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
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["Capsule"];
    
    this.isAlive = true;
};

Capsule.prototype.row = -1;
Capsule.prototype.column = -1;


Capsule.prototype.isEaten = function(){
    return false;
};

Capsule.prototype.update = function(du){

};

Capsule.prototype.render = function(du){

};