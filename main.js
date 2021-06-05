/* -------------------- setup -------------------- */
const canvas = document.querySelector('#canvas');
const ctxt = canvas.getContext('2d');
let renderRequest;

const size = 5; // side length of each cell in pixels
const width = Math.floor(window.innerWidth/size);
const height = Math.ceil(window.innerHeight/size);
canvas.width = width*size;
canvas.height = height*size;

// all cells start off dead
ctxt.fillStyle = 'black';
ctxt.fillRect(0, 0, canvas.width, canvas.height);

// initialize grid of cells
// need two to store current vs next layout
let cells = [[], []];
for(let i = 0; i < height; i++) {
	cells[0][i] = new Int8Array(width);
	cells[1][i] = new Int8Array(width);
}
let frame = 0; // track which grid is in use
let counter = 0; // track how many frames have passed since last update
const framerate = 10; // how many frames to wait between updates

// initialize mouse properties for interactivity
let mouseX, mouseY;
let mousePressed = false;

/* -------------------- automata functions -------------------- */
function update() {
	let nextFrame = (frame + 1)%2;
	let grid = cells[frame];
	let nextGrid = cells[nextFrame];

	for(let i = 0; i < height; i++) {
		for(let j = 0; j < width; j++) {
			applyRules(grid, nextGrid, i, j);
		}
	}

	frame = nextFrame;
}

// computes if a cell state changes; writes changes to image accordingly
// boundaries are looped around
function applyRules(current, next, i, j) {
	let left = (j == 0) ? width-1 : j-1;
	let right = (j == width-1) ? 0 : j+1;
	let up = (i == 0) ? height-1 : i-1;
	let down = (i == height-1) ? 0 : i+1;

	// accumulate number of neighbours
	let neighbours = 0;
	neighbours += current[up][left];
	neighbours += current[up][j];
	neighbours += current[up][right];
	neighbours += current[i][right];
	neighbours += current[down][right];
	neighbours += current[down][j];
	neighbours += current[down][left];
	neighbours += current[i][left];

	next[i][j] = current[i][j]; // first synchronize the grids
	if(current[i][j] == 1) { // check death conditions
		if(neighbours != 2 && neighbours != 3) {
			next[i][j] = 0;
			ctxt.fillStyle = '#000000'; // set to black
			ctxt.fillRect(j*size, i*size, size, size);
		}
	} else {
		if(neighbours == 3) { // check birth conditions
			next[i][j] = 1;
			ctxt.fillStyle = '#ffffff'; // set to white
			ctxt.fillRect(j*size, i*size, size, size);
		}
	}
}

/* -------------------- animation loop -------------------- */
function loop() {
	renderRequest = requestAnimationFrame(loop);
	counter++;
	if(counter >= framerate) {
		counter = 0;
		update();
	}
	if(mousePressed) { // sustain cell if mouse is pressed
		cells[frame][mouseY][mouseX] = 1;
		ctxt.fillStyle = '#ffffff';
		ctxt.fillRect(mouseX*size, mouseY*size, size, size);
	}
}

/* -------------------- event handlers -------------------- */
canvas.addEventListener('mousedown', function(e) {
	mouseX = Math.floor(e.offsetX/size);
	mouseY = Math.floor(e.offsetY/size);
	mousePressed = true;

	cells[frame][mouseY][mouseX] = 1;
	ctxt.fillStyle = '#ffffff';
	ctxt.fillRect(mouseX*size, mouseY*size, size, size);
});

canvas.addEventListener('mouseup', function(e) {
	mousePressed = false;
});

canvas.addEventListener('mousemove', function(e) {
	mouseX = Math.floor(e.offsetX/size);
	mouseY = Math.floor(e.offsetY/size);

	if(mousePressed) {
		cells[frame][mouseY][mouseX] = 1;
		ctxt.fillStyle = '#ffffff';
		ctxt.fillRect(mouseX*size, mouseY*size, size, size);
	}
});

/* -------------------- helper functions -------------------- */
// sets color data; 'color' is specified as a rgba 4-array
/*
function setIndex(img, y, x, color) {
	let flatIndex = (y*width + x)*4;
	img.data[flatIndex+0] = color[0];
	img.data[flatIndex+1] = color[1];
	img.data[flatIndex+2] = color[2];
	img.data[flatIndex+3] = color[3];
}*/

/* -------------------- start loop -------------------- */
loop();
