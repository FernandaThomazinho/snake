$("#restart-button").click(restart);

var gridCols = 16;
var gridRows = 16;
var cron = null;
var snake = [[2,3], [1,3], [1,2], [1,1]];
var direction = ["r"];
var food = [4,3];
var gridCells = getGridCells();
var grid = gridToMatrix(gridCells, gridCols, gridRows);
var speed = 1;

function getGridCells() {
    return $(".grid-cell");
}

function restart() {
    snake = [[2,3], [1,3], [1,2], [1,1]];
    direction = ["r"];
    food = [4,3];
    gridCells = getGridCells();
    grid = gridToMatrix(gridCells, gridCols, gridRows);
    speed = 1;
    clearInterval(cron);
    cron = null;
}

function gridToMatrix(DOMGrid, gridCols, gridRows) {
    var grid = [];
    var col = 0;
    var row = 0;
    var gridSize = DOMGrid.length;
    if(gridSize != gridCols * gridRows) return "Invalid grid size";
    for (i=0; i<gridSize; i++) {
        col = i % gridCols;
        row = Math.floor(i/gridCols);
        if (col == 0) grid[row] = [];
        grid[row][col] = DOMGrid[i];
    }
    return grid;
}

$(document).ready(function () {
    $(document).keydown(getDirection);
});

function getDirection() {
    var keyPressed = event.which;
    if (!isArrow(keyPressed)) return 0;
    changeDirection(keyPressed);
    if (cron == null) startCron();
    return 1;
}

function isArrow(keyPressed) {
    return keyPressed >= 37 && keyPressed <= 40;
}

function changeDirection (keyPressed) {
    switch(keyPressed) {
        case 37:
            direction = "l";
            break;
        case 38:
            direction = "u";
            break;
        case 39:
            direction = "r";
            break;
        case 40:
            direction = "d";
            break;
    }
}

function startCron () {
    cron = setInterval(handler, speed * 1000);
}

function handler (){
    alert("Hi");
}