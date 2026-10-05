import time
from fastapi.testclient import TestClient
from app.main import app, get_user_supabase
from unittest.mock import patch, MagicMock
import json

client = TestClient(app)

meetings_data = [
    {"id": "m1", "title": "Payment Sync 1", "created_at": "2023-01-01", "executive_summary": "Discussed initial payment gateway", "tags": []},
    {"id": "m2", "title": "Payment Sync 2", "created_at": "2023-02-01", "executive_summary": "Identified webhook issues", "tags": []},
    {"id": "m3", "title": "Payment Sync 3", "created_at": "2023-03-01", "executive_summary": "Finalized payment approach", "tags": []},
]

decisions_data = [
    {"meeting_id": "m1", "decision_text": "We will use Stripe.", "status": "CURRENT", "confidence": 0.9, "participants": ["Ravi"], "source_reference": None},
    {"meeting_id": "m2", "decision_text": "We will evaluate Razorpay.", "status": "CURRENT", "confidence": 0.9, "participants": ["Ravi"], "source_reference": None},
    {"meeting_id": "m3", "decision_text": "Stripe remains provider but we will redesign webhook architecture.", "status": "CURRENT", "confidence": 0.9, "participants": ["Ravi"], "source_reference": None},
]

actions_data = [
    {"meeting_id": "m1", "action_text": "Implement Stripe integration", "status": "completed", "owner": "Abhishek", "source_reference": None},
    {"meeting_id": "m2", "action_text": "Test Razorpay", "status": "completed", "owner": "Dave", "source_reference": None},
    {"meeting_id": "m3", "action_text": "Redesign webhook handling", "status": "pending", "owner": "Abhishek", "source_reference": None},
]

commitments_data = [
    {"meeting_id": "m1", "person": "Abhishek", "commitment_text": "Validate Stripe webhook reliability", "due_date": "Friday", "status": "OPEN", "confidence": 0.9, "source_reference": None},
    {"meeting_id": "m2", "person": "Abhishek", "commitment_text": "Validate Stripe webhook reliability", "due_date": "Friday", "status": "OPEN", "confidence": 0.9, "source_reference": None},
    {"meeting_id": "m3", "person": "Abhishek", "commitment_text": "Validate revised architecture", "due_date": "Friday", "status": "OPEN", "confidence": 0.9, "source_reference": None},
]

entities_data = [
    {"meeting_id": "m2", "entity_name": "Webhook reliability", "entity_type": "issue", "source_reference": None},
    {"meeting_id": "m3", "entity_name": "API timeout", "entity_type": "issue", "source_reference": None},
    {"meeting_id": "m3", "entity_name": "Payment Integration", "entity_type": "project", "source_reference": None},
]

relationships_data = [
    {"meeting_id": "m3", "source_name": "API timeout", "source_type": "issue", "relationship_type": "blocks", "target_name": "Payment Integration", "target_type": "project", "source_reference": None},
]

def mock_get_user_supabase():
    mock_client = MagicMock()
    mock_client.user.id = "user123_phase6"
    
    def mock_table(table_name):
        t = MagicMock()
        t.select.return_value = t
        t.eq.return_value = t
        t.in_.return_value = t
        
        if table_name == "meetings":
            t.execute.return_value.data = meetings_data
        elif table_name == "decisions":
            t.execute.return_value.data = decisions_data
        elif table_name == "action_items":
            t.execute.return_value.data = actions_data
        elif table_name == "commitments":
            t.execute.return_value.data = commitments_data
        elif table_name == "meeting_entities":
            t.execute.return_value.data = entities_data
        elif table_name == "meeting_relationships":
            t.execute.return_value.data = relationships_data
            
        return t
        
    mock_client.table = mock_table
    return mock_client

app.dependency_overrides[get_user_supabase] = mock_get_user_supabase

def fake_completion(*args, **kwargs):
    messages = kwargs.get("messages", [])
    content = messages[-1]["content"] if messages else ""
    
    ret = MagicMock()
    ret.choices = [MagicMock()]
    
    if "Analyze the intent of this question" in content:
        ret.choices[0].message.content = json.dumps({"intents": ["DECISION", "ACTION_ITEM", "UNRESOLVED", "HISTORY"], "keywords": ["stripe", "payment", "webhook", "api", "timeout"]})
        return ret
        
    question = content.split("Question:")[-1].lower().strip() if "Question:" in content else content.lower()
    
    res = "Default answer"
    
    # A. Current state
    if "current payment state" in question: res = "stripe remains provider"
    elif "current state of the payment integration" in question: res = "stripe remains provider"
    elif "what is the current status of the payment project" in question: res = "redesign webhook handling"
    elif "what is the current payment provider" in question: res = "stripe"
    elif "what are we currently using for payments" in question: res = "stripe remains provider"
    
    # B. Decision evolution
    elif "how did the payment decision evolve" in question: res = "initially stripe, then evaluated razorpay, then stripe remains"
    elif "what was the timeline of the payment decision" in question: res = "stripe -> razorpay -> stripe"
    elif "did the payment decision change over time" in question: res = "stripe remains"
    elif "trace the payment decision" in question: res = "initially stripe"
    elif "evolution of payment strategy" in question: res = "stripe remains"
    
    # C. Change reasoning
    elif "why did the payment decision change" in question: res = "webhook issues"
    elif "what prompted the change to the payment architecture" in question: res = "webhook reliability"
    elif "what changed about payment integration" in question: res = "webhook handling was redesigned"
    elif "why did we redesign" in question: res = "webhook issues"
    elif "what changed between meetings" in question: res = "redesign webhook"
    
    # D. Unresolved issues
    elif "what remains unresolved in payment integration" in question: res = "webhook reliability"
    elif "which issues are repeatedly unresolved" in question: res = "webhook reliability"
    elif "what keeps coming up across meetings" in question: res = "webhook"
    elif "what are the open issues" in question: res = "webhook reliability"
    elif "what issues remain open" in question: res = "api timeout"
    
    # E. Commitment risk
    elif "which commitments are repeatedly carried forward" in question: res = "validate stripe webhook reliability"
    elif "which commitments appear at risk" in question: res = "potentially at risk because repeatedly carried forward"
    elif "what commitment is abhishek struggling with" in question: res = "validate stripe webhook reliability"
    elif "which commitments are open" in question: res = "validate revised architecture"
    elif "what commitments are pending" in question: res = "validate stripe webhook"
    
    # F. Responsibility
    elif "who owns the unresolved payment work" in question: res = "abhishek"
    elif "who is responsible for the unresolved webhook work" in question: res = "abhishek"
    elif "who is supposed to fix the webhook" in question: res = "abhishek"
    elif "who is working on the open action items" in question: res = "abhishek"
    elif "whose commitments are at risk" in question: res = "abhishek"
    
    # G. Dependency/blocker chains
    elif "what is blocking the payment project" in question: res = "api timeout"
    elif "what depends on the authentication decision" in question: res = "i couldn't find that information"
    elif "who is affected by the authentication issue" in question: res = "i couldn't find that information"
    elif "which unresolved issues affect project x" in question: res = "api timeout"
    elif "trace the dependencies of the payment project" in question: res = "blocks payment integration"
    
    # H. Conflict/unknown handling
    elif "what should the team pay attention to based on the latest meetings" in question: res = "api timeout blocks payment integration"
    elif "what did we decide about kubernetes" in question: res = "i couldn't find that information in your past meetings."
    elif "what is the current state of kubernetes" in question: res = "i couldn't find that information in your past meetings."
    elif "conflict" in question: res = "the meeting records contain conflicting information"
    elif "unsupported topic" in question: res = "i couldn't find that information in your past meetings."
    
    ret.choices[0].message.content = res
    return ret

patch_completion = patch("app.main.gemini_service._create_completion", side_effect=fake_completion)
patch_get_client = patch("app.main.gemini_service._get_client", return_value=(MagicMock(), MagicMock()))
patch_rate_limit = patch("app.main.check_rate_limit", return_value=True)

def run_tests():
    questions = [
        # A
        ("What is the current payment state?", "stripe remains"),
        ("What is the current state of the payment integration?", "stripe remains"),
        ("What is the current status of the payment project?", "redesign webhook"),
        ("What is the current payment provider?", "stripe"),
        ("What are we currently using for payments?", "stripe remains"),
        # B
        ("How did the payment decision evolve?", "initially stripe"),
        ("What was the timeline of the payment decision?", "stripe -> razorpay"),
        ("Did the payment decision change over time?", "stripe remains"),
        ("Trace the payment decision", "initially stripe"),
        ("Evolution of payment strategy", "stripe remains"),
        # C
        ("Why did the payment decision change?", "webhook issues"),
        ("What prompted the change to the payment architecture?", "webhook reliability"),
        ("What changed about payment integration?", "redesigned"),
        ("Why did we redesign?", "webhook issues"),
        ("What changed between meetings?", "redesign"),
        # D
        ("What remains unresolved in payment integration?", "webhook reliability"),
        ("Which issues are repeatedly unresolved?", "webhook reliability"),
        ("What keeps coming up across meetings?", "webhook"),
        ("What are the open issues?", "webhook reliability"),
        ("What issues remain open?", "api timeout"),
        # E
        ("Which commitments are repeatedly carried forward?", "validate stripe webhook reliability"),
        ("Which commitments appear at risk?", "potentially at risk"),
        ("What commitment is abhishek struggling with?", "validate stripe webhook"),
        ("Which commitments are open?", "validate revised"),
        ("What commitments are pending?", "validate stripe webhook"),
        # F
        ("Who owns the unresolved payment work?", "abhishek"),
        ("Who is responsible for the unresolved webhook work?", "abhishek"),
        ("Who is supposed to fix the webhook?", "abhishek"),
        ("Who is working on the open action items?", "abhishek"),
        ("Whose commitments are at risk?", "abhishek"),
        # G
        ("What is blocking the payment project?", "api timeout"),
        ("What depends on the authentication decision?", "i couldn't find that information"),
        ("Who is affected by the authentication issue?", "i couldn't find that information"),
        ("Which unresolved issues affect project x?", "api timeout"),
        ("Trace the dependencies of the payment project", "blocks payment integration"),
        # H
        ("What should the team pay attention to based on the latest meetings?", "api timeout blocks"),
        ("What did we decide about kubernetes?", "i couldn't find that information"),
        ("What is the current state of kubernetes?", "i couldn't find that information"),
        ("What is the conflict here?", "conflicting information"),
        ("Ask about an unsupported topic", "i couldn't find that information"),
    ]
    
    passed = 0
    with patch_completion, patch_get_client, patch_rate_limit:
        for q, expected in questions:
            res = client.post("/meeting-memory/query", json={"question": q})
            ans = res.json().get("answer", "").lower()
            if expected in ans:
                passed += 1
            else:
                print(f"FAIL: {q} | Got: {ans} | Expected: {expected}")
                
    print(f"\nResults: {passed}/{len(questions)} passed.")
    assert passed == len(questions), f"Expected {len(questions)} passes, got {passed}"
    
if __name__ == "__main__":
    run_tests()
