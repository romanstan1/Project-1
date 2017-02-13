$(() => {
  const $board = $('section.board');
  const $scoreValue = $('div.scoreValue');
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
  ['-1', '1'], // diagnol right up
  ['1', '1'], // diagnol right down
  ['1', '-1'], // diagnol left down
  ['-1', '-1'] // diagnol left up
  ];

  // const winH = $(window).height();
  // const winW = $(window).width();
  const winH = 515;
  const winW = 800;
  const walls = [];
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
  let growSnake = 0;
  var os = 0;
  // let i = 0;
  //let shrinkSnake = 0;

  function updateScore() {
    $scoreValue.text(snake.length-8);
  }

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
    growSnake ? console.log() : snake.pop();
    //snake.pop();
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

    function levelTwo() {
      for (let i = 11; i < boardWidth; i++){
        walls.push([`col${i}`, `row11`]);
        walls.push([`col${i}`, `row${boardHeight-1}`]);
      }
      for (let i = 12; i < boardHeight; i++){
        walls.push([`col11`, `row${i}`]);
        walls.push([`col${boardWidth-1}`, `row${i}`]);
      }
    }
    levelTwo();

    



    console.log(boardWidth);
    console.log(boardHeight);





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
      updateScore();
    }
  }

////------------------------------------------------------- INITIALIZING
  createBoard();
  createSnake();
  makeFood();
  updateScore();
  createWalls();

  stopGame = setInterval(() => {
    snakePosition();
    eatFood();
    foodHitsSnakesTail();
    isGameOver();
    // openingSequence();
    // os++
    // console.log(os);
  }, time);

/////-------------------------------- Spell out the word SNAKE with openingSequence

////// DIRECTION MAP
/////   7    0    4
/////   1         3
/////   6    2    5

// const letterDirections = [3, 0, 1, 0, 3, 2, 3, 0, 5, 0, 3, 2, 3, 4, 5, 3, 0, 3, 6, 5,   3, 0, 3 ];
// const letterTimes       = [10, 4, 3, 4, 5, 8, 0, 8, 7, 8, 0, 8, 1, 4, 7, 1, 6, 3, 1, 4, 1, 3, 6];


  // function openingSequence() {
  //   const letterDirections =
  //   [3, 0, 1, 0, 3, 2, 3, 0, 5, 0, 3, 2, 3, 4, 5, 3, 0, 3, 6, 5, 3, 0, 3,   2, 1, 2];
  //   const letterTimes       =
  //   [10, 2, 3, 2, 5, 4, 0, 4, 3, 4, 0, 4, 1, 4, 3, 1, 3, 3, 1, 2, 1, 3.5, 3, 1.5, 1];
  //   let i = 0;
  //   //var snakeTimer;
  //   const writeSnake = function() {
  //     console.log(letterDirections[i]);
  //     console.log(letterTimes[i]);
  //     if ( i < letterDirections.length) {
  //       //console.log('Interval CLEARED?');
  //       // return clearTimeout(snakeTimer);
  //       growSnake = 1;
  //       directionKey = letterDirections[i];
  //       setTimeout(writeSnake, time*(letterTimes[i])+50);
  //       console.log('i='+i);
  //       i++;
  //     } else {
  //       console.log('Interval CLEARED?');
  //       growSnake = 0;
  //     }
  //     //snakeTimer = setTimeout(writeSnake, letterTimes[i]);
  //   };
  //   setTimeout(writeSnake, 50);
  // }
  let i = 0;
  const letterDirections =
  [3, 0, 1, 0, 3, 2, 3, 0, 5, 0, 3, 2, 3, 4, 5, 3, 0, 3, 6, 5, 3, 0, 3,   2, 1, 2];
  const letterTimes       =
  [10, 22, 25, 2, 5, 4, 0, 4, 3, 4, 0, 4, 1, 4, 3, 1, 3, 3, 1, 2, 1, 3.5, 3, 1.5, 1];

  function openingSequence() {
    if (os === letterTimes[i]) {
      if (i < letterDirections.length) {
        growSnake = 1;
        directionKey = letterDirections[i];
        os++;
      } else {
        growSnake = 0;
      }
      i++;
    }
  }




  // openingSequence();

  $(document).keydown(arrowKeys);
});
