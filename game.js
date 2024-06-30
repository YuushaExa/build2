let gold = 0;
let miners = 0;
let minerCost = 10;
let upgradeCost = 50;
let automationCost = 100;
let goldPerClick = 1;
let minerEfficiency = 1;
let isAutomated = false;
let specialPoints = 0;
let mineLevel = 1;
let levelUpCost = 10;

const goldDisplay = document.getElementById('gold');
const minersDisplay = document.getElementById('miners');
const gpsDisplay = document.getElementById('gps');
const specialPointsDisplay = document.getElementById('specialPoints');
const mineLevelDisplay = document.getElementById('mineLevel');
const mineButton = document.getElementById('mineButton');
const buyMinerButton = document.getElementById('buyMinerButton');
const upgradeButton = document.getElementById('upgradeButton');
const automationButton = document.getElementById('automationButton');
const levelUpButton = document.getElementById('levelUpButton');
const prestigeButton = document.getElementById('prestigeButton');
const minerCostDisplay = document.getElementById('minerCost');
const upgradeCostDisplay = document.getElementById('upgradeCost');
const automationCostDisplay = document.getElementById('automationCost');
const levelUpCostDisplay = document.getElementById('levelUpCost');

function updateDisplay() {
    goldDisplay.textContent = gold;
    minersDisplay.textContent = miners;
    gpsDisplay.textContent = miners * minerEfficiency;
    minerCostDisplay.textContent = minerCost;
    upgradeCostDisplay.textContent = upgradeCost;
    automationCostDisplay.textContent = automationCost;
    specialPointsDisplay.textContent = specialPoints;
    mineLevelDisplay.textContent = mineLevel;
    levelUpCostDisplay.textContent = levelUpCost;
    automationButton.disabled = isAutomated;
}

function mineGold() {
    gold += goldPerClick;
    updateDisplay();
}

function hireMiner() {
    if (gold >= minerCost) {
        gold -= minerCost;
        miners += 1;
        minerCost = Math.floor(minerCost * 1.1);
        updateDisplay();
    }
}

function upgradeEfficiency() {
    if (gold >= upgradeCost) {
        gold -= upgradeCost;
        minerEfficiency += 1;
        upgradeCost = Math.floor(upgradeCost * 1.5);
        updateDisplay();
    }
}

function buyAutomation() {
    if (gold >= automationCost) {
        gold -= automationCost;
        isAutomated = true;
        updateDisplay();
    }
}

function generateGold() {
    if (isAutomated) {
        gold += miners * minerEfficiency;
    }
    updateDisplay();
}

function levelUpMine() {
    if (gold >= levelUpCost) {
        gold -= levelUpCost;
        mineLevel += 1;
        specialPoints += 1;

        if (mineLevel % 10 === 0) {
            minerEfficiency *= 5;
        } else {
            minerEfficiency *= 2;
        }

        if (mineLevel <= 5) {
            levelUpCost = mineLevel * 10;
        } else {
            levelUpCost = 100 * (miners * minerEfficiency);
        }

        updateDisplay();
    }
}

function prestige() {
    specialPoints += Math.floor(gold / 100);
    gold = 0;
    miners = 0;
    mineLevel = 1;
    minerCost = 10;
    upgradeCost = 50;
    automationCost = 100;
    minerEfficiency = 1;
    isAutomated = false;
    levelUpCost = 10;
    updateDisplay();
}

mineButton.addEventListener('click', mineGold);
buyMinerButton.addEventListener('click', hireMiner);
upgradeButton.addEventListener('click', upgradeEfficiency);
automationButton.addEventListener('click', buyAutomation);
levelUpButton.addEventListener('click', levelUpMine);
prestigeButton.addEventListener('click', prestige);

setInterval(generateGold, 1000);
