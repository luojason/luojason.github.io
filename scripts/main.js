/* -------------------- setup -------------------- */
const canvas = document.querySelector('#canvas');
const ctxt = canvas.getContext('2d');
const speedControl = document.querySelector('#speed');
const animControl = document.querySelector('#play-pause');
let renderRequest;

const size = 5; // side length of each cell in pixels
const width = Math.ceil(window.innerWidth/size);
const height = Math.ceil(window.innerHeight/size);
canvas.width = width*size;
canvas.height = height*size;

let counter = 0; // track how many frames have passed since last update
let framerate = 10; // how many frames to wait between updates
speedControl.value = framerate;

// initialize mouse properties for interactivity
let mouseX, mouseY;
let mousePressed = false;

/* -------------------- automata functions -------------------- */
//placeholder
let automata = conway;
automata.init(ctxt, width, height);


/* -------------------- animation loop -------------------- */
function loop() {
	renderRequest = requestAnimationFrame(loop);
	counter++;
	if(counter >= framerate) {
		counter = 0;
		automata.update();
	}
	if(mousePressed) { // sustain cell if mouse is pressed
		automata.mouseAction(mouseX, mouseY);
	}
}

/* -------------------- event handlers -------------------- */
const app = document.querySelector('.application');
app.addEventListener('mousedown', function(e) {
	mouseX = Math.floor(e.clientX/size);
	mouseY = Math.floor(e.clientY/size);
	mousePressed = true;

	automata.mouseAction(mouseX, mouseY);
});

app.addEventListener('mouseup', function(e) {
	mousePressed = false;
});

app.addEventListener('mousemove', function(e) {
	mouseX = Math.floor(e.clientX/size);
	mouseY = Math.floor(e.clientY/size);

	if(mousePressed) {
		automata.mouseAction(mouseX, mouseY);
	}
});

// prevent header from highlighting on selection
document.querySelector('.application h1').addEventListener(
	'selectstart',
	function(e) {
		e.preventDefault();
	}
);

// toggle info box
const info = document.querySelector('.info-box');
const button = document.querySelector('#toggle');
const buttonText = document.querySelector('#toggle > p');
let active = false;
button.addEventListener('click', function(e) {
	if(active) {
		info.classList.remove('active');
		buttonText.textContent = 'Help';
		active = false;
	} else {
		info.classList.add('active');
		buttonText.textContent = 'Close Help';
		active = true;
	}
});

// change speed of animation
speedControl.addEventListener('input', function(e) {
	framerate = speedControl.value;
});

// pause/unpause animation
let paused = false;
animControl.addEventListener('click', function(e) {
	if(paused) {
		animControl.textContent = 'Pause';
		loop();
		paused = false;
	} else {
		animControl.textContent = 'Resume';
		cancelAnimationFrame(renderRequest);
		paused = true;
	}
});

/* -------------------- helper functions -------------------- */

/* -------------------- start loop -------------------- */
loop();
