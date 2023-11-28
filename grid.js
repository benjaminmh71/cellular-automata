const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 3;
const width = canvas.width/cellSize;
const height = canvas.height/cellSize;
var cells = [];
var nextCells = [];

function load() {
	for (let i = 0; i < width; i++) {
		cells.push([]);
		for (let j = 0; j < height; j++) {
			cells[i].push(Math.floor(Math.random() * 2));
		}
	}
	for (let i = 0; i < width; i++) {
		nextCells.push([]);
		for (let j = 0; j < height; j++) {
			nextCells[i].push(0);
		}
	}
}

function getCell(x,y) { // Loops toroidally
	if (x < 0) {
		x = width + x;
	}
	if (x >= width) {
		x = x - width;
	}
	if (y < 0) {
		y = height + y;
	}
	if (y >= height) {
		y = y - height;
	}
	return cells[x][y];
}

function neighborCount(x, y, target) {
	let total = 0;
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i == 0 && j == 0) {
				continue;
			}
			if (getCell(x + i, y + j) == target) {
				total++;
			}
		}
	}
	return total;
}

function update() {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (cells[i][j] == 1) {
				if (neighborCount(i, j, 1) == 3 || neighborCount(i, j, 1) == 2) {
					nextCells[i][j] = 1;
				} else {
					nextCells[i][j] = 0;
				}
			} else {
				if (neighborCount(i, j, 1) == 3) {
					nextCells[i][j] = 1;
				} else {
					nextCells[i][j] = 0;
				}
			}
		}
	}

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			cells[i][j] = nextCells[i][j];
		}
	}
}

function draw() {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (cells[i][j] == 1) {
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.fillRect(i * 3, j * 3, 3, 3);
			} else {
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillRect(i * 3, j * 3, 3, 3);
			}
		}
	}
}

function run() {
	update();
	draw();
}

load();
draw();
setInterval(run, 500); // Every 0.25 seconds