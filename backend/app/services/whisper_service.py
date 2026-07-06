import os
import tempfile
import gc
import logging
import psutil
from faster_whisper import WhisperModel

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
    Transcribe an audio file using Faster-Whisper.
    Returns full transcript string and timestamped segments.
    """
    process = psutil.Process(os.getpid())
    mem_before = process.memory_info().rss / (1024 * 1024)
    logger.info(f"Memory before transcription: {mem_before:.2f} MB")

    model = _get_model()
    segments_iter, info = model.transcribe(file_path, beam_size=2)

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
