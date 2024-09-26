from fastapi import APIRouter, Request, Query
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import List, Dict

router: APIRouter = APIRouter()
templates: Jinja2Templates = Jinja2Templates(directory="app/templates")


@router.get("/hello", response_class=HTMLResponse)
async def say_hello(
    request: Request,
    to: str = Query(..., description="Name of the person to greet"),
    salutation: str = Query("Hello", description="Salutation to use")
) -> HTMLResponse:
    return templates.TemplateResponse(
        request,
        "hello.html",
        {
            "name": to,
            "salutation": salutation,
            "navigation_items": request.state.navigation_items
        }
    )
