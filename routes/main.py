from fastapi import APIRouter

from config.settings import settings
from routes.room import router as room_router

router = APIRouter(
    prefix=settings.api.prefix,
)


router.include_router(
    room_router,
    prefix=settings.api.room,
)
