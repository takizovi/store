document.body.scrollTop = document.documentElement.scrollTop = 0;
const cards = document.querySelectorAll('.icon');

let gameData = {
  coins: 0,
  inventory: [],
  casesOpened: 0,
  playerName: null
}

document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  initializePlayer();
  updateCoins();
  updateInventory();
});

function initializePlayer() {
  if (!gameData.playerName) {
      const name = prompt('Введите ваше имя пук:');
      if (name) {
          gameData.playerName = name;
          saveGame();
      }
  }
}

// Создаём модальное окно
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <div class="container">
        <h1>Какой-то кейс говня</h1>
        <div class="coin-section">
            <button id="coin-button">Кликни для арiв</button>
            <p>Всего арiв: <span id="coins">0</span></p>
        </div>
        <div class="case-section">
            <button id="open-case-button">Открыть кейс (100 арiв)</button>
        </div>
        <div class="inventory-section">
            <h2>Инвентарь</h2>
            <ul id="inventory-list"></ul>
            <div id="etc">
              <p>И ещё <span id="items">0</span> предметов</p>
            </div>
        </div>
        
    </div>
  </div>
`;
document.body.appendChild(modal);

const modalClose = modal.querySelector('.modal-close');
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

cards.forEach(card => {
  let rect = card.getBoundingClientRect();
  let centerX = rect.left + rect.width / 2;
  let centerY = rect.top + rect.height / 2;
  let threshold = 20;

  window.addEventListener("resize", function () {
    rect = card.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  });

  function rotate(cursorPosition, centerPosition, threshold = 20) {
    if (cursorPosition - centerPosition >= 0) {
      return (cursorPosition - centerPosition) >= threshold ? threshold : (cursorPosition - centerPosition);
    } else {
      return (cursorPosition - centerPosition) <= -threshold ? -threshold : (cursorPosition - centerPosition);
    }
  }

  function brightness(cursorPositionY, centerPositionY, strength = 50) {
    return 1 - rotate(cursorPositionY, centerPositionY) / strength;
  }

  card.addEventListener("mousemove", function (event) {
    const rotY = rotate(event.x, centerX);
    const rotX = -rotate(event.y + window.scrollY, centerY);

    card.style.transform = `perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.5)`;
    card.style.filter = `brightness(${brightness(event.y / 10 + window.scrollY / 10, centerY / 10)})`;
    card.style.boxShadow = `0 0 25px rgba(95, 188, 255, 0.7)`;

    let offsetX = rotY * 2;
    let offsetY = rotX * 2;
    card.style.setProperty('--gloss-x', `${50 + offsetX}%`);
    card.style.setProperty('--gloss-y', `${50 + offsetY}%`);
  });

  card.addEventListener("mouseleave", function () {
    card.style.transform = `perspective(500px)`;
    card.style.filter = `brightness(1)`;
    card.style.boxShadow = `0 0 0 0 rgba(48, 65, 0, 0.5)`;
    card.style.setProperty('--gloss-x', `0%`);
    card.style.setProperty('--gloss-y', `0%`);
  });
});

let deb = document.getElementById('debug');
intervalId = window.setInterval(function () { deb.innerHTML = window.scrollY; }, 1000);


// CSS для модального окна
const style = document.createElement('style');
style.innerHTML = `
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(8px);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}
.modal-image {
  max-width: 100%;
  border-radius: 8px;
}
.modal-text {
  margin-top: 15px;
  font-size: 16px;
  color: #ffffffff;
}
  
#etc {
  padding: 10px;
}

#coin-button {
    background-color: #ffcc00;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    color: #000;
}

#coin-button:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}

#open-case-button {
    background-color: #ff3333;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    color: #fff;
}

#open-case-button:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}

.inventory-section {
    margin-top: 50px;
    background: rgba(72, 72, 72, 0.26);
    backdrop-filter: blur(16px);
    border-radius: 10px;
}

.inventory-section:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}

#inventory-list {
    list-style-type: none;
    padding: 0;
}

.inventory-item {
    background-color: #2e2e2e;
    border-radius: 10px;
    margin: 5px;
    padding: 10px;
}

.inventory-item:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}

.sell-button {
    background-color: #00cc66;
    border-radius: 10px;
    border: none;
    color: #000000ff;
    padding: 5px 10px;
    margin-left: 20px;
    cursor: pointer;
}

.sell-button:hover {
    transform: scale(1.02);
    transition: transform 0.2s;
}
`;
document.head.appendChild(style);



const coinButton = document.getElementById('coin-button');
const coinsDisplay = document.getElementById('coins');
const openCaseButton = document.getElementById('open-case-button');
const inventoryList = document.getElementById('inventory-list');
const winOpenButton = document.getElementById('window-open-button');

winOpenButton.addEventListener("click", function () {
  modal.style.display = 'flex';
});

const skins = [
    { name: 'пасосный предметус', rarity: 'синi', basePrice: 10 },
    { name: 'нормисный предметус', rarity: 'фиолетовi', basePrice: 20 },
    { name: 'Нормальный такой предметус', rarity: 'Розовi', basePrice: 50 },
    { name: 'Нихуйный такой предметус', rarity: 'Краснi', basePrice: 100 },
    { name: 'ААААААААА предметус (НУ ТЫ ПСИИХ)', rarity: 'ЗЛАТОI!!!AAAA', basePrice: 200 },
];

const wearLevels = [
    { level: '1 типа', multiplier: 1.0 },
    { level: '2 типа', multiplier: 0.9 },
    { level: '3 типа', multiplier: 0.8 },
    { level: '4 типа', multiplier: 0.7 },
    { level: '5 типа', multiplier: 0.5 },
];

// Функция обновления отображения коинов
function updateCoins() {
    coinsDisplay.textContent = gameData.coins;
}

// Обработчик для кнопки получения коинов
coinButton.addEventListener('click', () => {
    gameData.coins += 10;
    updateCoins();
    saveGame();
});

// Обработчик для кнопки открытия кейса
openCaseButton.addEventListener('click', () => {
    if (gameData.coins >= 100) {
        gameData.coins -= 100;
        updateCoins();
        openCase();
    } else {
        alert('Недостаточно арiв для открытия кейса!');
    }
});

// Функция открытия кейса
function openCase() {
    const skin = getRandomSkin();
    gameData.inventory.push(skin);
    updateInventory();
    alert(`Вы получили: ${skin.name} (${skin.rarity}, ${skin.wearLevel})`);
    saveGame();
}

// Функция получения случайного скина
function getRandomSkin() {
    const rarityRandom = Math.random();
    let skinRarity;

    if (rarityRandom < 0.5) {
        skinRarity = 'синi';
    } else if (rarityRandom < 0.75) {
        skinRarity = 'фиолетовi';
    } else if (rarityRandom < 0.9) {
        skinRarity = 'Розовi';
    } else if (rarityRandom < 0.98) {
        skinRarity = 'Краснi';
    } else {
        skinRarity = 'ЗЛАТОI!!!AAAA';
    }

    const availableSkins = skins.filter(skin => skin.rarity === skinRarity);
    const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];

    const wear = wearLevels[Math.floor(Math.random() * wearLevels.length)];

    const price = randomSkin.basePrice * wear.multiplier;

    return {
        name: randomSkin.name,
        rarity: randomSkin.rarity,
        wearLevel: wear.level,
        price: Math.floor(price),
    };
}

// Функция обновления инвентаря
function updateInventory() {
  const amount = 5;
    inventoryList.innerHTML = '';
    gameData.inventory.forEach((item, index) => {
      if(index >= gameData.inventory.length-amount){
        const li = document.createElement('li');
        li.className = 'inventory-item';
        li.textContent = `${item.name} (${item.rarity}, ${item.wearLevel}) - Цена: ${item.price} арiв`;
        const etcItems = document.getElementById('items');
        const etc = document.getElementById('etc');
        etcItems.textContent = gameData.inventory.length-amount;
        if (gameData.inventory.length<=amount) {
          etc.style.display = 'none'
        } else {
          etc.style.display = 'flex'
        }
        const sellButton = document.createElement('button');
        sellButton.className = 'sell-button';
        sellButton.textContent = 'Продать';
        
        sellButton.addEventListener('click', () => { //кнопка продажи скина
            gameData.coins += item.price;
            updateCoins();
            gameData.inventory.splice(index, 1);
            updateInventory();
            saveGame();
        });

        li.appendChild(sellButton);
        inventoryList.insertBefore(li,inventoryList.firstChild);
      }
    });
}

function loadGame() {
  const savedData = localStorage.getItem('caseData');
  if (savedData) {
      const loadedData = JSON.parse(savedData);
      gameData = { ...gameData, ...loadedData };
  }
}

function saveGame() {
  localStorage.setItem('caseData', JSON.stringify(gameData));
}
