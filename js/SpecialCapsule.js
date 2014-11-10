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

SpecialCapsule.prototype.row = -1;
SpecialCapsule.prototype.column = -1;


SpecialCapsule.prototype.isEaten = function(){
    return false;
};

SpecialCapsule.prototype.update = function(du){

};

SpecialCapsule.prototype.render = function(du){

};