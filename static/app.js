//const currentPlayer = "{{ current_player_name }}";

async function fetchRoomStatus() {
    try {
        const response = await fetch(`/api/room/json/${currentPlayer}`);
        const data = await response.json();

        updateDeckAndTrash(data.deck, data.trash);
        updateCardsOnTable(data.cards_on_table);
        updatePlayers(data.players);
    } catch (err) {
        console.error("Помилка при отриманні статусу кімнати:", err);
    }
}

function updateDeckAndTrash(deck, trash) {
    document.getElementById("deck-count").textContent = `Deck: ${deck ?? 0}`;
    document.getElementById("trash-count").textContent = `Trash: ${trash ?? 0}`;
}

function updateCardsOnTable(cards) {
    const container = document.getElementById("cards-on-table");
    container.innerHTML = "";  // Очистити попередні карти

    cards.forEach(card => {
        const img = document.createElement("img");
        img.src = `/${card}`;
        img.alt = "card";
        container.appendChild(img);
    });
}

function updatePlayers(players) {
    const container = document.getElementById("players-container");

    // Оновлення кожного гравця
    players.forEach((player, index) => {
        let playerDiv = container.querySelector(`.player-${index}`);
        if (!playerDiv) {
            playerDiv = document.createElement("div");
            playerDiv.className = `player player-${index}`;
            const nameSpan = document.createElement("span");
            nameSpan.textContent = player.name;
            playerDiv.appendChild(nameSpan);
            container.appendChild(playerDiv);
        }

        const cardsDiv = playerDiv.querySelector("div") || document.createElement("div");
        cardsDiv.innerHTML = ''; // Очистити попередні карти

        player.cards.forEach(card => {
            const img = document.createElement("img");
            if (player.name === currentPlayer) {
                img.src = `/${card.image_url}`;
            } else {
                img.src = "/assets/card_template.png";  // Зображення шаблону для інших гравців
            }
            cardsDiv.appendChild(img);
        });

        playerDiv.appendChild(cardsDiv);
    });

    // Генерація CSS для позицій гравців по колу
    generatePlayerStyles(players.length);
}

function generatePlayerStyles(count) {
    const styleTag = document.getElementById("dynamic-player-styles") || document.createElement("style");
    styleTag.id = "dynamic-player-styles";
    let styles = "";
    for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        styles += `.player-${i} { transform: rotate(${angle}deg) translate(220px) rotate(-${angle}deg); }\n`;
    }
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
}

// Перше оновлення + кожну секунду
fetchRoomStatus();
setInterval(fetchRoomStatus, 1000);