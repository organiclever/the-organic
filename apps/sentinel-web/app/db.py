from datetime import datetime
import logging
import shutil
from typing import Tuple, AsyncGenerator
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from alembic.config import Config
from alembic import command
from app.config import DB_PATH, DB_PATH_BACKUP, DATABASE_URL

logger = logging.getLogger(__name__)

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@asynccontextmanager
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(_run_migrations)


def _run_migrations(connection) -> None:
    config = Config("alembic.ini")
    config.attributes["connection"] = connection
    command.upgrade(config, "head")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with db_session() as session:
        yield session


async def backup_database() -> Tuple[bool, str]:
    try:
        logger.info("Starting database backup...")
        shutil.copy2(DB_PATH, DB_PATH_BACKUP)
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Database backed up at {current_time}")
        return True, current_time
    except Exception as e:
        error_msg = f"Error in backup_database: {str(e)}"
        logger.error(error_msg)
        return False, error_msg


async def restore_database() -> Tuple[bool, str]:
    try:
        logger.info("Starting database restore...")
        shutil.copy2(DB_PATH_BACKUP, DB_PATH)
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Database restored at {current_time}")
        return True, current_time
    except Exception as e:
        error_msg = f"Error in restore_database: {str(e)}"
        logger.error(error_msg)
        return False, error_msg
