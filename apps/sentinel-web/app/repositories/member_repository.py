import sqlite3
from uuid import UUID
from typing import List, Optional, Dict, Any
import aiosqlite
from app.config import DB_PATH


class MemberRepository:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path

    async def _init_db(self) -> None:
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                """
                CREATE TABLE IF NOT EXISTS members (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL
                )
            """
            )
            await db.commit()

    async def create(self, id: UUID, name: str) -> Dict[str, Any]:
        await self._init_db()
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                "INSERT INTO members (id, name) VALUES (?, ?)", (str(id), name)
            )
            await db.commit()
        return {"id": id, "name": name}

    async def list(self) -> List[Dict[str, Any]]:
        await self._init_db()
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute("SELECT id, name FROM members") as cursor:
                rows = await cursor.fetchall()
        return [{"id": UUID(row[0]), "name": row[1]} for row in rows]

    async def get(self, id: UUID) -> Optional[Dict[str, Any]]:
        await self._init_db()
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute(
                "SELECT id, name FROM members WHERE id = ?", (str(id),)
            ) as cursor:
                row = await cursor.fetchone()
        return {"id": UUID(row[0]), "name": row[1]} if row else None

    async def update(self, id: UUID, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        await self._init_db()
        set_clause = ", ".join(f"{key} = ?" for key in data.keys())
        values = list(data.values()) + [str(id)]
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(f"UPDATE members SET {set_clause} WHERE id = ?", values)
            await db.commit()
        return await self.get(id)

    async def delete(self, id: UUID) -> bool:
        await self._init_db()
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute("DELETE FROM members WHERE id = ?", (str(id),))
            await db.commit()
        return cursor.rowcount > 0


async def get_member_repository() -> MemberRepository:
    return MemberRepository(DB_PATH)
