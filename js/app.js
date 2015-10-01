'use strict';
// Set canvas size.
// TODO set these values based on device.
var SCALE_WIDTH = 600;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 600;

// Does this work ok/ is this an ok practice?
if ($(window).width < $(window).height) {
  CANVAS_WIDTH = $(window).width() - 10;
  CANVAS_HEIGHT = CANVAS_WIDTH;
} {
  CANVAS_HEIGHT = $(window).height() - 10;
  CANVAS_WIDTH = CANVAS_HEIGHT;
}

//console.log(CANVAS_WIDTH, CANVAS_HEIGHT);
var MAP_WIDTH = CANVAS_WIDTH * 0.9;
var MAP_HEIGHT = CANVAS_HEIGHT * 0.9;
var globalState = 'startMenu';

/*---------------------------------------------------------
 * The Game class!
 * Holds the whole game.
 *---------------------------------------------------------
 */
var Game = function () {
  this.menu = new StartMenu();
  this.level = '';
  this.character = 'images/char-boy.png';
};

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
    'bl': 'middle',
    'sdw': 'black',
    'bg': false,
    'x': 100,
    'y': 200,
    'width': 400,
    'height': 400,
    'itemsWide': 4,
    'itemsTall': 4,
    'image': 'images/Star.png'
  }, {
    'type': 'charList',
    'text': '',
    'font': 'h3',
    'tl': 'center',
    'bl': 'middle',
    'sdw': 'black',
    'bg': false,
    'x': 50,
    'y': 500,
    'width': 500,
    'height': 100,
    'itemsWide': 5,
    'itemsTall': 1,
    'image': ''
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
    'x': 20,
    'y': 35
  }, {
    'type': 'text',
    'label': 'Lives: ',
    'text': 'lives',
    'font': 'h1',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 490,
    'y': 35
  }, {
    'type': 'text',
    'label': 'Gems: ',
    'text': 'gems',
    'font': 'h1',
    'tl': 'left',
    'bl': 'bottom',
    'sdw': 'black',
    'bg': true,
    'x': 230,
    'y': 35
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
    'y': 580
  }, {
    'type': 'icon',
    'text': 'pause',
    'font': 'h4',
    'tl': 'right',
    'bl': 'bottom',
    'sdw': 'transparent',
    'bg': false,
    'x': 530,
    'y': 530,
    'width': 50,
    'height': 50,
    'image': 'images/pause-button.png'
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
    'bl': 'middle',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 100
  }, {
    'type': 'button',
    'text': "Restart",
    'font': 'h2',
    'tl': 'center',
    'bl': 'middle',
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
    'bl': 'middle',
    'sdw': 'black',
    'x': 400,
    'y': 300,
    'width': 130,
    'height': 60
  }, {
    'type': 'button',
    'text': "Back",
    'font': 'h2',
    'tl': 'center',
    'bl': 'middle',
    'sdw': 'black',
    'x': 300,
    'y': 420,
    'width': 130,
    'height': 60
  }],
  'pause': [{ // PAUSE MENU ------------------------
    'type': 'text',
    'text': 'Pause Menu',
    'font': 'h5',
    'tl': 'left',
    'bl': 'middle',
    'sdw': 'black',
    'bg': false,
    'x': 10,
    'y': 10
  }, {
    'type': 'text',
    'text': "Paused",
    'font': 'h1',
    'tl': 'center',
    'bl': 'middle',
    'sdw': 'black',
    'bg': false,
    'x': 300,
    'y': 100
  }, {
    'type': 'button',
    'text': "Restart",
    'font': 'h2',
    'tl': 'center',
    'bl': 'middle',
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
    'bl': 'middle',
    'sdw': 'black',
    'x': 400,
    'y': 350,
    'width': 130,
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
    'bl': 'middle',
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
    'bl': 'middle',
    'sdw': 'black',
    'x': 400,
    'y': 350,
    'width': 130,
    'height': 60
  }]
};

/**
 * @description Base Menu object for all other menus.
 * @param {menus} menus object from list above.
 */
var Menu = function (menu) {
  this.menuObj = menu;
  this.items = '';
  this.timer = 0;
  //this.name = menu.name;
  //console.log(this.items, 'in Menu constructor');
};

/**
 * @description Build menu item objects from menus obj.
 * @param {menus} original Menus from list above.
 * @param {varies} items   Datasource for original to work on
 * @return {menuItems[]}   Completed array of objects for rendering
 */
Menu.prototype.setListItems = function (original, items) {
  return items.map(function (item, index) {
    var width = original.width / original.itemsWide;
    var height = original.height / original.itemsTall;
    var x = width * (index % original.itemsWide) + original.x;
    var y = 0 + original.y;

    if (index >= original.itemsWide) {
      y = (height * Math.floor(index / original.itemsTall)) + original.y;
    }

    return {
      'type': 'button',
      'text': item.number,
      'tl': original.tl,
      'bl': original.bl,
      'sdw': original.sdw,
      'font': original.font,
      'x': x + (width * 0.5),
      'y': y + (height * 0.5),
      'leftCorner': {
        'x': x,
        'y': y
      },
      'width': width,
      'height': height,
      'image': original.image || item.image,
      'completed': item.completed || items.completed
    };
  }, this);
};

/**
 * @description Render current menu
 */
Menu.prototype.render = function () {
  // menuObj is a list of all UI objects needing to be drawn.
  this.menuObj.forEach(function (item) {
    switch (item.type) {
    case 'button':
      ctx.save();
      ctx.drawImage(Resources.get('images/button.png'), scale(item.x - (item.width / 2)), scale(item.y - (item.width * 1.2)), scale(item.width), scale(item.width * 1.5));
      ctx.restore();
    case 'text':
      this.drawText(item);
      break;
    case 'icon':
      ctx.drawImage(Resources.get(item.image), scale(item.x), scale(item.y) - scale(item.height * 0.55), scale(item.width), scale(item.height * 1.49));
      break;
    case 'levelList':
      this.list.forEach(function (obj, index) {
        if (levels.level[index].completed) {
          this.drawImg(obj);
        } else {
          ctx.save();
          ctx.globalAlpha = 0.5;
          this.drawImg(obj);
          ctx.restore();
        }
        this.drawText(obj);
      }, this);
      break;
    case 'charList':
      //console.log(this.charList);
      this.charList.forEach(function (obj) {
        //console.log(obj.completed);
        if (obj.completed) {
          ctx.drawImage(Resources.get('images/Selector.png'), scale(obj.leftCorner.x), scale(obj.leftCorner.y), scale(obj.width), scale(obj.height));
          this.drawImg(obj);
        } else {
          this.drawImg(obj);
        }
      }, this);
      break;
    }
  }, this);
};

/**
 * @description Load a level and set the game to run
 * @param  {int} number Number of level to be loaded
 */
Menu.prototype.levelButtonClicked = function (number) {
  game.level = new Level(number);
  game.menu = new UserInterface(game.level);
  globalState = 'run';
};

/**
 * @description Draw an image to canvas
 * @param  {Object} img Image object with location, size, etc
 */
Menu.prototype.drawImg = function (img) {
  ctx.save();
  //console.log(img);
  if (img.sdw != 'transparent') {
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = img.sdw;
  }
  ctx.drawImage(Resources.get(img.image), scale(img.leftCorner.x), scale(img.leftCorner.y - (img.height * 0.5)), scale(img.width), scale(img.height * 1.59));
  ctx.restore();
};

/**
 * @description Draw text to the canvas
 * @param  {Object} obj Image object with location, size, sprite, etc
 */
Menu.prototype.drawText = function (obj) {

  // If this text object has a label attribute, measure it.
  var labelWidth = 0;
  if (obj.label) {
    this.setFont('h2');
    labelWidth = ctx.measureText(obj.label).width;
  }

  // Measure length of text
  this.setFont(obj.font);
  var textWidth = ctx.measureText(obj.text).width;

  // Set alignment
  ctx.save();
  ctx.textAlign = obj.tl;
  ctx.textBaseline = obj.bl;

  // Render background gray box
  if (obj.bg) {
    ctx.save();
    ctx.fillStyle = "#1F1F1F";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(scale(obj.x) - scale(10), scale(obj.y) - scale(20), labelWidth + textWidth + scale(20), scale(20));
    ctx.restore();
  }

  // Set drop shadow if specified
  if (obj.sdw != 'transparent') {
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = obj.sdw;
  }

  this.setFont(obj.font);

  // Draw the Text
  if (labelWidth) {
    this.setFont('h2');
    ctx.fillText(obj.label, scale(obj.x), scale(obj.y));
    this.setFont(obj.font);
    ctx.fillText(obj.text, scale(obj.x) + labelWidth, scale(obj.y));
  } else {
    ctx.fillText(obj.text, scale(obj.x), scale(obj.y));
    ctx.strokeText(obj.text, scale(obj.x), scale(obj.y));
  }
  ctx.restore();
};

/**
 * @description set attributes of canvas
 * @param {string} style string to be checked by switch
 */
Menu.prototype.setFont = function (style) {
  // Set ctx to required style.
  // TODO there has to be a better way to do this.
  switch (style) {
  case 'h0':
    ctx.font = '40px Helvetica';
    ctx.fillStyle = '#d3ff00';
    break;
  case 'h0-red':
    ctx.font = '40px Helvetica';
    ctx.fillStyle = '#cc2514';
    break;
  case "h1":
    ctx.font = "30px Helvetica";
    ctx.fillStyle = '#fff';
    break;
  case 'h2':
    ctx.font = "25px Helvetica";
    ctx.fillStyle = '#Ddff00';
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
};

/**
 * @description StartMenu Class
 * @constructor
 * @property {array} charList   Array of Character Objects
 * @property {array} menuObj    Array of Level Objects
 */
var StartMenu = function () {
  Menu.call(this, menus.start);
  // Lists for holding special buttons
  this.charList = {};
  this.menuObj.forEach(function (item) {
    if (item.type === 'levelList') {
      console.log(item, 'before');
      var temp = item;
      this.list = this.setListItems(item, levels.level);
      if (item === temp) {
        console.log('equal');
      } else {
        console.log('not equal');
      }

    } else if (item.type === 'charList') {
      var chars = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
      ];

      var characters = chars.map(function (item, index) {
        console.log(item);
        var selected = 0;
        if (index === 0) {
          selected = true;
        }

        return {
          'image': item,
          'completed': selected
        };
      }, item);

      this.charList = this.setListItems(item, characters);

      this.charList.forEach(function (obj) {
        var imgArray = obj.image;
        if (Array.isArray(obj.image)) {
          var temp = imgArray.splice(0, 1);
          obj.image = temp[0];
        } else {}
      }, this);
    }
  }, this);
};
StartMenu.prototype = Object.create(Menu.prototype);
StartMenu.prototype.constructor = StartMenu;

StartMenu.prototype.startMenuRender = function () {
  // Draw background, the call prototypes render()
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
};

/**
 * @description Done Menu Class
 * @constructor
 * TODO: Nothing special. Probably should be refactored out of existance
 */
var DoneMenu = function () {
  Menu.call(this, menus.done);
};
DoneMenu.prototype = Object.create(Menu.prototype);
DoneMenu.prototype.constructor = DoneMenu;

DoneMenu.prototype.renderDoneMenu = function () {
  // Draw background, the call prototypes render()
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
};

/**
 * @description GameOverMenu Class
 * @constructor
 * TODO: Also nothing special. See DoneMenu Comments
 */
var GameOverMenu = function () {
  Menu.call(this, menus.gameOver);
};
GameOverMenu.prototype = Object.create(Menu.prototype);
GameOverMenu.prototype.constructor = DoneMenu;

GameOverMenu.prototype.renderGameOverMenu = function () {
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
};

/**
 * @description PauseMenu Class
 * @constructor
 * @param {Object} level Level loaded when PauseMenu was created.
 * TODO: use level to resume in the same exact place as when paused.
 */
var PauseMenu = function (level) {
  Menu.call(this, menus.pause);
  this.level = level;
};
PauseMenu.prototype = Object.create(Menu.prototype);
PauseMenu.prototype.constructor = PauseMenu;

PauseMenu.prototype.renderPauseMenu = function () {
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.render();
};

/**
 * @description UserInterface Class. Inherits from Menu
 * @constructor
 * @param {Object} level The level to load stats from
 */
var UserInterface = function (level) {
  Menu.call(this, menus.hud);
  this.level = level;
  this.messages = [];

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
    }
  }, this);
};
UserInterface.prototype = Object.create(Menu.prototype);
UserInterface.prototype.constructor = UserInterface;

UserInterface.prototype.renderUserInterface = function () {
  this.render();

  /**
   * @description Render the status messages
   */
  this.messages.forEach(function (message, index) {
    var height;
    if (index <= 1) {
      height = 0;
    } else {
      height = index - 1;
    }
    var newMessage = {
      'text': message.message,
      'x': (CANVAS_WIDTH / 2),
      'y': (CANVAS_HEIGHT / 2) - (scale(50) * height),
      'sdw': 'black',
      'tl': 'center',
      'bl': 'middle',
      'font': message.font
    };
    ctx.save();
    if (index == 1) {
      ctx.globalAlpha = 0.9;
    } else if (index === 2) {
      ctx.globalAlpha = 0.6;
    } else if (index === 3) {
      ctx.globalAlpha = 0.3;
    } else if (index >= 4) {
      ctx.globalAlpha = 0;
    } else if (index === 0) {
      if (this.timer < 1.5) {
        ctx.globalAlpha = 1 / (this.timer / 1);
        message.y = message.y + ((this.timer / 2) * (MAP_HEIGHT / 3));
      }
    }
    this.drawText(newMessage);
    ctx.restore();
  }, this);
};

/**
 * @description Update game UI
 * @param  {Object} currentLevel Current level being played
 * @param  {float} dt           Timing variable
 */
UserInterface.prototype.update = function (currentLevel, dt) {
  // Change level and goal text if level changes
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

  // Update message timer
  if (this.messages.length > 0) {
    if (this.timer >= 1.4) {
      this.timer = 0;
      this.messages.splice(0, 1);
    } else {
      this.timer = this.timer + (1 * dt);
    }
  } else {
    this.timer = 0;
  }
};

UserInterface.prototype.addMessage = function (message, font) {
  this.messages.push({
    'message': message,
    'font': font
  });
};

/**
 * @description LevelObject Class
 * @constructor
 * @param {Object} object Base object with x, y, etc.
 * @param {Object} scale  Object with scale x and y
 * @param {string} sprite String of sprite filename
 * @param {Object} offset Object with ofset x and y
 */
var LevelObject = function (object, scale, sprite, offset) {
  this.sprite = sprite;
  this.x = object.x * scale.x;
  this.y = object.y * (scale.x * 0.79);
  this.scale = scale;
  this.speed = object.speed;
  this.offset = offset;
};

LevelObject.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x + this.offset.x, this.y + this.offset.y, this.scale.x, this.scale.y);
};

/**
 * @description Functions to convert from data in
 *              array to actual canvas x and y
 * @param {int} multiplier int value to be scaled up for canvas
 */
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

/**
 * @description Block Class
 * @constructor
 * @param {Object} block    with x, y, etc
 * @param {Object} scale    Scale x and y
 * @param {string} sprite   holding sprite file location
 * @param {Object} offset   holding x and y offset for block
 * @param {bool} walkable   if true, square can be walked on.
 */
var Block = function (block, scale, sprite, offset, walkable) {
  LevelObject.call(this, block, scale, sprite, offset);
  this.block = block.item;
  this.walkable = walkable;
};
Block.prototype = Object.create(LevelObject.prototype);
Block.prototype.constructor = Block;

/**
 * @description Item Class
 * @constructor
 * @param {Object} item    with x, y, etc
 * @param {Object} scale    Scale x and y
 * @param {string} sprite   holding sprite file location
 * @param {Object} offset   holding x and y offset for item
 */
var Item = function (item, scale, sprite, offset) {
  LevelObject.call(this, item, scale, sprite, offset);
  this.y = this.y - scale.y * 0.20;
  this.item = item.item;
};
Item.prototype = Object.create(LevelObject.prototype);
Item.prototype.constructor = Item;

/**
 * @description Enemy Class
 * @constructor
 * @param {Object} enemy    with x, y, etc
 * @param {Object} scale    Scale x and y
 * @param {string} sprite   holding sprite file location
 * @param {Object} offset   holding x and y offset for enemy
 */
var Enemy = function (enemy, scale, offset) {
  LevelObject.call(this, enemy, scale, 'images/enemy-bug.png', offset);

  this.y = this.y - scale.y * 0.10; // Offset enemy y by a little bit to center on block
  this.path = enemy.path;
  this.currentWaypoint = 1;

};
Enemy.prototype = Object.create(LevelObject.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * @description Update enemy location.
 * Enemies use a waypoint system.
 * Check where they are and switch waypoints if needed.
 * @param  {float} dt timer variable
 */
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

/**
 * @description Player Class
 * @constructor
 * @param {Object} player x, y, etc
 * @param {Object} scale  width, height
 * @param {Object} offset x, y
 * @property {int} initX  starting position. Should not change.
 * @property {int} initY  starting position. Should not change.
 * @property {int} prevX  if you hit a wall, go here.
 * @property {int} prevY  if you hit a wall, go here.
 * @property {int} timer  for death animation Timing.
 * @property {int} keys   key counter
 * @property {string} status  holds state of player
 * @property {Object} movement  up, down, left, right boolean
 */
var Player = function (player, scale, offset) {
  LevelObject.call(this, player, scale,
    game.character, offset);
  this.y = this.y - scale.y * 0.05;
  this.lives = 3;
  this.initX = this.x;
  this.initY = this.y;
  this.prevX = this.x;
  this.prevY = this.y;
  this.speed = 7;
  this.timer = 0;
  this.keys = 0;

  this.status = 'standing';
  this.movement = {
    'up': false,
    'down': false,
    'left': false,
    'right': false
  };
};
Player.prototype = Object.create(LevelObject.prototype);
Player.prototype.constructor = Player;

/**
 * @description switches state to dead and loads dead sprite
 * @param  {float} dt time scale
 */
Player.prototype.die = function (dt) {
  var string = insertAt(game.character, '-dead', game.character.length - 4);
  //console.log(string);
  this.sprite = string;
  this.status = 'dead';
};

Player.prototype.update = function (dt) {
  // Move the character based on speed attribute.
  // Calculate speed for diaginals
  if (this.status !== 'dead') {
    this.sprite = game.character;
    this.prevX = this.x;
    this.prevY = this.y;
    if (this.movement.up) {
      if (this.movement.right) {
        this.x = this.x + (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y - (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else if (this.movement.left) {
        this.x = this.x - (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y - (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else {
        this.y = this.y - (this.scale.x / 2) * this.speed * dt;
      }
    } else if (this.movement.right) {
      if (this.movement.up) {
        this.x = this.x + (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y - (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else if (this.movement.down) {
        this.x = this.x + (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y + (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else {
        this.x = this.x + (this.scale.x / 2) * this.speed * dt;
      }
    } else if (this.movement.down) {
      if (this.movement.right) {
        this.x = this.x + (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y + (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else if (this.movement.left) {
        this.x = this.x - (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y + (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else {
        this.y = this.y + (this.scale.x / 2) * this.speed * dt;
      }
    } else if (this.movement.left) {
      if (this.movement.down) {
        this.x = this.x - (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y + (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else if (this.movement.up) {
        this.x = this.x - (this.scale.x / 2 * (this.speed * dt) * 0.707);
        this.y = this.y - (this.scale.x / 2 * (this.speed * dt) * 0.707);
      } else {
        this.x = this.x - (this.scale.x / 2) * this.speed * dt;
      }
    }
  } else if (this.status === 'dead') {
    this.timer += 1 * dt;
    if (this.timer >= 1) {
      //console.log(this.timer);
      this.timer = 0;

      if (this.lives <= 0) {
        game.menu = new GameOverMenu();
        globalState = 'gameOver';
        this.status = 'standing';
        game.level.gems.collected = 0;
      } else {
        this.status = 'standing';
        this.x = this.initX;
        this.prevX = this.x;
        //console.log(this);
        this.y = this.initY;
        this.prevY = this.y;

      }
    }
  }
};

// Handle input
Player.prototype.keyDown = function (key) {
  if (this.status !== 'dead') {
    this.movement[key] = true;
    this.status = 'walking';
    // For debugging only
    if (key === '1') {
      //console.log(game.level.player.x, game.level.player.y);
      //console.log(game.level.scale.x, game.level.scale.y, 'Level Scale');
      //console.log(game.level.mapSize.rows * game.level.scale.x, 'Map height');
    }
  }
};

Player.prototype.keyUp = function (key) {
  this.movement[key] = false;
  if (this.status !== 'dead') {
    this.status = 'standing';
  }
  if (key === 'escape') {
    globalState = 'pause';
    game.menu = new PauseMenu();
  }
};

/*---------------------------------------------------------
 * Object used to create and storegame levels.
 * Holds the map, enemies info and player locations.
 * New levels can be added by adding to levels.level[]
 * TODO Figure out how to put this in a seperate file.
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
  }, {
    'number': 3,
    'mapSize': {
      'rows': 10,
      'cols': 10
    },
    'map': [
      1, 3, 3, 3, 3, 3, 3, 3, 3, 1,
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      2, 0, 0, 1, 2, 2, 2, 1, 1, 2,
      2, 0, 0, 0, 0, 1, 0, 1, 1, 2,
      2, 0, 0, 0, 0, 0, 0, 0, 2, 2,
      2, 0, 0, 0, 0, 0, 0, 0, 0, 2,
      1, 0, 0, 0, 0, 0, 0, 3, 2, 2,
      1, 0, 0, 0, 0, 2, 3, 3, 2, 3,
      1, 0, 0, 0, 2, 2, 2, 2, 2, 3,
      1, 0, 0, 0, 2, 3, 3, 2, 2, 2
    ],
    'items': [
      2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 2, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 2, 1, 1, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 2, 1, 1, 0, 0, 7,
    ],
    'enemies': [{
      'type': 'red-bug',
      'speed': 20,
      'x': 3,
      'y': 2,
      'path': [{
        'x': 3,
        'y': 2
      }, {
        'x': 9,
        'y': 2
      }]
    }, {
      'type': 'red-bug',
      'speed': 9,
      'x': 4,
      'y': 8,
      'path': [{
        'x': 4,
        'y': 8
      }, {
        'x': 8,
        'y': 8
      }, {
        'x': 8,
        'y': 6
      }, {
        'x': 8,
        'y': 8
      }],
    }],
    'player': {
      'x': 0,
      'y': 5
    },
    'completed': 0,
    'gems': {
      'collected': 0,
      'total': 5
    },
    'helpText': 'Collet all gems and reach the goal!'
  }, {
    'number': 4,
    'mapSize': {
      'rows': 7,
      'cols': 7
    },
    'map': [
      1, 1, 3, 3, 3, 1, 1,
      1, 1, 1, 1, 1, 1, 1,
      3, 1, 3, 3, 1, 3, 3,
      1, 1, 3, 1, 1, 3, 1,
      1, 1, 3, 1, 1, 1, 1,
      3, 3, 3, 3, 3, 3, 1,
      3, 3, 1, 1, 1, 1, 1

    ],
    'items': [
      0, 0, 1, 1, 1, 2, 2,
      0, 0, 0, 0, 0, 0, 0,
      1, 4, 1, 1, 0, 1, 1,
      7, 0, 1, 0, 0, 1, 2,
      0, 0, 1, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 0,
      1, 1, 3, 0, 0, 0, 0
    ],
    'enemies': [{
      'type': 'red-bug',
      'speed': 5,
      'x': 3,
      'y': 4,
      'path': [{
        'x': 3,
        'y': 4
      }, {
        'x': 6,
        'y': 4
      }]
    }],
    'player': {
      'x': 0,
      'y': 0
    },
    'completed': 0,
    'gems': {
      'collected': 0,
      'total': 3
    },
    'helpText': 'Open the gate and reach the goal!'
  }, {
    'number': 5,
    'mapSize': {
      'rows': 10,
      'cols': 10
    },
    'map': [
      2, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      2, 0, 0, 0, 0, 1, 1, 1, 1, 3,
      2, 0, 0, 0, 1, 1, 1, 1, 1, 1,
      2, 0, 0, 1, 1, 1, 1, 1, 1, 3,
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      2, 0, 0, 1, 1, 3, 3, 3, 3, 3,
      2, 0, 0, 0, 1, 1, 1, 1, 1, 1,
      2, 0, 0, 0, 0, 2, 1, 1, 2, 1,
      2, 0, 0, 0, 0, 2, 2, 2, 2, 1,
      2, 0, 0, 0, 0, 1, 1, 2, 2, 2
    ],
    'items': [
      2, 0, 0, 0, 0, 0, 0, 0, 0, 2,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 1, 4,
      0, 0, 0, 0, 0, 0, 0, 0, 1, 7,
    ],
    'enemies': [{
      'type': 'red-bug',
      'speed': 5,
      'x': 8,
      'y': 0,
      'path': [{
        'x': 8,
        'y': 0
      }, {
        'x': 8,
        'y': 4
      }]
    }, {
      'type': 'red-bug',
      'speed': 5,
      'x': 7,
      'y': 4,
      'path': [{
        'x': 7,
        'y': 4
      }, {
        'x': 7,
        'y': 0
      }]
    }, {
      'type': 'red-bug',
      'speed': 7,
      'x': 6,
      'y': 3,
      'path': [{
        'x': 6,
        'y': 3
      }, {
        'x': 6,
        'y': 4
      }, {
        'x': 6,
        'y': 0
      }]
    }],
    'player': {
      'x': 0,
      'y': 9
    },
    'completed': 0,
    'gems': {
      'collected': 0,
      'total': 3
    },
    'helpText': 'Collet the key and gems, then head for the goal!'
  }]
};

/**
 * @description Level Class
 * @param {int}       number    level to Load
 * @property {int}    levelNumber
 * @property {Object} gems      x, y
 * @property {Object} mapSize   number of squares x, y.
 * @property {Obj}    scale     width, height
 * @property {bool}   completed level completed or not
 * @property {int}    width     scaled map width
 * @property {int}    height    scaled map height
 * @property {Object} offset    x, y to center map
 * @property {array}  map       Block
 * @property {array}  enemies   Enemie
 * @property {array}  items     Item
 * @property {Object} player    Player
 */
var Level = function (number) {
  var level = levels.level[number - 1];

  this.levelNumber = number;
  this.helpText = level.helpText;
  this.gems = level.gems;
  this.mapSize = level.mapSize;
  this.scale = this.setScale();
  this.completed = level.completed;
  this.width = 0;
  this.height = 0;

  // Center the map on the canvas and set its width and height
  var offsetY = 0;
  var offsetX = 0;
  if (this.mapSize.cols < this.mapSize.rows) {
    offsetX = (((MAP_WIDTH - (MAP_HEIGHT / this.mapSize.rows) * this.mapSize.cols)) / 2) + ((CANVAS_WIDTH - MAP_WIDTH) / 2);
    offsetY = (CANVAS_HEIGHT - MAP_HEIGHT) / 2;
    this.width = MAP_HEIGHT / this.mapSize.rows * this.mapSize.cols;
    this.height = MAP_HEIGHT - (this.mapSize.cols * (this.scale.y * 0.15));
  } else if (this.mapSize.cols > this.mapSize.rows) {
    offsetX = (CANVAS_WIDTH - MAP_WIDTH) / 2;
    offsetY = (((MAP_HEIGHT - (MAP_WIDTH / this.mapSize.cols) * this.mapSize.rows)) / 2) + ((CANVAS_HEIGHT - MAP_HEIGHT) / 2);
    this.width = MAP_WIDTH;
    this.height = (MAP_WIDTH / this.mapSize.cols * this.mapSize.rows) - (this.mapSize.cols * (this.scale.y * 0.1));
  } else {
    offsetX = (CANVAS_WIDTH - MAP_WIDTH) / 2;
    offsetY = (CANVAS_HEIGHT - MAP_HEIGHT) / 2;
    this.width = MAP_WIDTH;
    this.height = MAP_HEIGHT - (this.mapSize.cols * (this.scale.y * 0.12));
  }
  this.offset = {
    'x': offsetX,
    'y': offsetY
  };

  // Load the map from the levels.level array above
  // and build objects from it
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

  // Create enemies
  this.enemies = level.enemies.map(function (enemy) {
    return new Enemy(enemy, this.scale, this.offset);
  }, this);

  // Create the player
  this.player = new Player(level.player, this.scale, this.offset);

  // Create other items on the board like keys and gems.
  this.items = level.items.map(function (item, index) {
    var sprite = '';
    var offset = {
      'x': 0,
      'y': 0
    };
    switch (item) {
    case 1:
      sprite = 'images/Rock.png';
      break;
    case 2:
      sprite = 'images/gem-blue.png';
      break;
    case 3:
      sprite = 'images/Key.png';
      break;
    case 4:
      sprite = 'images/gate-closed.png';
      break;
    case 7:
      sprite = 'images/Selector.png';
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
};

/**
 * @description Set the scale for objects
 */
Level.prototype.setScale = function () {
  if ((this.mapSize.cols / this.mapSize.rows) <= CANVAS_WIDTH / CANVAS_HEIGHT) {
    return {
      'x': (MAP_HEIGHT / this.mapSize.rows),
      'y': ((MAP_HEIGHT / this.mapSize.rows) * 1.59)
    };
  } else {
    return {
      'x': (MAP_WIDTH / this.mapSize.cols),
      'y': ((MAP_WIDTH / this.mapSize.cols) * 1.59)
    };
  }
};

Level.prototype.render = function () {
  ctx.drawImage(Resources.get('images/background-one.jpg'), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Draw map to screen
  this.map.forEach(function (block) {
    block.render();
  });

  // Draw items to screen
  this.items.forEach(function (item) {
    if (item.sprite !== '') {
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
document.addEventListener('keydown', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    49: '1',
    50: '2',
    27: 'escape',
    65: 'left',
    83: 'down',
    68: 'right',
    87: 'up'
  };
  switch (globalState) {
  case 'run':
    if (game.level.player.status !== 'dead') {
      game.level.player.keyDown(allowedKeys[e.keyCode]);
    }

    break;
  case 'startMenu':
    //do something
    break;
  default:
    //do something else
  }
});

document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    49: '1',
    50: '2',
    27: 'escape',
    65: 'left',
    83: 'down',
    68: 'right',
    87: 'up'
  };
  //console.log(e);
  switch (globalState) {
  case 'run':
    game.level.player.keyUp(allowedKeys[e.keyCode]);
    break;
  case 'startMenu':
    //do something
    break;
  default:
    //do something else
  }
});

// Scale number to fit screen size.
function scale(value) {
  return (CANVAS_WIDTH / SCALE_WIDTH) * value;
}

// Event listener for mouse clicks.
// TODO: Should this be canvas.addEventListener?
document.addEventListener('mousedown', function (e) {
  //console.log(e);
  switch (globalState) {
  case 'run':
    game.menu.menuObj.forEach(function (box) {
      if (e.layerX < scale(box.x + box.width) && e.layerX > scale(box.x)) {
        if (e.layerY < scale(box.y + box.height) && e.layerY > scale(box.y)) {
          game.menu = new PauseMenu(game.level);
          globalState = 'pause';
        }
      }
    });
    break;
  case 'startMenu':
    game.menu.charList.forEach(function (box) {
      if (e.layerX < scale(box.leftCorner.x) + scale(box.width) && e.layerX > scale(box.leftCorner.x)) {
        if (e.layerY < scale(box.leftCorner.y + box.height) && e.layerY > scale(box.leftCorner.y)) {
          game.character = box.image;
          //console.log(game.character);
          game.menu.charList.forEach(function (boxtest) {
            boxtest.completed = false;
            //console.log(boxtest, 'button clicked')
          }, this);
          box.completed = true;
        }
      }
    }, this);

    game.menu.list.forEach(function (box) {
      if (e.layerX < scale(box.leftCorner.x + box.width) && e.layerX > scale(box.leftCorner.x)) {
        if (e.layerY < scale(box.leftCorner.y + box.height) && e.layerY > scale(box.leftCorner.y)) {
          game.menu.levelButtonClicked(box.text);
        }
      }
    });
    break;
  case 'done':
  case 'pause':
  case 'gameOver':
    //console.log(game);
    game.menu.menuObj.forEach(function (box) {
      if (box.type === 'button') {
        if (e.layerX < scale(box.x - (box.width / 2) + box.width) && e.layerX > scale(box.x - box.width / 2)) {
          if (e.layerY < scale((box.y - box.height * 0.2) + box.height) && e.layerY > scale(box.y - box.height * 0.3)) {
            if (box.text === 'Restart') {
              game.menu.levelButtonClicked(game.level.levelNumber);
            } else if (box.text === 'Next') {
              //console.log(levels.level.length, game.level.levelNumber);
              if (levels.level.length > game.level.levelNumber) {
                game.menu.levelButtonClicked(game.level.levelNumber + 1);
              } else {
                game.menu.levelButtonClicked(1);
              }
            } else if (box.text === 'Back') {
              game.menu = new StartMenu();
              globalState = 'startMenu';
            } else if (box.text === 'Resume') {
              globalState = 'run';
              game.level = game.menu.level;
            }
          }
        }
      }
    });
    break;
  }
});

// Insert a given string into another string.
// Used for changing file path for -dead character sprites
function insertAt(obj, string, location) {
  return obj.substr(0, location) + string + obj.substr(location);
}

// Used to stop player from moving if it collides with an obj
// TODO Probably should be part of Player, but, Time.
function stopPlayer() {
  if (game.level.player.prevX != game.level.player.x) {

    game.level.player.x = game.level.player.prevX;
  }
  if (game.level.player.prevY != game.level.player.y) {
    game.level.player.y = game.level.player.prevY;
  }
}
