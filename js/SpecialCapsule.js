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
};

SpecialCapsule.prototype = new Entity();

SpecialCapsule.prototype.row = -1;
SpecialCapsule.prototype.column = -1;

SpecialCapsule.prototype.kill = function () {
    this._isDeadNow = true;
    this.isAlive = false;
    spatialManager.unregister(this);
};

SpecialCapsule.prototype.hitMe = function(aggressor) {
    //~ console.log("Special Capsule under attack!");
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        //~ console.log("Special Capsule eaten by PacMan");
        
        //~ Implement "ghost-maniac-mode" with Boolean value?
        //~ [But wheeere?]
        //~ this._animProp = 0;
        this.kill();
    }};

SpecialCapsule.prototype.update = function(du) {
    if(!this.isAlive) {
        return entityManager.KILL_ME_NOW;
    }
};

SpecialCapsule.prototype.render = function(ctx) {
    //~ console.log("Capsule rendering!");
    
    if (!this.isAlive) return;
    
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = "#FBB382";
    
    var pos = util.getCoordsFromBox(this.row, this.column);
    //~ console.log("special capsule pos", pos);
    util.fillCircle(ctx, pos.xPos, pos.yPos, consts.BOX_DIMENSION/2.5);

    ctx.fillStyle = oldStyle; 
};