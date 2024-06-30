let gold = 0;
let prestigePoints = 0;
let levelBonuses = 0;

const mines = [
    { name: 'Coal Mine', level: 0, miners: 0, automation: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100 },
    { name: 'Iron Mine', level: 0, miners: 0, automation: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100 },
    { name: 'Gold Mine', level: 0, miners: 0, automation: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100 },
    { name: 'Diamond Mine', level: 0, miners: 0, automation: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100 },
    { name: 'Platinum Mine', level: 0, miners: 0, automation: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100 }
];

const goldDisplay = document.getElementById('gold');
const prestigePointsDisplay = document.getElementById('prestigePoints');
const levelBonusesDisplay = document.getElementById('levelBonuses');
const minesContainer = document.getElementById('mines');
const prestigeButton = document.getElementById('prestigeButton');

function updateDisplay() {
    goldDisplay.textContent = gold;
    prestigePointsDisplay.textContent = prestigePoints;
    levelBonusesDisplay.textContent = levelBonuses;
    minesContainer.innerHTML = '';
    
    mines.forEach((mine, index) => {
        const mineDiv = document.createElement('div');
        mineDiv.innerHTML = `
            <h2>${mine.name}</h2>
            <p>Level: ${mine.level}</p>
            <p>Miners: ${mine.miners}</p>
            <p>Gold per Click: ${mine.goldPerClick}</p>
            <p>Gold per Second: ${mine.miners * mine.minerEfficiency}</p>
            <button onclick="mineGold(${index})">Mine Gold</button>
            <button onclick="hireMiner(${index})">Hire Miner (Cost: ${mine.minerCost} Gold)</button>
            <button onclick="upgradeEfficiency(${index})">Upgrade Efficiency (Cost: ${mine.upgradeCost} Gold)</button>
            <button onclick="buyAutomation(${index})">Buy Automation (Cost: ${mine.automationCost} Gold)</button>
            <button onclick="levelUpMine(${index})">Level Up Mine (Cost: ${mine.levelUpCost} Gold)</button>
        `;
        minesContainer.appendChild(mineDiv);
    });
}

function mineGold(mineIndex) {
    gold += mines[mineIndex].goldPerClick;
    updateDisplay();
}

function hireMiner(mineIndex) {
    const mine = mines[mineIndex];
    if (gold >= mine.minerCost) {
        gold -= mine.minerCost;
        mine.miners += 1;
        mine.goldPerClick += 1;
        mine.minerCost = Math.floor(mine.minerCost * 1.1);
        updateDisplay();
    }
}

function upgradeEfficiency(mineIndex) {
    const mine = mines[mineIndex];
    if (gold >= mine.upgradeCost) {
        gold -= mine.upgradeCost;
        mine.minerEfficiency += 1;
        mine.upgradeCost = Math.floor(mine.upgradeCost * 1.5);
        updateDisplay();
    }
}

function buyAutomation(mineIndex) {
    const mine = mines[mineIndex];
    if (gold >= mine.automationCost) {
        gold -= mine.automationCost;
        mine.automation = true;
        updateDisplay();
    }
}

function generateGold() {
    mines.forEach(mine => {
        if (mine.automation) {
            gold += mine.miners * mine.minerEfficiency;
        }
    });
    updateDisplay();
}

function levelUpMine(mineIndex) {
    const mine = mines[mineIndex];
    if (gold >= mine.levelUpCost) {
        gold -= mine.levelUpCost;
        mine.level += 1;
        levelBonuses += 1;

        if (mine.level % 10 === 0) {
            mine.minerEfficiency *= 5;
        } else {
            mine.minerEfficiency *= 2;
        }

        if (mine.level <= 5) {
            mine.levelUpCost = mine.level * 10;
        } else {
            mine.levelUpCost = 100 * (mine.miners * mine.minerEfficiency);
        }

        updateDisplay();
    }
}

function prestige() {
    prestigePoints += Math.floor(gold / 100);
    gold = 0;
    mines.forEach(mine => {
        mine.level = 0;
        mine.miners = 0;
        mine.automation = false;
        mine.goldPerClick = 1;
        mine.minerEfficiency = 1;
        mine.levelUpCost = 10;
        mine.minerCost = 10;
        mine.upgradeCost = 50;
        mine.automationCost = 100;
    });
    updateDisplay();
}

prestigeButton.addEventListener('click', prestige);

setInterval(generateGold, 1000);
updateDisplay();
