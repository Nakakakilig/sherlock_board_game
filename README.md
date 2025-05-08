# Sherlock Game
### Vibe coding (only GPT-4o) for board game. Thats why we have terrible code :-)

## TODO:

- [x] Add on-click card enlargement.
    - [x] Cards on the table.
    - [x] Cards in hand.
- [x] Add buttons for dropping a card into the table and the trash.
    - [x] Move card to the table.
    - [x] Move card to trash.
- [ ] Add button to get a card from deck.
- [ ] Implement drag-and-drop to move a card on the table.

- [ ] move players to table edges, not in center circle
- [ ] (optional) add any  security

## Contribution

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi jinja2 dotenv pydantic-settings uuid uvicorn python-multipart
```

Run server:

```bash
uvicorn main:app --reload
```