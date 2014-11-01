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
    this.reset_rotation = this.rotation;
};


//TODO: Change to arrow keys?
PacMan.prototype.KEY_UP = 'W'.charCodeAt(0);
PacMan.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
PacMan.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
PacMan.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
PacMan.prototype.direction = 0;

// HACKED-IN AUDIO (no preloading)
//TODO: Change audio
PacMan.prototype.eatSound = new Audio("sounds/shipWarp.ogg");
PacMan.prototype.warpSound = new Audio("sounds/shipWarp.ogg");

PacMan.prototype.reset = function () {
    this.setPos(this.reset_row, this.reset_column);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

//When PacMan dies we warp him to his original place
PacMan.prototype.warp = function (ctx){
    //TODO: Move to original place with animation
    this.reset();
};

// Time to next is the remaining proportion of the distance traveled
// to next cell
PacMan.prototype.timeToNext = 1;
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

        var dir = this.nextDirection;

        if (dir === "up") {
            this.row -= 1;
        } else if (dir === "down") {
            this.row += 1;
        } else if (dir === "left") {
            this.column -= 1;
        } else if (dir === "right") {
            this.column += 1;
        }

        this.direction = this.nextDirection;
        
        // Make it positive again
        this.timeToNext += 1;
    }
    
    // TODO: Unregister and check for death
    
    // TODO: Warp if isColliding, otherwise Register

    // TODO: If going through "tunnel", handle 

};

PacMan.prototype.render = function (ctx) {
    var pos = util.getCoordsFromBox(this.row, this.column);
    this.sprite.drawCentredAt(ctx, pos.xPos, pos.yPos, this.rotation);
};
