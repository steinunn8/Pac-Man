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
    this._isFrightened = false;
    this._hadMoved = false;
};

Ghost.prototype = new Entity();
Ghost.prototype.direction = 0;
Ghost.prototype.nextDirection = "left";

// possible modes: chase, scatter, frightened, home, movingOut
Ghost.prototype.mode = "chase";

Ghost.prototype.rememberResets = function () {
    // Remember my reset positions and home corner (starting target)
    this.reset_row = this.row;
    this.reset_column = this.column;
    this.reset_mode = this.mode;
    this.startTarget = {
        row: this.target_.row,
        column: this.target_.column
    };
    this.reset_homeTime = this.homeTime;
};

Ghost.prototype.resetTarget = function() {
    this.target_.row = this.startTarget.row;
    this.target_.column = this.startTarget.column;
};

Ghost.prototype.changeMode = function(mode) {
    // can't change the mode from home with this method
    if (this.mode === "home" || this.mode === "movingOut") {
        this._isFrightened = false;
        return;
    }
    
    if (mode === "frightened") {
        //~ console.log(this.name, "is frightened")
        this._isFrightened = true;
    } else {
        this._isFrightened = false;
    }

    //Ghosts are forced to reverse direction by the system anytime the mode changes from: 
    //chase-to-scatter, chase-to-frightened, scatter-to-chase, and scatter-to-frightened. 
    //Ghosts do not reverse direction when changing back from frightened to chase or scatter modes.
    if (this.mode !== "frightened") {
        this.nextDirection = this.getOpposite(this.direction);
    }

    this.mode = mode;
};

Ghost.prototype.reset = function () {
    this.isAlive = true;
    this.setPos(this.reset_row, this.reset_column);
    this.mode = this.reset_mode;
    this.homeTime = this.reset_homeTime;
};

Ghost.prototype.drawCentredAt = function(ctx, cx, cy, rotation) {

};

Ghost.prototype.hitMe = function (aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        console.log("PacMan hit Ghost");
        
        //~ Implement "ghost-maniac-mode" with Boolean value?
        //~ [But wheeere?]
        if (this._isFrightened) {
            this.kill();
        } else {
            aggressor.kill();
            entityManager.pacmanDead();
        }
    } 
};

Ghost.prototype.kill = function () {
    audioManager.play(eatGhost);
    this.reset();
    this.isAlive = false;
    spatialManager.unregister(this);
};

Ghost.prototype.update = function (du) {
    if (!this.isAlive) return;
    spatialManager.unregister(this);

    // moves the ghost
    this._hasMoved = this.move(du, this.direction, this.nextDirection, this.mode === "movingOut");

    // If we're about to move, make decision
    if (this._hasMoved) {
        this.homeTime -= du / NOMINAL_UPDATE_INTERVAL;
        // Don't do anything if inside the center box
        if (this.mode === "home") {
            if (this.homeTime < 0) {
                this.mode = "movingOut";
            } else {
                return;
            }
        }

        if (this.mode === "movingOut") {
            if (this.column == 14 && this.row == 14) {
                this.mode = entityManager.getGhostMode();
                this.homeTime = 0;
            } else if(this.column != 14) {
                if(this.column > 14) {
                    this.nextDirection = "left";
                } else {
                    this.nextDirection = "right"
                }
            } else {
                this.nextDirection = "up";
            }
            return;
        }

        var directions = entityManager.getMazeDirections(this.row, this.column);
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

        if (dist < minDist) {
            minDist = dist;
            direction = directions[i];
        }
    }

    // if frightened we should random
    if (this.mode === "frightened") {
        var randomValue = parseInt(Math.random()*directions.length);
        direction = directions[randomValue];
    }

    return direction;
};

Ghost.prototype.bounceProp = 0;
Ghost.prototype.bounceSpeed = 0.1;
Ghost.prototype.bouncingUp = true;
Ghost.prototype.render = function (ctx) {
    if (!this.isAlive) return;
    
    var pos = util.getCoordsFromBox(this.row, this.column);
    var boxDim = consts.BOX_DIMENSION;
    var dir = this.direction;

    // only change if not paused/frozen
    var shouldChange = entityManager.shouldChange();

    // when home they are between 2 tiles
    if (this.mode === "home") {
        pos.xPos -= 0.5*boxDim;
    }

    // Ghosts at home just bounce up and down
    if (this.mode === "home" && shouldChange) {
        pos.yPos -= this.bounceProp*boxDim;
        this.bounceProp += (this.bouncingUp ? 1 : -1) * this.bounceSpeed;
        if (Math.abs(this.bounceProp) > 0.5) {
            this.bouncingUp = !this.bouncingUp;
        }
    } else if (this.mode !== "home") {
        if (dir === "up") {
            pos.yPos += (this.timeToNext)*boxDim;
        } else if (dir === "down") {
            pos.yPos -= (this.timeToNext)*boxDim;
        } else if (dir === "left") {
            pos.xPos += (this.timeToNext)*boxDim;
        } else if (dir === "right") {
            pos.xPos -= (this.timeToNext)*boxDim;
        }

        // when we change from movingOut to other modes we
        // need to smooth the transition
        var smoothDuration = 0.7;
        if (this.mode === "movingOut") {
            pos.xPos -= 0.5*boxDim;
        } else if(-this.homeTime < smoothDuration) {
            pos.xPos -= 0.5*boxDim*(1+this.homeTime/smoothDuration);
        }
    }

     // full animation circle frames per cell traverse
    var animFrame = Math.round(this.timeToNext);
    
    if (this._isFrightened) {
        var mf = entityManager.getFrightenedMode();
        var steps = 5;
        var ratioLeftTime = 1 - (mf.timer/(mf.duration*SECS_TO_NOMINALS));
        var ratioLeftStep = Math.floor(ratioLeftTime*mf.duration*steps);
        //~ console.log("ratio left steps:", ratioLeftStep);
        
        if (ratioLeftStep<=10 && ratioLeftStep%2===0) {
            g_sprites.ghosts.frightened.white[animFrame]
                .drawCentredAt(ctx, pos.xPos, pos.yPos);
        } else {
            g_sprites.ghosts.frightened.blue[animFrame]
                .drawCentredAt(ctx, pos.xPos, pos.yPos);            
        }
    } else {
        this.sprite[dir || "up"][animFrame]
            .drawCentredAt(ctx, pos.xPos, pos.yPos);
    }
};
