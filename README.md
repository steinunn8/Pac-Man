Pac-Man
=======

See `game.js` for entry point

Entity-manager
--------------

* Objects
  * Pac-Man
  * Ghosts
  * Maze
  * Capsules
  * Fruit
  * (Score)

Pac-Man / Ghosts
----------------

Always have the direction of

* Up
* Down
* Left
* Right
* Stop

Move by a speed of cells per du.

Maze
----

Wall rendering defines *wall matrix* on start based on impenetrable
walls around each cell.

### Cell coding ###

Code | Meaning 
----:| -------
-4   | Impenetrable by Pac-Man / penetrable by Ghosts
-3   | Impenetrable (double lines)
-2   | Impenetrable by Pac-Man / penetrable by Ghosts (wall)
-1   | Impenetrable
 0   | Empty
 1   | Capsule
 2   | Special Capsule
 3   | Pacman
 4   | Blinky
 5   | Pinky
 6   | Clyde
 7   | Inky
