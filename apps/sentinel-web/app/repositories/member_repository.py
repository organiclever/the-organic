from uuid import UUID
from typing import List, Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.exc import NoResultFound
from app.db import get_db
from app.models import Member


class MemberRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, id: UUID, name: str) -> Dict[str, str]:
        new_member = Member(id=id, name=name)
        self.session.add(new_member)
        await self.session.commit()
        return {"id": str(new_member.id), "name": str(new_member.name)}

    async def list(self) -> List[Dict[str, str]]:
        result = await self.session.execute(select(Member))
        members = result.scalars().all()
        return [{"id": str(member.id), "name": str(member.name)} for member in members]

    async def get(self, id: UUID) -> Optional[Dict[str, str]]:
        try:
            result = await self.session.execute(select(Member).filter(Member.id == id))
            member = result.scalar_one()
            return {"id": str(member.id), "name": str(member.name)}
        except NoResultFound:
            return None

    async def update(self, id: UUID, data: Dict[str, str]) -> Optional[Dict[str, str]]:
        await self.session.execute(update(Member).where(Member.id == id).values(**data))
        await self.session.commit()
        return await self.get(id)

    async def delete(self, id: UUID) -> bool:
        result = await self.session.execute(delete(Member).where(Member.id == id))
        await self.session.commit()
        return result.rowcount > 0


async def get_member_repository() -> MemberRepository:
    session = await anext(get_db())
    return MemberRepository(session)
