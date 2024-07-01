let gold = 0;
let prestigePoints = 0;
let levelBonuses = 0;

const mines = [
    { name: 'Coal Mine', level: 0, miners: 0, automation: false, automationPurchased: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100, purchased: true, minersRequired: 1000 },
    { name: 'Iron Mine', level: 0, miners: 0, automation: false, automationPurchased: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100, purchased: false, cost: 1000000, minersRequired: 1000 },
    { name: 'Gold Mine', level: 0, miners: 0, automation: false, automationPurchased: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100, purchased: false, cost: 10000000, minersRequired: 1000 },
    { name: 'Diamond Mine', level: 0, miners: 0, automation: false, automationPurchased: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100, purchased: false, cost: 100000000, minersRequired: 1000 },
    { name: 'Platinum Mine', level: 0, miners: 0, automation: false, automationPurchased: false, goldPerClick: 1, minerEfficiency: 1, levelUpCost: 10, minerCost: 10, upgradeCost: 50, automationCost: 100, purchased: false, cost: 1000000000, minersRequired: 1000 }
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
        if (mine.purchased) {
            mineDiv.innerHTML = `
                <h2>${mine.name}</h2>
                <p>Level: ${mine.level}</p>
                <p>Miners: ${mine.miners}</p>
                <p>Gold per Click: ${mine.goldPerClick}</p>
                <p>Gold per Second: ${mine.miners * mine.minerEfficiency}</p>
                <button onclick="mineGold(${index})">Mine Gold</button>
                <button onclick="hireMiner(${index})">Hire Miner (Cost: ${mine.minerCost} Gold)</button>
                <button onclick="buyMaxMiners(${index})">Buy Max Miners</button>
                <button onclick="upgradeEfficiency(${index})">Upgrade Efficiency (Cost: ${mine.upgradeCost} Gold)</button>
                <button onclick="buyAutomation(${index})" ${mine.automationPurchased ? 'disabled' : ''}>Buy Automation (Cost: ${mine.automationCost} Gold)</button>
                <button onclick="levelUpMine(${index})">Level Up Mine (Cost: ${mine.levelUpCost} Gold, Requires: ${mine.minersRequired} Miners)</button>
            `;
        } else {
            mineDiv.innerHTML = `
                <h2>${mine.name}</h2>
                <p>Cost: ${mine.cost} Gold</p>
                <button onclick="buyMine(${index})">Buy Mine</button>
            `;
        }
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

function buyMaxMiners(mineIndex) {
    const mine = mines[mineIndex];
    while (gold >= mine.minerCost) {
        gold -= mine.minerCost;
        mine.miners += 1;
        mine.goldPerClick += 1;
        mine.minerCost = Math.floor(mine.minerCost * 1.1);
    }
    updateDisplay();
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
    if (gold >= mine.automationCost && !mine.automationPurchased) {
        gold -= mine.automationCost;
        mine.automation = true;
        mine.automationPurchased = true;
        updateDisplay();
    }
}

function levelUpMine(mineIndex) {
    const mine = mines[mineIndex];
    if (mine.miners >= mine.minersRequired && gold >= mine.levelUpCost) {
        gold -= mine.levelUpCost;
        mine.level += 1;
        mine.goldPerClick *= 2;

        if (mine.level % 10 === 0) {
            mine.goldPerClick *= 5;
        }

        if (mine.level <= 5) {
            mine.levelUpCost *= 10;
            mine.minersRequired *= 3;
        } else if (mine.level <= 10) {
            mine.levelUpCost *= 100;
            mine.minersRequired *= 5;
        } else {
            mine.levelUpCost *= 100;
            mine.minersRequired *= 10;
        }

        levelBonuses += 1;
        updateDisplay();
    }
}

function buyMine(mineIndex) {
    const mine = mines[mineIndex];
    if (gold >= mine.cost) {
        gold -= mine.cost;
        mine.purchased = true;
        mine.goldPerClick = 1;
        mine.minerEfficiency = 1;
        mine.levelUpCost = 10;
        mine.minerCost = 10;
        mine.upgradeCost = 50;
        mine.automationCost = 100;
        mine.minersRequired = 1000;
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
        mine.automationPurchased = false;
        mine.goldPerClick = 1;
        mine.minerEfficiency = 1;
        mine.levelUpCost = 10;
        mine.minerCost = 10;
        mine.upgradeCost = 50;
        mine.automationCost = 100;
        mine.minersRequired = 1000;
        if (!mine.purchased) {
            mine.cost = mine.cost;
        }
    });
    updateDisplay();
}

function automateMines() {
    mines.forEach(mine => {
        if (mine.automation) {
            gold += mine.miners * mine.minerEfficiency;
        }
    });
    updateDisplay();
}

prestigeButton.addEventListener('click', prestige);

// Automate mines every second
setInterval(automateMines, 1000);

// Initial display update
updateDisplay();
