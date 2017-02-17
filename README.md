# Project-1

# Snake

###GA WDI London - Project 1

This version of Snake has four game options/levels:

1. 'Snake 2' with hollow walls.
2. 'Classic Snake' with solid walls.
3. 'Some walls' in the middle of the board and on the edge.
4. 'Bombs' that randomly appear on the game board.

You can toggle through the levels using the the X and Z keys (only when the game is paused).

#####[Play it here!](https://snakegame-wdi-one.herokuapp.com/ "Here!")



#####Rules

1. Use the arrow keys to direct the snake around the board.
2. Use the spacebar key to pause/play the game at any point.
3. Eat as many food cells as possible that add to your current score.
4. Your highest score is recorded from your overall game session and displayed.
5. If you hit into any wall or your tail then the game is over!


####Approach / How it works

The snake is an array of X and Y coordinates. As each timed interval passes, the snake array adds a cell (and its X and Y coordinate) onto the front of the snake and pops the last cell off the end of the snake. This gives the illusion that the snake is moving forwards.

For every timed interval that passes, the snake, wall and food arrays are checked against the front of the snake cell, with necessary actions taken upon each event.

If the front of the snake hits the the walls or snake cells, an animation is run that 'burns' the game board, checks your score against the high score array, and then subsequently resets the game.

####The build

* HTML 5, CSS, JavaScript jQuery were used to create this game.
* Animation was created using the style.css stylesheet and through its app.js file.
* The Google Web Font 'Space Mono' has been used to style the game.


####Problems and Challenges

The most difficult challenge I faced building this game, was creating the opening sequence animation that spells out the word SNAKE using the snake itself.

This was done through carefully calibrated directions that are given to the snake, that are fired once specific time intervals have passed.
