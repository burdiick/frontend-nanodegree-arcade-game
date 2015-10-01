# Chipper's Challenge

Welcome to my Project Three game!

The gameplay is simple:

Select your character, then starting level to play.

Move your character with the arrow keys, or ASWD.

Press the escape key or on screen pause button to pause.

## Running the game

You can run the game by visiting http://burdiick.github.io

Or by downloading the source and opening index.html in your browser.

## Modifications

Want to add to the game on your own? You can!

The main menu screen can hold up to 12 levels.

### Adding A Level

* Find the levels object in the source code.
* Copy levels.level[0] and paste it to the end of the array.
* Edit the contents of your level.

### levels Object

* number: level number
* mapSize: x: number of squares wide, y: number of squares tall
* map: Values:
  - 0: water-block
  - 1: stone-block
  - 2: grass-block
  - 3: cannot walk on(Use for Rocks usually)
* items: Values:
  - 0: nothing
  - 1: Rock
  - 2: gem
  - 3: Key
  - 4: gate
  - 7: Finish
* enemies:
  - type: currently not used
  - speed: Enemy speed. 7 is pretty normal
  - x: starting x square location. 0 indexed
  - y: starting y square location. 0 indexed
  - path: enemy will go in order from index 0 to n.
    * x: square location.
    * y: square location.
* player:
  - x: starting location.
  - y: starting location.
* completed: leave 0;
* gems:
  - collected: leave 0;
  - total: Count up all the 2s in your items array and put the sum here.
* helpText: A message to show while playing the level.
