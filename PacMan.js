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
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};


//TODO: Change to arrow keys?
PacMan.prototype.KEY_UP = 'W'.charCodeAt(0);
PacMan.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
PacMan.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
PacMan.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
PacMan.prototype.rotation = 0;
PacMan.prototype.cx = 200;
PacMan.prototype.cy = 200;
PacMan.prototype.velX = 0;
PacMan.prototype.velY = 0;
//TODO: FIX
PacMan.prototype.radius = 20;

// HACKED-IN AUDIO (no preloading)
//TODO: Change audio
PacMan.prototype.eatSound = new Audio("sounds/shipWarp.ogg");
PacMan.prototype.warpSound = new Audio("sounds/shipWarp.ogg");

PacMan.prototype.getRadius = function () {
    return this.radius;
};

PacMan.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

PacMan.prototype.halt = function () {
    //TODO: Maybe an array for directions??
    this.velX = 0;
    this.velY = 0;
};

//When PacMan dies we warp him to his original place
PacMan.prototype.warp = function (ctx){
    //TODO: Move to original place with animation
    this.reset();
};

PacMan.prototype.update = function (du) {
    
    // TODO: Unregister and check for death


    
    // TODO: Warp if isColliding, otherwise Register


    // TODO: If going through "tunnel", handle 

};

PacMan.prototype.render = function (ctx) {
    util.drawYellowCircle(ctx, this.cx, this.cy, this.radius);
};
