from fastapi.testclient import TestClient
from app.main import app
from app.navigation import navigation_items

client = TestClient(app)


def test_navigation_items_present_on_home():
    response = client.get("/")
    assert response.status_code == 200
    for item in navigation_items:
        assert item['text'] in response.text
        assert item['href'].replace('&', '&amp;') in response.text


def test_navigation_items_present_on_hello():
    response = client.get("/hello?to=Test")
    assert response.status_code == 200
    for item in navigation_items:
        assert item['text'] in response.text
        assert item['href'].replace('&', '&amp;') in response.text
