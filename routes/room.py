from typing import Annotated

from fastapi import APIRouter, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

from exceptions import PlayerNotFoundError
from game.models import Games, RoomStates
from game.room import Room

router = APIRouter(
    tags=["room"],
)
templates = Jinja2Templates(directory="static")


@router.post("/choose-game/{game}")
def choose_game(
    game: Games,
    room: Annotated[Room, Depends()],
):
    room.fill_deck(game.value)
    return


@router.post("/clean_deck")
def clean_deck(
    room: Annotated[Room, Depends()],
):
    room.clean_deck()
    return


@router.post("/clean_room")
def clean_room(
    room: Annotated[Room, Depends()],
):
    room.clean_room()
    return


@router.post("/join/{player_name}")
def enter_to_room(
    player_name: str,
    room: Annotated[Room, Depends()],
):
    room.add_player(player_name=player_name)
    return


@router.post("/leave/{player_name}")
def leave_from_room(
    player_name: str,
    room: Annotated[Room, Depends()],
):
    room.remove_player(player_name=player_name)
    return


@router.post("/card-from-deck-to-player/{player_name}")
def random_card_from_deck_for_player(
    player_name: str,
    room: Annotated[Room, Depends()],
):
    room.player_get_one_random_card_from_deck(player_name)
    return


@router.post("/player-card-to-table/{player_name}")
def move_card_to_table(
    player_name: str,
    card_image_url: str,
    room: Annotated[Room, Depends()],
):
    room.move_card_from_player_to_table(player_name, card_image_url)
    return


@router.post("/player-card-to-trash/{player_name}")
def move_card_to_trash(
    player_name: str,
    card_image_url: str,
    room: Annotated[Room, Depends()],
):
    room.move_card_from_player_to_trash(player_name, card_image_url)
    return


@router.get("/players")
def players_names(room: Annotated[Room, Depends()]) -> list[str]:
    return room.get_players_names()


@router.get("/status_old")
def room_status_old(room: Annotated[Room, Depends()]) -> RoomStates:
    return room.get_room_state()


# @router.get("/status", response_class=HTMLResponse)
# def room_status(
#     request: Request,
#     room: Annotated[Room, Depends()],
# ):
#     state = room.get_room_state()
#     return templates.TemplateResponse(
#         "index.html",
#         {
#             "request": request,
#             "deck": len(state.deck),
#             "trash": len(state.trash),
#             "cards_on_table": [card.image_url for card in state.cards_on_table],
#             "players": list(state.players.values()),
#             **state.model_dump(),
#         },
#     )


@router.get("/html/{player_name}", response_class=HTMLResponse)
def room_status_for_player(
    player_name: str,
    request: Request,
    room: Annotated[Room, Depends()],
):
    if not room._find_player_by_name(player_name):  # type: ignore
        raise PlayerNotFoundError(player_name)

    state = room.get_room_state()
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "deck": len(state.deck),
            "trash": len(state.trash),
            "cards_on_table": [card.image_url for card in state.cards_on_table],
            "players": list(state.players.values()),
            # "player_cards": [
            #     card.image_url for card in state.players[player_name].cards
            # ],
            "current_player_name": player_name,
        },
    )


@router.get("/json/{player_name}")
def room_status_for_player_2(  # type: ignore
    player_name: str,
    request: Request,
    room: Annotated[Room, Depends()],
):
    if not room._find_player_by_name(player_name):  # type: ignore
        raise PlayerNotFoundError(player_name)

    state = room.get_room_state()
    return {
        "deck": len(state.deck),
        "trash": len(state.trash),
        "cards_on_table": [card.image_url for card in state.cards_on_table],
        "players": list(state.players.values()),
        "current_player_name": player_name,
    }  # type: ignore


@router.post("/join")
def join_game_2(
    room: Annotated[Room, Depends()],
    player_name: str = Form(...),  # получає інфу з html
):
    room.add_player(player_name=player_name)
    redirect_url = f"/api/room/html/{player_name}"
    return RedirectResponse(url=redirect_url, status_code=302)
