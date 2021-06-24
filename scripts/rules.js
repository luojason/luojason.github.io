// every automata needs to have init(), update(), and mouseAction() implemented
/* -------------------- automata for Game of Life -------------------- */
var conway = {
	init: function(width, height) {
		// initialize grid of cells; need two to store current vs next layout
		let cells = [[], []];
		for(let i = 0; i < height; i++) { // row-major indexing
			cells[0][i] = new Int8Array(width);
			cells[1][i] = new Int8Array(width);
		}
		this.cells = cells;
		this.frame = 0; // track which grid is in use
		this.width = width;
		this.height = height;

		// all cells start off dead
		fill('#000000');
	},

	update: function() {
		let nextFrame = (this.frame + 1)%2;
		let grid = this.cells[this.frame];
		let nextGrid = this.cells[nextFrame];

		for(let i = 0; i < height; i++) {
			for(let j = 0; j < width; j++) {
				this.applyRules(grid, nextGrid, i, j);
			}
		}

		this.frame = nextFrame;
	},

	mouseAction: function(x, y) {
		if(0 <= x && x < width && 0 <= y && y < height) { // bounds check
			this.cells[this.frame][y][x] = 1;
			fillCell(x, y, '#ffffff');
		}
	},

	applyRules: function(current, next, i, j) {
		// computes if a cell state changes; writes changes to image accordingly
		// boundaries are looped around
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
				fillCell(j, i, '#000000'); // set to black
			}
		} else {
			if(neighbours == 3) { // check birth conditions
				next[i][j] = 1;
				fillCell(j, i, '#ffffff'); // set to white
			}
		}
	}
}

/* -------------------- automata for Langton's ant -------------------- */
var langton = {
	init: function(width, height) {
		// initialize grid of cells
		this.grid = [];
		for(let i = 0; i < width; i++) { // column-major indexing
			this.grid[i] = new Int8Array(height);
		}
		this.antPos = [Math.floor(width/2), Math.floor(height/2)];
		this.antDir = 3; // direction: [0,1,2,3] -> [N,E,S,W]
		this.width = width;
		this.height = height;

		// all cells start off white: 0 -> white, 1 -> black
		fill('#ffffff');
		fillCell(this.antPos[0], this.antPos[1], '#ff0000');
	},

	update: function() {
		let x = this.antPos[0];
		let y = this.antPos[1];
		let val = this.grid[x][y];
		this.antDir = (this.antDir + 1 + 2*val)%4; // rotate ant

		this.grid[x][y] = (val + 1)%2; // flip tile color
		fillCell(x, y, (val == 0)? '#000000':'#ffffff');

		// move ant, with looping behaviour
		this.antPos[0] = (x + (2 - this.antDir)%2 + this.width)%this.width;
		this.antPos[1] = (y + (this.antDir - 1)%2 + this.height)%this.height;
		fillCell(this.antPos[0], this.antPos[1], '#ff0000');
	},

	mouseAction: function(x, y) { // flips cell colors
		if(0 <= x && x < width && 0 <= y && y < height) { // bounds check
			if(this.grid[x][y] == 0) {
				this.grid[x][y] = 1;
				fillCell(x, y, '#000000');
			} else {
				this.grid[x][y] = 0;
				fillCell(x, y, '#ffffff');
			}
		}
	}
}
