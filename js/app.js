var snakeGame = snakeGame || {};

let snake = [
  ['col15','row30'],
  ['col14','row30'],
  ['col13','row30'],
  ['col12','row30'],
  ['col11','row30'],
  ['col10','row30'],
  ['col9','row30']
];

const direction = [
['-1', '0'], // north
['0', '-1'], // west
['1', '0'], // south
['0', '1'], // east
['-1', '1'], // diagnol right up
['1', '1'], // diagnol right down
['1', '-1'], // diagnol left down
['-1', '-1'] // diagnol left up
];

const letterDirections =
  [3, 0, 1, 0, 3,
    2, 3, 0, 5, 0,
    3, 6, 2, 3, 0,
    3, 2, 3, 0, 7,
    0, 3, 2, 3, 0,
    4, 3, 6, 5, 3,
    0, 3, 2, 1, 2,
    3, 2, 1, 2, 3,
    3, 3];

const letterTimess =
  [1, 18, 23, 28, 32,
    39, 47, 49, 57, 65,
    73, 79, 83, 88, 90,
    95, 100, 105, 107, 112,
    115, 117, 122, 130, 132,
    137, 141, 143, 147, 152,
    155, 163, 169, 171, 176,
    179, 183, 185, 189, 193,
    195, 216];

    ////// DIRECTION MAP
    /////   7    0    4
    /////   1         3
    /////   6    2    5

const highscore = [];
const levelOnArray = ['','Snake 2', 'Classic Snake', 'Some walls', 'Bombs'];
const boardHeight = 40;

let directionKey = 3; // east
let stopGame = null;
let stopWalls = null;
let walls = [];
let foodY = null;
let foodX = null;
let wallY = null;
let wallX = null;
let food = [];
let time = 20;
let growSnake = 0;
let os = 0;
let isPaused = false;
let runSequence = true;
let makeFoodFlag = false;
let destroy = 1;
let levelOn = 1;
let front = null;
let tail = null;
let i = 0;
let gameOver =  false;
let boardWidth = 83;
let $ul = null;
let $li = null;
let $food = null;
let $frontCell = null;
let $tailCell = null;

snakeGame.setup = function() {
  const $board = $('div.gameBoard');
  const $h2 = $('h2');
  const $scoreValue = $('div.scoreValue');
  const $levelValue = $('div.levelValue');
  const $instructions = $('.instructions');
  const $belowBoard = $('.belowBoard');
  const $highScore = $('.highScoreValue');

  snakeGame.updateScore = function() {
    $scoreValue.text(snake.length-7);
  };
  snakeGame.createBoard = function() {
    for (let x = 11; x < boardHeight; x++) {
      $board.append(`<ul class="block row${x}"></ul>`);
      for (let i = 11; i < boardWidth; i++) {
        $ul = $(`ul.block.row${x}`);
        $ul.append(`<li class="cell col${i} row${x}"></li>`);
      }
    }
    const $ulblock = $('ul.block');
    if(destroy === 2) {
      $ulblock.animate({width: '690px', easing: 'swing'}, 900);
      $instructions.animate({opacity: '0.92', easing: 'swing'}, 1300);
    } else if (destroy === 3) {
      $ulblock.css({width: '690px', easing: 'none'});
    }
    destroy = 3;
    gameOver =  false;
  };

  snakeGame.destroyBoard = function() {
    $board.html('');
  };

  snakeGame.createSnake = function() {
    for (let i = 0; i < snake.length; i++) {
      $li = $(`li.cell.${snake[i][0]}.${snake[i][1]}`);
      $li.addClass('snake');
    }
  };
  snakeGame.snakePosition = function() {
    front = snake[0];
    tail = snake[snake.length-1];
    $tailCell = $(`li.cell.${tail[0]}.${tail[1]}`);
    $tailCell.removeClass('snake');
    if (!growSnake) snake.pop();
    let col = parseInt(front[0].slice(-2));
    col = col + parseInt(direction[directionKey][1]);
    if(col>=boardWidth) {
      col = (col - boardWidth)+11;
    } else if (col<=10) {
      col = (boardWidth -1);
    }
    const colString = 'col'+col;
    let row = parseInt(front[1].slice(-2));
    row = row + parseInt(direction[directionKey][0]);
    if(row >= boardHeight) {
      row = (row - boardHeight)+11;
    } else if (row <= 10) {
      row = (boardHeight - 1);
    }
    const rowString = 'row'+row;
    snake.unshift([colString, rowString]);
    front = snake[0];
    $frontCell = $(`li.cell.${front[0]}.${front[1]}`);
    $frontCell.addClass('snake');
  };

  snakeGame.arrowKeys = function(e) {
    if ((directionKey + e.which) === 40) {
      // do nothing!
    } else if(e.which === 38) {
      directionKey = 0; // north
    } else if (e.which === 39 ) {
      directionKey = 3; // west
    } else if (e.which === 40 ) {
      directionKey = 2; // south
    } else if (e.which === 37 ) {
      directionKey = 1; // east
    } else if (e.which === 90 ) { // x
      if (isPaused) {
        if (levelOn === 1) {
          //
        } else {
          levelOn--;
        }
        snakeGame.selectLevel();
        $levelValue.text(levelOnArray[levelOn]);
      }
    } else if (e.which === 88 ) {  // z
      if (isPaused) {
        if (levelOn === 4) {
          //
        } else {
          levelOn++;
        }
        snakeGame.selectLevel();
        $levelValue.text(levelOnArray[levelOn]);
      }
    } else if (e.which === 32 ) {
      if (!gameOver) {
        if(!isPaused) {
          isPaused = true;
          clearInterval(stopWalls);
          clearInterval(stopGame);
          $h2.text('GAME PAUSED');
          $instructions.toggleClass('hide');
        } else {
          isPaused = false;
          snakeGame.startGame();
          if(makeFoodFlag) snakeGame.makeFood();
          $instructions.toggleClass('hide');
          if (levelOn === 4) {
            snakeGame.levelFour();
            snakeGame.createSnake();
          }
          makeFoodFlag = false;
        }
      }
    }
  };
  snakeGame.gameOverActions = function() {
    clearInterval(stopGame);
    $frontCell.addClass('snakeFront');
    isPaused =  true;
    gameOver =  true;
    setTimeout(function () {
      snakeGame.blowUpBoard();
      $h2.text('PLAY AGAIN?');
    }, 2500);
  };

  snakeGame.isGameOver = function() {
    snake.shift();
    //does snake hit into itself
    for (let i = 0; i < snake.length; i++) {
      if(snake[i][0] === front[0] && snake[i][1] === front[1]) {
        snakeGame.gameOverActions();
      }
    }
    // does snake hit into a wall
    for (let i = 0; i < walls.length; i++) {
      if(walls[i][0] === front[0] && walls[i][1] === front[1]) {
        snakeGame.gameOverActions();
      }
    }
    snake.unshift(front);
  };
//// ---------------------------------------------------------- WALLS & LEVELS
  snakeGame.createWalls = function() {
    for (let i = 0; i < walls.length; i++) {
      $li = $(`li.cell.${walls[i][0]}.${walls[i][1]}`);
      $li.addClass('walls');
    }
  };

  snakeGame.destroyWalls = function() {
    clearInterval(stopWalls);
    for (let i = 0; i < walls.length; i++) {
      $li = $(`li.cell.${walls[i][0]}.${walls[i][1]}`);
      $li.removeClass('walls');
    }
    walls = [];
  };

  snakeGame.blowUpBoard = function() {
    clearInterval(stopWalls);
    const $ulblock = $('ul.block');
    $ulblock.css({background: 'white', easing: 'none'});
    for (let x = 11; x < boardHeight; x++) {
      for (let i = 11; i < boardWidth; i = i + Math.ceil(Math.random()*3)) {
        setTimeout(function () {
          if(i%2 === 0) {
            $(`li.cell.col${i}.row${x}`).addClass('danger');
          } else {
            $(`li.cell.col${i}.row${x}`).addClass('fire');
          }
        }, 50);
      }
    }
    setTimeout(function () {
      for (let i = 0; i < snake.length; i++) {
        $(`li.cell.${snake[i][0]}.${snake[i][1]}`).addClass('danger');
      }
      for (let i = 0; i < walls.length; i++) {
        $(`li.cell.${walls[i][0]}.${walls[i][1]}`).addClass('danger');
      }
      for (let i = 0; i < food.length; i++) {
        $(`li.cell.${food[i][0]}.${food[i][1]}`).addClass('danger');
      }
    }, 3000);
    setTimeout(function () {
      snakeGame.resetGame();
      $instructions.toggleClass('hide');
    }, 7000);
  };

  snakeGame.resetGame = function() {
    highscore.push(snake.length-7);
    $highScore.text(Math.max.apply(null, highscore));
    snakeGame.destroyBoard();
    snakeGame.createBoard();
    $li = $(`li.cell`);
    $li.removeClass('snake');
    snake = [
      ['col11','row30'],
      ['col10','row30'],
      ['col9','row30'],
      ['col8','row30'],
      ['col7','row30'],
      ['col6','row30'],
      ['col5','row30']
    ];
    food = [];
    snakeGame.selectLevel();
    snakeGame.updateScore();
    directionKey = 3;
    makeFoodFlag = true;
      //$instructions.toggleClass('hide');
  };

  snakeGame.levelTwo = function() {
    for (let i = 11; i < boardWidth; i++){
      walls.push([`col${i}`, `row11`]);
      walls.push([`col${i}`, `row${boardHeight-1}`]);
    }
    for (let i = 12; i < boardHeight; i++){
      walls.push([`col11`, `row${i}`]);
      walls.push([`col${boardWidth-1}`, `row${i}`]);
    }
  };

  snakeGame.levelThree = function() {
    walls = [
      ['col41','row16'], ['col41','row17'], ['col41','row18'], ['col41','row19'], ['col41','row20'], ['col41','row21'], ['col41','row22'], ['col41','row23'], ['col41','row24'], ['col41','row25'], ['col41','row26'], ['col41','row27'], ['col41','row28'], ['col41','row29'], ['col41','row30'], ['col41','row31'], ['col41','row32'], ['col41','row33'], ['col41','row34'], ['col26','row16'], ['col26','row17'], ['col26','row18'], ['col26','row19'], ['col26','row20'], ['col26','row21'], ['col26','row22'], ['col26','row23'], ['col26','row24'], ['col26','row25'], ['col26','row26'], ['col26','row27'], ['col26','row28'], ['col26','row29'], ['col26','row30'], ['col26','row31'], ['col26','row32'], ['col26','row33'], ['col26','row34']
    ];
    for (let i = 11; i < boardWidth; i++){
      walls.push([`col${i}`, `row11`]);
      walls.push([`col${i}`, `row${boardHeight-1}`]);
    }
  };

  snakeGame.levelFour = function() {
    stopWalls = setInterval(() => {
      wallX = (Math.ceil(Math.random()*(boardHeight-13)))+11;
      wallY = (Math.ceil(Math.random()*(boardWidth-13)))+11;
      walls.unshift([]);
      walls[0].unshift('row'+wallX);
      walls[0].unshift('col'+wallY);
      snakeGame.createWalls();
    }, 2000);
  };

  snakeGame.selectLevel = function() {
    if(levelOn === 1) {
      snakeGame.destroyWalls();
      snakeGame.createWalls();
    } else if (levelOn === 2) {
      snakeGame.destroyWalls();
      snakeGame.levelTwo();
      snakeGame.createWalls();
    } else if (levelOn === 3) {
      snakeGame.destroyWalls();
      snakeGame.levelThree();
      snakeGame.createWalls();
    } else if (levelOn === 4) {
      snakeGame.destroyWalls();
      if(!isPaused) snakeGame.levelFour();
    }
  };
//  ----------------------- FOOD FUNCTIONS ------------------------------
  snakeGame.makeFood = function() {
    foodX = (Math.ceil(Math.random()*(boardHeight-13)))+11;
    foodY = (Math.ceil(Math.random()*(boardWidth-13)))+11;
    food.unshift([]);
    food[0].unshift('row'+foodX);
    food[0].unshift('col'+foodY);
    $food = $(`li.cell.${food[0][0]}.${food[0][1]}`);
    $food.addClass('food');

    for (let i = 0; i < walls.length; i++) {
      if(walls[i][0] === food[0][0] && walls[i][1] === food[0][1]) {
        $food.removeClass('food');
        food.shift();
        snakeGame.makeFood();
      }
    }
  };

  snakeGame.eatFood = function() {
    if(food[0][0] === front[0] && food[0][1] === front[1] ){
      $food.removeClass('food');
      $food.addClass('foodSwallowed');
      snakeGame.makeFood();
    }
  };

  snakeGame.foodHitsSnakesTail = function() {
    const $tailCell = $(`li.cell.${tail[0]}.${tail[1]}`);
    if(food[food.length-1][0] === tail[0] && food[food.length-1][1] === tail[1]){
      snake.push(food[food.length-1]);
      $tailCell.removeClass('foodSwallowed');
      food.pop();
      $tailCell.addClass('foodEaten');
      setTimeout(() => {
        $tailCell.removeClass('foodEaten');
      }, time);
      snakeGame.updateScore();
    }
  };
////------------------------------------------------------- INITIALIZING
  snakeGame.startGame = function() {
    stopGame = setInterval(() => {
      snakeGame.snakePosition();
      if (runSequence) {
        snakeGame.openingSequence();
      } else {
        snakeGame.isGameOver();
        snakeGame.eatFood();
        snakeGame.foodHitsSnakesTail();
        time = 100;
      }
    }, time);
  };

  snakeGame.createBoard();
  snakeGame.createSnake();
  snakeGame.updateScore();
  snakeGame.startGame();

/////-------------------------------- Spell out the word SNAKE with openingSequence ---------------------
  snakeGame.openingSequence = function() {
    os++;
    if (os === letterTimess[i]) {
      if (i < letterDirections.length-1) {
        growSnake = 1;
        directionKey = letterDirections[i];
        os++;
      } else {
        time = 100;
        growSnake = 0;
        destroy = 2;
        boardWidth = 57;
        snake = [1,2,3,4,5,6,7];
        setTimeout(() => {
          snakeGame.resetGame();
          runSequence = false;
          snakeGame.selectLevel();
          $levelValue.text(levelOnArray[levelOn]);
          $instructions.toggleClass('hide');
          $belowBoard.toggleClass('hide');
        }, 1300);
        isPaused = true;
        clearInterval(stopGame);
      }
      i++;
    }
  };
  $(document).keydown(snakeGame.arrowKeys);
};

$(snakeGame.setup);
