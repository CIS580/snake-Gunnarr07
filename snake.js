/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var snakeArr = [];
var snakeDiminsion = 10;

var x = 76;
var y = 20;

snakeArr.push({ x: 76, y: y });
snakeArr.push({ x: 74, y: y });
snakeArr.push({ x: 72, y: y });
snakeArr.push({ x: 70, y: y });
snakeArr.push({ x: 68, y: y });
snakeArr.push({ x: 66, y: y });
snakeArr.push({ x: 64, y: y });

var appleCord = { x: Math.round(Math.floor(Math.random() * (backBuffer.width - 24))), y: Math.round(Math.floor(Math.random() * (backBuffer.height - 14))) };
var appleDiminsion = 20;
var eaten = false;
var score = 0;
var idScore = document.getElementById('id_score');

var rocks = [];
var rockDiminsion = 20;
var rockCord;

var paused = false;
var idPaused = document.getElementById('id_paused');

//the direction of the snake
var input = {
    up: false,
    left: false,
    right: false,
    down: false,
}

function generateRocks() {
    for (var i = 0; i < 20; i++) {
        rockCord = { x: Math.round(Math.floor(Math.random() * (backBuffer.width - 24))), y: Math.round(Math.floor(Math.random() * (backBuffer.height - 14))) };

        //check if the rock will collide with snake
        snakeArr.forEach(function (snake) {
            while (snake.x < rockCord.x + rockDiminsion && snake.x + snakeDiminsion > rockCord.x &&
                snake.y < rockCord.y + rockDiminsion && snakeDiminsion + snake.y > rockCord.y) {

                rockCord = { x: Math.round(Math.floor(Math.random() * (backBuffer.width - 24))), y: Math.round(Math.floor(Math.random() * (backBuffer.height - 14))) };
            }
        })

        rocks.forEach(function (rock) {
            //check if new rock will collide with any previous built rocks

            /**
              * Rectangle collision algorithm found at MDN documentation
              * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
              */
            while (rockCord.x < appleCord.x + appleDiminsion && rockCord.x + rockDiminsion > appleCord.x &&
                rockCord.y < appleCord.y + appleDiminsion && rockDiminsion + rockCord.y > appleCord.y) {

                rockCord = { x: Math.round(Math.floor(Math.random() * (backBuffer.width - 24))), y: Math.round(Math.floor(Math.random() * (backBuffer.height - 14))) };
            }
            /**
              * Rectangle collision algorithm found at MDN documentation
              * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
              */
            //check if new rock will collide with any previous built rocks
            while (rock.x < rockCord.x + rockDiminsion && rock.x + rockDiminsion > rockCord.x &&
                rock.y < rockCord.y + rockDiminsion && rockDiminsion + rock.y > rockCord.y) {

                rockCord = { x: Math.round(Math.floor(Math.random() * (backBuffer.width - 24))), y: Math.round(Math.floor(Math.random() * (backBuffer.height - 14))) };
            }
        })

        rocks.push({ x: rockCord.x, y: rockCord.y });
    }
}
generateRocks();

//checks for key down event and sets the direction of the snake
window.onkeydown = function (event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 38:
        case 87:
            if (!input.down) {
                input.up = true;
                input.left = false;
                input.right = false;
                input.down = false;
            }
            break;
        case 37:
        case 65:
            if (!input.right) {
                input.left = true;
                input.right = false;
                input.down = false;
                input.up = false;
            }
            break;
        case 39:
        case 68:
            if (!input.left) {
                input.right = true;
                input.left = false;
                input.up = false;
                input.down = false;
            }
            break;
        case 40:
        case 83:
            if (!input.up) {
                input.down = true;
                input.up = false;
                input.right = false;
                input.left = false;
            }
            break;
        case 27:
            if (paused) {
                idPaused.style.display = "none"
                paused = false;
            }
            else {
                paused = true;
                idPaused.style.display = "block";
            }
            break;
    }
}

//restarts the game if the player lost
function restart() {
    location.reload();
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
    var elapsedTime = newTime - oldTime;
    oldTime = newTime;

    if (!paused) {
        update(elapsedTime);
    }

    render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

    // TODO: Spawn an apple periodically
    if (eaten) {
        appleCord = { x: Math.round(Math.floor(Math.random() * (backBuffer.width - 30))), y: Math.round(Math.floor(Math.random() * (backBuffer.height - 20))) };
        eaten = false;
    }

    // TODO: Move the snake
    if ((input.up || input.down || input.left || input.right)) {
        
        if (input.up && !input.right && !input.left) y -= 2;
        if (input.down && !input.right && !input.left) y += 2;
        if (input.left && !input.up && !input.down) x -= 2;
        if (input.right && !input.up && !input.down) x += 2;
                
        var tail = snakeArr.pop();
        var tmpTail = tail;
        tail.x = x;
        tail.y = y;
        snakeArr.unshift({ x: tail.x, y: tail.y });
    }

    // TODO: Determine if the snake has moved out-of-bounds (offscreen)
    if (snakeArr[0].x <= 0 || snakeArr[0].x >= backBuffer.width || snakeArr[0].y <= 0 || snakeArr[0].y >= backBuffer.height) {
        paused = true;
        document.getElementById("id_restart").style.display = 'block';
    }

    // TODO: Determine if the snake has eaten an apple
    /**
      * Rectangle collision algorithm found at MDN documentation
      * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
      */
    if(snakeArr[0].x < appleCord.x + appleDiminsion && snakeArr[0].x + snakeDiminsion > appleCord.x &&
        snakeArr[0].y < appleCord.y + appleDiminsion && snakeDiminsion + snakeArr[0].y > appleCord.y) {

        if (input.up && !input.right && !input.left) {
            snakeArr.push({ x: tmpTail.x, y: tmpTail.y - 2 });
            snakeArr.push({ x: tmpTail.x, y: tmpTail.y - 2 });
        }
        if (input.down && !input.right && !input.left) {
            snakeArr.push({ x: tmpTail.x, y: tmpTail.y + 2 });
            snakeArr.push({ x: tmpTail.x, y: tmpTail.y + 2 });
        }
        if (input.left && !input.up && !input.down) {
            snakeArr.push({ x: tmpTail.x + 2, y: tmpTail.y });
            snakeArr.push({ x: tmpTail.x + 2, y: tmpTail.y });
        }
        if (input.right && !input.up && !input.down) {
            snakeArr.push({ x: tmpTail.x - 2, y: tmpTail.y });
            snakeArr.push({ x: tmpTail.x - 2, y: tmpTail.y });
        }
        eaten = true;
        score += 10;
        idScore.innerText = "Score: " + score;
    }

    // TODO: Determine if the snake has eaten its tail
    

    // TODO: [Extra Credit] Determine if the snake has run into an obstacle
    rocks.forEach(function (rock) {
        /**
          * Rectangle collision algorithm found at MDN documentation
          * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
          */
        if (snakeArr[0].x < rock.x + rockDiminsion && snakeArr[0].x + snakeDiminsion > rock.x &&
            snakeArr[0].y < rock.y + rockDiminsion && snakeDiminsion + snakeArr[0].y > rock.y) {

            paused = true;
            document.getElementById("id_restart").style.display = 'block';
        }
    })
}


function collision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
        return true;
    }
    else {
        return false;
    }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
    backCtx.fillStyle = "grey";
    backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

    // TODO: Draw the game objects into the backBuffer
    backCtx.fillStyle = "red";
    backCtx.fillRect(appleCord.x, appleCord.y, appleDiminsion, appleDiminsion)
    
    rocks.forEach(function (rock) {
        backCtx.fillStyle = "saddlebrown";
        backCtx.fillRect(rock.x, rock.y, rockDiminsion, rockDiminsion);
    });
    
    snakeArr.forEach(function (arr) {
        backCtx.fillStyle = "green";
        backCtx.fillRect(arr.x, arr.y, snakeDiminsion, snakeDiminsion);
    });

    //switch buffers
    frontCtx.drawImage(backBuffer, 0, 0);
}

/* Launch the game */
window.requestAnimationFrame(loop);
