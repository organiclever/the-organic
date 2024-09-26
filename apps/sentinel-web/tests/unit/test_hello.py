from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_say_hello():
    response = client.get("/hello?to=Test&salutation=Hi")
    assert response.status_code == 200
    assert "Hi, Test!" in response.text
    assert "Navigation" in response.text


def test_say_hello_default_salutation():
    response = client.get("/hello?to=Test")
    assert response.status_code == 200
    assert "Hello, Test!" in response.text


def test_say_hello_missing_to_parameter():
    response = client.get("/hello")
    assert response.status_code == 422  # Unprocessable Entity


def test_hello_link_in_navigation():
    response = client.get("/")
    assert response.status_code == 200
    assert '/hello?to=World&amp;salutation=Hi' in response.text
