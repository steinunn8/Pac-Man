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
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["Ghost"];

    this.rememberResets();

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isDead = false; //only eyes
    this._isEatable = false;
    this._hadMoved = false;
};

Ghost.prototype = new Entity();
Ghost.prototype.directions = ["up", "down", "left", "right"];
Ghost.prototype.direction = "left";
Ghost.prototype.nextDirection = "left";

// TODO:
//Ghosts are forced to reverse direction by the system anytime the mode changes from: 
//chase-to-scatter, chase-to-frightened, scatter-to-chase, and scatter-to-frightened. 
//Ghosts do not reverse direction when changing back from frightened to chase or scatter modes.

// possible modes: chase, scatter, frightened, home
Ghost.prototype.mode = "chase";

Ghost.prototype.rememberResets = function () {
    // Remember my reset positions and home corner (starting target)
    this.reset_row = this.row;
    this.reset_column = this.column;
    this.startTarget = {
        row: this.target_.row,
        column: this.target_.column
    };
};

Ghost.prototype.resetTarget = function() {
    this.target_.row = this.startTarget.row;
    this.target_.column = this.startTarget.column;
};

Ghost.prototype.reset = function () {
    this.setPos(this.reset_row, this.reset_column);
};

Ghost.prototype.drawCentredAt = function(ctx, cx, cy, rotation) {

};

Ghost.prototype.hitMe = function (aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        console.log("PacMan hit Ghost");
        
        //~ Implement "ghost-maniac-mode" with Boolean value?
        //~ [But wheeere?]
        aggressor.kill();
    } 
};

Ghost.prototype.update = function (du) {
    // TODO: Unregister and check for death (if blue)
    spatialManager.unregister(this);

    // moves the ghost
    this._hasMoved = this.move(du, this.direction, this.nextDirection);

    // If we're about to move, make decision
    if (this._hasMoved) {
        var directions = entityManager._maze[0].getDirections(this.row, this.column);
        // make it impossible to turn back
        util.arrayRemove(directions, this.getOpposite(this.direction));

        // if we don't have a choice, continue
        if(directions.length == 1) {
            this.nextDirection = directions[0];
        } else if(directions.length >= 2) {
            // update target if needed and change direction
            if(this.mode === "chase") {
                this.updateTarget();
            } else if(this.mode === "scatter") {
                this.resetTarget();
            }
            this.nextDirection = this.getNextDirection(directions);
        }

        this._hasMoved = false;
    }
    
    // TODO: If going through "tunnel", handle
    spatialManager.register(this);
};

Ghost.prototype.getNextDirection = function(directions) {
    var minDist = Infinity;
    var direction = 0;
    for(var i = 0; i < directions.length; i++) {
        var offset = this.getOffset(directions[i]);
        var pos = this.getPos();

        var yPos = pos.row + offset.row;
        var xPos = pos.column + offset.column;
        var dist = util.distSq(xPos, yPos, this.target_.column, this.target_.row);

        if(dist < minDist) {
            minDist = dist;
            direction = directions[i];
        }
    }

    // if frightened we should random
    if(this.mode === "frightened") {
        var randomValue = parseInt(Math.random()*directions.length);
        direction = directions[randomValue];
    }

    return direction;
};

Ghost.prototype.drawCentredAt = function(ctx, cx, cy, rotation) {

};

var g_cell = 0;
Ghost.prototype.render = function (ctx) {
    // TODO: If dead, change to sprite eyes and then send home
    //       if specialCapsule, draw blue/white ghost from sprite
    
    // this.sprite.drawCentredAt(ctx, pos.xPos, pos.yPos, rotation);
    var pos = util.getCoordsFromBox(this.row, this.column);
    var boxDim = consts.BOX_DIMENSION;

    var dir = this.direction;
    if (dir === "up") {
        pos.yPos += (this.timeToNext)*boxDim;
    } else if (dir === "down") {
        pos.yPos -= (this.timeToNext)*boxDim;
    } else if (dir === "left") {
        pos.xPos += (this.timeToNext)*boxDim;
    } else if (dir === "right") {
        pos.xPos -= (this.timeToNext)*boxDim;
    }
    /*util.fillBox(ctx, pos.xPos - dimens/2,
                 pos.yPos - dimens/2,
                 dimens, dimens, "blue");*/
    g_sprites[g_cell].drawCentredAt(ctx, 
                            pos.xPos, 
                            pos.yPos);
    ++g_cell;
    if(g_cell == 2) g_cell = 0;
};
