// Enemies our player must avoid
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var UserInterface = function (lives, help, num) {
  this.lives = {
    'text': lives,
    'x': 10,
    'y': 60,
    'width': 100
  };
  this.help = {
    'text': help,
    'x': 10,
    'y': 560,
    'width': 600
  };
  this.number = {
    'text': num,
    'x': 10,
    'y': 30,
    'width': 100
  };

}

UserInterface.prototype.render = function () {
  this.drawText('Level: ', this.number);
  this.drawText('Lives: ', this.lives);
  this.drawText('Goal: ', this.help);
}

UserInterface.prototype.update = function (currentLevel) {
  this.lives = currentLevel.player.lives;
  this.help = currentLevel.helpText;
  this.number = currentLevel.levelNumber;
}

UserInterface.prototype.drawText = function (text, obj) {
  ctx.fillStyle = "#1F1F1F";
  ctx.globalAlpha = 0.6;
  ctx.fillRect(0, obj.y - 15, obj.x + obj.width - 10, 20);
  ctx.globalAlpha = 1;
  this.setFont('shadow');
  ctx.fillText(text + obj.text, obj.x + 2, obj.y + 2, obj.width, 30);
  this.setFont('h1');
  ctx.fillText(text + obj.text, obj.x, obj.y, obj.width, 30);
}

UserInterface.prototype.setFont = function (style) {
  switch (style) {
  case "h1":
    ctx.font = "25px Helvetica";
    ctx.fillStyle = '#FFF';
    break;
  case 'shadow':
    ctx.font = "25px Helvetica";
    ctx.fillStyle = '#000';
    break;
  default:
    ctx.font = "30px Helvetica";

  }
}

var LevelObject = function (object, scaleX, scaleY, sprite, offset) {
  this.sprite = sprite;
  this.x = object.x * scaleX;
  console.log(object.x);
  this.y = object.y * (scaleX * 0.79);
  this.scaleX = scaleX;
  this.scaleY = scaleY;
  this.speed = object.speed;
  this.offset = offset;

}

LevelObject.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x + this.offset, this.y, this.scaleX, this.scaleY);
}

LevelObject.prototype.setX = function (multiplier) {
  return multiplier * this.scaleX;
};

LevelObject.prototype.getX = function () {
  return this.x / this.scaleX;
};

LevelObject.prototype.setY = function (multiplier) {
  return multiplier * (this.scaleX * 0.79);
};

LevelObject.prototype.getY = function () {
  return this.y / (this.scaleX * 0.79);
};

var Enemy = function (enemy, scaleX, scaleY, offset) {
  LevelObject.call(this, enemy, scaleX, scaleY, 'images/enemy-bug.png', offset);
  console.log(this.x);
  this.y = this.y - scaleY * 0.10;
  this.path = enemy.path;
  this.currentWaypoint = 1;

};
Enemy.prototype = Object.create(LevelObject.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  //console.log(this.x + " " + this.speed + " " + dt);
  console.log(this.currentWaypoint + " currentWaypoint");
  /*if (this.x < this.setX(this.path[this.currentWaypoint].x)) {
    this.x = this.x + (this.speed * dt) / this.scaleX;
    console.log(this.x + " " + this.speed + " " + dt);
    if (this.x > this.setX(this.path[this.currentWaypoint].x)) {
      if ((this.path.length - 1) > this.currentWaypoint) {
        this.currentWaypoint++;
      } else {
        this.currentWaypoint = 0;
      }
      this.x = this.setX(this.path[this.currentWaypoint].x);
      this.x = this.x + 1;
    }
  } else if (this.x > this.setX(this.path[this.currentWaypoint].x))
    this.x = this.x - (this.speed * dt) / this.scaleX;
    if (this.x < this.setX(this.path[this.currentWaypoint].x)) {
      if ((this.path.length - 1) > this.currentWaypoint) {
        this.currentWaypoint++;
      } else {
        this.currentWaypoint = 0;
      }
      this.x = this.setX(this.path[this.currentWaypoint].x);
      this.x = this.x - 1;
    }*/
};

var Player = function (player, scaleX, scaleY, offset) {
  LevelObject.call(this, player, scaleX, scaleY,
    'images/char-boy.png', offset);
  this.y = this.y - scaleY * 0.05;
  this.movement = {
    'move': ''
  };
  this.lives = 3;
  this.initX = this.x;
  this.initY = this.y;
};

Player.prototype = Object.create(LevelObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
  if (this.movement === 'left' && this.getX() > 0) {
    this.x = this.setX(this.getX() - 1);
    console.log(this.x);
  } else if (this.movement === 'right' && this.getX() < level.mapSize.cols - 1) {
    this.x = this.setX(this.getX() + 1);
    console.log(level.mapSize.rows);
  } else if (this.movement === 'up' && this.getY() > 0) {
    this.y = this.setY(this.getY() - 1);
    console.log(this.y);
  } else if (this.movement === 'down' && this.getY() + 1 < level.mapSize.rows - 1) {
    this.y = this.setY(this.getY() + 1);
    console.log(this.y);
  }
  this.movement = '';
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
    'number': 1, // Level number
    'mapSize': { // Size of map in squares
      'rows': 6,
      'cols': 5
    },
    'map': [ // Array holding map layout.
      0, 0, 0, 0, 0,
      1, 1, 1, 1, 1,
      1, 2, 2, 1, 2,
      1, 2, 2, 2, 2,
      1, 1, 2, 2, 1,
      1, 1, 2, 2, 1
    ],
    'enemies': [{ // Data to instantiate enemies
      'type': 'red-bug', // Enemy type
      'speed': 100,
      'x': 0,
      'y': 1, // Movement speed
      'path': [{ // Array of grid locations to use as waypoints
        'x': 0,
        'y': 1
      }, {
        'x': 4,
        'y': 1
      }]
    }, {
      'type': 'red-bug',
      'speed': 100,
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
    'player': { // Data to set player location for map
      'x': 2,
      'y': 5,
    },
    'helpText': 'Navigate to the water. Watch out for bugs!'
  }, {
    'number': 1, // Level number
    'mapSize': { // Size of map in squares
      'rows': 7,
      'cols': 10
    },
    'map': [ // Array holding map layout.
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
      1, 2, 2, 1, 2, 0, 0, 0, 0, 0,
      1, 2, 2, 2, 2, 0, 0, 0, 0, 0,
      1, 1, 2, 2, 1, 0, 0, 0, 0, 0,
      1, 1, 2, 2, 1, 0, 0, 0, 0, 0,
      1, 1, 2, 2, 1, 0, 0, 0, 0, 0
    ],
    'enemies': [{ // Data to instantiate enemies
      'type': 'red-bug', // Enemy type
      'speed': 10, // Movement speed
      'x': 4,
      'y': 3,
      'path': [{ // Array of grid locations to use as waypoints
        'x': 4,
        'y': 3
      }, {
        'x': 4,
        'y': 1
      }]
    }, {
      'type': 'red-bug',
      'speed': 20,
      'x': 9,
      'y': 6,
      'path': [{
        'x': 9,
        'y': 6
      }, {
        'x': 4,
        'y': 1
      }],
    }],
    'player': { // Data to set player location for map
      'x': 2,
      'y': 5
    },
    'helpText': 'Collet all gems and reach the goal!'
  }]
};

var Level = function (number) {
  var level = levels.level[number - 1];

  this.levelNumber = number;
  this.mapSize = level.mapSize;
  this.map = level.map;
  var scale = this.setScale();
  this.scale = scale;
  var offset = (CANVAS_WIDTH - (this.mapSize.cols * this.scale.x)) / 2;
  this.offset = offset;
  this.enemies = level.enemies.map(function (enemy) {
    console.log(scale);
    return new Enemy(enemy, scale.x, scale.y, offset);
  });
  this.player = new Player(level.player, scale.x, scale.y, this.offset);
  this.helpText = level.helpText;

}

Level.prototype.setScale = function () {
  if ((this.mapSize.cols / this.mapSize.rows) < CANVAS_WIDTH / CANVAS_HEIGHT) {
    return {
      'x': (CANVAS_HEIGHT / this.mapSize.rows),
      'y': ((CANVAS_HEIGHT / this.mapSize.rows) * 1.59)
    };
  } else {
    return {
      'x': (CANVAS_WIDTH / this.mapSize.cols),
      'y': ((CANVAS_WIDTH / this.mapSize.cols) * 1.59)
    };
  }

}

Level.prototype.render = function () {
  var rowImages = [
    'images/water-block.png', // water block
    'images/stone-block.png', // Stone Block
    'images/grass-block.png' // Grass Block
  ];

  ctx.fillStyle = "#6ad8e3"
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (var row = 0; row < this.mapSize.rows; row++) {
    for (var col = 0; col < this.mapSize.cols; col++) {
      ctx.drawImage(
        Resources.get(rowImages[this.map[col + (row * this.mapSize.cols)]]),
        col * this.scale.x + this.offset,
      row * this.scale.y * 0.5, this.scale.x,
        this.scale.y); // 0.78 and 1.59 hard coded based on image sizes. Should never change, but not ideal.
    }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var level = new Level(2);
var ui = new UserInterface(3, level.helpText, level.levelNumber);

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
