/* -------------------- automata for Game of Life -------------------- */
var conway = {
	init: function(width, height) {
		// initialize grid of cells; need two to store current vs next layout
		let cells = [[], []];
		for(let i = 0; i < height; i++) {
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
