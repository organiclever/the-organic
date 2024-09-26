import pytest
from httpx import AsyncClient
from app.main import app
from app.navigation import navigation_items
from httpx import ASGITransport


@pytest.mark.asyncio
async def test_navigation_items_present_on_home():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    for item in navigation_items:
        assert item["text"] in response.text
        assert item["href"].replace("&", "&amp;") in response.text


@pytest.mark.asyncio
async def test_navigation_items_present_on_hello():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/hello?to=Test")
    assert response.status_code == 200
    for item in navigation_items:
        assert item["text"] in response.text
        assert item["href"].replace("&", "&amp;") in response.text


@pytest.mark.asyncio
async def test_navigation_items_present_on_members():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/members")
    assert response.status_code == 200
    for item in navigation_items:
        assert item["text"] in response.text
        assert item["href"].replace("&", "&amp;") in response.text


@pytest.mark.asyncio
async def test_navigation_items_not_present_on_nonexistent_page():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/nonexistent")
    assert response.status_code == 404
    for item in navigation_items:
        assert item["text"] not in response.text
        assert item["href"].replace("&", "&amp;") not in response.text
