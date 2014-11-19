// ======================
// Special Capsule Object
// ======================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function SpecialCapsule(descr) {
    
    this.setup(descr);
    spatialManager.register(this);
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["SpecialCapsule"];
    
    this.isAlive = true;
    this.frame = 0.25;
};

SpecialCapsule.prototype = new Entity();

SpecialCapsule.prototype.row = -1;
SpecialCapsule.prototype.column = -1;
SpecialCapsule.prototype.points = 50;

SpecialCapsule.prototype.kill = function () {
    this.isAlive = false;
    spatialManager.unregister(this);
};

SpecialCapsule.prototype.hitMe = function(aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        
        entityManager.setFrightenedMode();

        this.kill();

        screenshaker.shake(10);
    }
};

SpecialCapsule.prototype.update = function(du) {
    if(!this.isAlive) {
        entityManager.updateScore(this.points);
        return entityManager.KILL_ME_NOW;
    }
    this.frame -= du / SECS_TO_NOMINALS;
    if(this.frame <= 0){this.frame = 0.25;}
};

SpecialCapsule.prototype.render = function(ctx) {

    if (!this.isAlive) return;
    if (this.frame < 0.125) return;
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = "#FBB382";
    
    var pos = util.getCoordsFromBox(this.row, this.column);
    util.fillCircle(ctx, pos.xPos, pos.yPos, consts.BOX_DIMENSION/2.5);

    ctx.fillStyle = oldStyle; 
};
