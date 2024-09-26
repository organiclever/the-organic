from fastapi import APIRouter, Depends, HTTPException, Request  # Add Request import
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.db import db_session, backup_database, restore_database
from app.navigation import navigation_items  # Import navigation items
from datetime import datetime
import asyncio
import logging
import traceback

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/settings/backup")
async def backup_db():
    try:
        success, message = await backup_database()
        if success:
            logger.info(f"Database backed up successfully at {message}")
            return HTMLResponse(
                f'<p class="text-green-600">Database backed up successfully at {
                    message}</p>'
            )
        else:
            raise HTTPException(status_code=500, detail=message)
    except Exception as e:
        logger.error(f"Error backing up database: {str(e)}")
        logger.error(traceback.format_exc())
        return HTMLResponse(
            f'<p class="text-red-600">Error backing up database: {str(e)}</p>',
            status_code=500,
        )


@router.post("/settings/restore")
async def restore_db():
    try:
        success, message = await restore_database()
        if success:
            logger.info(f"Database restored successfully at {message}")
            return HTMLResponse(
                f'<p class="text-green-600">Database restored successfully at {
                    message}</p>'
            )
        else:
            raise HTTPException(status_code=500, detail=message)
    except Exception as e:
        logger.error(f"Error restoring database: {str(e)}")
        logger.error(traceback.format_exc())
        return HTMLResponse(
            f'<p class="text-red-600">Error restoring database: {str(e)}</p>',
            status_code=500,
        )


@router.get("/settings")
async def settings_page(request: Request):
    try:
        return templates.TemplateResponse(
            "settings.html",
            {
                "request": request,
                "navigation_items": navigation_items,  # Add navigation items to the context
            },
        )
    except Exception as e:
        logger.error(f"Error rendering settings page: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ... other routes ...
