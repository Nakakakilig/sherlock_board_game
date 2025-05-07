let enlargedCards = new Set(); // Зберігаємо ID збільшених карток
let currentlyEnlargedCard = null; // Зберігаємо посилання на поточну збільшену картку

async function fetchRoomStatus() {
    try {
        const response = await fetch(`/api/room/json/${currentPlayer}`);
        const data = await response.json();

        updateDeckAndTrash(data.deck, data.trash);
        updateCardsOnTable(data.cards_on_table); // Оновлюємо картки
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
        img.classList.add("card");
        img.dataset.cardId = card; // Зберігаємо ID картки (шлях до зображення)

        // Перевіряємо, чи була картка збільшена раніше
        if (enlargedCards.has(card)) {
            img.classList.add("enlarged");
            currentlyEnlargedCard = img;  // Оновлюємо поточну збільшену картку при оновленні
        }

        container.appendChild(img);
    });

    // **ДОДАЄМО ОБРОБНИКИ КЛІКІВ ТУТ!**
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.addEventListener('click', () => {
            const cardId = card.dataset.cardId;

            // Якщо є інша збільшена картка, зменшуємо її
            if (currentlyEnlargedCard && currentlyEnlargedCard !== card) {
                currentlyEnlargedCard.classList.remove('enlarged');
                enlargedCards.delete(currentlyEnlargedCard.dataset.cardId);
            }

            // Збільшуємо або зменшуємо поточну картку
            if (card.classList.contains('enlarged')) {
                card.classList.remove('enlarged');
                enlargedCards.delete(cardId);
                currentlyEnlargedCard = null; // Скидаємо поточну збільшену картку
            } else {
                card.classList.add('enlarged');
                enlargedCards.add(cardId);
                currentlyEnlargedCard = card; // Оновлюємо поточну збільшену картку
            }

            console.log("🖱️ Клік по картці");
        });
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