$(() => {
  const $board = $('main.board');
  const snake = [
    ['col15','row12'],
    ['col14','row12'],
    ['col13','row12'],
    ['col12','row12']
  ];

  const direction = [
  ['-1', '0'], // north
  ['0', '-1'], // west
  ['1', '0'], // south
  ['0', '1'] // east
  ];

  let directionKey = 3; // east
  let stopGame = null;
  let $ul = null;
  let $li = null;
  let $frontCell = null;
  const boardWidth = 64;
  const boardHeight = 51;
  let foodY = null;
  let foodX = null;
  let food = [];
  let time = 100;

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
    // $tailCell = $(`li.cell.${snake[snake.length-1][0]}.${snake[snake.length-1][1]}`);
    // console.log($tailCell);
  }

  function snakePosition() {
    $li = $(`li.cell.${snake[(snake.length)-1][0]}.${snake[(snake.length)-1][1]}`);
    $li.removeClass('snake');
    snake.pop();
    let col = parseInt(snake[0][0].slice(-2));
    col = col + parseInt(direction[directionKey][1]);
    const colString = 'col'+col;
    let row = parseInt(snake[0][1].slice(-2));
    row = row + parseInt(direction[directionKey][0]);
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
    snake.unshift(front);
  }

  function makeFood() {
    foodX = (Math.ceil(Math.random()*(boardHeight-13)))+11; // 51 = boardHeight 1---38  cells: 11---49
    foodY = (Math.ceil(Math.random()*(boardWidth-13)))+11; // 64 = boardWidth 1---51   cells:11---62
    food.push('col'+foodY);
    food.push('row'+foodX);
    $li = $(`li.cell.${food[0]}.${food[1]}`);
    $li.addClass('food');
  } // Gameboard 53 wide x 40 high

  function eatFood() {
    const front = snake[0];
    if(food.includes(front[0]) && food.includes(front[1])){
      $li = $(`li.cell.${food[0]}.${food[1]}`);
      $li.removeClass('food');
      $li.addClass('foodSwallowed');
    }
  }
  function foodHitsSnakesTail() {
    const tail = snake[snake.length-1];
    if(food.includes(tail[0]) && food.includes(tail[1])){
      snake.push(food);
      $li.removeClass('foodSwallowed');
      food = [];
      makeFood();
      const $tailCell = $(`li.cell.${tail[0]}.${tail[1]}`);
      $tailCell.addClass('foodEaten');
      setTimeout(() => {
        $tailCell.removeClass('foodEaten');
      }, time*2);
    }
  }

  createBoard();
  createSnake();
  makeFood();

  stopGame = setInterval(() => {
    snakePosition();
    eatFood();
    foodHitsSnakesTail();
    isGameOver();
  }, time);

  $(document).keydown(arrowKeys);
});
