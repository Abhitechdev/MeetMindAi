from pydantic import BaseModel


class TranscriptionSegment(BaseModel):
    start: float
    end: float
    text: str


class SummaryData(BaseModel):
    title: str
    executiveSummary: str
    decisions: list[str]
    actionItems: list[str]
    nextSteps: list[str]
    tags: list[str]
    sentiment: str | None = None
    priority: str | None = None


class ProcessingResponse(BaseModel):
    id: str
    title: str
    transcript: str
    segments: list[TranscriptionSegment]
    executiveSummary: str
    decisions: list[str]
    actionItems: list[str]
    nextSteps: list[str]
    tags: list[str]
    language: str
    sentiment: str | None = None
    priority: str | None = None


class ChatRequest(BaseModel):
    meeting_id: str
    question: str
    transcript: str
    summary: str


class ChatResponse(BaseModel):
    answer: str


class TranslateRequest(BaseModel):
    transcript: str
    source_language: str
    target_language: str


class TranslateResponse(BaseModel):
    translated_transcript: str
