/* -------------------- setup -------------------- */
// target elements
const app = document.querySelector('.application');
const canvas = document.querySelector('#canvas');
const ctxt = canvas.getContext('2d');
const info = document.querySelector('.info-box');
const buttonText = document.querySelector('#toggle > p');
const about = document.querySelector('#info');

// interactive elements
const speedControl = document.querySelector('#speed');
const animControl = document.querySelector('#play-pause');
const rulesControl = document.querySelector('#select-rules');
const button = document.querySelector('#toggle');

let renderRequest; // for disabling animation on pause

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

/* -------------------- animation loop -------------------- */
function loop() {
	renderRequest = requestAnimationFrame(loop);
	counter++;
	if(counter >= framerate) {
		counter = 0;
		automata.update();
	}
	/*if(mousePressed) { // sustain cell if mouse is pressed
		automata.mouseAction(mouseX, mouseY);
	}*/
}

/* -------------------- event handlers -------------------- */
app.addEventListener('mousedown', e => {
	mouseX = Math.floor(e.clientX/size);
	mouseY = Math.floor(e.clientY/size);
	mousePressed = true;

	automata.mouseAction(mouseX, mouseY);
});

app.addEventListener('mouseup', e => {
	mousePressed = false;
});

app.addEventListener('mousemove', e => {
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
let active = false;
button.addEventListener('click', () => {
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
speedControl.addEventListener('input', () => {
	framerate = speedControl.value;
});

// pause/unpause animation
let paused = false;
function togglePlayPause() {
	if(paused) {
		animControl.textContent = 'Pause';
		loop();
		paused = false;
	} else {
		animControl.textContent = 'Resume';
		cancelAnimationFrame(renderRequest);
		paused = true;
	}
}
animControl.addEventListener('click', togglePlayPause);

// load new automata
rulesControl.addEventListener('change', () => {
	loadAutomata(rulesControl.value);
});

/* -------------------- helper functions -------------------- */
function fill(color) {
	ctxt.fillStyle = color;
	ctxt.fillRect(0, 0, canvas.width, canvas.height);
}

function fillCell(x, y, color) {
	ctxt.fillStyle = color;
	ctxt.fillRect(x*size, y*size, size, size);
}

function loadAutomata(name) {
	if(!paused) { togglePlayPause(); }
	animControl.setAttribute('disabled', '');
	rulesControl.setAttribute('disabled', ''); // forbid rule changing while loading
	about.children[0].textContent = '';
	for(let i = about.children.length-1; i > 0; i--) { // remove old text
		about.children[i].remove();
	}

	fetch(`desc/${name}.json`)
	.then(response => response.json())
	.then(data => {
		about.children[0].textContent = `About - ${data.title}`; // new title
		let para;
		for(let i = 0; i < data.contents.length; i++) { // new contents
			para = document.createElement('p');
			para.textContent = data.contents[i];
			about.appendChild(para);
		}
		para = document.createElement('p'); // new source/link
		para.textContent = 'Source: ';
		let link = document.createElement('a');
		link.setAttribute('href', data.link);
		link.textContent = data.source;
		para.appendChild(link);
		about.appendChild(para);
	})
	.catch(err => {
		let para = document.createElement('p');
		para.textContent = `load error: ${err.message}`;
		about.appendChild(para);
	})
	.finally(() => {
		animControl.removeAttribute('disabled');
		rulesControl.removeAttribute('disabled'); // re-enable rule-changing

		automata = window[name];
		automata.init(width, height);
	});
}

/* -------------------- start -------------------- */
loadAutomata('conway');
