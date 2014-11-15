// ==============
// Fruit Object
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function Fruit(descr) {
    
    this.setup(descr);
    spatialManager.register(this);
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["Fruits"];
    
    this.isAlive = true;
};

Fruit.prototype = new Entity();
Fruit.prototype.row = 15;
Fruit.prototype.column = 9;
Fruit.prototype.points = 200;
Fruit.prototype.type = 0;

Fruit.prototype.kill = function () {
    this._isDeadNow = true;
    this.isAlive = false;
    audioManager.play(eatFruit);
    spatialManager.unregister(this);
};

Fruit.prototype.hitMe = function(aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        this.kill();
    }
};

Fruit.prototype.update = function(du) {
    if(!this.isAlive) {
        entityManager.updateScore(this.points);
        return entityManager.KILL_ME_NOW;
    }
};

Fruit.prototype.render = function(ctx) {
    if (!this.isAlive) return;
    var pos = util.getCoordsFromBox(this.row, this.column);
    g_sprites.extras.fruits[this.type].drawCentredAt(ctx, pos.xPos, pos.yPos);
    //Berry on the bottom of page, todo: find place
    //g_sprites.extras.fruits[0].drawCentredAt(ctx, 400, 425);
};
