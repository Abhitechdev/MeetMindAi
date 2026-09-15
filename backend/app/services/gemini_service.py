import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

_client = None


def _get_client() -> tuple[OpenAI, list[str]]:
    """Lazy-load the best available OpenAI-compatible client and candidate model names."""
    global _client
    # ponytail: if we have Groq, use it for everything. It's faster and avoids NIM timeouts.
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        if _client is None or str(getattr(_client, "base_url", "")).rstrip("/") != "https://api.groq.com/openai/v1":
            _client = OpenAI(base_url="https://api.groq.com/openai/v1", api_key=groq_api_key)
        # ponytail: Groq decommissioned llama-3.3-70b-versatile. Primary successor is openai/gpt-oss-120b, with qwen fallback.
        configured = os.getenv("GROQ_MODEL")
        candidates = [m for m in [configured, "openai/gpt-oss-120b", "qwen/qwen3.6-27b", "openai/gpt-oss-20b"] if m]
        return _client, candidates

    if _client is None:
        api_key = os.getenv("NVIDIA_API_KEY")
        if not api_key:
            raise ValueError("Neither GROQ_API_KEY nor NVIDIA_API_KEY is set in backend/.env")
        _client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key,
        )
    # ponytail: NVIDIA NIM deprecated llama-3.3-70b-instruct; use active vision/large models
    configured = os.getenv("NVIDIA_MODEL")
    candidates = [m for m in [configured, "meta/llama-3.2-90b-vision-instruct", "mistralai/mistral-large-2-instruct", "nvidia/llama-3.1-nemotron-70b-instruct"] if m]
    return _client, candidates


def _create_completion(client: OpenAI, models: list[str], **kwargs):
    """Execute chat completion with automatic fallback if a model is deprecated, 404, or decommissioned."""
    last_err = None
    for model in models:
        try:
            return client.chat.completions.create(model=model, **kwargs)
        except Exception as e:
            err_str = str(e).lower()
            if any(k in err_str for k in ["404", "410", "not found", "does not exist", "decommissioned", "model_not_found"]):
                last_err = e
                continue
            raise
    raise last_err


PROMPT = """You are a meeting analysis assistant. Analyze the following meeting transcript and return a JSON object with exactly these fields:

- "title": A smart, short title for the meeting.
- "executiveSummary": A concise 2-3 sentence summary of the meeting.
- "tags": An array of strings, 2-4 tags summarizing the topics.
- "sentiment": A string, e.g., "Positive", "Neutral", "Negative".
- "priority": A string, e.g., "High", "Medium", "Low".
- "decisions": An array of strings, each a key decision made during the meeting.
- "actionItems": An array of strings, each an action item assigned during the meeting.
- "nextSteps": An array of strings, each a next step discussed.

Detected Language: {detected_language}
Instruction: Ensure the final JSON values (title, summary, tags, etc.) are written in {output_language}.

Return ONLY valid JSON. No markdown. No explanations. No code fences.

Transcript:
"""


def summarize(transcript: str, detected_language: str = "en", output_language: str = "English") -> dict:
    """
    Send transcript to Gemini and return structured summary.
    """
    client, models = _get_client()

    prompt_formatted = PROMPT.format(
        detected_language=detected_language,
        output_language=output_language
    )
    
    response = _create_completion(
        client,
        models,
        messages=[{"role": "user", "content": prompt_formatted + transcript}],
        temperature=0.2,
        max_tokens=2048,
    )

    text = response.choices[0].message.content.strip()

    # Robust JSON extraction
    start_idx = text.find('{')
    end_idx = text.rfind('}')
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        text = text[start_idx:end_idx+1]

    try:
        result = json.loads(text)
    except Exception:
        result = {}

    # Validate expected keys exist
    required = ["title", "executiveSummary", "tags", "sentiment", "priority", "decisions", "actionItems", "nextSteps"]
    for key in required:
        if key not in result:
            result[key] = [] if key in ["tags", "decisions", "actionItems", "nextSteps"] else ""

    return result


CHAT_SYSTEM = """You are MeetMind AI, a direct, highly capable meeting assistant.
Answer questions using ONLY the provided transcript and summary.

CRITICAL RULES:
- Never invent information, deadlines, people, or assumptions.
- If the answer is not present, respond EXACTLY with: "I couldn't find that information in the meeting."
- Do not repeat the question or use phrases like "Based on the transcript...". Just answer directly.
- Use 2-4 short paragraphs or bullet lists depending on content.
- If transcript content is cited and timestamps are available, optionally append subtle timestamps like [08:32]. NEVER invent timestamps.
- Differentiate between detected speakers (e.g. Speaker 1) and actual people unless identities are explicitly mapped.
- Keep answers concise, factual, and scannable."""


def chat(question: str, transcript: str, summary: str, history: list = None) -> str:
    """Answer a question using only the transcript and summary as context."""
    client, models = _get_client()
    
    # ponytail: if the frontend sends stringified JSON, format it nicely so the LLM doesn't mimic JSON output
    try:
        import json
        summary_data = json.loads(summary)
        formatted_summary = []
        if summary_data.get("executiveSummary"):
            formatted_summary.append(f"Executive Summary: {summary_data['executiveSummary']}")
        if summary_data.get("decisions"):
            formatted_summary.append(f"Decisions:\n- " + "\n- ".join(summary_data['decisions']))
        if summary_data.get("actionItems"):
            formatted_summary.append(f"Action Items:\n- " + "\n- ".join(summary_data['actionItems']))
        if summary_data.get("nextSteps"):
            formatted_summary.append(f"Next Steps:\n- " + "\n- ".join(summary_data['nextSteps']))
        summary_text = "\n".join(formatted_summary)
    except Exception:
        summary_text = summary

    # ponytail: stuff transcript+summary into user message, no RAG/embeddings needed at this scale
    context = f"Meeting Context:\n\nTranscript:\n{transcript}\n\nSummary:\n{summary_text}"
    
    # Build messages
    messages = [{"role": "system", "content": CHAT_SYSTEM}]
    
    # Inject bounded history (last 8 messages)
    if history:
        for msg in history[-8:]:
            messages.append({"role": msg.role, "content": msg.content})
            
    # Add current question with context
    messages.append({"role": "user", "content": f"{context}\n\nUser Question: {question}"})
    
    response = _create_completion(
        client,
        models,
        messages=messages,
        temperature=0.2,
        max_tokens=512,
    )
    return response.choices[0].message.content.strip()


TRANSLATE_SYSTEM = """Translate the following transcript into natural, professional {target_language}.

Preserve:
- Meaning
- Speaker context
- Technical terminology
- Names
- Action items

Do not summarize.
Translate only."""


def translate_transcript(transcript: str, target_language: str = "English") -> str:
    """Translate a transcript to a target language."""
    client, models = _get_client()
    system_prompt = TRANSLATE_SYSTEM.format(target_language=target_language)
    response = _create_completion(
        client,
        models,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": transcript},
        ],
        temperature=0.1,
        max_tokens=4096,
    )
    return response.choices[0].message.content.strip()
