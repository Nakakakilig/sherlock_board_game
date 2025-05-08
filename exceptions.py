from game.models import Card


class PlayerAlreadyExistError(Exception):
    def __init__(self, player_name: str):
        super().__init__(f"Player {player_name} already exist. Try SlavaPidor.")


class PlayerNotFoundError(Exception):
    def __init__(self, player_name: str):
        super().__init__(f"Player {player_name} not found")


class NoMoreCardsInDeckError(Exception):
    def __init__(self):
        super().__init__("No more cards in deck")


class NoMoreCardsInPlayerError(Exception):
    def __init__(self, player_name: str):
        super().__init__(f"No more cards in player: {player_name}")


class NoSuchCardInPlayerError(Exception):
    def __init__(self, player_name: str, card_image_url: str):
        super().__init__(f"No such card {card_image_url} in player: {player_name}")


class DeckAlreadyExistError(Exception):
    def __init__(self, deck: list[Card]):
        super().__init__(f"Cant fill deck. Deck already exist: {deck}")


class MaxNumberOfCardsInHandError(Exception):
    def __init__(self, player_name: str, cards_num: int):
        super().__init__(
            f"Player {player_name} reached max number of cards: {cards_num}"
        )
