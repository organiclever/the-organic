from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.get("/")
async def root(request: Request):
    # Update the order of parameters in TemplateResponse
    return templates.TemplateResponse(request, "index.html", {"request": request})


@app.get("/hello", response_class=HTMLResponse)
async def hello(request: Request, to: str = "World", salutation: str = "Hi"):
    greeting = f"{salutation} {to}!"
    return f"<p class='text-2xl font-bold text-blue-600'>{greeting}</p>"
