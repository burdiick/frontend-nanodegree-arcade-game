'use strict';
// Engine.js
var Engine = (function (global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  doc.body.appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */

    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateEntities(dt);
  }

  function checkCollisions() {
    console.log();

    // Set size of player hitbox.
    var padding = {
      'x': game.level.player.scale.x * 0.4,
      'y': game.level.player.scale.x * 0.9
    };

    // Store player corners to shorter/easier to read variables
    var topLeft = {
      'x': game.level.player.x + game.level.offset.x + padding.x,
      'y': game.level.player.y + game.level.offset.y + padding.y
    };
    var bottomLeft = {
      'x': game.level.player.x + game.level.offset.x  + padding.x,
      'y': game.level.player.y + game.level.player.scale.x + game.level.offset.y - scale(20)
    };
    //console.log(bottomLeft);
    var topRight = {
      'x': game.level.player.x + game.level.player.scale.x + game.level.offset.x - padding.x,
      'y': game.level.player.y + game.level.offset.y + padding.y
    };
    var bottomRight = {
      'x': game.level.player.x + game.level.player.scale.x + game.level.offset.x - padding.x,
      'y': game.level.player.y + game.level.player.scale.x + game.level.offset.y - scale(20)
    };

    // Set bounding box of the level
    var level = {
      'width': game.level.mapSize.cols * game.level.scale.x,
      'height': game.level.mapSize.rows * (game.level.scale.x)
    };

    // Check for player collisions with outside edge.
    // TODO Still not ideal. Hacked badly, but working.
    // Player top left corner Y Check
    if (topLeft.x > game.level.offset.x && topLeft.x < game.level.offset.x + game.level.width &&
    topLeft.y < game.level.offset.y) {
      stopPlayer();
    }
    // Player bottom left corner Y Check
    if (bottomLeft.x > game.level.offset.x && bottomLeft.x < game.level.offset.x + game.level.width && bottomLeft.y > (game.level.height + (game.level.offset.y)) ) {
    //console.log('hmmmm');
      stopPlayer();
    };
    // Player top left corner X check
    if (topLeft.y > game.level.offset.y && topLeft.y < game.level.offset.y + game.level.height &&
    topLeft.x < game.level.offset.x) {
      stopPlayer();
    }
    // Player top right corner X check
    if (topRight.y > game.level.offset.y && topRight.y < game.level.offset.y + game.level.height && topRight.x > game.level.offset.x + game.level.width) {
      stopPlayer();
    }

    // Check player collisions with enemies.
    // TODO Refactor to same patern as level object collisions.
    game.level.enemies.forEach(function (enemy) {
      if (game.level.player.x + (enemy.scale.x * 0.7) < enemy.x + enemy.scale.x && game.level.player.x + (enemy.scale.x * 0.7) > enemy.x) {
        if (game.level.player.y + (enemy.scale.x * 0.7) < enemy.y + enemy.scale.x && game.level.player.y + (enemy.scale.x * 0.7) > enemy.y) {
          if (game.level.player.status !== 'dead') {

            console.log(game.level.player.status);
            game.level.player.lives--;
            game.level.player.die();
            game.menu.addMessage('BUMMER!', 'h0-red');
            //console.log(game.level.player.status);
          }
        }
      }
    });

    // Set variables for the corners of each block.
    // For customization and ease of use/comprehention
    game.level.map.some(function (block) {
      if (!block.walkable) {
        var blockTopLeft = {
          'x': block.x + game.level.offset.x,
          'y': block.y + game.level.offset.y
        }
        var blockBottomLeft = {
          'x': block.x + game.level.offset.x,
          'y': block.y + block.scale.x + game.level.offset.y
        }
        var blockTopRight = {
          'x': block.x + block.scale.x + game.level.offset.x,
          'y': block.y + game.level.offset.y
        }
        var blockBottomRight = {
          'x': block.x + block.scale.x + game.level.offset.x,
          'y': block.y + block.scale.x + game.level.offset.y
        }
        //console.log(topLeft, topRight, bottomLeft, bottomRight, 'Character');
        //console.log(blockTopLeft, blockTopRight, blockBottomLeft, blockBottomRight, 'block');

        // Check for Player collisions with block
        if (topLeft.x > blockTopLeft.x && topLeft.x < blockTopRight.x &&
        topLeft.y > blockTopLeft.y && topLeft.y < blockBottomLeft.y) {
          stopPlayer();
        } else if (topRight.x > blockTopLeft.x && topRight.x < blockTopRight.x &&
        topRight.y > blockTopLeft.y && topRight.y < blockBottomLeft.y) {
          stopPlayer();
        } else if (bottomRight.x > blockBottomLeft.x && bottomRight.x < blockBottomRight.x &&
        bottomRight.y > blockTopLeft.y && bottomRight.y < blockBottomLeft.y) {
          stopPlayer();
        } else if (bottomLeft.x > blockTopLeft.x && bottomLeft.x < blockTopRight.x &&
        bottomLeft.y > blockTopLeft.y && bottomLeft.y < blockBottomLeft.y) {
          stopPlayer();
        }
      }
    });

    // Check for player collision with Items.
    // Refactor to same patern as player/level object collisions
    game.level.items.some(function (item) {
      // TODO Refactor item creation so there arent any empty items in the array.
      if (item.sprite != '') {
        if (game.level.player.x + (item.scale.x * 0.5) < item.x + item.scale.x && game.level.player.x + (item.scale.x * 0.5) > item.x) {
          if (game.level.player.y + (item.scale.x * 0.5) < item.y + item.scale.x && game.level.player.y + (item.scale.x * 0.5) > item.y) {
            if (item.item == 2) {
              item.sprite = '';
              game.level.gems.collected++;
              //console.log(game.level.gems.collected, game.level.gems.total);
              game.menu.addMessage(game.level.gems.collected + ' / ' + game.level.gems.total, 'h0');
            }
            if (item.item == 3) {
              item.sprite = '';
              game.level.player.keys++;
            }
            if (item.item == 4) {
              if (game.level.player.keys > 0) {
                //game.level.player.keys--;
                item.sprite = 'images/gate-open.png';

              } else {
                if (game.level.player.prevX != game.level.player.x) {

                  game.level.player.x = game.level.player.prevX;
                }
                if (game.level.player.prevY != game.level.player.y) {
                  game.level.player.y = game.level.player.prevY;
                }
              }
            }
            if (item.item == 7) {
              if (game.level.gems.collected >= game.level.gems.total) {
                game.level.gems.collected = 0;
                globalState = 'done';
                //console.log(game.level, levels.level[game.level.levelNumber]);
                levels.level[game.level.levelNumber - 1].completed = 1;
                game.menu = new DoneMenu();
                return true;
              }
            }
          }
        }
      }
    });
  }

  function updateEntities(dt) {
    switch (globalState) {
    case 'run':
      game.level.enemies.forEach(function (enemy) {
        enemy.update(dt);
      });
      game.level.player.update(dt);
      if (globalState === 'run') {
        game.menu.update(game.level, dt);
        checkCollisions();
      }
      break;
    default:
    }

  }

  function render() {
    switch (globalState) {
    case 'run':
      game.level.render();
      renderEntities();
      game.menu.renderUserInterface();
      break;
    case 'startMenu':
      game.menu.startMenuRender();
      break;
    case 'done':
      game.menu.renderDoneMenu();
      break;
    case 'gameOver':
      game.menu.renderGameOverMenu();
      break;
    case 'pause':
      game.menu.renderPauseMenu();
      break;
    default:
    }
  }

  function renderEntities() {
    game.level.enemies.forEach(function (enemy) {
      enemy.render();
    });
    game.level.player.render();
  }

  function reset() {

  }


  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/Selector.png',
    'images/Star.png',
    'images/gem-blue.png',
    'images/Rock.png',
    'images/background-one.jpg',
    'images/char-boy-dead.png',
    'images/char-cat-girl-dead.png',
    'images/char-horn-girl-dead.png',
    'images/char-pink-girl-dead.png',
    'images/char-princess-girl-dead.png',
    'images/pause-button.png',
    'images/button.png',
    'images/Key.png',
    'images/gate-closed.png',
    'images/gate-open.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developer's can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
  global.canvas = canvas;
})(this);
