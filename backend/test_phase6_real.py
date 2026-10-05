import os
import time
import json
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

# Create a dummy user object on the client so client.user.id works
real_client.user = MagicMock()
real_client.user.id = "1d5df9d7-989d-47cf-959f-aebe6cacebdf"
real_client.user.email = "sam123aye@gmail.com"

TRANSCRIPTS = [
    {
        "title": "Payment Sync 1",
        "text": """
Alice: Let's discuss the payment integration for the new product.
Bob: We need something fast to implement.
Charlie: Stripe is the best for this. Let's decide to use Stripe.
Alice: OK, decision made. We use Stripe.
Bob: Great. I will implement the Stripe integration. That's my action item.
        """
    },
    {
        "title": "Payment Sync 2",
        "text": """
Alice: How is the payment integration going?
Bob: I hit a blocker. There is a severe webhook reliability issue with Stripe. 
Charlie: We can't launch with unreliable webhooks. This issue blocks the Payment Project.
Alice: We might need to change providers. Let's evaluate Razorpay as an alternative. That's a decision for now.
Charlie: Okay, I'll take the action to test Razorpay.
        """
    },
    {
        "title": "Payment Sync 3",
        "text": """
Alice: So what's the verdict on the payment provider?
Charlie: Razorpay is okay, but it turns out the webhook issue with Stripe was just a configuration error on our end. 
Bob: So the webhook reliability issue is resolved?
Charlie: Yes.
Alice: Okay, let's revert our decision. Stripe remains our provider.
Bob: Perfect. I commit to finishing the Stripe integration by next Friday.
        """
    }
]

async def run_test():
    print("=== PHASE 6 REAL DATA VALIDATION ===\n")
    
    meeting_ids = []
    
    # Process transcripts
    for t in TRANSCRIPTS:
        print(f"Processing: {t['title']}...")
        summary = summarize(
            t["text"].strip(),
            detected_language="English",
            output_language="English"
        )
        
        meeting_data = {
            "user_id": real_client.user.id,
            "email": real_client.user.email,
            "title": t['title'],
            "transcript": t["text"].strip(),
            "segments": [{"start": 0, "end": 10}],
            "executive_summary": summary["executiveSummary"],
            "duration": 10,
            "sentiment": summary.get("sentiment"),
            "priority": summary.get("priority"),
            "tags": summary.get("tags", []),
            "word_count": len(t["text"].strip().split()),
            "next_steps": summary.get("nextSteps", []),
            "language": "English",
            "language_code": "en",
        }
        
        meeting_res = real_client.table("meetings").insert(meeting_data).execute()
        meeting_id = meeting_res.data[0]["id"]
        meeting_ids.append(meeting_id)
        
        if summary.get("actionItems"):
            actions = [{"meeting_id": meeting_id, "action_text": a.get("text", a) if isinstance(a, dict) else a, "status": a.get("status", "pending") if isinstance(a, dict) else "pending"} for a in summary["actionItems"]]
            real_client.table("action_items").insert(actions).execute()
            
        if summary.get("decisions"):
            decisions = [{"meeting_id": meeting_id, "decision_text": d.get("text", d) if isinstance(d, dict) else d, "confidence": d.get("confidence") if isinstance(d, dict) else None, "status": d.get("status", "CURRENT") if isinstance(d, dict) else "CURRENT", "participants": d.get("participants") if isinstance(d, dict) else None} for d in summary["decisions"]]
            real_client.table("decisions").insert(decisions).execute()
            
        if summary.get("commitments"):
            commitments = [{"meeting_id": meeting_id, "person": c.get("person", "Unknown") if isinstance(c, dict) else "Unknown", "commitment_text": c.get("text", c) if isinstance(c, dict) else c, "due_date": c.get("due_date") if isinstance(c, dict) else None, "status": c.get("status", "OPEN") if isinstance(c, dict) else "OPEN", "confidence": c.get("confidence") if isinstance(c, dict) else None} for c in summary["commitments"]]
            try:
                real_client.table("commitments").insert(commitments).execute()
            except Exception as e:
                print("Commitments insert error:", e)
            
        if summary.get("entities"):
            entities = [{"meeting_id": meeting_id, "entity_name": e.get("name"), "entity_type": e.get("entity_type")} for e in summary["entities"]]
            try:
                real_client.table("meeting_entities").insert(entities).execute()
            except Exception as e:
                print("Entities insert error:", e)
            
        if summary.get("relationships"):
            relationships = [{"meeting_id": meeting_id, "source_name": r.get("source"), "source_type": r.get("source_type"), "relationship_type": r.get("type"), "target_name": r.get("target"), "target_type": r.get("target_type")} for r in summary["relationships"]]
            try:
                real_client.table("meeting_relationships").insert(relationships).execute()
            except Exception as e:
                print("Relationships insert error:", e)
            
        time.sleep(2) # rate limit protect
        
    print("\nData ingested. Asking cross-meeting reasoning questions...\n")
    
    questions = [
        "What is the current payment provider decision?",
        "How did the payment decision evolve across meetings?",
        "What changed about payment integration?",
        "Why did the payment decision change?",
        "What remains unresolved for the payment project?",
        "Who owns the payment work?",
        "What is blocking the payment project?",
        "What is the current state of kubernetes?"
    ]
    
    for q in questions:
        req = CrossMeetingQueryRequest(question=q, history=[])
        # override client user
        with patch("app.main.get_user_supabase", return_value=real_client):
            try:
                res = await cross_meeting_query(req, real_client)
                print(f"Q: {q}\nA:\n{res.answer}\n")
            except Exception as e:
                print(f"Failed to answer '{q}': {e}")
                
        time.sleep(2) # rate limit protect

if __name__ == "__main__":
    asyncio.run(run_test())
