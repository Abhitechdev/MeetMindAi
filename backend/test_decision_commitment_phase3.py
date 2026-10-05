import time
from fastapi.testclient import TestClient
from app.main import app, get_user_supabase
from unittest.mock import patch, MagicMock

client = TestClient(app)

# Setup mock data with Phase 3 structured lifecycle fields
meetings_data = [
    {"id": "m1", "title": "Jan Planning", "created_at": "2023-01-01", "executive_summary": "Initial frontend discussion.", "tags": []},
    {"id": "m2", "title": "Feb Pivot", "created_at": "2023-02-01", "executive_summary": "We pivoted our strategy.", "tags": []},
    {"id": "m3", "title": "March Execution", "created_at": "2023-03-01", "executive_summary": "Actioning on tasks.", "tags": []},
]

decisions_data = [
    {"meeting_id": "m1", "decision_text": "Use React for frontend.", "status": "SUPERSEDED", "confidence": 0.9, "participants": ["Alice"], "source_reference": "[speaker: Alice]"},
    {"meeting_id": "m2", "decision_text": "We considered Vue, but decided to use Svelte instead of React.", "status": "CURRENT", "confidence": 0.95, "participants": ["Alice", "Bob"], "source_reference": "[speaker: Bob]"},
]

actions_data = [
    {"meeting_id": "m1", "action_text": "Setup repo.", "status": "completed", "owner": "Alice", "source_reference": None},
    {"meeting_id": "m3", "action_text": "Configure CI/CD pipeline.", "status": "pending", "owner": "Charlie", "source_reference": None},
]

commitments_data = [
    {"meeting_id": "m2", "person": "Dave", "commitment_text": "Deliver marketing assets by Friday.", "due_date": "Friday", "status": "OPEN", "confidence": 0.9, "source_reference": None},
    {"meeting_id": "m3", "person": "Eve", "commitment_text": "Draft blog post.", "due_date": "Next week", "status": "OPEN", "confidence": 0.8, "source_reference": None},
    {"meeting_id": "m1", "person": "Alice", "commitment_text": "Send initial wireframes.", "due_date": "Jan 10", "status": "COMPLETED", "confidence": 0.9, "source_reference": None}
]

entities_data = []

def mock_get_user_supabase():
    mock_client = MagicMock()
    mock_client.user.id = "user123"
    
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
            
        return t
        
    mock_client.table = mock_table
    return mock_client

app.dependency_overrides[get_user_supabase] = mock_get_user_supabase

def fake_completion(*args, **kwargs):
    messages = kwargs.get("messages", [])
    content = messages[-1]["content"] if messages else ""
    system = messages[0]["content"] if messages else ""
    
    ret = MagicMock()
    ret.choices = [MagicMock()]
    
    # 1. Expansion call (always return something generic or the words themselves)
    if "Generate a comma-separated list of 5-10 synonyms" in content:
        ret.choices[0].message.content = "decision, commitment, action, frontend, react, svelte, pipeline, marketing"
        return ret
        
    # 2. Synthesis call
    question_part = content.split("Question:")[-1].lower() if "Question:" in content else content.lower()
    
    # Check if we should respond based on context (dummy logic for tests)
    response = "Mock response based on memory context."
    if "what decisions were made" in question_part:
        response = "### CURRENT DECISION\nWe are using Svelte.\n### HISTORY\nWe previously decided to use React but this was superseded.\n### EVIDENCE\nJan Planning"
    elif "what commitments were made" in question_part:
        response = "### OPEN COMMITMENTS\nDave is delivering marketing assets by Friday.\nEve is drafting a blog post.\nAlice completed wireframes."
    elif "action items are still pending" in question_part:
        response = "### PENDING ACTIONS\nCharlie needs to configure the CI/CD pipeline."
    elif "what changed between meetings" in question_part or "frontend" in question_part:
        response = "### HISTORY\nIn Jan Planning, the decision was to use React. In Feb Pivot, the strategy changed to use Svelte."
    elif "current versus historical" in question_part:
        response = "### CURRENT DECISION\nSvelte.\n### HISTORY\nReact."
    elif "commitments remain unresolved" in question_part:
        response = "### OPEN COMMITMENTS\nDave's marketing assets and Eve's blog post."
    
    ret.choices[0].message.content = response
    return ret

patch_completion = patch("app.main.gemini_service._create_completion", side_effect=fake_completion)
patch_get_client = patch("app.main.gemini_service._get_client", return_value=(MagicMock(), MagicMock()))

def run_tests():
    questions = [
        ("What decisions were made regarding the frontend framework?", "history"),
        ("What commitments were made by Dave?", "marketing"),
        ("Which action items are still pending?", "charlie"),
        ("What changed between meetings about the UI?", "svelte"),
        ("Which decisions are current versus historical?", "svelte"),
        ("Which commitments remain unresolved?", "eve")
    ]
    
    passed = 0
    with patch_completion, patch_get_client:
        for q, expected in questions:
            res = client.post("/meeting-memory/query", json={"question": q})
            ans = res.json().get("answer", "").lower()
            if expected in ans:
                print(f"PASS: {q}")
                passed += 1
            else:
                print(f"FAIL: {q} | Got: {ans}")
                
    print(f"\nResults: {passed}/{len(questions)} passed.")
    
if __name__ == "__main__":
    run_tests()
