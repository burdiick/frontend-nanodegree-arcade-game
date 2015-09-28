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
  'start': [{ // START MENU -------------------------------
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
    'font': 'h3',
    'tl': 'center',
    'bl': 'center',
    'sdw': 'black',
    'bg': false,
    'x': 100,
    'y': 200,
    'width': 400,
    'height': 400,
    'itemsWide': 4,
    'itemsTall': 4,
    'image': 'images/Star.png'
  }],
  'hud': [{ // HUD ----------------------------------------
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
    'font': 'h4',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 10,
    'y': 550
  }],
  'done': [{ // DONE MENU ---------------------------------
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
    'tl': 'center',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 100
  }, {
    'type': 'button',
    'text': "Restart",
    'font': 'h2',
    'tl': 'center',
    'bl': 'center',
    'sdw': 'black',
    'x': 200,
    'y': 300,
    'width': 130,
    'height': 60
  }, {
    'type': 'button',
    'text': "Next",
    'font': 'h2',
    'tl': 'center',
    'bl': 'center',
    'sdw': 'black',
    'x': 400,
    'y': 300,
    'width': 100,
    'height': 60
  }],
  'gameOver': [{ // GAME OVER MENU ------------------------
    'type': 'text',
    'text': 'Game Over Menu',
    'font': 'h5',
    'tl': 'left',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 10,
    'y': 10
  }, {
    'type': 'text',
    'text': "Game Over",
    'font': 'h1',
    'tl': 'center',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 100
  }, {
    'type': 'text',
    'text': "Oh No!",
    'font': 'h2',
    'tl': 'center',
    'bl': 'top',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 160
  }, {
    'type': 'button',
    'text': "Restart",
    'font': 'h2',
    'tl': 'center',
    'bl': 'center',
    'sdw': 'black',
    'x': 200,
    'y': 350,
    'width': 130,
    'height': 60
  }, {
    'type': 'button',
    'text': "Back",
    'font': 'h2',
    'tl': 'center',
    'bl': 'center',
    'sdw': 'black',
    'x': 400,
    'y': 350,
    'width': 100,
    'height': 60
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
  //console.log(this.items, 'in Menu constructor');
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
    console.log(item, 'item');
    return {
      'type': 'button',
      'text': item.number,
      'tl': original.tl,
      'bl': original.bl,
      'sdw': original.sdw,
      'font': original.font,
      'x': x + (width * 0.5),
      'y': y + (height * 0.55),
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
  this.menuObj.forEach(function (item) {
    switch (item.type) {
    case 'button':
      ctx.save();
      ctx.fillStyle = '#9EBF00';
      ctx.shadowColor = 'black';
      ctx.shadowblur = 5;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillRect(item.x - item.width / 2, item.y - (item.height * 0.55), item.width, item.height);
      ctx.strokeStyle = '#147e22';
      ctx.shadowColor = 'transparent';
      ctx.strokeRect(item.x - item.width / 2, item.y - (item.height * 0.55), item.width, item.height)
      ctx.restore();
    case 'text':
      this.drawText(item);
      break;
    case 'icon':
      //ctx.save();
      ctx.drawImage(Resources.get(item.image), item.x, item.y, item.width, item.height);
      break;
    case 'levelList':
      this.list.forEach(function (obj, index) {
        this.drawImg(obj);
        this.drawText(obj);
      }, this);

      break;
    }
  }, this);
}

Menu.prototype.levelButtonClicked = function (number) {
  game.level = new Level(number);
  game.menu = new UserInterface(game.level);
  globalState = 'run';
}

Menu.prototype.drawImg = function (img) {
    ctx.save();
    //console.log(img);
    if (img.sdw != 'transparent') {
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = img.sdw;
    }
    ctx.drawImage(Resources.get(img.image), img.leftCorner.x, img.leftCorner.y - (img.height * 0.5), img.width, img.height * 1.59);
    ctx.restore();
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
    ctx.fillStyle = "#1F1F1F";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(scale(obj.x - 20), scale(obj.y - 20), labelWidth + textWidth + scale(10), scale(20));
    ctx.restore();
  }

  if (obj.sdw != 'transparent') {
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = obj.sdw;
  }

  this.setFont(obj.font);

  if (obj.label) {
    this.setFont('h2');
    ctx.fillText(obj.label, scale(obj.x), scale(obj.y));
    this.setFont(obj.font);
    ctx.fillText(obj.text, scale(obj.x) + labelWidth, scale(obj.y));
  } else {
    ctx.fillText(obj.text, scale(obj.x), scale(obj.y));
    ctx.strokeText(obj.text, scale(obj.x), scale(obj.y));
  }
  ctx.restore();
}

Menu.prototype.setFont = function (style) {
  // Set ctx to required style.
  // TODO there has to be a better way to do this.
  switch (style) {
  case "h1":
    ctx.font = "30px Helvetica";
    ctx.fillStyle = '#FFF';
    break;
  case 'h2':
    ctx.font = "25px Helvetica";
    ctx.fillStyle = '#D3FF00';
    ctx.strokeStyle = 'transparent';
    break;
  case 'h3':
    ctx.font = "bolder 25px Helvetica";
    ctx.fillStyle = '#d3ff00';
    ctx.strokeStyle = 'transparent';
    break;
  case 'h4':
    ctx.font = '25px Helvetica';
    ctx.fillStyle = 'white';
    break;
  case 'h5':
    ctx.font = "15px Helvetica";
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = 'transparent';
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
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
}

var DoneMenu = function () {
  Menu.call(this, menus.done);
}
DoneMenu.prototype = Object.create(Menu.prototype);
DoneMenu.prototype.constructor = DoneMenu;

DoneMenu.prototype.renderDoneMenu = function () {
  ctx.fillStyle = "#6ad8e3";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
}

var GameOverMenu = function () {
  Menu.call(this, menus.gameOver);
}
GameOverMenu.prototype = Object.create(Menu.prototype);
GameOverMenu.prototype.constructor = DoneMenu;

GameOverMenu.prototype.renderGameOverMenu = function () {
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
}

// Takes the current Level instance
var UserInterface = function (level) {
  Menu.call(this, menus.hud);
  //this.items = menus.hud;
  //console.log(menus.hud, 'UserInterface Constructor called');
  this.level = level;

  this.menuObj.forEach(function (item) {
    //console.log(item, 'inside this.items.forEach()');
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
    };
  }, this);
}
UserInterface.prototype = Object.create(Menu.prototype);
UserInterface.prototype.constructor = UserInterface;

UserInterface.prototype.renderUserInterface = function () {
  //ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
}

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
  this.y = object.y * (scale.x * 0.79);
  this.scale = scale;
  this.speed = object.speed;
  this.offset = offset;
}

LevelObject.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x + this.offset.x, this.y + this.offset.y, this.scale.x, this.scale.y);
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
 * Block Class. Holds a block and its location.
 * walkable is true if you can move other the block.
 *---------------------------------------------------------
 */
var Block = function (block, scale, sprite, offset, walkable) {
  LevelObject.call(this, block, scale, sprite, offset);
  this.block = block.item;
  this.walkable = walkable;
}
Block.prototype = Object.create(LevelObject.prototype);
Block.prototype.constructor = Block;

/*---------------------------------------------------------
 * Item class, used to hold Rocks, Gems, Finish points, etc.
 *---------------------------------------------------------
 */
var Item = function (item, scale, sprite, offset) {
  LevelObject.call(this, item, scale, sprite, offset);
  this.y = this.y - scale.y * 0.20;
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

  this.y = this.y - scale.y * 0.10; // Offset enemy y by a little bit to center on block
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
      3, 3, 1, 3, 3,
      1, 2, 2, 1, 2,
      3, 3, 2, 3, 3,
      1, 1, 2, 2, 1,
      1, 1, 2, 2, 1
    ],
    'items': [ // Array holding Map items like rocks, gems and the finish gate
      2, 0, 0, 0, 7,
      1, 1, 0, 1, 1,
      0, 0, 0, 0, 2,
      1, 1, 0, 1, 1,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
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
        'x': 3,
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
    'completed': 0, // Data to show if you have completed the level already. No, it shouldnt be here
    'gems': { // Data to track gem collection
      'collected': 0,
      'total': 2
    },
    'helpText': 'Reach the Exit. Watch out for bugs!'
  }, {
    'number': 2,
    'mapSize': {
      'rows': 7,
      'cols': 10
    },
    'map': [
      0, 0, 0, 1, 1, 1, 1, 0, 0, 1,
      3, 3, 3, 1, 3, 3, 3, 3, 3, 1,
      1, 2, 2, 1, 2, 2, 2, 1, 1, 2,
      1, 3, 3, 3, 3, 3, 3, 3, 3, 2,
      2, 3, 3, 2, 3, 2, 2, 2, 2, 2,
      2, 2, 3, 2, 3, 2, 3, 3, 3, 2,
      2, 2, 3, 2, 2, 2, 2, 2, 2, 2
    ],
    'items': [
      0, 0, 0, 0, 2, 2, 0, 0, 0, 7,
      1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 2, 1, 0, 0, 0, 0, 0,
      0, 0, 1, 2, 1, 0, 1, 1, 1, 0,
      0, 0, 1, 2, 0, 0, 0, 0, 0, 0
    ],
    'enemies': [{
      'type': 'red-bug',
      'speed': 5,
      'x': 0,
      'y': 2,
      'path': [{
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
    'player': {
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

  this.levelNumber = number;
  this.helpText = level.helpText;
  this.gems = level.gems;
  this.mapSize = level.mapSize;
  this.scale = this.setScale();

  var offsetY = 0;
  var offsetX = 0;
  if (this.mapSize.cols <= this.mapSize.rows) {
    offsetX = (CANVAS_WIDTH - (this.mapSize.cols * this.scale.x)) / 2;
  } else {
    offsetY = (CANVAS_HEIGHT - (this.mapSize.rows * this.scale.x)) / 2;
  }
  this.offset = {
    'x': offsetX,
    'y': offsetY
  };

  this.map = level.map.map(function (obj, index) {
    var sprite = '';
    var walkable = true;
    var y = 0;
    var x = index % level.mapSize.cols;
    if (index >= level.mapSize.cols) {
      y = (Math.floor(index / level.mapSize.cols));
    }

    switch (obj) {
    case 0:
      sprite = 'images/water-block.png';
      walkable = false;
      break;
    case 1:
      sprite = 'images/stone-block.png';
      break;
    case 2:
      sprite = 'images/grass-block.png';
      break;
    case 3:
      sprite = 'images/stone-block.png';
      walkable = false;
      break;
    }

    return new Block({
      'item': obj,
      'x': x,
      'y': y
    }, this.scale, sprite, this.offset, walkable);
  }, this);

  this.enemies = level.enemies.map(function (enemy) {
    return new Enemy(enemy, this.scale, this.offset);
  }, this);

  this.player = new Player(level.player, this.scale, this.offset);

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
    var x = (index % level.mapSize.cols);
    if (index >= level.mapSize.cols) {
      y = Math.floor(index / level.mapSize.cols);
    }
    return new Item({
      'item': item,
      'x': x,
      'y': y
    }, this.scale, sprite, this.offset);
  }, this);
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

  // Draw background to blue color
  ctx.fillStyle = "#6ad8e3"
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Draw map to screen
  this.map.forEach(function (block) {
    block.render();
  });

  this.items.forEach(function (item) {
    if (item.sprite != '') {
      item.render();
    }
  });
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
    console.log(game);
    game.menu.menuObj.forEach(function (box) {
      if (box.type === 'button') {
        if (e.layerX < (box.x - (box.width / 2)) + box.width && e.layerX > box.x - box.width / 2) {
          if (e.layerY < (box.y - box.height * 0.2) + box.height && e.layerY > box.y - box.height * 0.2) {
            if (box.text === 'Restart') {
              game.menu.levelButtonClicked(game.level.levelNumber);
            } else if (box.text === 'Next') {
              console.log(levels.level.length, game.level.levelNumber);
              if (levels.level.length > game.level.levelNumber) {
                game.menu.levelButtonClicked(game.level.levelNumber + 1);
              } else {
                game.menu.levelButtonClicked(1);
              }
            }
          }
        }
      }
    });
    break;
  case 'gameOver':
    game.menu.menuObj.forEach(function (box) {
      if (box.type === 'button') {
        if (e.layerX < (box.x - (box.width / 2)) + box.width && e.layerX > box.x - box.width / 2) {
          if (e.layerY < (box.y - box.height * 0.2) + box.height && e.layerY > box.y - box.height * 0.2) {
            if (box.text === 'Restart') {
              game.menu.levelButtonClicked(game.level.levelNumber);
            } else if (box.text === 'Back') {
              game.menu = new StartMenu();
              globalState = 'startMenu';
            }
          }
        }
      }
    });
    break;
  }
});
