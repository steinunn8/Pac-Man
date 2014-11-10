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
};

PacMan.prototype.KEY_UP = 'W'.charCodeAt(0);
PacMan.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
PacMan.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
PacMan.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

// Initial, inheritable, default values
PacMan.prototype.direction = 0;
PacMan.prototype.lives = 3;
PacMan.prototype.score = 0;

//TODO: FIX

// HACKED-IN AUDIO (no preloading)
//TODO: Change audio
PacMan.prototype.eatSound = new Audio("sounds/pacman_chomp.wav");
PacMan.prototype.warpSound = new Audio("sounds/pacman_death.wav");
PacMan.prototype.eatFruit = new Audio("sounds/pacman_eatfruit.wav");
PacMan.prototype.eatGhost = new Audio("sounds/pacman_eatghost.wav");
PacMan.prototype.newLive = new Audio("sounds/pacman_extrapac.wav");
PacMan.prototype.intermission = new Audio("sounds/pacman_intermission.wav");
//TODO: Move to better place!
PacMan.prototype.introSound = new Audio("sounds/pacman_beginning.wav");

PacMan.prototype.reset = function () {
    this.setPos(this.reset_row, this.reset_column);
    this.direction = this.reset_direction;

    this.halt();
};

//When PacMan dies we warp him to his original place
PacMan.prototype.warp = function (ctx){
    //TODO: Move to original place with animation
    this.warpSound.play();
    this.reset();
};

PacMan.prototype._keyMove = function() {
    return keys[this.KEY_UP] || keys[this.KEY_DOWN] || 
           keys[this.KEY_LEFT] || keys[this.KEY_RIGHT];
}

PacMan.prototype.update = function (du) {
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

    // mutates the direction of pacman
    this.move(du, this.direction, this.nextDirection);

    // TODO: Unregister and check for death
    spatialManager.unregister(this);

    // TODO: Warp if isColliding, otherwise Register

    // TODO: If going through "tunnel", handle
    spatialManager.register(this);
};

PacMan.prototype._mouthOpenProp = 0.1;
PacMan.prototype._mouthSpeed = 0.02;
PacMan.prototype._mouthOpening = false;
PacMan.prototype.drawCentredAt = function(ctx, cx, cy, rotation) {
    var boxDim = consts.BOX_DIMENSION;
    var startMouth = this._mouthOpenProp*2*Math.PI,
        endMouth = (1-this._mouthOpenProp)*2*Math.PI,
        r = boxDim/1.5;

    var draw = function(cx, cy) {
        ctx.save();

        ctx.fillStyle = "#EBFC00";
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, startMouth, endMouth);
        ctx.lineTo(0, 0);
        ctx.fill();
    
        ctx.restore();
  
    };

    draw(cx, cy);
    draw(cx + boxDim*entityManager.getMazeColumns(), cy);
    draw(cx - boxDim*entityManager.getMazeColumns(), cy);
    draw(cx, cy + boxDim*entityManager.getMazeRows());
    draw(cx, cy - boxDim*entityManager.getMazeRows());
};

PacMan.prototype.render = function (ctx) {
    var rotation = 0;
    var boxDim = consts.BOX_DIMENSION;
    var pos = util.getCoordsFromBox(this.row, this.column);

    var dir = this.direction;
    var going = this.nextDirection;
    if (dir === "up") {
        pos.yPos += (this.timeToNext)*boxDim;
        rotation = 3*Math.PI/2;
    } else if (dir === "down") {
        pos.yPos -= (this.timeToNext)*boxDim;
        rotation = 1*Math.PI/2;
    } else if (dir === "left") {
        pos.xPos += (this.timeToNext)*boxDim;
        rotation = 2*Math.PI/2;
    } else if (dir === "right") {
        pos.xPos -= (this.timeToNext)*boxDim;
    }

    if (!dir) {
        if (going === "up") {
            rotation = 3*Math.PI/2;
        } else if (going === "down") {
            rotation = 1*Math.PI/2;
        } else if (going === "left") {
            rotation = 2*Math.PI/2;
        }
    }

    this.drawCentredAt(ctx, pos.xPos, pos.yPos, rotation);
    if (this.direction) {
        if (this._mouthOpenProp > 0.1) {
            this._mouthOpening = false;
        } else if (this._mouthOpenProp <= 0) {
            this._mouthOpening = true;
        }
        if (this._mouthOpening) {
            this._mouthOpenProp += this._mouthSpeed;
        } else {
            this._mouthOpenProp -= this._mouthSpeed;
        }
    }
    // this.sprite.drawCentredAt(ctx, pos.xPos, pos.yPos, rotation);
};
