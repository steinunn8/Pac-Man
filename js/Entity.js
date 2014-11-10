// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Entity type by default is undefined
    this.entityType = undefined;
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();
    
    // I am not dead yet!
    this._isDeadNow = false;
    // Time to next is the remaining proportion of the distance traveled
    // to next cell
    this.timeToNext = 1;
};

Entity.prototype.direction = 0;
Entity.prototype.nextDirection = "left";

Entity.prototype.getNextPos = function(direction) {
    var row = this.row,
        column = this.column;
    
    if (direction === "up") {
        row -= 1;
    } else if (direction === "down") {
        row += 1;
    } else if (direction === "left") {
        column -= 1;
    } else if (direction === "right") {
        column += 1;
    }

    return util.wrapPosition(row, column);
};

Entity.prototype.move = function(du, direction, nextDirection) {
    this.timeToNext -= this.speed * du / NOMINAL_UPDATE_INTERVAL;
    if (this.timeToNext <= 0) {

        var oldPos = this.getPos();

        // First try the the key pressed
        var nextPos = this.getNextPos(nextDirection);

        if (!entityManager._maze[0].penetrable(nextPos.row, nextPos.column)) {
            // Not allowed to go there, Try the old direction
            nextPos = this.getNextPos(direction);
        } else {
            // We can move into the new direction. For now just make
            // that our future direction, and move later.
            this.direction = nextDirection;
        }
        
        if (!entityManager._maze[0].penetrable(nextPos.row, nextPos.column)) {
            // Still not allowed, so just stop
            this.direction = 0;
        } else {
            // we can move!!
            this.setPos(nextPos.row, nextPos.column);
            spatialManager.imGoingHere(this, nextPos.row, nextPos.column);
        }

        // Make the distance to next cell positive again
        this.timeToNext += 1;

        return true;
    }

    return false;
};

Entity.prototype.getOpposite = function(direction) {
    return (direction === "left") ? "right" :
           (direction === "right") ? "left" :
           (direction === "up") ? "down" : 
           (direction === "down") ? "up" :
           0;
};

// returns offset based on direction, for example
// "left" would return {row: -1, column: 0};
Entity.prototype.getOffset = function(direction) {
    var offset = {row: 0, column: 0};
    offset.column = (direction === "left") ? -1 :
                    (direction === "right") ? 1 : 
                    0;
    offset.row = (direction === "up") ? -1 : 
                 (direction === "down") ? 1 :
                 0;

    return offset;
}

Entity.prototype.getPos = function() {
    return { row: this.row, column: this.column };
};

Entity.prototype.setPos = function(row, column) {
    this.row = row;
    this.column = column;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

Entity.prototype.hitMe = function(aggressor){
    //~ Implement me for every type of Entity
    //~ who extends me
    return false;
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

Entity.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};
