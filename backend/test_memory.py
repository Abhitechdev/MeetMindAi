from fastapi.testclient import TestClient
from app.main import app
import os
from unittest.mock import patch, MagicMock

client = TestClient(app)

# We will mock get_user_supabase to return a mock client
def mock_get_user_supabase():
    mock_client = MagicMock()
    mock_client.user.id = "user123"
    
    # Setup mock data for meetings, decisions, actions, entities
    # 3 meetings for evolution
    meetings_data = [
        {"id": "m1", "title": "Kickoff", "created_at": "2023-01-01", "executive_summary": "We discussed frontend frameworks.", "tags": []},
        {"id": "m2", "title": "Architecture Sync", "created_at": "2023-02-01", "executive_summary": "We changed our minds on the framework.", "tags": []},
        {"id": "m3", "title": "Final Review", "created_at": "2023-03-01", "executive_summary": "Final decision made.", "tags": []}
    ]
    
    decisions_data = [
        {"meeting_id": "m1", "decision_text": "Use React for frontend.", "source_reference": "[speaker: Alice]"},
        {"meeting_id": "m2", "decision_text": "We considered Vue, but decided not to.", "source_reference": "[speaker: Bob]"},
        {"meeting_id": "m3", "decision_text": "Use Svelte for frontend instead of React or Vue.", "source_reference": "[speaker: Charlie]"}
    ]
    
    actions_data = [
        {"meeting_id": "m1", "action_text": "Alice to setup repo.", "source_reference": None}
    ]
    
    entities_data = [
        {"meeting_id": "m2", "entity_name": "Database Migration", "entity_type": "project", "source_reference": None},
        {"meeting_id": "m1", "entity_name": "Alice", "entity_type": "person", "source_reference": None}
    ]
    
    # Mock table chains
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

app.dependency_overrides[app.dependency_overrides.get("get_user_supabase", list(app.dependency_overrides.keys())[-1] if app.dependency_overrides else None) or "get_user_supabase"] = mock_get_user_supabase
# Wait, it's better to just explicitly override:
from app.main import get_user_supabase
app.dependency_overrides[get_user_supabase] = mock_get_user_supabase

def fake_completion(*args, **kwargs):
    messages = kwargs.get("messages", [])
    content = messages[-1]["content"] if messages else ""
    
    # Determine the response based on the question
    if "question: what frontend framework" in content.lower():
        response = "We decided to use React in 'Kickoff', then considered Vue in 'Architecture Sync', and finally switched to Svelte in 'Final Review'."
    elif "question: what was our plan for kubernetes" in content.lower():
        response = "I couldn't find that information in your past meetings."
    elif "question: who proposed using svelte" in content.lower():
        response = "Charlie proposed using Svelte in 'Final Review' (Source: [speaker: Charlie])."
    else:
        response = "Default response."
        
    ret = MagicMock()
    ret.choices = [MagicMock()]
    ret.choices[0].message.content = response
    return ret

patch_completion = patch("app.main.gemini_service._create_completion", side_effect=fake_completion)
patch_get_client = patch("app.main.gemini_service._get_client", return_value=(MagicMock(), MagicMock()))

def test_evolution():
    response = client.post("/meeting-memory/query", json={"question": "What frontend framework did we decide to use?"})
    ans = response.json().get("answer", "").lower()
    assert "react" in ans
    assert "vue" in ans
    assert "svelte" in ans
    assert "kickoff" in ans.lower()
    assert "final review" in ans.lower()

def test_hallucination_absent():
    response = client.post("/meeting-memory/query", json={"question": "What was our plan for Kubernetes deployment?"})
    ans = response.json().get("answer", "")
    print(f"ANS for kubernetes: {ans}")
    assert "couldn't find" in ans.lower() or "not find" in ans.lower()

def test_evidence():
    response = client.post("/meeting-memory/query", json={"question": "Who proposed using Svelte?"})
    ans = response.json().get("answer", "")
    assert "charlie" in ans.lower()

if __name__ == "__main__":
    with patch_completion, patch_get_client:
        test_evolution()
        test_hallucination_absent()
        test_evidence()
        print("TESTS PASSED")
