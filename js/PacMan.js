// =============
// PacMan Object
// =============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function PacMan(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Used in collision logic in spatialManager.js
    this.entityType = entityManager.entityTypes["PacMan"];

    this.rememberResets();

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

PacMan.prototype = new Entity();

PacMan.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_row = this.row;
    this.reset_column = this.column;
    this.reset_direction = this.direction;
    this.reset_nextDirection = this.nextDirection;
};

PacMan.prototype.KEY_UP = 'W'.charCodeAt(0);
PacMan.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
PacMan.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
PacMan.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
PacMan.prototype.lives = 3;
PacMan.prototype.score = 0;

PacMan.prototype.reset = function () {
    this.setPos(this.reset_row, this.reset_column);
    this.direction = this.reset_direction;
    this.nextDirection = this.reset_nextDirection;
    this.isAlive = true;
};

// When PacMan dies we warp him to his original place
PacMan.prototype.kill = function (ctx) {
    this.isAlive = false;
    this.lives -= 1;
    spatialManager.unregister(this);
};

PacMan.prototype._keyMove = function() {
    return keys[this.KEY_UP] || keys[this.KEY_DOWN] || 
           keys[this.KEY_LEFT] || keys[this.KEY_RIGHT];
};

PacMan.prototype._dyingProp = 0;
PacMan.prototype._dyingSpeed = 0.2; // fps
PacMan.prototype.update = function (du) {
    // Special logic for dying behaviour
    if (!this.isAlive) {
        if (this._dyingProp > 1) {
            this._dyingProp = 0;
            this.reset();
        }
        this._dyingProp += this._dyingSpeed * (du/NOMINAL_UPDATE_INTERVAL);
        return;
    }
    
    if (keys[this.KEY_UP]) {
        this.nextDirection = "up";
    }
    if (keys[this.KEY_DOWN]) {
        this.nextDirection = "down";
    }
    if (keys[this.KEY_LEFT]) {
        this.nextDirection = "left";
    }
    if (keys[this.KEY_RIGHT]) {
        this.nextDirection = "right";
    }

    if (this._keyMove() && this.direction === 0) {
        this.timeToNext = 0;
    }

    // TODO: Unregister and check for death
    spatialManager.unregister(this);
    
    // mutates the direction of pacman
    this.move(du, this.direction, this.nextDirection);
    
    spatialManager.register(this);
};

PacMan.prototype._animProp = 0;    //proportion of the animation cycle
PacMan.prototype._animSpeed = 0.1; //frames per second

PacMan.prototype.hitMe = function (aggressor) {
    if (aggressor.entityType === entityManager.entityTypes["Ghost"]) {
        console.log("Ghost hit PacMan");
        //TODO: Temp, will be something else
        //~ entityManager.resetGhosts();
        //~ Implement "ghost-maniac-mode" with Boolean value?
        //~ [But wheeere?]
        //~ this.kill();
        if (aggressor.mode === "frightened") {
            aggressor.kill();
        } else if (aggressor.mode === "dead") {
            // pass
            // don't do anything
        } else {
            this.kill();
            entityManager.pacmanDead();
        }
    } 
};

PacMan.prototype.render = function (ctx) {
    var boxDim = consts.BOX_DIMENSION;
    var pos = util.getCoordsFromBox(this.row, this.column);
    var animFrame;

    if(this.lives == 0) {return;}

    //Lives
    var livePos = util.getCoordsFromBox(34.5, 3);
    for (var i = 0; i < this.lives-1; i++){
        this.sprite.lives[0].drawCentredAt(ctx, livePos.xPos + (i*30), livePos.yPos);
    }

    //~ TODO: change logic when PacMan dies
    if (!this.isAlive) {
        animFrame = Math.round((this._dyingProp)*10); // 0-10 frames of dying
        if (animFrame > 10) { animFrame=10; }
        //~ console.log(animFrame);
        this.sprite["dying"][animFrame].drawCentredAt(ctx, pos.xPos, pos.yPos);
        return;
    }
    
    var dir = this.direction;
    var going = this.nextDirection;
    if (dir === "up") {
        pos.yPos += (this.timeToNext)*boxDim;
    } else if (dir === "down") {
        pos.yPos -= (this.timeToNext)*boxDim;
    } else if (dir === "left") {
        pos.xPos += (this.timeToNext)*boxDim;
    } else if (dir === "right") {
        pos.xPos -= (this.timeToNext)*boxDim;
    }

    // update animationFrame if not paused/frozen
    if (this.direction && entityManager.shouldChange()) {
        this._animProp += this._animSpeed;
        if (this._animProp > 1) {
            this._animProp -= 1;
        }
    }
    animFrame =  Math.round(this._animProp*2);
    this.sprite[dir||going||"left"][animFrame].drawWrapedCentredAt(ctx, pos.xPos, pos.yPos);
};
