import pytest
from unittest.mock import MagicMock
from app.services import gemini_service
from app.main import app, get_user_supabase
from fastapi.testclient import TestClient

client = TestClient(app, raise_server_exceptions=False)

def get_mock_client(user_id, email="test@test.com"):
    mock_client = MagicMock()
    mock_user = MagicMock()
    mock_user.id = user_id
    mock_user.email = email
    mock_client.user = mock_user
    return mock_client

def test_llm_fallback_resilience():
    client_mock = MagicMock()
    call_count = 0
    def mock_create(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            raise Exception("503 Service Unavailable")
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Success fallback"
        return mock_response
    client_mock.chat.completions.create = mock_create
    models = ["model1_failing", "model2_success"]
    response = gemini_service._create_completion(client_mock, models, messages=[{"role": "user", "content": "test"}])
    assert response.choices[0].message.content == "Success fallback"
    assert call_count == 2
    
def test_llm_complete_failure():
    client_mock = MagicMock()
    def mock_create(*args, **kwargs): raise Exception("Timeout")
    client_mock.chat.completions.create = mock_create
    models = ["model1_failing", "model2_failing"]
    with pytest.raises(Exception) as exc_info:
        gemini_service._create_completion(client_mock, models, messages=[{"role": "user", "content": "test"}])
    assert "Timeout" in str(exc_info.value)

def test_llm_malformed_json():
    from app.services.gemini_service import summarize
    def mock_completion_garbage(*args, **kwargs):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "I'm sorry, I can't do that."
        return mock_response
    gemini_service._create_completion = mock_completion_garbage
    result = summarize("Some transcript")
    assert isinstance(result, dict)
    assert result.get("decisions") == []

def test_database_failure_graceful_handling():
    mock_client = get_mock_client("user_a")
    app.dependency_overrides[get_user_supabase] = lambda: mock_client
    
    mock_client.table().select().eq().order().execute.side_effect = Exception("Supabase connection timeout")
    
    response = client.get("/meetings", headers={"Authorization": "Bearer fake"})
    app.dependency_overrides.clear()
    
    assert response.status_code == 500
    assert "Supabase connection timeout" in response.text or "Internal Server Error" in response.text

def test_database_missing_table_handling():
    mock_client = get_mock_client("user_a")
    app.dependency_overrides[get_user_supabase] = lambda: mock_client
    
    mock_client.table().select().eq().execute.return_value = MagicMock(data=[{"id": "m1", "title": "t", "created_at": "now", "executive_summary": "s", "tags": []}])
    
    original_table = mock_client.table
    def mock_table(table_name):
        tbl = MagicMock()
        if table_name in ["commitments", "meeting_entities", "meeting_relationships"]:
            tbl.select().in_().execute.side_effect = Exception("Table not found")
        else:
            tbl.select().in_().execute.return_value = MagicMock(data=[])
        return tbl
    mock_client.table = mock_table
    
    def mock_completion(*args, **kwargs):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Mock answer"
        return mock_response
    gemini_service._create_completion = mock_completion

    response = client.post("/meeting-memory/query", json={"question": "test"}, headers={"Authorization": "Bearer fake"})
    app.dependency_overrides.clear()
    mock_client.table = original_table
    
    assert response.status_code == 200
    assert response.json()["answer"] == "Mock answer"
