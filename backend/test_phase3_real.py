import os
import json
import time
from unittest.mock import patch, MagicMock
from supabase import create_client
from dotenv import load_dotenv
import asyncio

load_dotenv()

from app.main import cross_meeting_query, CrossMeetingQueryRequest
from app.services.gemini_service import summarize

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
real_client = create_client(url, key)
# Create a dummy user object on the client so client.user.id works
real_client.user = MagicMock()
real_client.user.id = "11111111-1111-1111-1111-111111111111"
real_client.user.email = "test@example.com"

TRANSCRIPT_TEXT = """
Alice: Okay team, let's finalize the Q4 planning. We have a few open items.
Bob: Yeah, we need to decide on the database for the new service. 
Alice: I propose we stick with Postgres for now. It handles our workload fine.
Charlie: Agreed. We will definitely use Postgres. That's a firm decision.
Alice: Great. Next up, who's going to handle the migration?
Charlie: I can take that. I commit to finishing the data migration by November 15th.
Alice: Perfect. Bob, can you review the new architecture doc?
Bob: I will do that. That's an action item for me.
Alice: Awesome. We'll sync again next week.
"""

def fake_transcribe(filename, mode):
    return {
        "transcript": TRANSCRIPT_TEXT.strip(),
        "segments": [{"start": 0, "end": 10}],
        "language": "en"
    }

async def run_test():
    print("Processing new meeting (calling summarize directly)...")
    summary = summarize(
        TRANSCRIPT_TEXT.strip(),
        detected_language="English",
        output_language="English"
    )
    
    meeting_data = {
        "user_id": real_client.user.id,
        "email": real_client.user.email,
        "title": summary.get("title", "Untitled Meeting"),
        "transcript": TRANSCRIPT_TEXT.strip(),
        "segments": [{"start": 0, "end": 10}],
        "executive_summary": summary["executiveSummary"],
        "duration": 10,
        "sentiment": summary.get("sentiment"),
        "priority": summary.get("priority"),
        "tags": summary.get("tags", []),
        "word_count": len(TRANSCRIPT_TEXT.strip().split()),
        "next_steps": summary.get("nextSteps", []),
        "language": "English",
        "language_code": "en",
    }
    
    meeting_res = real_client.table("meetings").insert(meeting_data).execute()
    meeting_id = meeting_res.data[0]["id"]
    print(f"Meeting created with ID: {meeting_id}")
    
    if summary.get("actionItems"):
        actions = [{"meeting_id": meeting_id, "action_text": a.get("text", a) if isinstance(a, dict) else a, "owner": a.get("owner") if isinstance(a, dict) else None, "status": a.get("status", "pending") if isinstance(a, dict) else "pending", "source_reference": a.get("source_reference") if isinstance(a, dict) else None} for a in summary["actionItems"]]
        real_client.table("action_items").insert(actions).execute()
        
    if summary.get("decisions"):
        decisions = [{"meeting_id": meeting_id, "decision_text": d.get("text", d) if isinstance(d, dict) else d, "confidence": d.get("confidence") if isinstance(d, dict) else None, "status": d.get("status", "CURRENT") if isinstance(d, dict) else "CURRENT", "participants": d.get("participants") if isinstance(d, dict) else None, "source_reference": d.get("source_reference") if isinstance(d, dict) else None} for d in summary["decisions"]]
        real_client.table("decisions").insert(decisions).execute()
        
    if summary.get("commitments"):
        commitments = [{"meeting_id": meeting_id, "person": c.get("person", "Unknown") if isinstance(c, dict) else "Unknown", "commitment_text": c.get("text", c) if isinstance(c, dict) else c, "due_date": c.get("due_date") if isinstance(c, dict) else None, "status": c.get("status", "OPEN") if isinstance(c, dict) else "OPEN", "confidence": c.get("confidence") if isinstance(c, dict) else None, "source_reference": c.get("source_reference") if isinstance(c, dict) else None} for c in summary["commitments"]]
        real_client.table("commitments").insert(commitments).execute()
    
    print("\nVerifying in Supabase...")
    decisions_db = real_client.table("decisions").select("*").eq("meeting_id", meeting_id).execute().data
    commitments_db = real_client.table("commitments").select("*").eq("meeting_id", meeting_id).execute().data
    actions_db = real_client.table("action_items").select("*").eq("meeting_id", meeting_id).execute().data
    
    print(f"Decisions found: {len(decisions_db)}")
    for d in decisions_db:
        print(f" - {d['decision_text']} (Status: {d['status']}, Conf: {d['confidence']}) [Source: {d['source_reference']}]")
        
    print(f"Commitments found: {len(commitments_db)}")
    for c in commitments_db:
        print(f" - {c['person']}: {c['commitment_text']} (Due: {c['due_date']}, Status: {c['status']}) [Source: {c['source_reference']}]")
        
    print(f"Actions found: {len(actions_db)}")
    for a in actions_db:
        print(f" - {a['owner']}: {a['action_text']} (Status: {a['status']})")
        
    # 3. Ask questions
    questions = [
        "What did we decide?",
        "What commitments were made?",
        "What action items are still pending?",
        "Who is responsible?",
        "What remains unresolved?"
    ]
    
    print("\nQuerying cross-meeting intelligence...")
    for q in questions:
        print(f"\nQ: {q}")
        req = CrossMeetingQueryRequest(question=q)
        res = await cross_meeting_query(req, real_client)
        print(f"A:\n{res.answer}")

if __name__ == "__main__":
    asyncio.run(run_test())
