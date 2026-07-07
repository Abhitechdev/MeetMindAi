import os
import tempfile
import gc
import logging
import psutil
from faster_whisper import WhisperModel
from openai import OpenAI

logger = logging.getLogger("meetmind-backend")

_model = None


def _get_model() -> WhisperModel:
    """Lazy-load Whisper model (singleton)."""
    global _model
    if _model is None:
        logger.info("Initializing WhisperModel('tiny') with restricted threads...")
        _model = WhisperModel(
            "tiny", 
            device="cpu", 
            compute_type="int8",
            cpu_threads=4,
            num_workers=1
        )
    return _model


def transcribe(file_path: str) -> dict:
    """
    Transcribe an audio file. Uses Groq API if GROQ_API_KEY is set for <1s transcription,
    otherwise falls back to Faster-Whisper on CPU.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        try:
            logger.info("Using Groq API for blazing fast audio processing...")
            client = OpenAI(api_key=groq_api_key, base_url="https://api.groq.com/openai/v1")
            with open(file_path, "rb") as audio_file:
                # ponytail: groq gives <1s processing time for whisper-large-v3
                transcription = client.audio.transcriptions.create(
                    file=(os.path.basename(file_path), audio_file),
                    model="whisper-large-v3",
                    response_format="verbose_json",
                )
            
            # Parse Groq's verbose_json format to match our schema
            segments = []
            if hasattr(transcription, "segments") and transcription.segments:
                for seg in transcription.segments:
                    segments.append({
                        "start": round(seg["start"] if isinstance(seg, dict) else getattr(seg, "start"), 2),
                        "end": round(seg["end"] if isinstance(seg, dict) else getattr(seg, "end"), 2),
                        "text": (seg["text"] if isinstance(seg, dict) else getattr(seg, "text")).strip(),
                    })
            else:
                # Fallback if segments aren't properly returned by the wrapper
                segments.append({
                    "start": 0.0,
                    "end": 0.0,
                    "text": transcription.text.strip(),
                })

            return {
                "transcript": transcription.text.strip(),
                "segments": segments,
                "language": getattr(transcription, "language", "en"),
            }
        except Exception as e:
            # ponytail: falling back to local faster_whisper on Railway's 500MB RAM tier causes an OOM crash.
            # It is better to fail fast and show the user the real Groq error.
            raise ValueError(f"Groq API Error: {str(e)}")
    # Fallback to local CPU processing
    process = psutil.Process(os.getpid())
    mem_before = process.memory_info().rss / (1024 * 1024)
    logger.info(f"Memory before transcription: {mem_before:.2f} MB")

    model = _get_model()
    # ponytail: beam_size=1 (greedy) + condition_on_previous_text=False is faster and avoids hallucination loops
    segments_iter, info = model.transcribe(file_path, beam_size=1, condition_on_previous_text=False)

    segments = []
    full_text_parts = []

    for segment in segments_iter:
        segments.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip(),
        })
        full_text_parts.append(segment.text.strip())
        
    result = {
        "transcript": " ".join(full_text_parts),
        "segments": segments,
        "language": info.language,
    }

    # Explicit memory cleanup
    del segments_iter
    del info
    gc.collect()

    mem_after = process.memory_info().rss / (1024 * 1024)
    logger.info(f"Memory after transcription: {mem_after:.2f} MB")

    return result
