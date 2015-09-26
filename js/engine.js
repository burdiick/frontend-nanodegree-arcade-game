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
    game.level.enemies.forEach(function (enemy) {
      if (game.level.player.x + (enemy.scale.x / 2) < enemy.x + enemy.scale.x && game.level.player.x + (enemy.scale.x / 2) > enemy.x) {
        if (game.level.player.y + (enemy.scale.x / 2) < enemy.y + enemy.scale.x && game.level.player.y + (enemy.scale.x / 2) > enemy.y) {
          game.level.player.lives--;
          //console.log("successfull colliision!");
          // TODO REPLACE WITH FUNCTION
          game.level.player.x = game.level.player.initX;
          game.level.player.y = game.level.player.initY;
        }
      }
    });
    game.level.items.forEach( function (item) {
      if(item.sprite != ''){
        if (game.level.player.x + (item.scale.x / 2) < item.x + item.scale.x && game.level.player.x + (item.scale.x / 2) > item.x) {
          if (game.level.player.y + (item.scale.x / 2) < item.y + item.scale.x && game.level.player.y + (item.scale.x / 2) > item.y) {
            //game.level.player.lives--;
            //console.log("successfull colliision!");
            // TODO REPLACE WITH FUNCTION
            //console.log(item);
            if (item.item == 2) {
              item.sprite = '';
              game.level.gems.collected++;
              console.log(game.level.gems.collected, game.level.gems.total);
            }

            if (item.item == 1) {
              game.level.player.x = game.level.player.prevX;
              game.level.player.y = game.level.player.prevY;
            }
            if (item.item == 7) {
              if(game.level.gems.collected == game.level.gems.total) {
                //console.log(" test", game.level.levelNumber, levels.level.length);
                game.startMenu = new Menu(2);
                globalState = 'done';

                if (game.level.levelNumber < levels.level.length) {
                  game.level.gems.collected = 0;
                  game.level = new Level(game.level.levelNumber + 1);
                } else {
                  game.level.gems.collected = 0;
                  game.level = new Level(1);
                }
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
        checkCollisions();
        game.level.enemies.forEach(function (enemy) {
          enemy.update(dt);
        });
        game.level.player.update();
        game.ui.update(game.level);
      break;
      case 'menu':
      break;
      default:
    }

  }

  canvas.addEventListener('mousedown', function (e) {

  });

  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    switch (globalState) {
    case 'run':
      game.level.render();
      renderEntities();
      game.ui.render();
      break;
    case 'startMenu':
      game.startMenu.renderStartMenu();
      break;
    case 'done':
      game.startMenu.renderDoneMenu();
    default:
    }
  }

  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    game.level.enemies.forEach(function (enemy) {
      enemy.render();
    });
    game.level.player.render();
  }

  function reset() {
    // noop
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
    'images/Rock.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developer's can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
  global.canvas = canvas;
})(this);
