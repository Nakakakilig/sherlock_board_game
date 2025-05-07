# Sherlock Game

## TODO:

- [x] Add on-click card enlargement.
    - [x] Cards on the table.
    - [x] Cards in hand.
- [ ] Create buttons for dropping a card into the table and the trash.
- [ ] Create drag-and-drop to move a card to the table.

- [ ] (optional) create drag-and-drop for cards in hands
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