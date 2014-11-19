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
    this._rotationTimer = (Math.random()*4 + 1) * SECS_TO_NOMINALS;
};

Ghost.prototype = new Entity();
Ghost.prototype.direction = 0;
Ghost.prototype.nextDirection = "left";

// possible modes: chase, scatter, frightened, home, movingOut
Ghost.prototype.mode = "chase";
Ghost.prototype._frightenedSpeed = 1;
Ghost.prototype._deadSpeed = 4;
Ghost.prototype._rotation = 0;

Ghost.prototype.rememberResets = function () {
    // Remember my reset positions and home corner (starting target)
    this.reset_row = this.row;
    this.reset_column = this.column;
    this.reset_mode = this.mode;
    this.reset_speed = this.speed;
    this.startTarget = {
        row: this.target_.row,
        column: this.target_.column
    };
    this.reset_homeTime = this.homeTime;
};

Ghost.prototype.getStartPosition = function() {
    return {row: this.reset_row, column: this.reset_column};
};

Ghost.prototype.resetTarget = function() {
    this.target_.row = this.startTarget.row;
    this.target_.column = this.startTarget.column;
};

Ghost.prototype.changeMode = function(mode) {
    this._isFrightened = (mode === "frightened");

    // can't change the mode from home with this method
    if (util.inArray(["home", "movingOut", "dead", "movingIn"], this.mode)) {
        return;
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
    this._isFrightened = false;
    this.isAlive = true;
    this.setPos(this.reset_row, this.reset_column);
    this.mode = this.reset_mode;
    this.homeTime = this.reset_homeTime;
};

Ghost.prototype.drawCentredAt = function(ctx, cx, cy, rotation) {

};

Ghost.prototype.hitMe = function (aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["PacMan"]) {
        if (this.mode === "frightened") {
            this.kill();
            screenshaker.rotateScreen();
        } else if (this.mode === "dead" || this.mode === "movingIn") {
            // Pass
            // don't do anything
        } else {
            aggressor.kill();
            entityManager.pacmanDead();
        }
    } 
};

Ghost.prototype.kill = function (sideEffects) {
    sideEffects = typeof sideEffects !== "undefined" ? sideEffects : true;
    this.isAlive = false;
    this.mode = "dead";

    if (sideEffects) {
        audioManager.play(eatGhost);
        entityManager.ghostDies(this);
    }

    spatialManager.unregister(this);
};

Ghost.prototype.getColors = function () {
    if (this.mode === "dead" || this.mode === "movingIn") {
        return ["white"];
    } else if (this.mode === "frightened") {
        // more blue than white
        return ["blue", "blue", "white"];
    } else {
        return [this.color];
    }
}

Ghost.prototype.update = function (du) {
    if (this._rotation > 0) {
        this._rotation -= du * 0.25;
    } else {
        this._rotation = 0;
        this._rotationTimer -= du;
        if (this._rotationTimer <= 0) {
            this._rotation = Math.PI * 2;
            this._rotationTimer = (Math.random()*5 + 2) * SECS_TO_NOMINALS;
        }
    }

    if (this.mode === "dead") {
        var homeTarget = entityManager.getGhostExitPosition();
        if (this.row === homeTarget.row &&
            this.column === homeTarget.column) {
            this.mode = "movingIn";
            this.direction = 0;
            this.nextDirection = 0;
        }
    }

    spatialManager.unregister(this);

    // moves the ghost
    var speed = this.mode === "frightened" ? this._frightenedSpeed :
            this.mode === "dead" ? this._deadSpeed :
            this.speed;
    this._hasMoved = this.move(
        du, this.direction, this.nextDirection,
        this.mode === "movingOut" || this.mode === "movingIn", speed
    );

    if (this.direction !== 0) {
        var pos = util.getCoordsFromBox(this.row, this.column);
        var offset = this.getOffset(this.getOpposite(this.direction), Math.random()*1);
        if (offset.row == 0) {
            offset.row = Math.random()*1-0.5;
        }
        if (offset.column == 0) {
            offset.column = Math.random()*1-0.5;
        }
        var colors = this.getColors();
        particleManager.createParticles(pos.xPos + offset.column * consts.BOX_DIMENSION, 
                        pos.yPos + offset.row * consts.BOX_DIMENSION/2, 
                        offset.column, offset.row,
                        colors);
    }

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

        if (this.mode === "movingIn") {
            var pos = entityManager.getGhostSpawnBoxPosition();
            if (this.column == pos.column && this.row == pos.row) {
                this.mode = "movingOut";
                this._isFrightened = false;
                this.column = pos.column;
                this.row = pos.row;
                return;
            } else if (this.row > pos.row) {
                this.nextDirection = "up";
            } else {
                this.nextDirection = "down";
            }
            return;
        }

        if (this.mode === "movingOut") {
            var exitPos = entityManager.getGhostExitPosition();
            if (this.column == exitPos.column && this.row == exitPos.row) {
                this.mode = this._isFrightened ? "frightened" : entityManager.getGhostMode();
                this.homeTime = 0;
            } else if(this.column != exitPos.column) {
                if(this.column > exitPos.column) {
                    this.nextDirection = "left";
                } else {
                    this.nextDirection = "right";
                }
            } else {
                if(this.row > exitPos.row) {
                    this.nextDirection = "up";
                } else {
                    this.nextDirection = "down"
                }
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
            } else if(this.mode === "dead") {
                var homeTarget = entityManager.getGhostExitPosition();
                this.target_ = {
                    row: homeTarget.row,
                    column: homeTarget.column
                };
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

    if (!entityManager.shouldRenderGhosts ||
        this.shouldSkipRender) {
        return;
    }
    
    var pos = util.getCoordsFromBox(this.row, this.column);
    var boxDim = consts.BOX_DIMENSION;
    var dir = this.direction;

    // Ghosts at home just bounce up and down
    // only change if not paused/frozen
    var shouldChange = entityManager.shouldChange();

    // when home they are between 2 tiles
    if (this.mode === "home") {
        pos.xPos -= 0.5*boxDim;
    }

    if (!entityManager.isJuicy()) {
        this._rotation = 0;
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
        if (this.mode === "movingOut" || this.mode === "movingIn") {
            pos.xPos -= 0.5*boxDim;
        } else if(-this.homeTime < smoothDuration) {
            pos.xPos -= 0.5*boxDim*(1+this.homeTime/smoothDuration);
        }
    }

     // full animation circle frames per cell traverse
    var animFrame = Math.round(this.timeToNext);

    if (this.mode === "dead" || this.mode === "movingIn") {
        g_sprites.ghosts.dead[dir || "up"]
            .drawCentredAt(ctx, pos.xPos, pos.yPos, this._rotation);
    } else if (this.mode === "frightened" || this._isFrightened) {
        var mf = entityManager.getFrightenedMode();
        var steps = 5;
        var ratioLeftTime = 1 - (mf.timer/(mf.duration*SECS_TO_NOMINALS));
        var ratioLeftStep = Math.floor(ratioLeftTime*mf.duration*steps);
        //~ console.log("ratio left steps:", ratioLeftStep);
        
        if (ratioLeftStep<=10 && ratioLeftStep%2===0) {
            g_sprites.ghosts.frightened.white[animFrame]
                .drawCentredAt(ctx, pos.xPos, pos.yPos, this._rotation);
        } else {
            g_sprites.ghosts.frightened.blue[animFrame]
                .drawCentredAt(ctx, pos.xPos, pos.yPos, this._rotation);            
        }
    } else {
        this.sprite[dir || "up"][animFrame]
            .drawCentredAt(ctx, pos.xPos, pos.yPos, this._rotation);
    }
};
