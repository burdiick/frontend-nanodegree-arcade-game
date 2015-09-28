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
    //console.log(game.level.offset.x);
    if ( game.level.player.x + game.level.player.scale.x > game.level.map[game.level.mapSize.cols].scale.x * game.level.mapSize.cols) {
      game.level.player.x = game.level.player.prevX;
    }else if ( game.level.player.x < 0) {
      game.level.player.x = game.level.player.prevX;
    }
    if ( game.level.player.y + (game.level.player.scale.x * 1.15) > game.level.map[game.level.mapSize.cols * game.level.mapSize.rows - 1].scale.x * (game.level.mapSize.rows - 1)) {
      game.level.player.y = game.level.player.prevY;
    }else if ( game.level.player.y + (game.level.player.scale.x * 0.15) < 0) {
      game.level.player.y = game.level.player.prevY;
    }
    game.level.enemies.forEach(function (enemy) {
      if (game.level.player.x + (enemy.scale.x * 0.7) < enemy.x + enemy.scale.x && game.level.player.x + (enemy.scale.x * 0.7) > enemy.x) {
        if (game.level.player.y + (enemy.scale.x * 0.7) < enemy.y + enemy.scale.x && game.level.player.y + (enemy.scale.x * 0.7) > enemy.y) {

          //console.log("successfull colliision!");
          // TODO REPLACE WITH FUNCTION
          if(game.level.player.status !== 'dead') {
            console.log(game.level.player.status);
            game.level.player.lives--;
            game.level.player.die();
            game.menu.addMessage('BUMMER!', 'h0-red');
            console.log(game.level.player.status);
          }
        }
      }
    });
    game.level.map.some( function (block) {
      if(!block.walkable) {
        if (game.level.player.x + (block.scale.x * 0.5) < block.x + block.scale.x && game.level.player.x + (block.scale.x * 0.5) > block.x) {
          if (game.level.player.y + (block.scale.x * 0.8) < block.y + block.scale.x && game.level.player.y + (block.scale.x * 0.8) > block.y) {
            if(game.level.player.prevX != game.level.player.x) {
              game.level.player.x = game.level.player.prevX;
            }
            if (game.level.player.prevY != game.level.player.y){
              game.level.player.y = game.level.player.prevY;
            }
          }
        }
      }
    });
    game.level.items.some( function (item) {
      if(item.sprite != ''){
        if (game.level.player.x + (item.scale.x * 0.7) < item.x + item.scale.x && game.level.player.x + (item.scale.x * 0.7) > item.x) {
          if (game.level.player.y + (item.scale.x * 0.7) < item.y + item.scale.x && game.level.player.y + (item.scale.x * 0.7) > item.y) {
            // TODO REPLACE WITH FUNCTION
            if (item.item == 2) {
              item.sprite = '';
              game.level.gems.collected++;
              console.log(game.level.gems.collected, game.level.gems.total);
              game.menu.addMessage(game.level.gems.collected + ' / ' + game.level.gems.total, 'h0');
            }

            if (item.item == 7) {
              if(game.level.gems.collected >= game.level.gems.total) {
                game.level.gems.collected = 0;
                globalState = 'done';
                console.log(game.level, levels.level[game.level.levelNumber]);
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
      case 'menu':
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
    'images/Selector.png',
    'images/Star.png',
    'images/gem-blue.png',
    'images/Rock.png',
    'images/background-one.jpg',
    'images/char-boy-dead.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developer's can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
  global.canvas = canvas;
})(this);
