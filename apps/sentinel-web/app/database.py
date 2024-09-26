from datetime import datetime
import logging
import time
import shutil
from typing import Optional
from app.config import DB_PATH, DB_PATH_BACKUP

logger = logging.getLogger(__name__)


def backup_database() -> Optional[str]:
    try:
        logger.info("Starting database backup...")
        shutil.copy2(DB_PATH, DB_PATH_BACKUP)
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Database backed up at {current_time}")
        return current_time
    except Exception as e:
        logger.error(f"Error in backup_database: {str(e)}")
        return None


def restore_database() -> Optional[str]:
    try:
        logger.info("Starting database restore...")
        shutil.copy2(DB_PATH_BACKUP, DB_PATH)
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Database restored at {current_time}")
        return current_time
    except Exception as e:
        logger.error(f"Error in restore_database: {str(e)}")
        return None
