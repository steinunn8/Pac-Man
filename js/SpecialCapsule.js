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
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["SpecialCapsule"];
    
    this.isAlive = true;
};

SpecialCapsule.prototype = new Entity();

SpecialCapsule.prototype.row = -1;
SpecialCapsule.prototype.column = -1;

SpecialCapsule.prototype.hitMe = function(aggressor) {
    //~ Implement me for every type of Entity
    //~ who extends me
    return false;
};

SpecialCapsule.prototype.update = function(du) {
    return;
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