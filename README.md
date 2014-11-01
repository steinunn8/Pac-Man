Pac-Man
=======

See `game.js` for entry point

Entity-manager
--------------

* Objects
  * Pac-Man
  * Ghosts
  * Maze
  * Fruit
  * (Score)

Maze
----

Wall rendering defines *wall matrix* on start based on impenetrable
walls around each cell.

### Cell coding ###

Code | Meaning 
----:| ------- 
-1   | Impenetrable
 0   | Empty
 1   | Capsule
 2   | Special Capsule
