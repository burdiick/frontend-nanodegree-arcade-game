// Set canvas size.
// TODO set these values based on device.
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var UserInterface = function (lives, help, num) {
  this.lives = {
    'text': lives,
    'x': 10,
    'y': 60
  };
  this.help = {
    'text': help,
    'x': 10,
    'y': 560
  };
  this.number = {
    'text': num,
    'x': 10,
    'y': 30
  };
}

UserInterface.prototype.render = function () {
  // Draw UI to screen
  this.drawText('Level: ', this.number);
  this.drawText('Lives: ', this.lives);
  this.drawText('Goal: ', this.help);
}

UserInterface.prototype.update = function (currentLevel) {
  // Change level and goal text if level changes
  if (this.number.text != currentLevel.levelNumber) {
    this.number.text = currentLevel.levelNumber;
    this.help.text = currentLevel.helpText;
  }
  // Change lives count if different
  if (this.lives.text != currentLevel.player.lives) {
    this.lives.text = currentLevel.player.lives;
  }
}

UserInterface.prototype.drawText = function (text, obj) {
  // Render background gray box
  ctx.fillStyle = "#1F1F1F";
  ctx.globalAlpha = 0.6;
  ctx.fillRect(0, obj.y - 15, ctx.measureText(text + obj.text).width, 20);
  ctx.globalAlpha = 1;

  // Render Drop shadow
  this.setFont('h2')
  this.setFont('shadow');
  ctx.fillText(text, obj.x + 2, obj.y + 2);
  this.setFont('h1')
  this.setFont('shadow');
  ctx.fillText(obj.text, obj.x + ctx.measureText(text).width + 2, obj.y + 2);

  // Render Text
  this.setFont('h2');
  ctx.fillText(text, obj.x, obj.y);
  this.setFont('h1');
  ctx.fillText(obj.text, obj.x + ctx.measureText(text).width, obj.y);
}

UserInterface.prototype.setFont = function (style) {
  // Set ctx to required style.
  // TODO there has to be a better way to do this.
  switch (style) {
  case "h1":
    ctx.font = "28px Helvetica";
    ctx.fillStyle = '#FFF';
    break;
  case 'h2':
    ctx.font = "25px Helvetica";
    ctx.fillStyle = '#ddcd00'
    break;
  case 'shadow':
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
  // Calculate location of next waypoint
  var targetX = this.setX(this.path[this.currentWaypoint].x);
  var targetY = this.setY(this.path[this.currentWaypoint].y) - (this.scaleY * 0.1);

  // Move enemy toward next waypoint X
  if (this.x < targetX) {
    this.x = this.x + (this.scaleX / 2 * (this.speed * dt));
    if (this.x >= targetX) {
      this.x = targetX;
    }
  } else if (this.x > targetX) {
    this.x = this.x - (this.scaleX / 2 * (this.speed * dt));
    if (this.x <= targetX) {
      this.x = targetX;
    }
  }

  // Move enemy toward next waypoint Y
  if (this.y < targetY) {
    this.y = this.y + (this.scaleX / 2 * (this.speed * dt));
    if (this.y >= targetY) {
      this.y = targetY;
    }
  } else if (this.y > targetY) {
    this.y = this.y - (this.scaleX / 2 * (this.speed * dt));
    if (this.y <= targetY) {
      this.y = targetY;
    }
  }

  // Set next waypoint
  if (this.x == targetX && this.y == targetY) {
    if (this.path.length > this.currentWaypoint + 1) {
      this.currentWaypoint++;
    } else {
      this.currentWaypoint = 0;
    }
  }
};

var Player = function (player, scaleX, scaleY, offset) {
  LevelObject.call(this, player, scaleX, scaleY,
    'images/char-boy.png', offset);
  this.y = this.y - scaleY * 0.05;
  this.lives = 3;
  this.initX = this.x;
  this.initY = this.y;
};
Player.prototype = Object.create(LevelObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {

};

Player.prototype.handleInput = function (key) {
  if (key === 'left' && this.getX() > 0) {
    this.x = this.setX(this.getX() - 1);
    console.log(this.x);
  } else if (key === 'right' && this.getX() < level.mapSize.cols - 1) {
    this.x = this.setX(this.getX() + 1);
    console.log(level.mapSize.rows);
  } else if (key === 'up' && this.getY() > 0) {
    this.y = this.setY(this.getY() - 1);
    console.log(this.y);
  } else if (key === 'down' && this.getY() + 1 < level.mapSize.rows - 1) {
    this.y = this.setY(this.getY() + 1);
    console.log(this.y);
  } else if (key === '1' && level.levelNumber != 1) {
    level = new Level(1);
  } else if (key === '2' && level.levelNumber != 2) {
    level = new Level(2);
  }
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
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 2, 2, 1, 2,
      1, 2, 2, 2, 2,
      1, 1, 2, 2, 1,
      1, 1, 2, 2, 1
    ],
    'enemies': [{ // Data to instantiate enemies
      'type': 'red-bug', // Enemy type
      'speed': 5,
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
      'speed': 3,
      'x': 4,
      'y': 3,
      'path': [{
        'x': 4,
        'y': 3
      }, {
        'x': 0,
        'y': 3
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
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 2, 2, 1, 2, 2, 2, 1, 1, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 1, 2, 2, 2, 2, 2,
      1, 1, 2, 2, 1, 2, 2, 1, 1, 2,
      1, 1, 2, 2, 2, 2, 2, 2, 2, 2
    ],
    'enemies': [{ // Data to instantiate enemies
      'type': 'red-bug', // Enemy type
      'speed': 5, // Movement speed
      'x': 0,
      'y': 3,
      'path': [{ // Array of grid locations to use as waypoints
        'x': 0,
        'y': 3
      }, {
        'x': 4,
        'y': 3
      }]
    }, {
      'type': 'red-bug',
      'speed': 5,
      'x': 9,
      'y': 6,
      'path': [{
        'x': 9,
        'y': 6
      }, {
        'x': 5,
        'y': 6
      }, {
        'x': 5,
        'y': 2
      }, {
        'x': 9,
        'y': 2
      }],
    }],
    'player': { // Data to set player location for map
      'x': 2,
      'y': 6
    },
    'helpText': 'Collet all gems and reach the goal!'
  }]
};

var Level = function (number) {
  var level = levels.level[number - 1];

  this.levelNumber = number;
  this.mapSize = level.mapSize;
  this.map = level.map;
  var scale = this.setScale(); // TODO figure out how to pass 'this' into array.map()
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

// Scale all objects to fit screen
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
    'images/grass-block.png', // Grass Block
    'images/Selector.png'
  ];

  // Draw background to blue color
  ctx.fillStyle = "#6ad8e3"
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw map to screen
  for (var row = 0; row < this.mapSize.rows; row++) {
    for (var col = 0; col < this.mapSize.cols; col++) {
      ctx.drawImage(
        Resources.get(rowImages[this.map[col + (row * this.mapSize.cols)]]),
        col * this.scale.x + this.offset,
        row * this.scale.y * 0.5,
        this.scale.x,
        this.scale.y); // 0.78 and 1.59 hard coded based on image sizes. Should never change, but not ideal.
    }
  }

  // TEMP render Selector.
  // TODO refactor to draw all other objects to screen.
  ctx.drawImage(Resources.get(rowImages[3]),
    (this.mapSize.cols - 1) * this.scale.x + this.offset,
    0 - this.scale.y * 0.25,
    this.scale.x,
    this.scale.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var level = new Level(1);
var ui = new UserInterface(3, level.helpText, level.levelNumber);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    49: '1',
    50: '2'
  };
  console.log(e.keyCode);
  console.log(allowedKeys[e.keyCode]);
  level.player.handleInput(allowedKeys[e.keyCode]);
});
