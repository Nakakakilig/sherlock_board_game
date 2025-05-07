from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from config.settings import settings
from exceptions_handler import add_exception_handler
from game.room import Room
from routes.main import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    room = Room()
    room.fill_deck("red_roses")
    print("Room is initialized.")
    yield
    print("Shutting down the Room.")


app = FastAPI(lifespan=lifespan)
app.include_router(router)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app = add_exception_handler(app)


# @app.get("/", response_class=RedirectResponse)
# def _():
#     return "http://localhost:8000/docs"


templates = Jinja2Templates(directory="static")


@app.get("/", response_class=HTMLResponse)
def get_name_form(request: Request):
    return templates.TemplateResponse("enter.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
    )
