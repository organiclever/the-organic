from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

from app.routes import home, hello, members, settings  # Add settings import
from app.navigation import navigation_items
from app.config import PORT
from app.db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown


app: FastAPI = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates: Jinja2Templates = Jinja2Templates(directory="app/templates")


@app.middleware("http")
async def add_navigation_to_request(
    request: Request, call_next: RequestResponseEndpoint
) -> Response:
    request.state.navigation_items = navigation_items
    response = await call_next(request)
    return response


# Include routers
app.include_router(home.router)
app.include_router(hello.router)
app.include_router(members.router)
app.include_router(settings.router)  # Add this line

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
