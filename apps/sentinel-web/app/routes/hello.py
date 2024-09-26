from fastapi import APIRouter, Request, Query
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/hello")
async def say_hello(
    request: Request,
    to: str = Query(..., description="Name of the person to greet"),
    salutation: str = Query("Hello", description="Salutation to use")
):
    return templates.TemplateResponse(
        request,
        "hello.html",
        {
            "name": to,
            "salutation": salutation,
            "navigation_items": request.state.navigation_items
        }
    )
