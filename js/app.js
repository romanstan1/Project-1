$(() => {
  const $board = $('main.board');
  const snake = [
    ['col29','row12'],
    ['col28','row12'],
    ['col27','row12'],
    ['col26','row12'],
    ['col25','row12'],
    ['col24','row12'],
    ['col23','row12'],
    ['col22','row12'],
    ['col21','row12'],
    ['col20','row12'],
    ['col19','row12'],
    ['col18','row12'],
    ['col17','row12'],
    ['col16','row12'],
    ['col15','row12'],
    ['col14','row12'],
    ['col13','row12'],
    ['col12','row12']
  ];
  // const walls = [
  //   ['col10','row10'],
  //   ['col11','row10'],
  //   ['col12','row10'],
  //   ['col13','row10'],
  //   ['col14','row10'],
  //   ['col15','row10']
  // ];

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
  // let $nextCell = null;

  function createBoard() {
    for (let x = 10; x < 50; x++) {
      $board.append(`<ul class="block row${x}"></ul>`);
      for (let i = 10; i < 63; i++) {
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
    // $front = $(`li.cell.${snake[0][0]}.${snake[0][1]}`);
    // $front.addClass('snakeFront');
    var col = parseInt(snake[0][0].slice(-2));
    col = col + parseInt(direction[directionKey][1]);
    var colString = 'col'+col;
    var row = parseInt(snake[0][1].slice(-2));
    row = row + parseInt(direction[directionKey][0]);
    var rowString = 'row'+row;
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
    // $frontCell = $(`li.cell.${snake[0][0]}.${snake[0][1]}`);
    // $front.addClass('snakeFront');
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

  createBoard();
  createSnake();

  stopGame = setInterval(() => {
    snakePosition();
    isGameOver();
  }, 80);

  $(document).keydown(arrowKeys);
});
