import os
import json
import time
import asyncio
from unittest.mock import patch, MagicMock
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
from app.main import cross_meeting_query, CrossMeetingQueryRequest
from app.services.gemini_service import summarize

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
real_client = create_client(url, key)

async def run_test():
    # 1. Fetch a real meeting
    meeting_id = "ebbecb89-8bee-45d2-b9d2-5ec56e4ece32"
    print(f"Fetching an existing meeting from Supabase (ID: {meeting_id})...")
    res = real_client.table("meetings").select("*").eq("id", meeting_id).execute()
    if not res.data:
        print("Meeting not found.")
        return
        
    meeting = res.data[0]
    print(f"Found meeting: {meeting['title']}")
    
    transcript = meeting.get("transcript")
    if not transcript or len(transcript.strip()) < 20:
        print("Meeting has no substantial transcript.")
        return
        
    print("Processing meeting through pipeline...")
    
    # Process it through summarize
    summary = summarize(
        transcript,
        detected_language="English",
        output_language="English"
    )
    
    print("\nUpdating meeting with Phase 3 extraction...")
    
    # 2. Insert extracted structures
    if summary.get("actionItems"):
        actions = [{"meeting_id": meeting["id"], "action_text": a.get("text", a) if isinstance(a, dict) else a, "owner": a.get("owner") if isinstance(a, dict) else None, "status": a.get("status", "pending") if isinstance(a, dict) else "pending", "source_reference": a.get("source_reference") if isinstance(a, dict) else None} for a in summary["actionItems"]]
        real_client.table("action_items").insert(actions).execute()
        
    if summary.get("decisions"):
        decisions = [{"meeting_id": meeting["id"], "decision_text": d.get("text", d) if isinstance(d, dict) else d, "confidence": d.get("confidence") if isinstance(d, dict) else None, "status": d.get("status", "CURRENT") if isinstance(d, dict) else "CURRENT", "participants": d.get("participants") if isinstance(d, dict) else None, "source_reference": d.get("source_reference") if isinstance(d, dict) else None} for d in summary["decisions"]]
        real_client.table("decisions").insert(decisions).execute()
        
    if summary.get("commitments"):
        commitments = [{"meeting_id": meeting["id"], "person": c.get("person", "Unknown") if isinstance(c, dict) else "Unknown", "commitment_text": c.get("text", c) if isinstance(c, dict) else c, "due_date": c.get("due_date") if isinstance(c, dict) else None, "status": c.get("status", "OPEN") if isinstance(c, dict) else "OPEN", "confidence": c.get("confidence") if isinstance(c, dict) else None, "source_reference": c.get("source_reference") if isinstance(c, dict) else None} for c in summary["commitments"]]
        real_client.table("commitments").insert(commitments).execute()
    
    print("\nVerifying directly in database...")
    decisions_db = real_client.table("decisions").select("*").eq("meeting_id", meeting["id"]).execute().data
    commitments_db = real_client.table("commitments").select("*").eq("meeting_id", meeting["id"]).execute().data
    actions_db = real_client.table("action_items").select("*").eq("meeting_id", meeting["id"]).execute().data
    
    print(f"Decisions found: {len(decisions_db)}")
    for d in decisions_db:
        print(f" - {d.get('decision_text')} (Status: {d.get('status')}, Conf: {d.get('confidence')}) [Source: {d.get('source_reference')}]")
        
    print(f"Commitments found: {len(commitments_db)}")
    for c in commitments_db:
        print(f" - {c.get('person')}: {c.get('commitment_text')} (Due: {c.get('due_date')}, Status: {c.get('status')}) [Source: {c.get('source_reference')}]")
        
    print(f"Actions found: {len(actions_db)}")
    for a in actions_db:
        print(f" - {a.get('owner')}: {a.get('action_text')} (Status: {a.get('status')})")
        
    # 3. Ask questions
    questions = [
        "What did we decide?",
        "What commitments were made?",
        "What action items are still pending?",
        "Who is responsible?",
        "What remains unresolved?",
        "How do I install kubernetes with helm?"  # Unsupported question
    ]
    
    # Set the mock user context for the API calls
    real_client.user = MagicMock()
    real_client.user.id = meeting["user_id"]
    
    print("\nQuerying cross-meeting intelligence...")
    for q in questions:
        print(f"\nQ: {q}")
        req = CrossMeetingQueryRequest(question=q)
        res = await cross_meeting_query(req, real_client)
        try:
            print(f"A:\n{res.answer.encode('utf-8').decode('utf-8', 'ignore')}")
        except:
            print(f"A:\n{res.answer}")

if __name__ == "__main__":
    asyncio.run(run_test())
