const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pauseButton = document.getElementById("pauseButton");
const speedButton1 = document.getElementById("speedButton1");
const speedButton2 = document.getElementById("speedButton2");
const speedButton3 = document.getElementById("speedButton3");
const resetButton = document.getElementById("resetButton");
const randomizeButton = document.getElementById("randomizeButton");
const clearButton = document.getElementById("clearButton");
const widthInput = document.getElementById("gridWidth");
const heightInput = document.getElementById("gridHeight");
const statesInput = document.getElementById("states");
const offToOn = document.getElementById("offToOn");
const onToOff = document.getElementById("onToOff");
const ruleDiv = document.getElementById("ruleDiv");
const cellSize = 3;
var width = 0;
var height = 0;
var cells = [];
var nextCells = [];
var intervalID = 0;
var states = 2;
var ruleString;
var rule;

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

function neighborCount(x, y) {
	let total = 0;
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i == 0 && j == 0) {
				continue;
			}
			if (getCell(x + i, y + j) != 0) {
				total++;
			}
		}
	}
	return total;
}

function changeState(x, y, state) {
	for (let i = 0; i < states; i++) {
		if (i == state) { continue; }
		for (let j = 0; j < rule[state][i].length; j++) {
			if (neighborCount(x, y) == rule[state][i][j]) {
				return i;
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
			let color = 256 - (256/(states-1))*cells[i][j];
			ctx.fillStyle = "rgb(" + color + "," + color +"," + color + ")";
			ctx.fillRect(i * 3, j * 3, 3, 3);
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

function paintCells(event) {
	const rect = canvas.getBoundingClientRect();
	const x = Math.floor((event.clientX - rect.left) / cellSize);
	const y = Math.floor((event.clientY - rect.top) / cellSize);
	if (cells[x][y] == 0) {
		cells[x][y] = 1;
	} else {
		cells[x][y] = 0;
	}
	draw();
}

function load() {
	cells = [];
	states = statesInput.value;
	let ruleDivChildren = ruleDiv.children;
	ruleString = [];
	for (let i = 0; i < states; i++) {
		ruleString.push([]);
		for (let j = 0; j < states; j++) {
			ruleString[i].push("");
		}
	}

	for (let i = 0; i < ruleDivChildren.length; i++) {
		let item = ruleDivChildren[i];
		if (item.tagName == 'INPUT') {
			ruleString[parseInt(item.id.charAt(0))][parseInt(item.id.charAt(3))] = item.value;
		}
	}
	width = Math.floor(widthInput.value / cellSize);
	height = Math.floor(heightInput.value / cellSize);
	canvas.setAttribute("width", widthInput.value - widthInput.value % 3);
	canvas.setAttribute("height", heightInput.value - heightInput.value % 3);

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

	rule = [];
	for (let i = 0; i < states; i++) {
		rule.push([]);
		for (let j = 0; j < states; j++) {
			rule[i].push([]);
		}
	}

	for (let i = 0; i < states; i++) {
		for (let j = 0; j < states; j++) {
			let string = ruleString[i][j].split(",");
			console.log(string);
			if (string[0] == "") {
				rule[i][j].push("-1");
				continue;
			}
			for (let k = 0; k < string.length; k++) {
				let list = string[k].split("-");
				if (list.length > 1) {
					for (let l = list[0]; l <= list[1]; l++) {
						rule[i][j].push(l);
					}
				} else {
					rule[i][j].push(list[0]);
				}
			}
		}
	}
	console.log(rule);

	draw();
}

function randomize() {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			cells[i][j] = Math.floor(Math.random() * 2);
		}
	}
	draw();
}

function clear() {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			cells[i][j] = 0;
		}
	}
	draw();
}

function updateStates() {
	if (statesInput.value < 2) { return; }
	let ruleDivString = "";
	for (let i = 0; i < statesInput.value; i++) {
		for (let j = 0; j < statesInput.value; j++) {
			if (i == j) { continue; }
			ruleDivString = ruleDivString +
				"<label for=\"" + i + "To" + j + "\"> " + i + " to " + j + ":</label>" +
				"<input type=\"text\" id=\"" + i + "To" + j + "\">";
		}
	}
	ruleDiv.innerHTML = ruleDivString;
}

function run() {
	update();
	draw();
}

load();
intervalID = setInterval(run, 250); // Every 0.25 seconds
pauseButton.onclick = function () { setSpeed(0); }
speedButton1.onclick = function () { setSpeed(250); }
speedButton2.onclick = function () { setSpeed(100); }
speedButton3.onclick = function () { setSpeed(50); }
resetButton.onclick = function () { load(); }
randomizeButton.onclick = function () { randomize(); }
clearButton.onclick = function () { clear(); }
statesInput.onchange = function () { updateStates() }
canvas.addEventListener("mousedown", function (e) { paintCells(e); })