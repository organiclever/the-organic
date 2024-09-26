from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to Sentinel Web" in response.text
    assert "This is a simple index page for your FastAPI application." in response.text
    assert "Navigation" in response.text


def test_navigation_items_present():
    response = client.get("/")
    assert response.status_code == 200
    assert "Home" in response.text
    assert "Say Hello" in response.text
