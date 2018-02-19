document.getElementById("restart-button").addEventListener("click", restart);

var gridCols = 16;
var gridRows = 16;
var cron = null;
var snake = [[2,3], [1,3], [1,2], [1,1]];
var direction = ["r"];
var food = [4,3];
var gridCells = getGridCells();
var grid = gridToMatrix(gridCells, gridCols, gridRows);

function getGridCells() {
    return $(".grid-cell");
}

function restart() {
    cron = null;
    snake = [[2,3], [1,3], [1,2], [1,1]];
    direction = ["r"];
    food = [4,3];
    gridCells = getGridCells();
    grid = gridToMatrix(gridCells, gridCols, gridRows);
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
        console.log("col: " + col + "row: " + row);
        grid[row][col] = DOMGrid[i];
    }
    return grid;
}