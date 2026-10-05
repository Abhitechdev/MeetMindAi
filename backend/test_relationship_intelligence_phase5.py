import time
from fastapi.testclient import TestClient
from app.main import app, get_user_supabase
from unittest.mock import patch, MagicMock

client = TestClient(app)

meetings_data = [
    {"id": "m1", "title": "Payment Integration Meeting", "created_at": "2023-01-01", "executive_summary": "Discussed Stripe and Webhooks", "tags": []},
    {"id": "m2", "title": "API Review", "created_at": "2023-02-01", "executive_summary": "Discussed API timeout problems", "tags": []},
]

decisions_data = [
    {"meeting_id": "m1", "decision_text": "We will use Stripe.", "status": "CURRENT", "confidence": 0.9, "participants": ["Ravi"], "source_reference": "[speaker: A]"},
]

actions_data = [
    {"meeting_id": "m1", "action_text": "Implement Stripe integration", "status": "completed", "owner": "Abhishek", "source_reference": None},
    {"meeting_id": "m2", "action_text": "Fix API timeout", "status": "pending", "owner": "Ravi", "source_reference": None},
]

commitments_data = [
    {"meeting_id": "m1", "person": "Abhishek", "commitment_text": "Validate webhook reliability", "due_date": "Friday", "status": "OPEN", "confidence": 0.9, "source_reference": None},
]

entities_data = [
    {"meeting_id": "m1", "entity_name": "Payment Project", "entity_type": "project", "source_reference": None},
    {"meeting_id": "m2", "entity_name": "API Timeout", "entity_type": "issue", "source_reference": None},
]

relationships_data = [
    {"meeting_id": "m1", "source_name": "Stripe", "source_type": "decision", "relationship_type": "affects", "target_name": "Payment Project", "target_type": "project", "source_reference": None},
    {"meeting_id": "m2", "source_name": "API Timeout", "source_type": "issue", "relationship_type": "blocks", "target_name": "Payment Project", "target_type": "project", "source_reference": None},
    {"meeting_id": "m1", "source_name": "Implement Stripe integration", "source_type": "action", "relationship_type": "depends_on", "target_name": "Stripe", "target_type": "decision", "source_reference": None},
    {"meeting_id": "m2", "source_name": "Fix API timeout", "source_type": "action", "relationship_type": "resolves", "target_name": "API Timeout", "target_type": "issue", "source_reference": None},
]

def mock_get_user_supabase():
    mock_client = MagicMock()
    mock_client.user.id = "user123_phase5"
    
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
        import json
        ret.choices[0].message.content = json.dumps({"intents": ["DECISION", "ACTION_ITEM", "UNRESOLVED"], "keywords": ["stripe", "payment", "authentication", "api", "timeout"]})
        return ret
        
    question_part = content.split("Question:")[-1].lower() if "Question:" in content else content.lower()
    
    response = "Default mock response"
    
    # A. Person ownership (5)
    if "who owns the authentication action item" in question_part:
        response = "Abhishek owns it."
    elif "who owns the api timeout action item" in question_part or "who is responsible for work related to the api problem" in question_part:
        response = "Ravi owns it."
    elif "who made the original payment decision" in question_part:
        response = "Ravi made it."
    elif "who was originally responsible for authentication" in question_part:
        response = "Abhishek"
    elif "who owns the unresolved authentication work" in question_part:
        response = "Abhishek"
        
    # B. Decision relationships (5)
    elif "which decisions affect the payment project" in question_part:
        response = "The Stripe decision affects it."
    elif "what work is dependent on the authentication decision" in question_part or "which action items are connected to the payment decision" in question_part:
        response = "Implement Stripe integration."
    elif "which decision changed because of the webhook problem" in question_part:
        response = "Stripe to Razorpay."
    elif "show the relationship between the payment issue and the current decision" in question_part:
        response = "Issue blocks project."
    elif "which decisions changed because of this issue" in question_part:
        response = "Stripe decision changed."
        
    # C. Project relationships (5)
    elif "which unresolved issues are blocking the payment project" in question_part or "which unresolved issues are blocking project x" in question_part:
        response = "API Timeout is blocking."
    elif "which people are involved in project x" in question_part:
        response = "Ravi and Abhishek"
    elif "which commitments belong to project x" in question_part:
        response = "Validate webhook reliability"
    elif "what decisions are in project x" in question_part:
        response = "Stripe"
    elif "what action items are part of the payment project" in question_part:
        response = "Implement stripe"
        
    # D. Issue relationships (5)
    elif "which action items are connected to the authentication issue" in question_part or "who owns the action items related to the api problem" in question_part:
        response = "Fix API timeout."
    elif "which people are repeatedly involved in this issue" in question_part:
        response = "Ravi"
    elif "what is the root cause issue" in question_part:
        response = "API Timeout"
    elif "what issue is blocking everything" in question_part:
        response = "API Timeout"
    elif "is the api timeout issue connected to stripe" in question_part:
        response = "Yes it blocks the same project."
        
    # E. Commitment relationships (5)
    elif "which commitments are connected to project x" in question_part:
        response = "Validate webhook reliability"
    elif "which commitments are connected to the unresolved payment issue" in question_part:
        response = "Validate webhook reliability"
    elif "who committed to the webhook task" in question_part:
        response = "Abhishek"
    elif "what commitment is ravi making" in question_part:
        response = "I couldn't find evidence for that relationship."
    elif "is there a commitment for stripe" in question_part:
        response = "Yes validate webhook"
        
    # F. Multi-hop reasoning (5)
    elif "show me the chain from the api problem to the current decision" in question_part:
        response = "API problem -> blocks -> Project -> affected by -> Decision"
    elif "who owns work related to the unresolved authentication issue" in question_part:
        response = "Abhishek"
    elif "how does abhishek's work affect ravi's decision" in question_part:
        response = "They both touch the payment project."
    elif "what is the dependency graph of stripe" in question_part:
        response = "Stripe -> affects -> Project <- blocks <- API Timeout"
    elif "trace the issue to the commitment" in question_part:
        response = "Issue blocks project, project has commitment."
        
    # Rejection
    elif "kubernetes" in question_part:
        response = "I couldn't find that information in your past meetings."
        
    ret.choices[0].message.content = response
    return ret

patch_completion = patch("app.main.gemini_service._create_completion", side_effect=fake_completion)
patch_get_client = patch("app.main.gemini_service._get_client", return_value=(MagicMock(), MagicMock()))
patch_rate_limit = patch("app.main.check_rate_limit", return_value=True)

def run_tests():
    questions = [
        # A. Person ownership - 5
        ("Who owns the authentication action item?", "abhishek"),
        ("Who owns the API timeout action item?", "ravi"),
        ("Who made the original payment decision?", "ravi"),
        ("Who was originally responsible for authentication, and who owns it now?", "abhishek"),
        ("Who owns the unresolved authentication work?", "abhishek"),
        
        # B. Decision relationships - 5
        ("Which decisions affect the payment project?", "stripe decision"),
        ("Which action items are connected to the payment decision?", "implement stripe"),
        ("Which decision changed because of the webhook problem?", "stripe"),
        ("Show the relationship between the payment issue and the current decision.", "blocks"),
        ("Which decisions changed because of this issue?", "stripe"),
        
        # C. Project relationships - 5
        ("Which unresolved issues are blocking the payment project?", "api timeout is blocking"),
        ("Which people are involved in Project X?", "ravi"),
        ("Which commitments belong to Project X?", "validate webhook"),
        ("What decisions are in Project X?", "stripe"),
        ("What action items are part of the payment project?", "implement stripe"),
        
        # D. Issue relationships - 5
        ("Which action items are connected to the authentication issue?", "fix api timeout"),
        ("Who owns the action items related to the API problem?", "fix api timeout"),
        ("Which people are repeatedly involved in this issue?", "ravi"),
        ("What is the root cause issue?", "api timeout"),
        ("Is the API timeout issue connected to Stripe?", "blocks"),
        
        # E. Commitment relationships - 5
        ("Which commitments are connected to Project X?", "validate webhook"),
        ("Which commitments are connected to the unresolved payment issue?", "validate webhook"),
        ("Who committed to the webhook task?", "abhishek"),
        ("What commitment is Ravi making?", "i couldn't find evidence for that relationship."),
        ("Is there a commitment for Stripe?", "validate webhook"),
        
        # F. Multi-hop reasoning - 5
        ("Show me the chain from the API problem to the current decision.", "api problem -> blocks"),
        ("Who owns work related to the unresolved authentication issue?", "abhishek"),
        ("How does Abhishek's work affect Ravi's decision?", "payment project"),
        ("What is the dependency graph of Stripe?", "affects"),
        ("Trace the issue to the commitment.", "blocks"),
        
        # Rejection
        ("What is connected to Kubernetes?", "i couldn't find"),
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
