const canvas = document.getElementById('cityCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 300;

// Images for different levels
const backgrounds = [
    'https://i.imgur.com/8ncU2as.png',
    'https://i.imgur.com/xTGRkMl.png', // Add more background URLs
];
const enemyImages = [
    'https://i.imgur.com/uwFwDWo.png',
    'https://i.imgur.com/WjlEqSl.png', // Add more enemy URLs
];
const bossImages = [
    'https://i.imgur.com/J4t2LZL.png',
    'https://i.imgur.com/LZbTYUl.png', // Add more boss URLs
];

const overlayBackgroundsWin = [
    'https://i.imgur.com/overlay-win1.jpg', // Backgrounds for winning
    'https://i.imgur.com/overlay-win2.jpg',
];

const overlayBackgroundsLost = [
    'https://i.imgur.com/overlay-lost1.jpg', // Backgrounds for losing
    'https://i.imgur.com/overlay-lost2.jpg',
];

const overlayTextsWin = [
    'Congratulations on defeating the boss! Moving to the next level...',
    'You defeated the boss again! Keep going...',
];

const overlayTextsLost = [
    'You lost! Restarting the level...',
    'Try again! You can do it!',
];

let currentBackgroundIndex = 0;
let currentEnemyIndex = 0;
let currentOverlayIndex = 0;

let backgroundImage = new Image();
backgroundImage.src = backgrounds[currentBackgroundIndex];

let characterImage = new Image();
characterImage.src = 'https://i.imgur.com/o1A4mW1.png';

let enemyImage = new Image();
enemyImage.src = enemyImages[currentEnemyIndex];

let bossImage = new Image();
bossImage.src = bossImages[currentEnemyIndex];

let bgX = 0;
const speed = 2;

const character = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    width: 100,
    height: 150,
    hp: 100,
    attack: 10,
    loot: {
        hat: false,
        talisman: false,
        clothes: false,
        pants: false
    }
};

let level = 1;
let enemyKillCount = 0;

const enemies = [];

function spawnEnemy() {
    const isBoss = enemyKillCount > 0 && enemyKillCount % 100 === 0;
    const enemy = {
        x: canvas.width,
        y: canvas.height - 150,
        width: 100,
        height: 150,
        hp: isBoss ? 50 * Math.pow(10, level) * 1.5 : 50 * Math.pow(10, level),
        attack: isBoss ? 5 * Math.pow(10, level) * 1.5 : 5 * Math.pow(10, level),
        speed: isBoss ? 1 + Math.random() * 1 : 1 + Math.random() * 2,
        isBoss: isBoss
    };
    enemies.push(enemy);
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
        }

        // Check for collision with character
        if (
            enemy.x < character.x + character.width &&
            enemy.x + enemy.width > character.x &&
            enemy.y < character.y + character.height &&
            enemy.y + enemy.height > character.y
        ) {
            character.hp -= enemy.attack;
            enemy.hp -= character.attack;

            if (enemy.hp <= 0) {
                enemies.splice(index, 1);
                enemyKillCount++;
                gold += 10; // Reward for killing an enemy

                // Check for loot drop
                if (Math.random() < (enemy.isBoss ? 0.2 : 0.01)) {
                    dropLoot();
                }

                // Check for level completion
                if (enemy.isBoss) {
                    displayOverlayWin();
                    setTimeout(() => {
                        level++;
                        enemyKillCount = 0;
                        resetCharacter();
                        updateLevelAssets();
                        updateDisplay();
                        hideOverlay();
                    }, 5000);
                }
            }

            if (character.hp <= 0) {
                displayOverlayLost();
                setTimeout(() => {
                    resetCharacter();
                    updateDisplay();
                    hideOverlay();
                }, 5000);
            }
        }
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.isBoss ? bossImage : enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, bgX + canvas.width, 0, canvas.width, canvas.height);

    bgX -= speed;
    if (bgX <= -canvas.width) {
        bgX = 0;
    }

    // Draw character
    ctx.drawImage(characterImage, character.x, character.y, character.width, character.height);

    // Draw enemies
    drawEnemies();

    // Update enemy positions and check for collisions
    updateEnemies();

    requestAnimationFrame(drawBackground);
}

function resetCharacter() {
    character.hp = 100;
}

function resetGame() {
    character.hp = 100;
    enemies.length = 0;
    gold = 0; // Reset gold
    level = 1;
    enemyKillCount = 0;
}

function displayOverlayWin() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayBg = document.getElementById('overlay-bg');
    overlayText.textContent = overlayTextsWin[currentOverlayIndex];
    overlayBg.style.backgroundImage = `url(${overlayBackgroundsWin[currentBackgroundIndex]})`;
    overlay.style.display = 'flex';
}

function displayOverlayLost() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayBg = document.getElementById('overlay-bg');
    overlayText.textContent = overlayTextsLost[currentOverlayIndex];
    overlayBg.style.backgroundImage = `url(${overlayBackgroundsLost[currentBackgroundIndex]})`;
    overlay.style.display = 'flex';
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

function dropLoot() {
    const lootTypes = ['hat', 'talisman', 'clothes', 'pants'];
    const loot = lootTypes[Math.floor(Math.random() * lootTypes.length)];
    character.loot[loot] = true;
}

function updateLevelAssets() {
    if (level % 10 === 0) {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
        currentEnemyIndex = (currentEnemyIndex + 1) % enemyImages.length;
        backgroundImage.src = backgrounds[currentBackgroundIndex];
        enemyImage.src = enemyImages[currentEnemyIndex];
        bossImage.src = bossImages[currentEnemyIndex];
        currentOverlayIndex = (currentOverlayIndex + 1) % overlayTextsWin.length;
    }
}

backgroundImage.onload = () => {
    drawBackground();
};

// Spawn enemies at random intervals
setInterval(spawnEnemy, 2000);

// Initial display update
updateDisplay();
