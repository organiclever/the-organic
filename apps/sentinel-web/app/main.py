from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse(request, "index.html", {"request": request})


@app.post("/hello")
async def hello(request: Request, to: str = Form("World"), salutation: str = Form("Hi")):
    greeting = f"{salutation} {to}!"
    return HTMLResponse(f"<p class='text-2xl font-bold text-blue-600'>{greeting}</p>")
