import os
import random

from exceptions import (
    DeckAlreadyExistError,
    MaxNumberOfCardsInHandError,
    NoMoreCardsInDeckError,
    NoMoreCardsInPlayerError,
    NoSuchCardInPlayerError,
    PlayerAlreadyExistError,
    PlayerNotFoundError,
)
from game.models import Card, Player, PlayerName, RoomStates

MAX_CARDS_IN_PLAYER_HAND = 2


class Room:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, "_players"):
            self._players: dict[PlayerName, Player] = {}
            self._cards_on_table: list[Card] = []
            self._cards_in_trash: list[Card] = []
            self._deck: list[Card] = []

    def add_player(self, player_name: str) -> None:
        if not self._deck:
            raise Exception(f"No more cards in deck for {player_name}")
        if self._find_player_by_name(player_name):
            raise PlayerAlreadyExistError(player_name)
        two_cards = random.sample(self._deck, k=2)
        player = Player(name=player_name, cards=two_cards)
        self._players[player.name] = player
        for card in two_cards:
            self._deck.remove(card)
        return

    def remove_player(self, player_name: str) -> None:
        if self._find_player_by_name(player_name):
            players_cards = self._players[player_name].cards
            for card in players_cards:
                self._deck.append(card)
            del self._players[player_name]
            return
        raise PlayerNotFoundError(player_name)

    def move_card_from_player_to_table(
        self, player_name: str, card_image_url: str
    ) -> None:
        if not self._find_player_by_name(player_name):
            raise PlayerNotFoundError(player_name)
        players_cards = self._players[player_name].cards
        if not players_cards:
            raise NoMoreCardsInPlayerError(player_name)

        card = None
        for player_card in players_cards:
            if card_image_url == player_card.image_url:
                card = player_card

        if not card:
            raise NoSuchCardInPlayerError(player_name, card_image_url)

        self._cards_on_table.append(card)
        self._players[player_name].cards.remove(card)
        return

    def move_card_from_player_to_trash(
        self, player_name: str, card_image_url: str
    ) -> None:
        if not self._find_player_by_name(player_name):
            raise PlayerNotFoundError(player_name)
        players_cards = self._players[player_name].cards
        if not players_cards:
            raise NoMoreCardsInPlayerError(player_name)

        card = None
        for player_card in players_cards:
            if card_image_url == player_card.image_url:
                card = player_card

        if not card:
            raise NoSuchCardInPlayerError(player_name, card_image_url)

        self._cards_in_trash.append(card)
        self._players[player_name].cards.remove(card)
        return

    def player_get_one_random_card_from_deck(self, player_name: str) -> None:
        if not self._deck:
            raise NoMoreCardsInDeckError()
        if not self._find_player_by_name(player_name):
            raise PlayerNotFoundError(player_name)

        num_cards_in_hand = len(self._players[player_name].cards)
        if num_cards_in_hand >= MAX_CARDS_IN_PLAYER_HAND:
            raise MaxNumberOfCardsInHandError(player_name, num_cards_in_hand)
        card = random.choice(self._deck)
        self._players[player_name].cards.append(card)
        self._deck.remove(card)
        return

    def fill_deck(self, game: str):
        if self._deck:
            raise DeckAlreadyExistError(self._deck)
        self.clean_room()

        path = "assets/" + game + "/"
        # need first card to be on table (game rules)
        self._cards_on_table.append(Card(image_url=path + "1.png"))
        cards_urls_unfiltered = os.listdir(path)
        if not cards_urls_unfiltered:
            raise NoMoreCardsInDeckError()
        cards_urls = self._filter_cards_urls(cards_urls_unfiltered)
        cards = [Card(image_url=path + image) for image in cards_urls]
        random.shuffle(cards)
        self._deck = cards
        return

    @staticmethod
    def _filter_cards_urls(cards_urls_unfiltered: list[str]):
        cards_urls: list[str] = []
        for url in cards_urls_unfiltered:
            # skip first card, it's on table already
            if url == "1.png":
                continue
            # skip not playable cards
            if "lor" in url:
                continue
            cards_urls.append(url)
        return cards_urls

    def clean_deck(self):
        self._deck = []
        return

    def clean_room(self):
        for player in self._players.values():
            player.cards = []
        self._cards_on_table: list[Card] = []
        self._cards_in_trash: list[Card] = []
        self._deck: list[Card] = []
        return

    def _find_player_by_name(self, player_name: str) -> bool:
        return any(player.name == player_name for player in self._players.values())

    def get_room_state(self) -> RoomStates:
        room_state = RoomStates(
            players=self._players,
            cards_on_table=self._cards_on_table,
            deck=self._deck,
            trash=self._cards_in_trash,
        )
        return room_state

    def get_players_names(self):
        return [player.name for player in self._players.values()]
