const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pauseButton = document.getElementById("pauseButton");
const speedButton1 = document.getElementById("speedButton1");
const speedButton2 = document.getElementById("speedButton2");
const speedButton3 = document.getElementById("speedButton3");
const resetButton = document.getElementById("resetButton");
const widthInput = document.getElementById("gridWidth");
const heightInput = document.getElementById("gridHeight");
const offToOn = document.getElementById("offToOn");
const onToOff = document.getElementById("onToOff");
const cellSize = 3;
var width = 0;
var height = 0;
var cells = [];
var nextCells = [];
var intervalID = 0;
var rule;

function load() {
	cells = [];
	rule = [[offToOn.value], [onToOff.value]];
	width = Math.floor(widthInput.value / cellSize);
	height = Math.floor(heightInput.value / cellSize);
	canvas.setAttribute("width", widthInput.value - widthInput.value%3);
	canvas.setAttribute("height", heightInput.value - heightInput.value%3);
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

function changeState(x, y, state) {
	let rule0To1 = rule[0][0].split(",");
	let rule1To0 = rule[1][0].split(",");
	if (state == 0) {
		for (let i = 0; i < rule0To1.length; i++) {
			if (neighborCount(x, y, 1) == rule0To1[i]) {
				return 1;
			}
		}
	} else if (state == 1) {
		for (let i = 0; i < rule1To0.length; i++) {
			if (neighborCount(x, y, 1) == rule1To0[i]) {
				return 0;
			}
		}
	}
	return state;
}

function update() {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			nextCells[i][j] = changeState(i, j, cells[i][j]);
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

function setSpeed(speed) {
	if (intervalID != 0) {
		clearInterval(intervalID);
	}
	if (speed != 0) {
		intervalID = setInterval(run, speed);
	}
}

function run() {
	update();
	draw();
}

load();
draw();
intervalID = setInterval(run, 250); // Every 0.25 seconds
pauseButton.onclick = function () { setSpeed(0); }
speedButton1.onclick = function () { setSpeed(250); }
speedButton2.onclick = function () { setSpeed(100); }
speedButton3.onclick = function () { setSpeed(50); }
resetButton.onclick = function () { load(); }