from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert "Greeting Generator" in response.text
    assert "text/html" in response.headers["content-type"]


def test_read_hello():
    response = client.get("/hello?to=Test&salutation=Hello")
    assert response.status_code == 200
    assert "<p class='text-2xl font-bold text-blue-600'>Hello Test!</p>" == response.text
    assert "text/html" in response.headers["content-type"]


def test_read_hello_default():
    response = client.get("/hello")
    assert response.status_code == 200
    assert "<p class='text-2xl font-bold text-blue-600'>Hi World!</p>" == response.text
    assert "text/html" in response.headers["content-type"]
