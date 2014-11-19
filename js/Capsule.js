// ==============
// Capsule Object
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function Capsule(descr) {
    
    this.setup(descr);
    spatialManager.register(this);
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["Capsule"];
    
    this.isAlive = true;
};

Capsule.prototype = new Entity();

Capsule.prototype.row = -1;
Capsule.prototype.column = -1;
Capsule.prototype.points = 10;

Capsule.prototype.kill = function () {
    this.isAlive = false;
    spatialManager.unregister(this);
};

Capsule.prototype.hitMe = function(aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        audioManager.play(eatSound);
        screenshaker.shake(1);
        this.kill();
    }
};

Capsule.prototype.update = function(du) {
    if(!this.isAlive) {
        entityManager.updateScore(this.points);
        return entityManager.KILL_ME_NOW;
    }
};

Capsule.prototype.render = function(ctx) {
    if (!this.isAlive) return;
    
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = "#FBB382";
    
    var pos = util.getCoordsFromBox(this.row, this.column);
    util.fillCircle(ctx, pos.xPos, pos.yPos, consts.BOX_DIMENSION/8);

    ctx.fillStyle = oldStyle; 
};
