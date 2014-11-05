// =============
// Ghost Object
// =============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function Ghost(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isDead = false; //only eyes
};

Ghost.prototype = new Entity();

Ghost.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_row = this.row;
    this.reset_column = this.column;
};

Ghost.prototype.direction = 0;
Ghost.prototype.nextDirection = 0;

Ghost.prototype.reset = function () {
    this.setPos(this.reset_row, this.reset_column);
};

Ghost.prototype.update = function (du) {
    // TODO: Unregister and check for death (if blue)
    spatialManager.unregister(this);

    // TODO: If going through "tunnel", handle
    spatialManager.register(this);
};

Ghost.prototype.drawCentredAt = function(ctx, cx, cy, rotation) {

};

Ghost.prototype.render = function (ctx) {
    // TODO: If dead, change to sprite eyes and then send home
    //       if specialCapsule, draw blue/white ghost from sprite
    
    // this.sprite.drawCentredAt(ctx, pos.xPos, pos.yPos, rotation);
};
