$("#restart-button").click(restart);

var gridCols = 16;
var gridRows = 16;
var cron = null;
var snake = [[2,3], [1,3], [1,2], [1,1]];
var direction = "r";
var food = [];
generateFood();
var gridCells = getGridCells();
var grid = gridToMatrix(gridCells, gridCols, gridRows);
var speed = 1;
var points = 0;
render();

function getGridCells() {
    return $(".grid-cell");
}

function restart() {
    snake = [[2,3], [1,3], [1,2], [1,1]];
    direction = "r";
    food = [4,3];
    gridCells = getGridCells();
    grid = gridToMatrix(gridCells, gridCols, gridRows);
    speed = 1;
    clearInterval(cron);
    cron = null;
    points = 0;
    render();
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
    cron = setInterval(move, speed * 1000);
}

function move () {
    var nextCell = getNextCell();
    if (isSnakeCell(nextCell) || isOutGrid(nextCell)) {
        lose();
    }
    else if (isFoodCell(nextCell)) {
        eat();
    }
    else{
        moveFoward();
    }
}

function isOutGrid (cell) {
    return (cell[0] < 0 || cell[0] >= gridRows || cell[1] < 0 || cell[1] >= gridCols);
}

function getNextCell () {
    var nextCell = [];
    var snakeHeadRow = snake[0][0];
    var snakeHeadCol = snake[0][1];
    
    switch (direction) {
        case "u":
            nextCell[0] = snakeHeadRow - 1;
            nextCell[1] = snakeHeadCol;
            break;
        case "r":
            nextCell[0] = snakeHeadRow;
            nextCell[1] = snakeHeadCol + 1;
            break;
        case "d":
            nextCell[0] = snakeHeadRow + 1;
            nextCell[1] = snakeHeadCol;
            break;
        case "l":
            nextCell[0] = snakeHeadRow;
            nextCell[1] = snakeHeadCol - 1;
            break;
    }
    return nextCell;
}

function isEmptyCell (cell) {
    return (isFoodCell(cell) || isSnakeCell(cell));
}

function isSnakeCell (cell) {
    for (i=0; i < snake.length; i++) {
        if ((cell[0] == snake[i][0]) && (cell[1] == snake[i][1])) return true;
    }
    return false;
}

function isFoodCell (cell) {
    return ((cell[0] == food[0]) && (cell[1] == food[1]));
}

function moveFoward () {
    snake.unshift(getNextCell());
    snake.pop();
    render();
}

function eat () {
    points ++;
    snakeGrow();
    generateFood();
    speedUp();
    render();
}

function speedUp () {
    speed *= 0.9;
}

function generateFood () {
    var row = Math.ceil(Math.random()*(gridRows-1));
    var col = Math.ceil(Math.random()*(gridCols-1));
    while (isSnakeCell([row,col]) || isFoodCell([row,col])) {
        row = Math.ceil(Math.random()*(gridRows-1));
        col = Math.ceil(Math.random()*(gridCols-1));
    }
    food = [row,col];
}

function snakeGrow () {
    snake.unshift(getNextCell());
}

function lose () {
    restart();
    alert("Game Over");
}

function render () {
    var row = 0;
    var col = 0;
    for (row=0; row<gridRows; row++) {
        for (col=0; col<gridCols; col++) {
            $(grid[row][col]).removeClass("snake-cell");
            $(grid[row][col]).removeClass("food-cell");
        }
    }
    for (i=0; i<snake.length; i++) {
        row = snake[i][0];
        col = snake[i][1];
        $(grid[row][col]).addClass("snake-cell");
    }
    row = food[0];
    col = food[1];
    $(grid[row][col]).addClass("food-cell");
    $(".score-value")[0].innerHTML = points;
}