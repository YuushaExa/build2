const canvas = document.getElementById('cityCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 300;

let backgroundImage = new Image();
backgroundImage.src = 'https://i.imgur.com/8ncU2as.png'; // URL to a city background image

let characterImage = new Image();
characterImage.src = 'https://i.imgur.com/o1A4mW1.png'; // URL to a character sprite

let enemyImage = new Image();
enemyImage.src = 'https://i.imgur.com/uwFwDWo.png'; // URL to an enemy sprite

let bgX = 0;
const speed = 2;

const character = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    width: 100,
    height: 150,
    hp: 100,
    attack: 10
};

const enemies = [];

function spawnEnemy() {
    const enemy = {
        x: canvas.width,
        y: canvas.height - 150,
        width: 100,
        height: 150,
        hp: 50,
        attack: 5,
        speed: 1 + Math.random() * 2
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
                gold += 10; // Reward for killing an enemy
            }

            if (character.hp <= 0) {
                alert('Game Over');
                resetGame();
            }
        }
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
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

function resetGame() {
    character.hp = 100;
    enemies.length = 0;
    gold = 0; // Reset gold
}

backgroundImage.onload = () => {
    drawBackground();
};

// Spawn enemies at random intervals
setInterval(spawnEnemy, 2000);
