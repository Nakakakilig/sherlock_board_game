from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from exceptions import (
    DeckAlreadyExistError,
    NoMoreCardsInDeckError,
    NoMoreCardsInPlayerError,
    NoSuchCardInPlayerError,
    PlayerAlreadyExistError,
    PlayerNotFoundError,
)


def add_exception_handler(app: FastAPI) -> FastAPI:
    @app.exception_handler(DeckAlreadyExistError)
    async def _(request: Request, exc: DeckAlreadyExistError):
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(NoMoreCardsInDeckError)
    async def _(request: Request, exc: NoMoreCardsInDeckError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(NoMoreCardsInPlayerError)
    async def _(request: Request, exc: NoMoreCardsInPlayerError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(NoSuchCardInPlayerError)
    async def _(request: Request, exc: NoSuchCardInPlayerError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(PlayerAlreadyExistError)
    async def _(request: Request, exc: PlayerAlreadyExistError):
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(PlayerNotFoundError)
    async def _(request: Request, exc: PlayerNotFoundError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(Exception)
    async def _(request: Request, exc: Exception):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error."},
        )

    return app
