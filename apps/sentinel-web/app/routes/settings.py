from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, PlainTextResponse
from app.config import config
from app.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import shutil
from datetime import datetime
from pathlib import Path

router: APIRouter = APIRouter()
templates: Jinja2Templates = Jinja2Templates(directory="app/templates")


@router.get("/settings", response_class=HTMLResponse)
async def settings_page(request: Request):
    return templates.TemplateResponse(
        request, "settings.html", {"navigation_items": request.state.navigation_items}
    )


@router.post("/settings/backup", response_class=PlainTextResponse)
async def backup_database(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        source_path = Path(config["db_path"]).expanduser()
        backup_path = Path(config["db_path_backup"]).expanduser()

        # Ensure the backup directory exists
        backup_path.parent.mkdir(parents=True, exist_ok=True)

        # Close the database connection
        await db.close()

        # Perform the backup
        shutil.copy2(source_path, backup_path)

        backup_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        message = f"Database backed up successfully at {backup_time}"
    except Exception as e:
        message = f"Backup failed: {str(e)}"

    return f'<p class="text-green-600">{message}</p>'


@router.post("/settings/restore", response_class=PlainTextResponse)
async def restore_database(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        source_path = Path(config["db_path_backup"]).expanduser()
        restore_path = Path(config["db_path"]).expanduser()

        # Check if backup file exists
        if not source_path.exists():
            return f'<p class="text-red-600">Backup file not found: {source_path}</p>'

        # Close the database connection
        await db.close()

        # Perform the restore
        shutil.copy2(source_path, restore_path)

        restore_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        message = f"Database restored successfully at {restore_time}"
    except Exception as e:
        message = f"Restore failed: {str(e)}"

    return f'<p class="text-green-600">{message}</p>'
