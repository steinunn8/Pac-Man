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
Fruit.prototype.points = 100;
Fruit.prototype.type = "cherrie";
Fruit.prototype.timer = 10;

Fruit.prototype.kill = function () {
    this.isAlive = false;
    spatialManager.unregister(this);
    return entityManager.KILL_ME_NOW;
};

Fruit.prototype.hitMe = function(aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        if (!this.isMerePoints) {
            backgroundManager.burst(1, "#FFFFFF");
            audioManager.play(eatFruit);
            entityManager.updateScore(this.points);
            this.turnIntoPoints();
        }
    }
};

Fruit.prototype.turnIntoPoints = function() {
    this.isMerePoints = true;
    this.fruitPointIndex = util.fruitOrder.indexOf(this.type);
    this.timer = 1;
};

Fruit.prototype.update = function(du) {
    this.timer -= du/SECS_TO_NOMINALS;
    if (this.timer < 0) {
        return this.kill();
    }
};

Fruit.prototype.render = function(ctx) {
    if (!this.isAlive) return;
    var pos = util.getCoordsFromBox(this.row, this.column);
    var sprite = this.isMerePoints ?
            g_sprites.extras.fruitPoints[this.fruitPointIndex] :
            g_sprites.extras.fruits[this.type];
    sprite.drawCentredAt(ctx, pos.xPos, pos.yPos);
};
