import os
import tempfile
import time
import logging
from collections import defaultdict
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import ProcessingResponse, ChatRequest, ChatResponse, TranslateRequest, TranslateResponse, ChatMessage
from app.services import whisper_service, gemini_service
from supabase.client import create_client, Client
import razorpay
from pydantic import BaseModel
import asyncio

# ponytail: strict single-concurrency for whisper to avoid OOM
transcription_semaphore = asyncio.Semaphore(1)

# Configure structured logging
# ponytail: simple console logging formatted for structured ingestion
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("meetmind-backend")

# Simple in-memory rate limiter
# ponytail: simple dictionary-based rate limiting, does not persist across restarts (good enough for beta)
rate_limit_records = defaultdict(list)

def check_rate_limit(key: str, limit: int, window: int = 60) -> bool:
    """Check if the key has exceeded the limit in the given window (seconds)."""
    now = time.time()
    rate_limit_records[key] = [t for t in rate_limit_records[key] if now - t < window]
    if len(rate_limit_records[key]) >= limit:
        return False
    rate_limit_records[key].append(now)
    return True

PLANS = {
    "Free": {
        "meeting_limit": 3
    },
    "Pro": {
        "meeting_limit": 100
    }
}

def get_razorpay_client():
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    if key_id and key_secret:
        return razorpay.Client(auth=(key_id, key_secret))
    return None

def get_supabase() -> Client:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase environment variables not set")
    return create_client(supabase_url, supabase_key)

def get_user_supabase(authorization: str = Header(None)) -> Client:
    """Ponytail: Create a user-scoped client so Postgres handles RLS automatically."""
    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("Auth failure: Missing or invalid Authorization header")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.split(" ")[1]
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    if not url or not key:
        logger.error("Auth failure: Supabase environment variables not set")
        raise HTTPException(status_code=500, detail="Supabase env vars not set")
    
    from supabase import ClientOptions
    try:
        client = create_client(url, key, options=ClientOptions(headers={"Authorization": authorization}))
        user_res = client.auth.get_user(token)
        if not user_res or not user_res.user:
            logger.warning("Auth failure: Invalid token or user not found")
            raise HTTPException(status_code=401, detail="Invalid token")
            
        client.user = user_res.user
        return client
    except Exception as e:
        logger.warning(f"Auth failure exception: {str(e)}")
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=401, detail="Authentication failed")

app = FastAPI(title="MeetMind AI", version="1.0.0")

# CORS configuration supporting multiple origins via ALLOWED_ORIGINS env
# ponytail: lazy strict origins. Default to localhost for dev, but env var is required for prod.
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
# Ensure production domains are always allowed to prevent 400 Bad Request on OPTIONS
default_prod_origins = ["https://meetmindai.co.in", "https://www.meetmindai.co.in"]
for origin in default_prod_origins:
    if origin not in allowed_origins:
        allowed_origins.append(origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".mp4", ".webm", ".mov", ".avi"}
# ponytail: hard limit upload size to save RAM during processing
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

LANGUAGE_MAP = {
    "te": "Telugu", "hi": "Hindi", "ta": "Tamil", "kn": "Kannada",
    "ml": "Malayalam", "en": "English", "es": "Spanish", "fr": "French",
    "de": "German", "pt": "Portuguese", "it": "Italian", "nl": "Dutch",
    "ja": "Japanese", "ko": "Korean", "zh": "Chinese", "mr": "Marathi",
    "bn": "Bengali", "gu": "Gujarati", "pa": "Punjabi", "ur": "Urdu"
}


@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}


@app.get("/usage")
def get_usage(client: Client = Depends(get_user_supabase)):
    sub_res = client.table("subscriptions").select("*").eq("user_id", client.user.id).execute()
    sub = sub_res.data[0] if sub_res.data else None
    
    plan_name = sub["plan"] if sub else "Free"
    limit = sub["meeting_limit"] if sub else PLANS["Free"]["meeting_limit"]
    
    # ponytail: Single source of truth. Count actual meetings instead of managing out-of-sync counters.
    used_res = client.table("meetings").select("id", count="exact").eq("user_id", client.user.id).execute()
    used = used_res.count if used_res.count is not None else 0
    
    return {"plan": plan_name, "used": used, "limit": limit, "remaining": max(0, limit - used)}


@app.get("/meetings")
def get_meetings(client: Client = Depends(get_user_supabase)):
    """Fetch all meetings for the history page."""
    return client.table("meetings").select("id, title, created_at, duration, tags").eq("user_id", client.user.id).order("created_at", desc=True).execute().data


@app.delete("/meetings/{meeting_id}")
def delete_meeting(meeting_id: str, client: Client = Depends(get_user_supabase)):
    """Delete a meeting by ID. Enforces ownership via RLS."""
    res = client.table("meetings").delete().eq("id", meeting_id).execute()
    if not res.data:
        raise HTTPException(status_code=403, detail="Forbidden or not found")
    return res.data

@app.get("/meetings/{meeting_id}")
def get_meeting(meeting_id: str, client: Client = Depends(get_user_supabase)):
    """Fetch a single meeting with its actions and decisions."""
    meeting_res = client.table("meetings").select("id, title, transcript, segments, executive_summary, next_steps, language").eq("id", meeting_id).eq("user_id", client.user.id).execute()
    if not meeting_res.data:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting = meeting_res.data[0]
    
    # ponytail: explicit separate small queries instead of complex RPC joins to keep it simple
    actions = [a["action_text"] for a in client.table("action_items").select("action_text").eq("meeting_id", meeting_id).execute().data]
    decisions = [d["decision_text"] for d in client.table("decisions").select("decision_text").eq("meeting_id", meeting_id).execute().data]
    
    return {
        "id": meeting["id"],
        "title": meeting["title"],
        "transcript": meeting["transcript"],
        "segments": meeting.get("segments", []),
        "executiveSummary": meeting.get("executive_summary", ""),
        "actionItems": actions,
        "decisions": decisions,
        "nextSteps": meeting.get("next_steps", []),
        "language": meeting.get("language", "English")
    }

@app.delete("/meetings")
def delete_all_meetings(client: Client = Depends(get_user_supabase)):
    """Delete all meetings for the user."""
    return client.table("meetings").delete().eq("user_id", client.user.id).execute().data

@app.get("/actions")
def get_actions(client: Client = Depends(get_user_supabase)):
    # We filter by meeting_id in (select id from meetings where user_id = client.user.id)
    # Since we can't easily subquery in Supabase python without RPC, we first fetch meeting IDs.
    # Ponytail: Just fetch the meeting IDs first. It's fast enough.
    meetings = client.table("meetings").select("id").eq("user_id", client.user.id).execute().data
    meeting_ids = [m["id"] for m in meetings]
    if not meeting_ids:
        return []
    return client.table("action_items").select("id, action_text, status, created_at, meetings(title)").in_("meeting_id", meeting_ids).order("created_at", desc=True).execute().data

@app.put("/actions/{action_id}/status")
def update_action_status(action_id: str, payload: dict, client: Client = Depends(get_user_supabase)):
    res = client.table("action_items").update({"status": payload.get("status")}).eq("id", action_id).execute()
    if not res.data:
        raise HTTPException(status_code=403, detail="Forbidden or not found")
    return res.data

@app.get("/decisions")
def get_decisions(client: Client = Depends(get_user_supabase)):
    meetings = client.table("meetings").select("id").eq("user_id", client.user.id).execute().data
    meeting_ids = [m["id"] for m in meetings]
    if not meeting_ids:
        return []
    return client.table("decisions").select("id, decision_text, status, created_at, meetings(title)").in_("meeting_id", meeting_ids).order("created_at", desc=True).execute().data


@app.post("/process-meeting", response_model=ProcessingResponse)
async def process_meeting(
    file: UploadFile = File(...),
    mode: str = Form("fast"),
    output_language: str = Form("English"),
    client: Client = Depends(get_user_supabase)
):
    """
    Single endpoint: Upload audio → Whisper transcription → Gemini summary.
    Temp file is deleted after processing.
    """
    # Rate Limit Check (5 requests per minute per user)
    rate_limit_key = f"process_{client.user.id}"
    if not check_rate_limit(rate_limit_key, 5, 60):
        logger.warning(f"Rate limit exceeded for /process-meeting: user {client.user.id}")
        raise HTTPException(status_code=429, detail="Too many requests. Limit is 5 per minute.")

    # ponytail: limit check before processing
    sub_res = client.table("subscriptions").select("*").eq("user_id", client.user.id).execute()
    sub = sub_res.data[0] if sub_res.data else None
    limit = sub["meeting_limit"] if sub else PLANS["Free"]["meeting_limit"]
    plan_name = sub["plan"] if sub else "Free"

    used_res = client.table("meetings").select("id", count="exact").eq("user_id", client.user.id).execute()
    used = used_res.count if used_res.count is not None else 0
    if used >= limit:
        logger.warning(f"Quota exceeded: user {client.user.id} ({plan_name} plan limit {limit})")
        return JSONResponse(status_code=403, content={"success": False, "error": f"{plan_name} plan limit reached", "upgradeRequired": True})

    # Validate file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        logger.warning(f"Upload rejected: unsupported extension '{ext}' for user {client.user.id}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Save to temp file
    tmp = None
    try:
        # ponytail: Stream the file to disk in chunks to prevent OOM on 100MB files
        if getattr(file, "size", 0) > MAX_FILE_SIZE:
            logger.warning(f"Upload rejected: header size too large for user {client.user.id}")
            raise HTTPException(status_code=400, detail="File too large. Max 100MB.")

        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
        total_size = 0
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            total_size += len(chunk)
            if total_size > MAX_FILE_SIZE:
                tmp.close()
                os.remove(tmp.name)
                logger.warning(f"Upload rejected: actual size exceeded limit for user {client.user.id}")
                raise HTTPException(status_code=400, detail="File too large. Max 100MB.")
            tmp.write(chunk)
            
        tmp.close()
        logger.info(f"Processing meeting upload: {file.filename} ({total_size} bytes) for user {client.user.id}")
        t_start = time.time()

        # Step 1: Transcribe with Whisper (Concurrency protected)
        async with transcription_semaphore:
            loop = asyncio.get_running_loop()
            transcription = await loop.run_in_executor(None, whisper_service.transcribe, tmp.name, mode)
            
        t_transcribe = time.time() - t_start
        logger.info(f"[PERFORMANCE] Transcription ({mode} mode) took {t_transcribe:.2f}s")

        lang_code = transcription.get("language", "en")
        detected_language = LANGUAGE_MAP.get(lang_code, "English")
        target_lang = detected_language if output_language == "Original Language" else output_language

        # Step 2: Summarize with Gemini
        t_gemini_start = time.time()
        summary = gemini_service.summarize(
            transcription["transcript"],
            detected_language=detected_language,
            output_language=target_lang
        )
        t_gemini = time.time() - t_gemini_start
        logger.info(f"[PERFORMANCE] LLM Analysis took {t_gemini:.2f}s")
        
        # Calculate duration from segments
        segments = transcription["segments"]
        duration = int(segments[-1]["end"] - segments[0]["start"]) if segments else 0
        word_count = len(transcription["transcript"].split())

        meeting_data = {
            "user_id": client.user.id,
            "email": client.user.email,
            "title": summary.get("title", "Untitled Meeting"),
            "transcript": transcription["transcript"],
            "segments": transcription["segments"],
            "executive_summary": summary["executiveSummary"],
            "duration": duration,
            "sentiment": summary.get("sentiment"),
            "priority": summary.get("priority"),
            "tags": summary.get("tags", []),
            "word_count": word_count,
            "next_steps": summary.get("nextSteps", []),
            "language": detected_language,
            "language_code": lang_code,
        }

        meeting_res = client.table("meetings").insert(meeting_data).execute()
        meeting_id = meeting_res.data[0]["id"]

        if summary.get("actionItems"):
            actions = [{"meeting_id": meeting_id, "action_text": a.get("text", a) if isinstance(a, dict) else a, "owner": a.get("owner") if isinstance(a, dict) else None, "status": a.get("status", "pending") if isinstance(a, dict) else "pending", "source_reference": a.get("source_reference") if isinstance(a, dict) else None} for a in summary["actionItems"]]
            client.table("action_items").insert(actions).execute()

        if summary.get("decisions"):
            decisions = [{"meeting_id": meeting_id, "decision_text": d.get("text", d) if isinstance(d, dict) else d, "confidence": d.get("confidence") if isinstance(d, dict) else None, "status": d.get("status", "CURRENT") if isinstance(d, dict) else "CURRENT", "participants": d.get("participants") if isinstance(d, dict) else None, "source_reference": d.get("source_reference") if isinstance(d, dict) else None} for d in summary["decisions"]]
            client.table("decisions").insert(decisions).execute()
            
        if summary.get("commitments"):
            commitments = [{"meeting_id": meeting_id, "person": c.get("person", "Unknown") if isinstance(c, dict) else "Unknown", "commitment_text": c.get("text", c) if isinstance(c, dict) else c, "due_date": c.get("due_date") if isinstance(c, dict) else None, "status": c.get("status", "OPEN") if isinstance(c, dict) else "OPEN", "confidence": c.get("confidence") if isinstance(c, dict) else None, "source_reference": c.get("source_reference") if isinstance(c, dict) else None} for c in summary["commitments"]]
            client.table("commitments").insert(commitments).execute()
            
        if summary.get("entities"):
            entities = [{"meeting_id": meeting_id, "entity_name": e.get("name"), "entity_type": e.get("entity_type"), "source_reference": e.get("source_reference")} for e in summary["entities"]]
            if entities:
                client.table("meeting_entities").insert(entities).execute()
                
        if summary.get("relationships"):
            relationships = [{"meeting_id": meeting_id, "source_name": r.get("source"), "source_type": r.get("source_type"), "relationship_type": r.get("type"), "target_name": r.get("target"), "target_type": r.get("target_type"), "source_reference": r.get("source_reference")} for r in summary["relationships"]]
            if relationships:
                client.table("meeting_relationships").insert(relationships).execute()
        
        t_total = time.time() - t_start
        logger.info(f"[PERFORMANCE] Total pipeline time: {t_total:.2f}s")
        logger.info(f"Meeting processed successfully: {meeting_id} for user {client.user.id}")

        return ProcessingResponse(
            id=meeting_id,
            title=summary.get("title", "Untitled Meeting"),
            transcript=transcription["transcript"],
            segments=transcription["segments"],
            executiveSummary=summary["executiveSummary"],
            decisions=summary.get("decisions", []),
            actionItems=summary.get("actionItems", []),
            nextSteps=summary.get("nextSteps", []),
            tags=summary.get("tags", []),
            language=detected_language,
            sentiment=summary.get("sentiment"),
            priority=summary.get("priority"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI processing failure: {str(e)} for user {client.user.id}")
        with open("error.log", "a") as f:
            f.write(f"Error: {str(e)}\n")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # ponytail: aggressively delete temp file to free OS buffer cache
        if tmp and os.path.exists(tmp.name):
            try:
                os.remove(tmp.name)
            except Exception as e:
                logger.error(f"Failed to delete temp file {tmp.name}: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, client: Client = Depends(get_user_supabase)):
    """Answer a question about the meeting transcript."""
    # Rate Limit Check (30 requests per minute per user)
    rate_limit_key = f"chat_{client.user.id}"
    if not check_rate_limit(rate_limit_key, 30, 60):
        logger.warning(f"Rate limit exceeded for /chat: user {client.user.id}")
        raise HTTPException(status_code=429, detail="Too many requests. Limit is 30 per minute.")

    # Validate meeting ownership by querying supabase under user-scoped client
    # This automatically enforces RLS.
    try:
        # ponytail: verify ownership by fetching ID only, use frontend context for speed and full data
        meeting_res = client.table("meetings").select("id").eq("id", req.meeting_id).execute()
        if not meeting_res.data:
            logger.warning(f"Unauthorized chat access attempt: user {client.user.id} requested meeting {req.meeting_id}")
            raise HTTPException(status_code=403, detail="Forbidden or meeting not found")
        
        answer = gemini_service.chat(req.question, req.transcript, req.summary, history=req.history)
        return ChatResponse(answer=answer)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat failed: {str(e)} for user {client.user.id}, meeting {req.meeting_id}")
        raise HTTPException(status_code=500, detail=str(e))


class CrossMeetingQueryRequest(BaseModel):
    question: str
    history: list[ChatMessage] | None = None

@app.post("/meeting-memory/query", response_model=ChatResponse)
async def cross_meeting_query(req: CrossMeetingQueryRequest, client: Client = Depends(get_user_supabase)):
    """Answer a question across all meetings using the extracted structured intelligence."""
    rate_limit_key = f"cross_query_{client.user.id}"
    if not check_rate_limit(rate_limit_key, 20, 60):
        raise HTTPException(status_code=429, detail="Too many requests.")
        
    try:
        # Intent-Aware Retrieval Layer
        expansion_prompt = f"Analyze the intent of this question. Output a JSON object with 'intents': list of strings from [DECISION, ACTION_ITEM, COMMITMENT, UNRESOLVED, CHANGE, HISTORY, PERSON, TOPIC], and 'keywords': list of strings (synonyms, related terms, excluding intent words like 'pending' or 'decide'). Return ONLY valid JSON, no markdown fences. Question: {req.question}"
        gemini_client, models = gemini_service._get_client()
        
        intents = []
        expanded_keywords = []
        try:
            expansion_response = gemini_service._create_completion(
                gemini_client,
                models,
                messages=[{"role": "user", "content": expansion_prompt}],
                temperature=0.1,
                max_tokens=150,
                timeout=3.0
            )
            resp_text = expansion_response.choices[0].message.content.strip()
            import json
            if resp_text.startswith("```json"): resp_text = resp_text[7:]
            if resp_text.startswith("```"): resp_text = resp_text[3:]
            if resp_text.endswith("```"): resp_text = resp_text[:-3]
            parsed = json.loads(resp_text.strip())
            intents = parsed.get("intents", [])
            expanded_keywords = parsed.get("keywords", [])
        except Exception as e:
            logger.warning(f"Intent parsing failed: {e}")
            
        import re
        stopwords = {"what", "when", "where", "which", "who", "whom", "whose", "why", "how", "this", "that", "these", "those", "have", "with", "from", "about", "could", "would", "should", "does", "did", "their", "there", "is", "are", "was", "were", "the", "and", "our", "for", "any", "all"}
        all_words_text = req.question + " " + " ".join(expanded_keywords)
        words = re.findall(r'\b[a-zA-Z]{3,}\b', all_words_text.lower())
        keywords = set(w for w in words if w not in stopwords)
        
        # Fetch all meetings for the user (metadata only)
        meetings = client.table("meetings").select("id, title, created_at, executive_summary, tags").eq("user_id", client.user.id).execute().data
        if not meetings:
            return ChatResponse(answer="I couldn't find any meetings in your history.")
            
        meeting_ids = [m["id"] for m in meetings]
        
        # Fetch structured data
        decisions = client.table("decisions").select("*").in_("meeting_id", meeting_ids).execute().data
        actions = client.table("action_items").select("*").in_("meeting_id", meeting_ids).execute().data
        
        try:
            commitments = client.table("commitments").select("*").in_("meeting_id", meeting_ids).execute().data
        except Exception:
            commitments = []
            
            
        try:
            entities = client.table("meeting_entities").select("*").in_("meeting_id", meeting_ids).execute().data
        except Exception:
            entities = []
            
        try:
            relationships = client.table("meeting_relationships").select("*").in_("meeting_id", meeting_ids).execute().data
        except Exception:
            relationships = []
        
        # Filter meetings based on keyword overlap and intent (Phase 2.5)
        scored_meetings = []
        for m in meetings:
            mid = m["id"]
            m_decisions = [d for d in decisions if d["meeting_id"] == mid]
            m_actions = [a for a in actions if a["meeting_id"] == mid]
            m_commitments = [c for c in commitments if c["meeting_id"] == mid]
            m_entities = [e for e in entities if e["meeting_id"] == mid]
            m_relationships = [r for r in relationships if r["meeting_id"] == mid]
            
            content_text = f"{m['title']} {m['executive_summary']} "
            content_text += " ".join([d['decision_text'] for d in m_decisions]) + " "
            content_text += " ".join([a['action_text'] for a in m_actions]) + " "
            content_text += " ".join([c['commitment_text'] for c in m_commitments]) + " "
            content_text += " ".join([e['entity_name'] for e in m_entities]) + " "
            content_text += " ".join([f"{r.get('source_name')} {r.get('target_name')}" for r in m_relationships])
            content_text = content_text.lower()
            
            score = sum(1 for kw in keywords if kw in content_text)
            
            # Intent-based scoring boosts
            if "DECISION" in intents and m_decisions:
                score += 5
                
            if "ACTION_ITEM" in intents and m_actions:
                has_pending = any(a.get("status", "").lower() in ["pending", "open", "in progress", "overdue"] for a in m_actions)
                score += 10 if has_pending else 2
                
            if "COMMITMENT" in intents and m_commitments:
                has_pending = any(c.get("status", "").lower() in ["open", "pending", "overdue"] for c in m_commitments)
                score += 10 if has_pending else 2
                
            if "UNRESOLVED" in intents:
                has_unresolved = False
                if any(a.get("status", "").lower() in ["pending", "open", "in progress", "overdue"] for a in m_actions): has_unresolved = True
                if any(c.get("status", "").lower() in ["open", "pending", "overdue"] for c in m_commitments): has_unresolved = True
                if has_unresolved:
                    score += 10
                    
            if "CHANGE" in intents or "HISTORY" in intents:
                score += 2
                
            if "PERSON" in intents:
                has_person = False
                for a in m_actions:
                    if a.get("owner") and any(kw in str(a.get("owner")).lower() for kw in keywords): has_person = True
                for c in m_commitments:
                    if c.get("person") and any(kw in str(c.get("person")).lower() for kw in keywords): has_person = True
                if has_person:
                    score += 10
                    
            if not keywords and not intents:
                score = 1 
                
            if score > 0:
                scored_meetings.append((score, m, m_decisions, m_actions, m_commitments, m_entities, m_relationships))
                
        # Sort by score desc, then date desc. Keep top 5 most relevant to fit context window.
        scored_meetings.sort(key=lambda x: (x[0], x[1]["created_at"]), reverse=True)
        top_meetings = scored_meetings[:5]
        
        # Sort chronologically for the LLM to understand timeline properly (Phase 4)
        top_meetings.sort(key=lambda x: x[1]["created_at"])
        
        # Build memory context
        context_parts = []
        for _, m, m_decisions, m_actions, m_commitments, m_entities, m_relationships in top_meetings:
            part = f"Meeting: {m['title']} ({m['created_at']})\n"
            part += f"Summary: {m['executive_summary']}\n"
            if m_decisions:
                part += "Decisions:\n" + "\n".join([f"- [{d.get('status', 'CURRENT')}] {d['decision_text']} (Source: {d.get('source_reference')})" for d in m_decisions]) + "\n"
            if m_actions:
                part += "Actions:\n" + "\n".join([f"- [{d.get('status', 'pending')}] {d.get('owner', 'Unassigned')}: {d['action_text']} (Source: {d.get('source_reference')})" for d in m_actions]) + "\n"
            if m_commitments:
                part += "Commitments:\n" + "\n".join([f"- [{c.get('status', 'OPEN')}] {c.get('person', 'Unknown')}: {c['commitment_text']} | Due: {c.get('due_date', 'None')} (Source: {c.get('source_reference')})" for c in m_commitments]) + "\n"
            if m_entities:
                part += "Entities:\n" + "\n".join([f"- {e['entity_type']}: {e['entity_name']} (Source: {e.get('source_reference')})" for e in m_entities]) + "\n"
            if m_relationships:
                part += "Relationships:\n" + "\n".join([f"- {r.get('source_name')} ({r.get('source_type')}) -> {r.get('relationship_type')} -> {r.get('target_name')} ({r.get('target_type')}) (Source: {r.get('source_reference')})" for r in m_relationships]) + "\n"
            context_parts.append(part)
            
        memory_context = "\n\n".join(context_parts)
        
        system_prompt = """You are MeetMind AI's cross-meeting intelligence assistant.
Your goal is to provide evidence-grounded organizational reasoning over the provided meeting context.
Answer the user's question using ONLY the provided meeting memory context.

CRITICAL REASONING RULES:
1. EVIDENCE-FIRST REASONING: Every conclusion must be traceable. For every major conclusion provide the source meeting and date. If evidence is insufficient, say EXACTLY: "I couldn't find that information in your past meetings." Do NOT use outside knowledge.
2. CURRENT STATE DERIVATION: Combine latest decisions, open commitments, action items, unresolved issues, and relationships to determine the current state.
3. DECISION EVOLUTION: Trace how decisions evolved over time. If they changed, state what it was initially, what happened, and what the current state is. Say "The change followed discussion of..." if causality is not explicitly stated.
4. BLOCKER CHAINS & DEPENDENCIES: Trace explicit relationships. If A blocks B and B affects C, explain the chain. Do not infer relationships without evidence.
5. CONFLICT HANDLING: DO NOT silently resolve conflicting evidence. If Meeting 1 says X and Meeting 2 says Y, explicitly state the chronological evolution or the conflict. If current state is ambiguous, say: "The meeting records contain conflicting information, and the current state cannot be determined with confidence."
6. COMMITMENT RISK: Identify commitments that appear at risk (e.g. overdue, repeatedly discussed, blocked). Use cautious language: "Potentially at risk because..." or "Repeatedly carried forward...". Do not invent deadlines.
7. HALLUCINATION DEFENSE: Distinguish between facts directly supported, derived conclusions, and unknowns. Never convert an unknown into a guess. Do not give generic business advice.

STRUCTURED FORMATTING (Use only the headings relevant to the query):
## ANSWER
(Short direct answer)

## CURRENT STATE
(What is true now, derived from the latest data)

## WHAT CHANGED
(Important historical changes and decision evolution)

## WHY
(Evidence-supported explanation or causal context)

## OPEN ITEMS
(Unresolved actions/commitments/issues)

## IMPACTED AREAS
(Related projects/people/items via relationships)

## EVIDENCE
(Meetings and source references backing your claims)

Keep answers concise, factual, and scannable. Do not fabricate dates or status."""

        messages = [{"role": "system", "content": system_prompt}]
        if req.history:
            for msg in req.history[-6:]:
                messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": f"Meeting Memory:\n{memory_context}\n\nQuestion: {req.question}"})
        
        gemini_client, models = gemini_service._get_client()
        response = gemini_service._create_completion(
            gemini_client,
            models,
            messages=messages,
            temperature=0.1,  # Lower temperature for less hallucination
            max_tokens=1024,
        )
        
        return ChatResponse(answer=response.choices[0].message.content.strip())
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cross-meeting query failed: {str(e)} for user {client.user.id}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate-transcript", response_model=TranslateResponse)
async def translate_transcript_endpoint(req: TranslateRequest, client: Client = Depends(get_user_supabase)):
    """Translate transcript to another language."""
    try:
        translated = gemini_service.translate_transcript(req.transcript, req.target_language)
        return TranslateResponse(translated_transcript=translated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@app.post("/payments/create-order")
def create_order(client: Client = Depends(get_user_supabase)):
    # Rate Limit Check (5 requests per minute per user)
    rate_limit_key = f"create_order_{client.user.id}"
    if not check_rate_limit(rate_limit_key, 5, 60):
        logger.warning(f"Rate limit exceeded for /payments/create-order: user {client.user.id}")
        raise HTTPException(status_code=429, detail="Too many requests. Limit is 5 per minute.")

    rzp = get_razorpay_client()
    if not rzp:
        logger.error("Payment gateway failure: Razorpay client is not configured")
        raise HTTPException(status_code=500, detail="Payment gateway not configured")
    
    order_amount = 29900  # ₹299
    order_currency = "INR"
    order_receipt = f"receipt_{client.user.id[:8]}"
    
    try:
        order = rzp.order.create({
            "amount": order_amount,
            "currency": order_currency,
            "receipt": order_receipt,
            "notes": {"user_id": client.user.id}
        })
        logger.info(f"Razorpay order created: {order.get('id')} for user {client.user.id}")
        return order
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {str(e)} for user {client.user.id}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/payments/verify")
def verify_payment(req: VerifyPaymentRequest, client: Client = Depends(get_user_supabase)):
    # Rate Limit Check (5 requests per minute per user)
    rate_limit_key = f"verify_payment_{client.user.id}"
    if not check_rate_limit(rate_limit_key, 5, 60):
        logger.warning(f"Rate limit exceeded for /payments/verify: user {client.user.id}")
        raise HTTPException(status_code=429, detail="Too many requests. Limit is 5 per minute.")

    rzp = get_razorpay_client()
    if not rzp:
        logger.error("Payment gateway failure: Razorpay client is not configured")
        raise HTTPException(status_code=500, detail="Payment gateway not configured")
        
    try:
        rzp.utility.verify_payment_signature({
            'razorpay_order_id': req.razorpay_order_id,
            'razorpay_payment_id': req.razorpay_payment_id,
            'razorpay_signature': req.razorpay_signature
        })
    except Exception:
        logger.warning(f"Payment signature verification failed for user {client.user.id}, order {req.razorpay_order_id}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Fetch order to verify ownership and replay
    try:
        order = rzp.order.fetch(req.razorpay_order_id)
        if order.get("notes", {}).get("user_id") != client.user.id:
            logger.warning(f"Payment verification security violation: user {client.user.id} attempted to claim order belonging to {order.get('notes', {}).get('user_id')}")
            raise HTTPException(status_code=403, detail="Order belongs to another user")
        if order.get("status") != "paid":
            logger.warning(f"Payment verification failed: order {req.razorpay_order_id} is not marked as paid")
            raise HTTPException(status_code=400, detail="Order is not paid")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Razorpay order {req.razorpay_order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")

    import datetime
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    new_plan = "Pro"
    new_limit = PLANS[new_plan]["meeting_limit"]

    # Insert into transactions table (unique constraint on order_id handles replay)
    try:
        client.table("transactions").insert({
            "user_id": client.user.id,
            "order_id": req.razorpay_order_id,
            "payment_id": req.razorpay_payment_id,
            "payment_provider": "razorpay",
            "plan": new_plan,
            "amount": order.get("amount", 29900) / 100, # Convert from paise
            "status": "completed",
            "created_at": now
        }).execute()
    except Exception as e:
        if "duplicate key value violates unique constraint" in str(e).lower():
            logger.warning(f"Duplicate payment verification attempt: order {req.razorpay_order_id} already processed for user {client.user.id}")
            raise HTTPException(status_code=409, detail="Order already processed")
        logger.error(f"Transaction insertion failed for user {client.user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    sub_res = client.table("subscriptions").select("*").eq("user_id", client.user.id).execute()
    
    if sub_res.data:
        client.table("subscriptions").update({
            "plan": new_plan,
            "meeting_limit": new_limit,
            "purchased_at": now
        }).eq("user_id", client.user.id).execute()
    else:
        client.table("subscriptions").insert({
            "user_id": client.user.id,
            "plan": new_plan,
            "meeting_limit": new_limit,
            "purchased_at": now
        }).execute()

    logger.info(f"Subscription upgraded successfully: user {client.user.id} upgraded to {new_plan}")
    return {"success": True, "plan": new_plan, "limit": new_limit}
