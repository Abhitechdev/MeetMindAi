import time
from fastapi.testclient import TestClient
from app.main import app, get_user_supabase
from unittest.mock import patch, MagicMock
import os

client = TestClient(app)

# Setup mock data for meetings, decisions, actions, entities
meetings_data = [
    {"id": "m1", "title": "Kickoff", "created_at": "2023-01-01", "executive_summary": "We discussed frontend frameworks.", "tags": []},
    {"id": "m2", "title": "Architecture Sync", "created_at": "2023-02-01", "executive_summary": "We changed our minds on the framework.", "tags": []},
    {"id": "m3", "title": "Final Review", "created_at": "2023-03-01", "executive_summary": "Final decision made.", "tags": []},
    {"id": "m4", "title": "Payment Sync", "created_at": "2023-04-01", "executive_summary": "We selected Stripe as our payment provider.", "tags": []},
    {"id": "m5", "title": "Database Planning", "created_at": "2023-05-01", "executive_summary": "We will use PostgreSQL database.", "tags": []}
]

decisions_data = [
    {"meeting_id": "m1", "decision_text": "Use React for frontend.", "source_reference": "[speaker: Alice]"},
    {"meeting_id": "m2", "decision_text": "We considered Vue, but decided not to.", "source_reference": "[speaker: Bob]"},
    {"meeting_id": "m3", "decision_text": "Use Svelte for frontend instead of React or Vue.", "source_reference": "[speaker: Charlie]"},
    {"meeting_id": "m4", "decision_text": "We chose Stripe.", "source_reference": "[speaker: Dave]"},
    {"meeting_id": "m5", "decision_text": "PostgreSQL is selected.", "source_reference": "[speaker: Eve]"}
]

actions_data = [
    {"meeting_id": "m1", "action_text": "Alice to setup repo.", "source_reference": None}
]

entities_data = [
    {"meeting_id": "m2", "entity_name": "Database Migration", "entity_type": "project", "source_reference": None},
    {"meeting_id": "m1", "entity_name": "Alice", "entity_type": "person", "source_reference": None}
]

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
    
    # 1. Expansion call
    if "Analyze the intent of this question" in content:
        import json
        if "ui library" in content.lower() or "client-side" in content.lower():
            ret.choices[0].message.content = json.dumps({"intents": ["TOPIC"], "keywords": ["frontend", "framework", "react", "svelte", "vue", "interface", "components"]})
        elif "payment provider" in content.lower() or "gateway" in content.lower() or "payments" in content.lower():
            ret.choices[0].message.content = json.dumps({"intents": ["TOPIC"], "keywords": ["stripe", "paypal", "processor", "gateway", "billing"]})
        elif "database" in content.lower() or "postgres" in content.lower():
            ret.choices[0].message.content = json.dumps({"intents": ["TOPIC"], "keywords": ["postgresql", "sql", "relational", "storage"]})
        elif "initializing the codebase" in content.lower():
            ret.choices[0].message.content = json.dumps({"intents": ["TOPIC"], "keywords": ["setup", "repo", "initialize", "repository", "project"]})
        elif "kubernetes" in content.lower():
            ret.choices[0].message.content = json.dumps({"intents": ["TOPIC"], "keywords": ["k8s", "containers", "orchestration", "deployment", "pods"]})
        else:
            ret.choices[0].message.content = json.dumps({"intents": [], "keywords": []})
        return ret
        
    # 2. Synthesis call
    # The bounded retrieval will have fed specific context.
    # We simulate reading the memory_context.
    
    # Extract question from content
    question_part = content.split("Question:")[-1].lower() if "Question:" in content else content.lower()
    
    # Check if correct meetings are in context
    if "stripe" in question_part or "payment" in question_part or "gateway" in question_part:
        if "We chose Stripe." in content:
            response = "We selected Stripe as our payment provider."
        else:
            response = "I couldn't find that information in your past meetings."
            
    elif "postgres" in question_part:
        if "PostgreSQL is selected" in content:
            response = "We selected PostgreSQL."
        else:
            response = "I couldn't find that information in your past meetings."
            
    elif "setup" in question_part or "initialize" in question_part or "codebase" in question_part:
        if "Alice to setup repo" in content:
            response = "Alice is responsible for setting up the repo."
        else:
            response = "I couldn't find that information in your past meetings."
            
    elif "frontend" in question_part or "ui library" in question_part or "client-side" in question_part:
        if "Svelte" in content:
            response = "We decided to use Svelte (after considering React and Vue)."
        else:
            response = "I couldn't find that information in your past meetings."
            
    elif "kubernetes" in question_part:
        response = "I couldn't find that information in your past meetings."
        
    else:
        response = "General answer based on context."
        
    ret.choices[0].message.content = response
    return ret

patch_completion = patch("app.main.gemini_service._create_completion", side_effect=fake_completion)
patch_get_client = patch("app.main.gemini_service._get_client", return_value=(MagicMock(), MagicMock()))

def run_tests():
    questions = [
        # Semantics
        ("Which UI library did we settle on?", "svelte"),
        ("What payment provider did we choose?", "stripe"),
        ("Which gateway are we using?", "stripe"),
        ("Are we utilizing a Postgres database?", "postgresql"),
        ("Who is responsible for initializing the codebase?", "alice"),
        
        # Negative
        ("What was our plan for Kubernetes deployment?", "couldn't find")
    ]
    
    start_time = time.time()
    
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
                
    latency = (time.time() - start_time) / len(questions)
    print(f"\nResults: {passed}/{len(questions)} passed.")
    print(f"Average latency per request (mocked): {latency:.3f}s")
    
if __name__ == "__main__":
    run_tests()
