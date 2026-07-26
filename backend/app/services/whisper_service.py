import os
import logging
import httpx
import time
from openai import OpenAI

logger = logging.getLogger("meetmind-backend")

def compress_if_needed(file_path: str) -> str:
    """ponytail: bypass ffmpeg if natively supported and under 24MB to avoid extra processing."""
    try:
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        ext = os.path.splitext(file_path)[1].lower()
        
        # Supported natively by both Groq and Deepgram
        supported_exts = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm", ".flac", ".ogg"}
        
        if ext in supported_exts and file_size_mb < 24.0:
            logger.info(f"Bypassing FFmpeg. Format {ext} ({file_size_mb:.1f}MB) is natively supported.")
            return file_path
    except Exception as e:
        logger.warning(f"Failed to check file size: {e}")
        
    compressed_path = file_path + "_compressed.mp3"
    try:
        import subprocess
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        logger.info(f"Extracting 16k mono audio via FFmpeg for {file_path}...")
        t_ffmpeg_start = time.time()
        subprocess.run(
            [ffmpeg_exe, "-y", "-i", file_path, "-vn", "-ac", "1", "-b:a", "16k", compressed_path], 
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
        )
        t_ffmpeg = time.time() - t_ffmpeg_start
        logger.info(f"[PERFORMANCE] FFmpeg extraction took {t_ffmpeg:.2f}s")
        return compressed_path
    except Exception as e:
        logger.error(f"ffmpeg compression failed: {e}")
        return file_path

def transcribe_groq(file_path: str) -> dict:
    """Fast mode using Groq (whisper-large-v3-turbo). Word timestamps included, no diarization."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set.")
    
    client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    
    t_api_start = time.time()
    with open(file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=(os.path.basename(file_path), audio_file),
            model="whisper-large-v3-turbo",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"]
        )
    t_api = time.time() - t_api_start
    logger.info(f"[PERFORMANCE] Groq API call took {t_api:.2f}s")
    
    segments = []
    if hasattr(transcription, "segments") and transcription.segments:
        for seg in transcription.segments:
            segments.append({
                "start": round(seg["start"] if isinstance(seg, dict) else getattr(seg, "start"), 2),
                "end": round(seg["end"] if isinstance(seg, dict) else getattr(seg, "end"), 2),
                "text": (seg["text"] if isinstance(seg, dict) else getattr(seg, "text")).strip(),
            })
    else:
        segments.append({
            "start": 0.0,
            "end": 0.0,
            "text": transcription.text.strip(),
        })

    return {
        "transcript": transcription.text.strip(),
        "segments": segments,
        "language": getattr(transcription, "language", "en"),
        "diarization_unavailable": True
    }

def transcribe_deepgram(file_path: str) -> dict:
    """Meeting mode using Deepgram (nova-3). Includes word timestamps and speaker diarization."""
    api_key = os.getenv("DEEPGRAM_API_KEY")
    if not api_key:
        raise ValueError("DEEPGRAM_API_KEY is not set.")
    
    url = "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&diarize=true&detect_language=true"
    headers = {
        "Authorization": f"Token {api_key}"
    }
    
    t_api_start = time.time()
    with open(file_path, "rb") as audio_file:
        with httpx.Client(timeout=180.0) as client:
            response = client.post(url, headers=headers, content=audio_file)
            response.raise_for_status()
            data = response.json()
    t_api = time.time() - t_api_start
    logger.info(f"[PERFORMANCE] Deepgram API call took {t_api:.2f}s")
            
    results = data.get("results", {})
    channels = results.get("channels", [])
    if not channels:
        raise ValueError("Deepgram returned no channels")
        
    alts = channels[0].get("alternatives", [])
    if not alts:
        raise ValueError("Deepgram returned no alternatives")
        
    alt = alts[0]
    transcript_text = alt.get("transcript", "")
    words = alt.get("words", [])
    
    segments = []
    current_speaker = None
    current_text = []
    start_time = 0.0
    
    for word in words:
        speaker = f"Speaker {word.get('speaker', 0) + 1}"
        if speaker != current_speaker:
            if current_speaker is not None:
                segments.append({
                    "start": round(start_time, 2),
                    "end": round(word.get('start', 0), 2),
                    "text": " ".join(current_text).strip(),
                    "speaker": current_speaker
                })
            current_speaker = speaker
            current_text = [word.get('punctuated_word', word.get('word'))]
            start_time = word.get('start', 0)
        else:
            current_text.append(word.get('punctuated_word', word.get('word')))
            
    if current_text:
        segments.append({
            "start": round(start_time, 2),
            "end": round(words[-1].get('end', 0) if words else 0, 2),
            "text": " ".join(current_text).strip(),
            "speaker": current_speaker
        })
        
    language = results.get("channels", [{}])[0].get("detected_language", "en")
        
    return {
        "transcript": transcript_text,
        "segments": segments,
        "language": language
    }

def transcribe(file_path: str, mode: str = "fast") -> dict:
    """
    Orchestrates transcription.
    mode='fast': Groq (whisper-large-v3-turbo, no diarization)
    mode='meeting': Deepgram (nova-3, diarization) -> failover -> Groq
    """
    file_to_process = compress_if_needed(file_path)
    
    try:
        if mode == "meeting":
            try:
                logger.info("Using Deepgram for Meeting Mode (Diarization)")
                return transcribe_deepgram(file_to_process)
            except Exception as e:
                logger.warning(f"Deepgram failed: {e}. Falling back to Groq.")
                return transcribe_groq(file_to_process)
        else:
            logger.info("Using Groq for Fast Mode")
            try:
                return transcribe_groq(file_to_process)
            except Exception as e:
                # Fast mode failover to Deepgram if Groq is down
                logger.warning(f"Groq failed: {e}. Falling back to Deepgram.")
                return transcribe_deepgram(file_to_process)
    finally:
        # Cleanup compressed file if created
        if file_to_process != file_path and os.path.exists(file_to_process):
            try:
                os.remove(file_to_process)
            except Exception:
                pass

