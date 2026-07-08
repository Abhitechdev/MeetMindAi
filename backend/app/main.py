import os
import tempfile
import time
import logging
from collections import defaultdict
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import ProcessingResponse, ChatRequest, ChatResponse, TranslateRequest, TranslateResponse
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".mp4"}
# ponytail: hard limit upload size to save RAM during processing
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB

LANGUAGE_MAP = {
    "te": "Telugu", "hi": "Hindi", "ta": "Tamil", "kn": "Kannada",
    "ml": "Malayalam", "en": "English", "es": "Spanish", "fr": "French",
    "de": "German", "pt": "Portuguese", "it": "Italian", "nl": "Dutch",
    "ja": "Japanese", "ko": "Korean", "zh": "Chinese", "mr": "Marathi",
    "bn": "Bengali", "gu": "Gujarati", "pa": "Punjabi", "ur": "Urdu"
}


@app.get("/health")
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
    meeting_res = client.table("meetings").select("id, title, transcript, executive_summary, next_steps, language").eq("id", meeting_id).eq("user_id", client.user.id).execute()
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
        "segments": [],
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
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            logger.warning(f"Upload rejected: file too large ({len(contents)} bytes) for user {client.user.id}")
            raise HTTPException(status_code=400, detail="File too large. Max 25MB.")

        logger.info(f"Processing meeting upload: {file.filename} ({len(contents)} bytes) for user {client.user.id}")

        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
        tmp.write(contents)
        tmp.close()

        # Step 1: Transcribe with Whisper (Concurrency protected)
        async with transcription_semaphore:
            loop = asyncio.get_running_loop()
            transcription = await loop.run_in_executor(None, whisper_service.transcribe, tmp.name)
            
        lang_code = transcription.get("language", "en")
        detected_language = LANGUAGE_MAP.get(lang_code, "English")
        target_lang = detected_language if output_language == "Original Language" else output_language

        # Step 2: Summarize with Gemini
        summary = gemini_service.summarize(
            transcription["transcript"],
            detected_language=detected_language,
            output_language=target_lang
        )
        
        # Calculate duration from segments
        segments = transcription["segments"]
        duration = int(segments[-1]["end"] - segments[0]["start"]) if segments else 0
        word_count = len(transcription["transcript"].split())

        meeting_data = {
            "user_id": client.user.id,
            "email": client.user.email,
            "title": summary.get("title", "Untitled Meeting"),
            "transcript": transcription["transcript"],
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
            actions = [{"meeting_id": meeting_id, "action_text": a} for a in summary["actionItems"]]
            client.table("action_items").insert(actions).execute()

        if summary.get("decisions"):
            decisions = [{"meeting_id": meeting_id, "decision_text": d} for d in summary["decisions"]]
            client.table("decisions").insert(decisions).execute()
        
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
        
        answer = gemini_service.chat(req.question, req.transcript, req.summary)
        return ChatResponse(answer=answer)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat failed: {str(e)} for user {client.user.id}, meeting {req.meeting_id}")
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
