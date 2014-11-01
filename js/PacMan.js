// =============
// PacMan Object
// =============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function PacMan(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    //TODO: Sprites
    //this.sprite = this.sprite || g_sprites.ship;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

PacMan.prototype = new Entity();

PacMan.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_row = this.row;
    this.reset_column = this.column;
    this.reset_direction = this.direction;
};


//TODO: Change to arrow keys?
PacMan.prototype.KEY_UP = 'W'.charCodeAt(0);
PacMan.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
PacMan.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
PacMan.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
PacMan.prototype.direction = 0;
//TODO: FIX

// HACKED-IN AUDIO (no preloading)
//TODO: Change audio
PacMan.prototype.eatSound = new Audio("sounds/shipWarp.ogg");
PacMan.prototype.warpSound = new Audio("sounds/shipWarp.ogg");

PacMan.prototype.reset = function () {
    this.setPos(this.reset_row, this.reset_column);
    this.direction = this.reset_direction;

    this.halt();
};

//When PacMan dies we warp him to his original place
PacMan.prototype.warp = function (ctx){
    //TODO: Move to original place with animation
    this.reset();
};

PacMan.prototype.wrapPosition = function() {
    if (this.column >= g_maze.nColumns) { this.column -= g_maze.nColumns; }
    else if (this.column < 0) { this.column += g_maze.nColumns; }

    if (this.row >= g_maze.nRows) { this.row -= g_maze.nRows; }
    else if (this.row < 0) { this.row += g_maze.nRows; }
};

// Time to next is the remaining proportion of the distance traveled
// to next cell
PacMan.prototype.timeToNext = 1;

PacMan.prototype.getNextPos = function(direction) {
    var row = this.row,
        column = this.column;
    
    if (direction === "up") {
        row -= 1;
    } else if (direction === "down") {
        row += 1;
    } else if (direction === "left") {
        column -= 1;
    } else if (direction === "right") {
        column += 1;
    }

    return {row: row, column: column};
};

PacMan.prototype.update = function (du) {
    if (keys[this.KEY_UP]) {
        this.nextDirection = "up";
    }
    if (keys[this.KEY_DOWN]) {
        this.nextDirection = "down";
    }
    if (keys[this.KEY_LEFT]) {
        this.nextDirection = "left";
    }
    if (keys[this.KEY_RIGHT]) {
        this.nextDirection = "right";
    }

    this.timeToNext -= this.speed;
    if (this.timeToNext <= 0) {

        var oldPos = this.getPos();

        // First try the the key pressed
        var nextPos = this.getNextPos(this.nextDirection);

        if (!g_maze.penetrable(nextPos.row, nextPos.column)) {
            // Not allowed to go there, Try the old direction
            nextPos = this.getNextPos(this.direction);
        } else {
            // We can move into the new direction. For now just make
            // that our future direction, and move later.
            this.direction = this.nextDirection;
        }
        
        if (!g_maze.penetrable(nextPos.row, nextPos.column)) {
            // Still not allowed, so just stop
            this.direction = 0;
        } else {
            // we can move!!
            this.setPos(nextPos.row, nextPos.column);
            this.wrapPosition();
        }

        // Make the distance to next cell positive again
        this.timeToNext += 1;
    }

    // TODO: Unregister and check for death
    spatialManager.unregister(this);

    // TODO: Warp if isColliding, otherwise Register

    // TODO: If going through "tunnel", handle
    spatialManager.register(this);
};

PacMan.prototype.render = function (ctx) {
    var pos = util.getCoordsFromBox(this.row, this.column);
    this.sprite.drawCentredAt(ctx, pos.xPos, pos.yPos, this.rotation);
};
