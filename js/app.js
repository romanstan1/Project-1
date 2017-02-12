$(() => {
  const $board = $('section.board');
  const snake = [
    ['col19','row32'],
    ['col18','row32'],
    ['col17','row32'],
    ['col16','row32'],
    ['col15','row32'],
    ['col14','row32'],
    ['col13','row32'],
    ['col12','row32']
  ];

  const direction = [
  ['-1', '0'], // north
  ['0', '-1'], // west
  ['1', '0'], // south
  ['0', '1'], // east
  ['1', '-1'], // diagnol right up
  ['1', '1'], // diagnol right down
  ['-1', '1'], // diagnol left down
  ['-1', '-1'] // diagnol left up
  ];

  const winH = $(window).height();
  const winW = $(window).width();
  let walls = [];
  let directionKey = 3; // east
  let stopGame = null;
  let $ul = null;
  let $li = null;
  let $frontCell = null;
  const boardWidth = Math.round(winW/15)+10;
  const boardHeight = Math.round(winH/15)+6;
  let foodY = null;
  let foodX = null;
  const food = [];
  const time = 100;

  function createBoard() {
    for (let x = 11; x < boardHeight; x++) {
      $board.append(`<ul class="block row${x}"></ul>`);
      for (let i = 11; i < boardWidth; i++) {
        $ul = $(`ul.block.row${x}`);
        $ul.append(`<li class="cell col${i} row${x}"></li>`);
      }
    }
  }

  function createSnake() {
    for (let i = 0; i < snake.length; i++) {
      $li = $(`li.cell.${snake[i][0]}.${snake[i][1]}`);
      $li.addClass('snake');
    }
  }

  function snakePosition() {
    $li = $(`li.cell.${snake[(snake.length)-1][0]}.${snake[(snake.length)-1][1]}`);
    $li.removeClass('snake');
    snake.pop();
    let col = parseInt(snake[0][0].slice(-2));
    col = col + parseInt(direction[directionKey][1]);
    if(col>=boardWidth) {
      col = (col - boardWidth)+11;
    } else if (col<=10) {
      col = (boardWidth -1);
    }
    const colString = 'col'+col;
    let row = parseInt(snake[0][1].slice(-2));
    row = row + parseInt(direction[directionKey][0]);
    if(row >= boardHeight) {
      row = (row - boardHeight)+11;
    } else if (row <= 10) {
      row = (boardHeight - 1);
    }
    const rowString = 'row'+row;
    snake.unshift([colString, rowString]);
    createSnake();
  }

  function arrowKeys(e) {
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
    }
  }

  function isGameOver() {
    const front = snake[0];
    snake.shift();
    for (let i = 0; i<snake.length; i++) {
      if(snake[i].includes(front[0]) && snake[i].includes(front[1])) {
        clearInterval(stopGame);
        $frontCell = $(`li.cell.${snake[0][0]}.${snake[0][1]}`);
        $frontCell.addClass('snakeFront');
      }
    }
    for (let i = 0; i<walls.length; i++) {
      if(walls[i].includes(front[0]) && walls[i].includes(front[1])) {
        clearInterval(stopGame);
        $frontCell = $(`li.cell.${snake[0][0]}.${snake[0][1]}`);
        $frontCell.addClass('snakeFront');
      }
    }
    snake.unshift(front);
  }

  function createWalls() {
    walls = [
    ['col17','row11'],
    ['col16','row11'],
    ['col15','row11'],
    ['col14','row11'],
    ['col13','row11'],
    ['col12','row11'],
    ['col11','row11']
    ];

    for (let i = 0; i < walls.length; i++) {
      $li = $(`li.cell.${walls[i][0]}.${walls[i][1]}`);
      $li.addClass('walls');
    }
  }

///// ----------------------------------------------------- FOOD FUNCTIONS
  function makeFood() {
    foodX = (Math.ceil(Math.random()*(boardHeight-13)))+11;
    foodY = (Math.ceil(Math.random()*(boardWidth-13)))+11;
    //let fl = food.length;
    food.unshift([]);
    food[0].unshift('col'+foodY);
    food[0].unshift('row'+foodX);
    $li = $(`li.cell.${food[0][0]}.${food[0][1]}`);
    $li.addClass('food');
  }

  function eatFood() {
    const front = snake[0];
    if(food[0].includes(front[0]) && food[0].includes(front[1])){
      $li = $(`li.cell.${food[0][0]}.${food[0][1]}`);
      $li.removeClass('food');
      $li.addClass('foodSwallowed');
      //food.pop();
      makeFood();
      console.log(food);
    }
  }
  function foodHitsSnakesTail() {
    const tail = snake[snake.length-1];
    const $tailCell = $(`li.cell.${tail[0]}.${tail[1]}`);
    if(food[food.length-1].includes(tail[0]) && food[food.length-1].includes(tail[1])){
      snake.push(food[food.length-1]);
      $tailCell.removeClass('foodSwallowed');
      food.pop();
      $tailCell.addClass('foodEaten');
      setTimeout(() => {
        $tailCell.removeClass('foodEaten');
      }, time*2);
    }
  }

////------------------------------------------------------- INITIALIZING
  createBoard();
  createSnake();
  makeFood();
  //createWalls();

  stopGame = setInterval(() => {
    snakePosition();
    eatFood();
    foodHitsSnakesTail();
    isGameOver();
  }, time);

/////-------------------------------- Spell out the word SNAKE with openingSequence

////// DIRECTION MAP
/////   7    0    4
/////   1         3
/////   6    2    5

  function openingSequence() {
    const letterDirections = [0, 1, 0, 3, 0, 0, 0, 0];
    const letterTimes     = [10, 20, 3, 2, 18, 12, 9, 10];
    let i = 0;

    const writeSnake = function() {
      directionKey = letterDirections[i];
      snakeTimer = setInterval(writeSnake, time*letterTimes[i]);
      i++;
      if ( i-1 > letterDirections[i]) {
        clearInterval(snakeTimer);
        console.log('Interval CLEARED?');
      }
    };

    let snakeTimer = setInterval(writeSnake, time*letterTimes[i]);

  }

  //openingSequence();

  $(document).keydown(arrowKeys);
});
