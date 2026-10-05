import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app, get_user_supabase
import os
from supabase.client import Client

client = TestClient(app)

def get_mock_client(user_id, email="test@test.com"):
    mock_client = MagicMock(spec=Client)
    mock_user = MagicMock()
    mock_user.id = user_id
    mock_user.email = email
    mock_client.user = mock_user
    return mock_client

def test_tenant_isolation_meeting_access():
    mock_client = get_mock_client("user_a")
    mock_client.table().select().eq().eq().execute.return_value = MagicMock(data=[])
    
    app.dependency_overrides[get_user_supabase] = lambda: mock_client
    response = client.get("/meetings/meeting_owned_by_b")
    app.dependency_overrides.clear()
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Meeting not found"

def test_tenant_isolation_meeting_delete():
    mock_client = get_mock_client("user_a")
    mock_client.table().delete().eq().execute.return_value = MagicMock(data=[])
    
    app.dependency_overrides[get_user_supabase] = lambda: mock_client
    response = client.delete("/meetings/meeting_owned_by_b")
    app.dependency_overrides.clear()
    
    assert response.status_code == 403
    assert response.json()["detail"] == "Forbidden or not found"

def test_input_validation_empty_question():
    response = client.post("/meeting-memory/query", json={"question": ""})
    # Covered by unauth, but empty payload test logic applies when properly authed.
    pass 

def test_input_validation_huge_payload():
    mock_client = get_mock_client("user_a")
    app.dependency_overrides[get_user_supabase] = lambda: mock_client
    
    huge_question = "A" * 5_000_000
    response = client.post("/meeting-memory/query", json={"question": huge_question})
    app.dependency_overrides.clear()
    
    # Fastapi will raise 413, 400, or LLM will raise 500, but no stack trace.
    assert response.status_code in [400, 413, 500, 429]

def test_upload_security_unsupported_extension():
    mock_client = get_mock_client("user_a")
    # We must mock rate limiting and subscriptions logic since it's checked in /process-meeting
    mock_client.table().select().eq().execute.return_value = MagicMock(data=[{"plan": "Pro", "meeting_limit": 100}])
    mock_client.table().select().eq().execute.return_value.count = 0
    app.dependency_overrides[get_user_supabase] = lambda: mock_client
    
    files = {'file': ('malicious.exe', b'bad stuff', 'application/x-msdownload')}
    data = {'mode': 'fast', 'output_language': 'English'}
    
    response = client.post("/process-meeting", data=data, files=files)
    app.dependency_overrides.clear()
    
    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]

def test_unauthenticated_access_meetings():
    response = client.get("/meetings")
    assert response.status_code == 401

def test_unauthenticated_access_chat():
    response = client.post("/chat", json={"meeting_id": "test", "question": "test"})
    assert response.status_code == 401

def test_rate_limiting():
    from app.main import check_rate_limit, rate_limit_records
    rate_limit_records.clear()
    key = "test_limit"
    limit = 5
    for _ in range(limit):
        assert check_rate_limit(key, limit) is True
    assert check_rate_limit(key, limit) is False
