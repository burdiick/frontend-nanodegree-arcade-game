// Set canvas size.
// TODO set these values based on device.
var SCALE_WIDTH = 600;

var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 600;
var globalState = 'startMenu';

var Game = function () {
  this.startMenu = new Menu(1);
  this.level = '';
  this.ui = new UserInterface();
}

var menus = {
  'menu': [{
    'text': 'Title Menu',
    'x': 10,
    'y': 10
  }, {
    'text': "Chipper's Challenge",
    'x': 300,
    'y': 100
  }, {
    'text': 'Levels',
    'x': 300,
    'y': 150
  }]
}

var Menu = function (number) {
  this.menu = menus.menu;
  this.levels = levels.level.map(function (level) {
    //console.log(level.number, 'level');
    return level.number;
  });
  this.hitBoxes = [];
  this.levelListBox = {
    'x': 0,
    'y': 0
  };

  this.boxWidth = scale((SCALE_WIDTH * 0.75));
  this.boxHeight = (this.boxWidth / 5) * 4;
  this.buttonWidth = (this.boxWidth / 5);
  this.buttonHeight = this.boxHeight / 4;
  this.levelListBox.x = scale(300) - (this.boxWidth / 2);
  this.levelListBox.y = 200;

  for (var i = 0; i < 4; i++) {
    for (var f = 0; f < 5; f++) {
      if (this.levels.length > (i * 5) + f) {
        //console.log(f, i);
        this.levels[f] = {
          'text': {
            'text': this.levels[f],
            'x': this.buttonWidth * f + (this.buttonWidth / 2),
            'y': this.buttonHeight * i + (this.buttonHeight / 2)
          },
          'x': this.buttonWidth * f,
          'y': this.buttonHeight * i,
          'width': this.buttonWidth,
          'height': this.buttonHeight
        }
      } else {
        f = 5;
        i = 4;
      }
    }
  }
}

Menu.prototype.levelButtonClicked = function (number) {
  game.level = new Level(number);
  game.ui = new UserInterface(game.level);
  globalState = 'run';
}

Menu.prototype.renderStartMenu = function () {
  ctx.fillStyle = "#6ad8e3";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  game.ui.drawText(this.menu[0], 'left', 'top', 'black', false, 'h5');
  game.ui.drawText(this.menu[1], 'center', 'top', 'black', false, 'h1');
  game.ui.drawText(this.menu[2], 'center', 'top', 'black', false, 'h2');

  ctx.save();
  ctx.translate(this.levelListBox.x, this.levelListBox.y);
  for (var i = 0; i < 4; i++) {
    for (var f = 0; f < 5; f++) {
      if (this.levels.length > (i * 5) + f) {
        ctx.drawImage(Resources.get('images/Star.png'), this.buttonWidth * f, (this.buttonWidth * 1.59) * i - this.buttonHeight * 0.5, this.buttonWidth, this.buttonWidth * 1.5);

        game.ui.drawText(this.levels[f].text, 'center', 'center', 'black', false, 'h1');
        game.ui.drawText({
          'text': levels.level[f].gems.collected + " / " + levels.level[f].gems.total,
          'x': f * this.buttonWidth + (this.buttonWidth * 0.5),
          'y': this.buttonHeight * 0.75
        }, 'center', 'center', 'black', false, 'h5');
      } else {
        f = 5;
        i = 4;
      }
    }
  }
  ctx.restore();

}

var UserInterface = function (level) {
  if (level) {
    this.lives = {
      'label': 'Lives: ',
      'text': level.player.lives,
      'x': 10,
      'y': 60
    };
    this.help = {
      'label': 'Goal: ',
      'text': level.helpText,
      'x': 10,
      'y': 560
    };
    this.number = {
      'label': 'Level: ',
      'text': level.number,
      'x': 10,
      'y': 30
    };
    this.gems = {
      'label': 'Gems: ',
      'text': level.gems.collected + " / " + level.gems.total,
      'x': 10,
      'y': 90,
      'collected': level.gems.collected,
      'total': level.gems.total
    }
  }
}

UserInterface.prototype.render = function () {
  // Draw UI to screen
  this.drawText(this.number, 'left', 'bottom', 'black', true, 'h1');
  this.drawText(this.lives, 'left', 'bottom', 'black', true, 'h1');
  this.drawText(this.help, 'left', 'bottom', 'black', true, 'h3');
  this.drawText(this.gems, 'left', 'bottom', 'black', true, 'h1');
}

UserInterface.prototype.update = function (currentLevel) {
  // Changegame.level and goal text ifgame.level changes
  if (this.number.text != currentLevel.levelNumber) {
    this.number.text = currentLevel.levelNumber;
    this.help.text = currentLevel.helpText;
    this.gems.text = currentLevel.gems.collected + " / " + currentLevel.gems.total;
  }
  // Change lives count if different
  if (this.lives.text != currentLevel.player.lives) {
    this.lives.text = currentLevel.player.lives;
  }

  if (this.gems.collected != currentLevel.gems.collected) {
    this.gems.text = currentLevel.gems.collected + " / " + currentLevel.gems.total;
  }
}

// Takes agame.ui item object with .label, .text, and .x and .y locations
UserInterface.prototype.drawText = function (obj, tl, bl, shadow, bg, font) {
  // Render background gray box
  this.setFont('h2');
  var labelWidth = ctx.measureText(obj.label).width;
  this.setFont(font);
  var textWidth = ctx.measureText(obj.text).width;
  //console.log(test);
  ctx.save();
  ctx.textAlign = tl;
  ctx.textBaseline = bl

  if (bg) {
    ctx.save();
    this.setFont('shadowOff');
    ctx.fillStyle = "#1F1F1F";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(obj.x - 20, obj.y - 20, labelWidth + textWidth + 10, 20);
    ctx.restore();
  }

  if (shadow != 'transparent') {
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = shadow;
  }

  game.ui.setFont(font);

  if (obj.label) {
    game.ui.setFont('h2');
    ctx.fillText(obj.label, obj.x, obj.y);
    game.ui.setFont(font);
    ctx.fillText(obj.text, scale(obj.x) + labelWidth, obj.y);
  } else {
    //console.log('scaled x: ', scale(obj.x), 'x: ' , obj.x);
    ctx.fillText(obj.text, scale(obj.x), obj.y);
  }
  ctx.restore();
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
    ctx.fillStyle = '#ddcd00';
    break;
  case 'h3':
    ctx.font = "20px Helvetica";
    ctx.fillStyle = '#FFF';
    break;
  case 'h5':
    ctx.font = "15px Helvetica";
    ctx.fillStyle = '#FFF';
    break;
  default:
    ctx.font = "30px Helvetica";
  }
}

var LevelObject = function (object, scale, sprite, offset) {
  this.sprite = sprite;
  this.x = object.x * scale.x;
  //console.log(object.x);
  this.y = object.y * (scale.x * 0.79);
  this.scale = scale;
  this.speed = object.speed;
  this.offset = offset;
}

LevelObject.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x + this.offset, this.y, this.scale.x, this.scale.y);
}

LevelObject.prototype.setX = function (multiplier) {
  return multiplier * this.scale.x;
};

LevelObject.prototype.getX = function () {
  return this.x / this.scale.x;
};

LevelObject.prototype.setY = function (multiplier) {
  return multiplier * (this.scale.x * 0.79);
};

LevelObject.prototype.getY = function () {
  return this.y / (this.scale.x * 0.79);
};

var Item = function (item, scale, sprite, offset) {
  LevelObject.call(this, item, scale, sprite, offset);
  this.y = this.y - scale.y * 0.10;
  this.item = item.item;
}
Item.prototype = Object.create(LevelObject.prototype);
Item.prototype.constructor = Item;

var Enemy = function (enemy, scale, offset) {
  LevelObject.call(this, enemy, scale, 'images/enemy-bug.png', offset);
  //console.log(this.x);
  this.y = this.y - scale.y * 0.10;
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
  var targetY = this.setY(this.path[this.currentWaypoint].y) - (this.scale.y * 0.1);

  // Move enemy toward next waypoint X
  if (this.x < targetX) {
    this.x = this.x + (this.scale.x / 2 * (this.speed * dt));
    if (this.x >= targetX) {
      this.x = targetX;
    }
  } else if (this.x > targetX) {
    this.x = this.x - (this.scale.x / 2 * (this.speed * dt));
    if (this.x <= targetX) {
      this.x = targetX;
    }
  }

  // Move enemy toward next waypoint Y
  if (this.y < targetY) {
    this.y = this.y + (this.scale.x / 2 * (this.speed * dt));
    if (this.y >= targetY) {
      this.y = targetY;
    }
  } else if (this.y > targetY) {
    this.y = this.y - (this.scale.x / 2 * (this.speed * dt));
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

var Player = function (player, scale, offset) {
  LevelObject.call(this, player, scale,
    'images/char-boy.png', offset);
  this.y = this.y - scale.y * 0.05;
  this.lives = 3;
  this.initX = this.x;
  this.initY = this.y;
  this.prevX = this.x;
  this.prevY = this.y;
};
Player.prototype = Object.create(LevelObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
  // Not sure what to do here yet.
};

Player.prototype.handleInput = function (key) {
  this.prevX = this.x;
  this.prevY = this.y;
  if (key === 'left' && this.getX() > 0) {
    this.x = this.setX(this.getX() - 1);
  } else if (key === 'right' && this.getX() < game.level.mapSize.cols - 1) {
    this.x = this.setX(this.getX() + 1);
  } else if (key === 'up' && this.getY() > 0) {
    this.y = this.setY(this.getY() - 1);
  } else if (key === 'down' && this.getY() + 1 < game.level.mapSize.rows - 1) {
    this.y = this.setY(this.getY() + 1);
  }
};

/*
 * Object used to create and storegame.levels.
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
    'items': [
      2, 0, 0, 0, 7,
      1, 1, 0, 1, 1,
      0, 0, 0, 0, 0,
      1, 1, 0, 1, 1,
      0, 2, 0, 0, 0,
      0, 0, 0, 2, 0
    ],
    'enemies': [{ // Data to instantiate enemies
      'type': 'red-bug', // Enemy type
      'speed': 5,
      'x': 0,
      'y': 2, // Movement speed
      'path': [{ // Array of grid locations to use as waypoints
        'x': 0,
        'y': 2
      }, {
        'x': 4,
        'y': 2
      }]
    }, {
      'type': 'red-bug',
      'speed': 3,
      'x': 4,
      'y': 4,
      'path': [{
        'x': 4,
        'y': 4
      }, {
        'x': 0,
        'y': 4
      }],
    }],
    'player': { // Data to set player location for map
      'x': 2,
      'y': 5
    },
    'completed': 0,
    'gems': {
      'collected': 0,
      'total': 3
    },
    'helpText': 'Reach the Exit. Watch out for bugs!'
  }, {
    'number': 2, // Level number
    'mapSize': { // Size of map in squares
      'rows': 7,
      'cols': 10
    },
    'map': [ // Array holding map layout.
      0, 0, 0, 1, 1, 1, 1, 0, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 2, 2, 1, 2, 2, 2, 1, 1, 2,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
      2, 1, 1, 2, 1, 2, 2, 2, 2, 2,
      2, 2, 1, 2, 1, 2, 1, 1, 1, 2,
      2, 2, 1, 2, 2, 2, 2, 2, 2, 2
    ],
    'items': [ // Array holding map layout.
      0, 0, 0, 0, 2, 2, 0, 0, 0, 7,
      1, 1, 1, 0, 1, 1, 0, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 2, 1, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 1, 0, 1, 1, 1, 0,
      0, 0, 1, 2, 0, 0, 0, 0, 0, 0
    ],
    'enemies': [{ // Data to instantiate enemies
      'type': 'red-bug', // Enemy type
      'speed': 5, // Movement speed
      'x': 0,
      'y': 2,
      'path': [{ // Array of grid locations to use as waypoints
        'x': 0,
        'y': 2
      }, {
        'x': 9,
        'y': 2
      }]
    }, {
      'type': 'red-bug',
      'speed': 10,
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
        'y': 4
      }, {
        'x': 9,
        'y': 4
      }],
    }],
    'player': { // Data to set player location for map
      'x': 0,
      'y': 6
    },
    'completed': 0,
    'gems': {
      'collected': 0,
      'total': 5
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
    //console.log(scale);
    return new Enemy(enemy, scale, offset);
  });
  this.player = new Player(level.player, scale, this.offset);
  this.helpText = level.helpText;
  this.gems = level.gems;
  this.items = level.items.map(function (item, index) {
    var sprite = '';
    switch (item) {
    case 1:
      sprite = 'images/Rock.png';
      break;
    case 2:
      sprite = 'images/gem-blue.png';
      break;
    case 7:
      sprite = 'images/Selector.png'
      break;
    default:
    }
    var y = 0;
    var x = index % level.mapSize.cols;
    if (index >= level.mapSize.cols) {
      y = Math.floor(index / level.mapSize.cols);
    }

    return new Item({
      'item': item,
      'x': x,
      'y': y
    }, scale, sprite, offset);
  });
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

      if (this.items[col + (row * this.mapSize.cols)].sprite != '') {
        ctx.drawImage(
          Resources.get(this.items[col + (row * this.mapSize.cols)].sprite),
          col * this.scale.x + this.offset,
          row * this.scale.y * 0.5 - (this.scale.y * 0.20),
          this.scale.x,
          this.scale.y);
      }
    }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game();

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
  //console.log(e.keyCode);
  //console.log(allowedKeys[e.keyCode]);
  switch (globalState) {
  case 'run':
    game.level.player.handleInput(allowedKeys[e.keyCode]);
    break;
  case 'startMenu':
    //do something
    break;
  default:
    //do something else
  }
});

function scale(value) {
  return (CANVAS_WIDTH / SCALE_WIDTH) * value;
}

document.addEventListener('mousedown', function (e) {
  switch (globalState) {
  case 'startMenu':
    game.startMenu.levels.forEach(function (box) {
      if (e.layerX < box.x + box.width + game.startMenu.levelListBox.x && e.layerX > box.x + game.startMenu.levelListBox.x) {
        if (e.layerY < box.y + box.height + game.startMenu.levelListBox.y && e.layerY > box.y + game.startMenu.levelListBox.y) {
          game.startMenu.levelButtonClicked(box.text.text);
        }
      }
    });
    break;
  }

});
