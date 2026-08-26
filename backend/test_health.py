from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_get():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    print("GET /health passed")

def test_health_head():
    response = client.head("/health")
    assert response.status_code == 200
    # HEAD requests shouldn't have a body, but FastAPI/TestClient strips it correctly
    print("HEAD /health passed")

if __name__ == "__main__":
    test_health_get()
    test_health_head()
    print("All health tests passed!")
