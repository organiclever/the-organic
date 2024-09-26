from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from alembic.config import Config
from alembic import command
from app.config import DB_PATH
from typing import AsyncGenerator

engine = create_async_engine(f"sqlite+aiosqlite:///{DB_PATH}", echo=True)
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db() -> None:
    async with engine.begin() as conn:
        # Run migrations
        await conn.run_sync(_run_migrations)


def _run_migrations(connection) -> None:
    config = Config("alembic.ini")
    config.attributes["conection"] = connection
    command.upgrade(config, "head")


# Dependency to get DB session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
