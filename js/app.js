// Enemies our player must avoid
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var LevelObject = function(object, scaleX, scaleY, sprite) {
  this.sprite = sprite;
  this.x = object.x * scaleX;
  console.log(object.x);
  this.y = object.y * (scaleX * 0.79);
  this.scaleX = scaleX;
  this.scaleY = scaleY;
  this.speed = object.speed;

}

LevelObject.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.scaleX, this.scaleY);
}

var Enemy = function (enemy, scaleX, scaleY) {
  LevelObject.call(this, enemy, scaleX, scaleY, 'images/enemy-bug.png');
  console.log(this.x);
  this.y = this.y - 25;
  this.path = enemy.path;
  this.currentWaypoint = enemy.path[0];
  console.log(enemy.type);
};
Enemy.prototype = Object.create(LevelObject.prototype);
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

};

var Player = function (player, scaleX, scaleY) {
  LevelObject.call(this, player, scaleX, scaleY,
  'images/char-boy.png');
  this.y = this.y - 15;
  this.movement = {
    'move': ''
  };
};
Player.prototype = Object.create(LevelObject.prototype);

Player.prototype.setX = function (multiplier) {
  return multiplier * this.scaleX;
};

Player.prototype.getX = function () {
  return this.x / this.scaleX;
};

Player.prototype.setY = function (multiplier) {
  return multiplier * (this.scaleX * 0.79);
};

Player.prototype.getY = function () {
  return this.y / (this.scaleX * 0.79);
};

Player.prototype.update = function () {
  if (this.movement === 'left' && this.getX() > 0) {
    this.x = this.setX(this.getX() - 1);
    console.log(this.x);
  } else if (this.movement === 'right' && this.getX() < 4) {
    this.x = this.setX(this.getX() + 1);
    console.log(level.mapSize.rows);
  } else if (this.movement === 'up' && this.getY() > 0) {
    this.y = this.setY(this.getY() - 1);
    console.log(this.y);
  } else if (this.movement === 'down' && this.getY() + 1 < 5) {
    this.y = this.setY(this.getY() + 1);
    console.log(this.y);
  }
  this.movement = '';
};

//Player.prototype.render = function () {
//  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
//};

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
      'speed': 0,
      'x': 0,
      'y': 1,         // Movement speed
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
      'x': 4,
      'y': 3,
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
  }, {
    'number': 1,          // Level number
    'mapSize': {          // Size of map in squares
      'rows': 6,
      'cols': 10
    },
    'map': [              // Array holding map layout.
      0, 0, 0, 0, 0,0,0,0,0,0,
      1, 1, 1, 1, 1,0,0,0,0,0,
      1, 2, 2, 1, 2,0,0,0,0,0,
      1, 2, 2, 2, 2,0,0,0,0,0,
      1, 1, 2, 2, 1,0,0,0,0,0,
      1, 1, 2, 2, 1,0,0,0,0,0
    ],
    'enemies': [{         // Data to instantiate enemies
      'type': 'red-bug',  // Enemy type
      'speed': 0,         // Movement speed
      'x': 4,
      'y': 3,
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
      'x': 10,
      'y': 6,
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
  this.scaleX = 0;
  this.scaleY = 0;
  if ((this.mapSize.cols / this.mapSize.rows) < CANVAS_WIDTH / CANVAS_HEIGHT) {
    this.scaleX = CANVAS_HEIGHT / this.mapSize.rows;
    this.scaleY = this.scaleX * 1.59;
  } else {
    this.scaleX = CANVAS_WIDTH / this.mapSize.cols;
    console.log(this.mapSize.cols, this.scaleX);
    this.scaleY = this.scaleX * 1.59;
  }

  this.enemies = level.enemies.map(function (enemy, scaleX, scaleY) {
    console.log(this.scaleX + "In level create");
    return new Enemy(enemy, 101, 171);
  });
  this.player = new Player(level.player, 101, 171);
  this.helpText = level.helpText;

  console.log(this.scaleX);
}

Level.prototype.setScale = function() {

}

Level.prototype.render = function() {
  var rowImages = [
          'images/water-block.png',   // water block
          'images/stone-block.png',   // Stone Block
          'images/grass-block.png'    // Grass Block
      ];


  for (var row = 0; row < this.mapSize.rows; row++) {
      for (var col = 0; col < this.mapSize.cols; col++) {
          ctx.drawImage(
            Resources.get(rowImages[this.map[col + (row * this.mapSize.cols)]]),
            col * this.scaleX,
            row * this.scaleY * 0.5, this.scaleX,
             this.scaleY); // 0.78 and 1.59 hard coded based on image sizes. Should never change, but not ideal.
      }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var level = new Level(2);

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
