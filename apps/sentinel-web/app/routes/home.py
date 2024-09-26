from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "navigation_items": request.state.navigation_items
        }
    )
