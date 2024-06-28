const canvasContainer = document.getElementById('canvas-container');
const canvasBackground = document.getElementById('canvas-background');
const canvasElement = document.getElementById('c');
const fabricCanvas = new fabric.Canvas('c', {
  backgroundColor: 'white',
  width: 1000,
  height: 1000
});

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
  fabricCanvas.setWidth(canvasBackground.clientWidth);
  fabricCanvas.setHeight(canvasBackground.clientHeight);
  fabricCanvas.renderAll();
});

// Panning functionality
let isPanning = false;
let isPanMode = false;
let startPoint = { x: 0, y: 0 };

fabricCanvas.on('mouse:down', (opt) => {
  if (isPanMode) {
    isPanning = true;
    startPoint = { x: opt.e.clientX, y: opt.e.clientY };
    fabricCanvas.setCursor('grabbing');
    fabricCanvas.renderAll();
  }
});

fabricCanvas.on('mouse:move', (opt) => {
  if (isPanning) {
    const e = opt.e;
    const vpt = fabricCanvas.viewportTransform;
    vpt[4] += e.clientX - startPoint.x;
    vpt[5] += e.clientY - startPoint.y;
    fabricCanvas.requestRenderAll();
    startPoint = { x: e.clientX, y: e.clientY };
  }
});

fabricCanvas.on('mouse:up', () => {
  isPanning = false;
  if (isPanMode) {
    fabricCanvas.setCursor('grab');
  }
  fabricCanvas.renderAll();
});

// Toggle Panning Mode
document.getElementById('toggle-panning').addEventListener('click', () => {
  isPanMode = !isPanMode;
  if (isPanMode) {
    fabricCanvas.setCursor('grab');
  } else {
    fabricCanvas.setCursor('default');
  }
  fabricCanvas.renderAll();
});

// Zoom functionality
const zoomDisplay = document.getElementById('zoom-percentage');

canvasContainer.addEventListener('wheel', (opt) => {
  let zoom = fabricCanvas.getZoom();
  zoom *= 0.999 ** opt.deltaY;
  zoom = Math.min(Math.max(zoom, 0.1), 10);
  fabricCanvas.zoomToPoint({ x: opt.offsetX, y: opt.offsetY }, zoom);
  updateZoomDisplay();
  opt.preventDefault();
  opt.stopPropagation();
});

document.getElementById('zoom-in').addEventListener('click', () => {
  let zoom = fabricCanvas.getZoom();
  zoom = Math.min(zoom * 1.1, 10);
  fabricCanvas.setZoom(zoom);
  updateZoomDisplay();
});

document.getElementById('zoom-out').addEventListener('click', () => {
  let zoom = fabricCanvas.getZoom();
  zoom = Math.max(zoom * 0.9, 0.1);
  fabricCanvas.setZoom(zoom);
  updateZoomDisplay();
});

document.getElementById('reset-zoom').addEventListener('click', () => {
  fabricCanvas.setZoom(1);
  fabricCanvas.viewportTransform[4] = 0;
  fabricCanvas.viewportTransform[5] = 0;
  updateZoomDisplay();
  fabricCanvas.renderAll();
});

document.getElementById('create-circle').addEventListener('click', () => {
  const circle = new fabric.Circle({
    radius: 50,
    fill: 'red',
    left: fabricCanvas.width / 2,
    top: fabricCanvas.height / 2
  });
  fabricCanvas.add(circle);
});

function updateZoomDisplay() {
  let zoom = fabricCanvas.getZoom();
  zoomDisplay.innerText = `${Math.round(zoom * 100)}%`;
}

// Initial zoom display
updateZoomDisplay();
