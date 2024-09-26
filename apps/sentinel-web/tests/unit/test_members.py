import pytest
from fastapi.testclient import TestClient
from uuid import UUID, uuid4
from typing import Dict, List, Optional
from app.main import app
from app.repositories.member_repository import MemberRepository
from app.routes.members import get_member_repository
from contextlib import asynccontextmanager


class InMemoryMemberRepository(MemberRepository):
    def __init__(self):
        self.members: Dict[UUID, Dict[str, str]] = {}

    async def create(self, id: UUID, name: str, github_account: str) -> Dict[str, str]:
        member = {"id": str(id), "name": name, "github_account": github_account}
        self.members[id] = member
        return member

    async def get(self, id: UUID) -> Optional[Dict[str, str]]:
        return self.members.get(id)

    async def list(self) -> List[Dict[str, str]]:
        return list(self.members.values())

    async def update(self, id: UUID, data: Dict[str, str]) -> Optional[Dict[str, str]]:
        if id in self.members:
            self.members[id].update(data)
            return self.members[id]
        return None

    async def delete(self, id: UUID) -> bool:
        return self.members.pop(id, None) is not None


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def in_memory_repo():
    return InMemoryMemberRepository()


@pytest.fixture
def override_get_repository(in_memory_repo):
    @asynccontextmanager
    async def _override_get_repository():
        async def get_repo():
            return in_memory_repo

        app.dependency_overrides[get_member_repository] = get_repo
        yield
        app.dependency_overrides.clear()

    return _override_get_repository


@pytest.mark.asyncio
async def test_list_members(client, override_get_repository, in_memory_repo):
    async with override_get_repository():
        # Add some test data
        await in_memory_repo.create(uuid4(), "Test Member 1", "github1")
        await in_memory_repo.create(uuid4(), "Test Member 2", "github2")

        response = client.get("/members")
        assert response.status_code == 200
        assert "Test Member 1" in response.text
        assert "Test Member 2" in response.text


@pytest.mark.asyncio
async def test_create_member(client, override_get_repository):
    async with override_get_repository():
        response = client.post(
            "/members", data={"name": "New Member", "github_account": "newgithub"}
        )
        assert response.status_code == 200
        assert "New Member" in response.text


@pytest.mark.asyncio
async def test_get_member(client, override_get_repository, in_memory_repo):
    async with override_get_repository():
        member_id = uuid4()
        await in_memory_repo.create(member_id, "Test Member", "testgithub")

        response = client.get(f"/members/{member_id}")
        assert response.status_code == 200
        assert str(member_id) in response.text
        assert "Test Member" in response.text
        assert "Member Details" in response.text


@pytest.mark.asyncio
async def test_update_member(client, override_get_repository, in_memory_repo):
    async with override_get_repository():
        member_id = uuid4()
        await in_memory_repo.create(member_id, "Old Name", "oldgithub")

        response = client.put(
            f"/members/{member_id}",
            json={"name": "Updated Name", "github_account": "updatedgithub"},
        )
        assert response.status_code == 200
        assert "Updated Name" in response.text


@pytest.mark.asyncio
async def test_delete_member(client, override_get_repository, in_memory_repo):
    async with override_get_repository():
        member_id = uuid4()
        await in_memory_repo.create(member_id, "To Be Deleted", "deletegithub")

        response = client.delete(f"/members/{member_id}")
        assert response.status_code == 200
        assert response.text == ""

        # Verify the member is deleted
        assert await in_memory_repo.get(member_id) is None


@pytest.mark.asyncio
async def test_get_nonexistent_member(client, override_get_repository):
    async with override_get_repository():
        non_existent_id = uuid4()
        response = client.get(f"/members/{non_existent_id}")
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_nonexistent_member(client, override_get_repository):
    async with override_get_repository():
        non_existent_id = uuid4()
        response = client.put(
            f"/members/{non_existent_id}", json={"name": "Updated Name"}
        )
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_member(client, override_get_repository):
    async with override_get_repository():
        non_existent_id = uuid4()
        response = client.delete(f"/members/{non_existent_id}")
        assert response.status_code == 404
