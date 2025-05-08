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

            console.log("🖱️ Клік по картці на столі", cardId);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const cardToTableButton = document.getElementById('card-to-table-button');
    const cardToTrashButton = document.getElementById('card-to-trash-button');
    const cardFromDeckButton = document.getElementById('card-from-deck-button');
    const cardsOnTable = document.getElementById("cards-on-table"); //Отримайте id cardsOnTable тут

    cardToTableButton.addEventListener('click', function () {
        if (currentlyEnlargedCard) {
            const playerName = cardToTableButton.dataset.playerName;

            fetch(`/api/room/player-card-to-table/${playerName}?card_image_url=${encodeURIComponent(cardImageUrl)}`, {
                method: 'POST',
            })
                .then(response => {
                    if (response.ok) {
                        // Створюємо елемент img для нової картки на столі
                        const newCardImage = document.createElement('img');
                        newCardImage.src = cardImageUrl;
                        newCardImage.classList.add('card');
                        newCardImage.dataset.cardId = cardImageUrl;  // Важливо!
                        cardsOnTable.appendChild(newCardImage);
                        //Видаляємо стару картку
                        currentlyEnlargedCard.remove();
                        enlargedCards.delete(currentlyEnlargedCard.dataset.cardId);
                        currentlyEnlargedCard = null

                        cardToTableButton.classList.add('hidden'); // Ховаємо кнопку
                        cardToTrashButton.classList.add('hidden'); // Ховаємо кнопку
                    } else {
                        console.error('Помилка скидання картки:', response.status);
                    }
                    // Оновлюємо інтерфейс після скидання картки.
                    fetchRoomStatus()
                });
        }
    });

    cardToTrashButton.addEventListener('click', function () {
        if (currentlyEnlargedCard) {
            const playerName = cardToTableButton.dataset.playerName;
    
            fetch(`/api/room/player-card-to-trash/${playerName}?card_image_url=${encodeURIComponent(cardImageUrl)}`, {
                method: 'POST',
            })
                .then(response => {
                    if (response.ok) {
                        // Створюємо елемент img для нової картки на столі
                        console.log('Успішно скинули карту в отбой:', playerName, response.status);
                        //Видаляємо стару картку
                        currentlyEnlargedCard.remove();
                        enlargedCards.delete(currentlyEnlargedCard.dataset.cardId);
                        currentlyEnlargedCard = null
    
                        cardToTableButton.classList.add('hidden'); // Ховаємо кнопку
                        cardToTrashButton.classList.add('hidden'); // Ховаємо кнопку
                    } else {
                        console.error('Помилка скидання картки в отбой:', response.status);
                    }
                    // Оновлюємо інтерфейс після скидання картки.
                    fetchRoomStatus()
                });
        }
    });

    cardFromDeckButton.addEventListener('click', function () {

        const playerName = cardFromDeckButton.dataset.playerName;
        fetch(`/api/room/card-from-deck-to-player/${playerName}`, {
            method: 'POST',
        })
            .then(response => {
                if (response.ok) {
                    console.log('Успішно взяли карту з колоди:', playerName, response.status);
                } else {
                    console.error('Помилка при спробі взяти карту з колоди:', response.status, response.statusText);
                }
                // Оновлюємо інтерфейс після скидання картки.
                fetchRoomStatus()
            });

    });
});

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
            img.classList.add("player-card"); // Додаємо клас для обробки кліків
            img.style.zIndex = "1"; // Встановлюємо z-index
            if (player.name === currentPlayer) {
                img.src = `/${card.image_url}`;
                img.dataset.cardId = card.image_url; // Зберігаємо ID картки (шлях до зображення)
            } else {
                img.src = "/assets/card_template.png";  // Зображення шаблону для інших гравців
                img.dataset.cardId = "hidden"; // Щоб не обробляти кліки по чужим картам
            }

            // Перевіряємо, чи була картка збільшена раніше. Важливо використовувати dataset.cardId
            if (enlargedCards.has(img.dataset.cardId)) {
                img.classList.add("enlarged");
                img.style.zIndex = "10"; // Встановлюємо z-index для збільшеної картки
            }

            cardsDiv.appendChild(img);
        });

        playerDiv.appendChild(cardsDiv);
    });

    // Генерація CSS для позицій гравців по колу
    generatePlayerStyles(players.length);

    const discardButton = document.getElementById('card-to-table-button');
    const discardButtonTrash = document.getElementById('card-to-trash-button');

    // Додаємо обробники кліків для карток гравців
    const playerCards = Array.from(document.querySelectorAll('.player div img.player-card'))
        .filter(card => card.dataset.cardId !== 'hidden'); // <---- Фільтруємо картки

    playerCards.forEach(card => {
        card.addEventListener('click', function () {
            const cardId = this.dataset.cardId;
            const playerDiv = this.closest('.player');
            const playerName = playerDiv.querySelector('span').textContent;

            if (cardId === "hidden") {
                return;
            }

            const allPlayerCards = Array.from(document.querySelectorAll('.player div img.player-card'))
                .filter(card => card.dataset.cardId !== 'hidden');

            allPlayerCards.forEach(playerCard => {
                playerCard.style.zIndex = 1; // Скидаємо z-index для всіх карток
                if (playerCard !== this && playerCard.classList.contains('enlarged')) {
                    playerCard.classList.remove('enlarged');
                    enlargedCards.delete(playerCard.dataset.cardId);
                }
            });

            if (this.classList.contains('enlarged')) {
                this.classList.remove('enlarged');
                enlargedCards.delete(cardId);
                this.style.zIndex = 1;
                discardButton.classList.add('hidden'); // Ховаємо кнопку
                discardButtonTrash.classList.add('hidden'); // Ховаємо кнопку
                currentlyEnlargedCard = null;
            } else {
                this.classList.add('enlarged');
                enlargedCards.add(cardId);
                discardButton.classList.remove('hidden'); // Показуємо кнопку
                discardButtonTrash.classList.remove('hidden'); // Показуємо кнопку
                this.style.zIndex = 10; // Встановлюємо z-index для поточної картки
                currentlyEnlargedCard = this;

                // Зберігаємо ім'я гравця та URL картки в data-атрибути кнопки
                discardButton.dataset.playerName = playerName;
                discardButton.dataset.cardImageUrl = this.dataset.cardId; // Використовуємо card.dataset.cardId
                cardImageUrl = this.dataset.cardId; // Задаємо значення cardImageUrl
            }
            console.log("🖱️ Клік по картці гравця", cardId);
        });
    });
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