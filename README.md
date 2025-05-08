# Sherlock Game
### Vibe coding (only GPT-4o) for board game. Thats why we have terrible code :-)

## TODO:

- [x] Add on-click card enlargement.
    - [x] Cards on the table.
    - [x] Cards in hand.
- [x] Add buttons for dropping a card into the table and the trash.
    - [x] Move card to the table.
    - [x] Move card to trash.
- [x] Add button to get a card from deck.
- [x] Fix card collision (table card overlap hand enlarged card )
- [ ] Implement drag-and-drop to move a cards on the table.
    - [ ] Add structure for cards on table (something like matrix 5x6) (frontend)
    - [ ] Add structure for cards on table (something like matrix 5x6) (backend)

- [ ] Security: Implement security features to avoid cheating or card exposure by other players.

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