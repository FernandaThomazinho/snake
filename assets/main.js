$("#restart-button").click(restart);

var gridCols = 16;
var gridRows = 16;
var cron = null;
var snake = [[2,3], [1,3], [1,2], [1,1]];
var currentDirection = "r";
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
  currentDirection = "r";
  generateFood();
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
      var nextCell = getNextCell("l");
      if (sameCell(snake[1], nextCell)) break;
      currentDirection = "l";
      break;
    case 38:
      var nextCell = getNextCell("u");
      if (sameCell(snake[1], nextCell)) break;
      currentDirection = "u";
      break;
    case 39:
      var nextCell = getNextCell("r");
      if (sameCell(snake[1], nextCell)) break;
      currentDirection = "r";
      break;
    case 40:
      var nextCell = getNextCell("d");
      if (sameCell(snake[1], nextCell)) break;
      currentDirection = "d";
      break;
  }
}

function startCron () {
  cron = setInterval(move, 200 - (Math.log(speed) * 25));
}

function sameCell (firstCell, secondCell) {
  return (firstCell[0] == secondCell[0] && firstCell[1] == secondCell[1]);
}

function move () {
  var nextCell = getNextCell();
  if (isSnakeCell(nextCell) || isOutGrid(nextCell)) {
    lose();
  }
  else if (isFoodCell(nextCell)) {
    eat(nextCell);
  }
  else{
    moveFoward(nextCell);
  }
}

function isOutGrid (cell) {
  return (cell[0] < 0 || cell[0] >= gridRows || cell[1] < 0 || cell[1] >= gridCols);
}

function getNextCell (otherDirection) {
  var nextCell = [];
  var snakeHeadRow = snake[0][0];
  var snakeHeadCol = snake[0][1];
  var directionToUse = "";

  if (otherDirection) {
    directionToUse = otherDirection;
  }
  else {
    directionToUse = currentDirection;
  }

  switch (directionToUse) {
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

function moveFoward (nextCell) {
  snake.unshift(nextCell);
  snake.pop();
  render();
}

function eat (nextCell) {
  points ++;
  snakeGrow(nextCell);
  generateFood();
  speedUp();
  render();
}

function speedUp () {
  speed ++;
  clearInterval(cron);
  startCron();
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

function snakeGrow (nextCell) {
  snake.unshift(nextCell);
}

function lose () {
  restart();
  alert("Game Over");
}

function render () {
  clearGrid();
  paintSnake();
  paintFood();
  showScore();
}

function clearGrid () {
  var row = 0;
  var col = 0;
  for (row=0; row<gridRows; row++) {
    for (col=0; col<gridCols; col++) {
      $(grid[row][col]).removeClass("snake-cell");
      $(grid[row][col]).removeClass("food-cell");
    }
  }
}

function paintSnake () {
  var row = 0;
  var col = 0;
  for (i=0; i<snake.length; i++) {
    row = snake[i][0];
    col = snake[i][1];
    $(grid[row][col]).addClass("snake-cell");
  }
}

function paintFood () {
  var row = food[0];
  var col = food[1];
  $(grid[row][col]).addClass("food-cell");
}

function showScore () {
  $(".score-value")[0].innerHTML = points;
}