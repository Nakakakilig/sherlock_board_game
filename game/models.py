from enum import Enum

from pydantic import BaseModel

PlayerName = str


class Games(Enum):
    RED_ROSES = "red_roses"
    ANCIENT_EGYPT = "ancient_egypt"


class Card(BaseModel):
    image_url: str


class Player(BaseModel):
    name: PlayerName
    cards: list[Card]


class RoomStates(BaseModel):
    players: dict[str, Player] = {}
    cards_on_table: list[Card] = []
    deck: list[Card] = []
    trash: list[Card] = []
