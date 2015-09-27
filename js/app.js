'use strict';
// Set canvas size.
// TODO set these values based on device.
var SCALE_WIDTH = 600;

var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 600;
var globalState = 'startMenu';

/*---------------------------------------------------------
 * The Game class!
 * Holds the whole game.
 *---------------------------------------------------------
 */
var Game = function () {
  this.menu = new StartMenu();
  this.level = '';
}

/*---------------------------------------------------------
 * menus object.
 * Holds all menu objects.
 * Each menu object is an array of menu items.
 *---------------------------------------------------------
 */
var menus = {
  'start': [{
    'type': 'text',
    'text': 'Title Menu',
    'font': 'h5',
    'tl': 'left',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 10,
    'y': 10
  }, {
    'type': 'text',
    'text': "Chipper's Challenge",
    'font': 'h1',
    'tl': 'center',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 100
  }, {
    'type': 'text',
    'text': 'Levels',
    'font': 'h2',
    'tl': 'center',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 150
  }, {
    'type': 'levelList',
    'text': '',
    'font': 'h5',
    'tl': 'center',
    'bl': 'center',
    'sdw': 'black',
    'bg': false,
    'x': 150,
    'y': 250,
    'width': 300,
    'height': 300,
    'itemsWide': 4,
    'itemsTall': 4,
    'image': 'images/Star.png'
  }],
  'hud': [{
    'type': 'text',
    'label': 'Level: ',
    'text': 'level',
    'font': 'h1',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 10,
    'y': 50
  }, {
    'type': 'text',
    'label': 'Lives: ',
    'text': 'lives',
    'font': 'h1',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 10,
    'y': 100
  }, {
    'type': 'text',
    'label': 'Gems: ',
    'text': 'gems',
    'font': 'h1',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 10,
    'y': 150
  }, {
    'type': 'text',
    'label': 'Goal: ',
    'text': 'goal',
    'font': 'h5',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 10,
    'y': 550
  }],
  'done': [{
    'type': 'text',
    'text': 'Done Menu',
    'font': 'h5',
    'tl': 'left',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 10,
    'y': 10
  }, {
    'type': 'text',
    'text': "Level Completed!",
    'font': 'h1',
    'tl': 'left',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 100
  }, {
    'type': 'button',
    'text': "Restart",
    'font': 'h1',
    'tl': 'left',
    'bl': 'top',
    'sdw': 'black',
    'x': 200,
    'y': 300,
    'width': 100,
    'height': 75
  }, {
    'type': 'button',
    'text': "Next",
    'font': 'h1',
    'tl': 'left',
    'bl': 'top',
    'sdw': 'black',
    'x': 400,
    'y': 300,
    'width': 100,
    'height': 75
  }]
};

/*---------------------------------------------------------
 * Menu class. Prototype for all other menu classes
 *---------------------------------------------------------
 */
var Menu = function (menu) {
  this.menuObj = menu;
  this.items = '';
  //this.name = menu.name;
  console.log(this.items, 'in Menu constructor');
}

Menu.prototype.setListItems = function (original, items) {
  //console.log(original, items);
  return items.map(function (item, index) {
    var width = scale(original.width) / original.itemsWide;
    var height = scale(original.height) / original.itemsTall;
    var x = width * (index % original.itemsWide) + scale(original.x);
    var y = 0 + scale(original.y);

    if (index >= original.itemsWide) {
      y = height * Math.floor(index / original.itemsTall) + scale(original.y);
    }
    return {
      'type': 'button',
      'text': item.number,
      'tl': original.tl,
      'bl': original.bl,
      'sdw': original.sdw,
      'font': original.font,
      'x': x + (width / 2),
      'y': y + (height / 2),
      'leftCorner': {
        'x': x,
        'y': y
      },
      'width': width,
      'height': height,
      'image': original.image
    };
  }, this);
}

Menu.prototype.render = function () {
  //console.log(this.items);

  this.menuObj.forEach(function (item) {
    switch (item.type) {
    case 'text':
    case 'button':
      this.drawText(item);
      break;
    case 'icon':
      ctx.drawImage(Resources.get(item.image), item.x, item.y, item.width, item.height);
      break;
    case 'levelList':
      this.list.forEach(function (obj, index) {

        ctx.drawImage(Resources.get(obj.image), obj.leftCorner.x, obj.leftCorner.y - (obj.height * 0.5), obj.width, obj.height * 1.59);
        this.drawText(obj);
      }, this);

      break;
    }
  }, this);
}

Menu.prototype.levelButtonClicked = function (number) {
  //console.log(game.level, 'first');
  game.level = new Level(number);
  console.log(game.level, 'second, New level should be loaded');
  game.menu = new UserInterface(game.level);
  console.log(game.level, 'third');
  globalState = 'run';
}

// Takes a menu item object and draws it's text to the screen
Menu.prototype.drawText = function (obj) {
  // Render background gray box
  if (obj.label) {
    this.setFont('h2');
    var labelWidth = ctx.measureText(obj.label).width;
  }
  this.setFont(obj.font);
  var textWidth = ctx.measureText(obj.text).width;
  //console.log(test);
  ctx.save();
  ctx.textAlign = obj.tl;
  ctx.textBaseline = obj.bl

  if (obj.bg) {
    ctx.save();
    this.setFont('shadowOff');
    ctx.fillStyle = "#1F1F1F";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(obj.x - 20, obj.y - 20, labelWidth + textWidth + 10, 20);
    ctx.restore();
  }

  if (obj.sdw != 'transparent') {
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = obj.sdw;
  }

  this.setFont(obj.font);

  if (obj.label) {
    this.setFont('h2');
    ctx.fillText(obj.label, scale(obj.x), scale(obj.y));
    this.setFont(obj.font);
    ctx.fillText(obj.text, scale(obj.x) + labelWidth, scale(obj.y));
  } else {
    //console.log('scaled x: ', scale(obj.x), 'x: ' , obj.x);
    ctx.fillText(obj.text, scale(obj.x), scale(obj.y));
  }
  ctx.restore();
}

Menu.prototype.setFont = function (style) {
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

/*---------------------------------------------------------
 * StartMenu class. Inherits from Menu()
 * Also holds a list of levels.
 *---------------------------------------------------------
 */
var StartMenu = function () {
  Menu.call(this, menus.start);

  this.list = {};
  this.menuObj.forEach(function (item) {
    if (item.type === 'levelList') {
      this.list = this.setListItems(item, levels.level);
    }
  }, this);
}
StartMenu.prototype = Object.create(Menu.prototype);
StartMenu.prototype.constructor = StartMenu;

StartMenu.prototype.startMenuRender = function () {
  ctx.fillStyle = "#6ad8e3";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
}
// Takes the current Level instance
var UserInterface = function (level) {
  Menu.call(this, menus.hud);
  //this.items = menus.hud;
  console.log(menus.hud, 'UserInterface Constructor called');
  this.level = level;
  //this.number = {};
  //this.lives = {};
  //this.gems = {};
  //this.goal = {};
  this.menuObj.forEach(function (item) {
    console.log(item, 'inside this.items.forEach()');
    switch (item.label) {
    case 'Level: ':
      this.number = item;
      this.number.text = this.level.levelNumber;
      break;
    case 'Lives: ':
      this.lives = item;
      this.lives.text = this.level.player.lives;
      break;
    case 'Gems: ':
      this.gems = item;
      this.gems.text = "0" + " / " + this.level.gems.total;
      break;
    case 'Goal: ':
      this.goal = item;
      this.goal.text = this.level.helpText;
      break;
    }
;
  }, this);
}
UserInterface.prototype = Object.create(Menu.prototype);
UserInterface.prototype.constructor = UserInterface;

UserInterface.prototype.update = function (currentLevel) {
  // Changegame.level and goal text if game.level changes
  //console.log(this.number, currentLevel.levelNumber);
  if (this.number.text != currentLevel.levelNumber) {
    this.number.text = currentLevel.levelNumber;
    this.goal.text = currentLevel.helpText;
    this.gems.text = currentLevel.gems.collected + " / " + currentLevel.gems.total;
  }
  // Change lives count if different
  if (this.lives.text != currentLevel.player.lives) {
    this.lives.text = currentLevel.player.lives;
  }
  if (this.gems.collected != this.level.gems.collected) {
    this.gems.text = currentLevel.gems.collected + " / " + currentLevel.gems.total;
  }
}

/*---------------------------------------------------------
 * Base level object.
 * Prototype for all other game elements:
 * Player, map square, Enemies, Items, etc.
 *---------------------------------------------------------
 */
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

/*---------------------------------------------------------
 * Item class, used to hold Rocks, Gems, Finish points, etc.
 * TODO: take out Rocks maybe and put them in Level?
 *---------------------------------------------------------
 */
var Item = function (item, scale, sprite, offset) {
  LevelObject.call(this, item, scale, sprite, offset);
  this.y = this.y - scale.y * 0.10;
  this.item = item.item;
}
Item.prototype = Object.create(LevelObject.prototype);
Item.prototype.constructor = Item;

/*---------------------------------------------------------
 * Enemy class
 *---------------------------------------------------------
 */
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

/*---------------------------------------------------------
 * Player class
 *---------------------------------------------------------
 */
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

/*---------------------------------------------------------
 * Object used to create and storegame levels.
 * Holds the map, enemies info and player locations.
 * New levels can be added by adding to levels.level[]
 *---------------------------------------------------------
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

/*---------------------------------------------------------
 * Level class. Holds current level.
 * Includes size and scale for positioning the map
 * Array of enemies, items, and the player
 *---------------------------------------------------------
 */
var Level = function (number) {
  var level = levels.level[number - 1];
  console.log(this, 'Inside Level constructor');
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

/*---------------------------------------------------------
 * Instanciate Game object
 *---------------------------------------------------------
 */
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
    game.menu.list.forEach(function (box) {
      if (e.layerX < box.leftCorner.x + box.width && e.layerX > box.leftCorner.x) {
        if (e.layerY < box.leftCorner.y + box.height && e.layerY > box.leftCorner.y) {
          game.menu.levelButtonClicked(box.text);
        }
      }
    });
    break;
  case 'done':
    //if (e.layerX < game.menu.menu.start[3].x +  )

    break;
  }
});
