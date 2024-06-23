const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let activeElement = null;
let offsetX, offsetY;

// Add text to canvas
document.getElementById('add-text').addEventListener('click', () => {
    const text = prompt("Enter text:");
    if (text) {
        const fontSize = document.getElementById('font-size').value;
        const fontColor = document.getElementById('font-color').value;
        const textElement = createTextElement(text, fontSize, fontColor);
        canvasContainer.appendChild(textElement);
    }
});

// Add image to canvas
document.getElementById('add-image').addEventListener('click', () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
        const imgElement = createImageElement(imageUrl);
        canvasContainer.appendChild(imgElement);
    }
});

// Delete selected element
document.getElementById('delete-element').addEventListener('click', () => {
    if (activeElement) {
        canvasContainer.removeChild(activeElement);
        activeElement = null;
    }
});

function createTextElement(text, fontSize, fontColor) {
    const div = document.createElement('div');
    div.className = 'draggable resizable';
    div.contentEditable = true;
    div.innerText = text;
    div.style.fontSize = `${fontSize}px`;
    div.style.color = fontColor;
    div.style.position = 'absolute';
    div.style.left = '50px';
    div.style.top = '50px';
    div.style.cursor = 'move';
    div.addEventListener('click', () => setActiveElement(div));
    makeDraggable(div);
    makeResizable(div);
    return div;
}

function createImageElement(imageUrl) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '100%';
    img.style.height = '100%';
    div.className = 'draggable resizable';
    div.style.position = 'absolute';
    div.style.left = '50px';
    div.style.top = '50px';
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.cursor = 'move';
    div.appendChild(img);
    div.addEventListener('click', () => setActiveElement(div));
    makeDraggable(div);
    makeResizable(div);
    return div;
}

function setActiveElement(element) {
    if (activeElement) {
        activeElement.classList.remove('selected');
    }
    activeElement = element;
    activeElement.classList.add('selected');
}

function makeDraggable(element) {
    element.addEventListener('mousedown', (e) => {
        activeElement = element;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

function onMouseMove(e) {
    if (activeElement) {
        const left = e.clientX - offsetX;
        const top = e.clientY - offsetY;
        const rightBound = canvasContainer.clientWidth - activeElement.offsetWidth;
        const bottomBound = canvasContainer.clientHeight - activeElement.offsetHeight;

        activeElement.style.left = `${Math.min(Math.max(0, left), rightBound)}px`;
        activeElement.style.top = `${Math.min(Math.max(0, top), bottomBound)}px`;
    }
}

function onMouseUp() {
    activeElement = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function makeResizable(element) {
    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    element.appendChild(resizer);
    resizer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        activeElement = element;
        document.addEventListener('mousemove', resizeElement);
        document.addEventListener('mouseup', stopResizeElement);
    });
}

function resizeElement(e) {
    if (activeElement) {
        const newWidth = e.clientX - activeElement.offsetLeft;
        const newHeight = e.clientY - activeElement.offsetTop;
        const maxWidth = canvasContainer.clientWidth - activeElement.offsetLeft;
        const maxHeight = canvasContainer.clientHeight - activeElement.offsetTop;

        activeElement.style.width = `${Math.min(newWidth, maxWidth)}px`;
        activeElement.style.height = `${Math.min(newHeight, maxHeight)}px`;
    }
}

function stopResizeElement() {
    activeElement = null;
    document.removeEventListener('mousemove', resizeElement);
    document.removeEventListener('mouseup', stopResizeElement);
}
