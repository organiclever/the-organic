from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.routes import home, hello
from app.navigation import navigation_items

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.middleware("http")
async def add_navigation_to_request(request: Request, call_next):
    request.state.navigation_items = navigation_items
    response = await call_next(request)
    return response

# Include routers
app.include_router(home.router)
app.include_router(hello.router)
