// Enemies our player must avoid
var CANVAS_WIDTH = 505;
var CANVAS_HEIGHT = 606;

var Enemy = function (enemy) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = 100 * enemy.path[0].x;
  this.y = 82 * enemy.path[0].y - 10;
  this.speed = enemy.speed;
  this.path = enemy.path;
  this.currentWaypoint = enemy.path[0];
  console.log(enemy.type);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y) {
  this.sprite = 'images/char-boy.png';
  this.x = this.setX(x);
  this.y = this.setY(y) - 10;
  this.movement = {
    'move': ''
  };
};

Player.prototype.setX = function (multiplier) {
  return multiplier * 101;
};

Player.prototype.getX = function () {
  return this.x / 101;
};

Player.prototype.setY = function (multiplier) {
  return multiplier * 82;
};

Player.prototype.getY = function () {
  return this.y / 82;
};

Player.prototype.update = function () {
  if (this.movement === 'left' && this.getX() > 0) {
    this.x = this.setX(this.getX() - 1);
    console.log(this.x);
  } else if (this.movement === 'right' && this.getX() < 5) {
    this.x = this.setX(this.getX() + 1);
    console.log(level.mapSize.x);
  } else if (this.movement === 'up' && this.getY() > 0) {
    this.y = this.setY(this.getY() - 1);
    console.log(this.y);
  } else if (this.movement === 'down' && this.getY() < 6) {
    this.y = this.setY(this.getY() + 1);
    console.log(this.y);
  }
  this.movement = '';
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
  this.movement = key;
};

/*
* Object used to create and store levels.
* Holds the map, enemies info and player locations.
*
*/
var levels = {
  'level': [{
    'number': 1,          // Level number
    'mapSize': {          // Size of map in squares
      'rows': 6,
      'cols': 5
    },
    'map': [              // Array holding map layout.
      0, 0, 0, 0, 0,
      1, 1, 1, 1, 1,
      1, 2, 2, 1, 2,
      1, 2, 2, 2, 2,
      1, 1, 2, 2, 1,
      1, 1, 2, 2, 1
    ],
    'enemies': [{         // Data to instantiate enemies
      'type': 'red-bug',  // Enemy type
      'speed': 0,         // Movement speed
      'path': [{          // Array of grid locations to use as waypoints
        'x': 0,
        'y': 1
      }, {
        'x': 4,
        'y': 1
      }]
    }, {
      'type': 'red-bug',
      'speed': 2,
      'path': [{
        'x': 4,
        'y': 3
      }, {
        'x': 4,
        'y': 1
      }],
    }],
    'player': {           // Data to set player location for map
      'x': 2,
      'y': 5
    },
    'helpText': 'Navigate to the water. Watch out for bugs!'
  }]
};

var Level = function(number) {
  var level = levels.level[number - 1];

  this.levelNumber = number;
  this.mapSize = level.mapSize;
  this.map = level.map;
  this.enemies = level.enemies.map(function (enemy) {
    console.log(enemy);
    return new Enemy(enemy);
  });
  this.player = new Player(level.player.x, level.player.y);
  this.helpText = level.helpText;
  this.scaleX = CANVAS_WIDTH / level.mapSize.cols;
  this.scaleY = CANVAS_HEIGHT / level.mapSize.rows;
  console.log(this.scaleX);
}

Level.prototype.render = function() {
  var rowImages = [
          'images/water-block.png',   // water block
          'images/stone-block.png',   // Stone Block
          'images/grass-block.png'    // Grass Block
      ];


  for (var row = 0; row < this.mapSize.rows; row++) {
      for (var col = 0; col < this.mapSize.cols; col++) {
          ctx.drawImage(Resources.get(rowImages[this.map[col + (row * this.mapSize.cols)]]), col * 101, row * 83, 101, 108 * 1.59064327);
      }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var level = new Level(1);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  console.log(allowedKeys[e.keyCode]);
  level.player.handleInput(allowedKeys[e.keyCode]);
});
