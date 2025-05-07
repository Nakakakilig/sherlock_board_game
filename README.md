# Sherlock Game

## TODO:

- [ ] add on click card enlargement 
    - [x] cards on table
    - [ ] card in hand
- [ ] create drag-and-drop for cards on table
- [ ] (optional) create drag-and-drop for cards in hands
- [ ] move players to table edges, not in center circle
- [ ] (optional) add any  security

## Contributing

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