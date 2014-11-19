// =============
// Maze Object
// =============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Maze(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.nRows = this.aGrid.length; //36
    this.nColumns = this.aGrid[0].length; //28

    this._generateWall();
    this.selectedBlock = Infinity;

    this.image = -1;
};

Maze.prototype.penetrable = function(row, column) {
    return this.aGrid[row][column] >= this.gridValues.EMPTY;
};

Maze.prototype.isCapsule = function(row, column){
    return this.aGrid[row][column] == this.gridValues.CAPSULE;
}

Maze.prototype.isSpecialCapsule = function(row, column){
    return this.aGrid[row][column] == this.gridValues.SPECIAL_CAPSULE;
};

// Maze is handled by entity manager and everything handled by it
// should have a kill method
Maze.prototype.kill = function() {
    return;
}

Maze.prototype.getDirections = function(row, column) {
    var directions = [];

    if(row > 0 && this.aGrid[row-1][column] >= this.gridValues.EMPTY) {
        directions.push("up");
    }
    if(row < this.aGrid.length-1 &&
       this.aGrid[row+1][column] >= this.gridValues.EMPTY) {
        directions.push("down");
    }
    if(column > 0 && this.aGrid[row][column-1] >= this.gridValues.EMPTY) {
        directions.push("left");
    }
    if(column < this.aGrid[0].length-1 &&
       this.aGrid[row][column+1] >= this.gridValues.EMPTY) {
        directions.push("right");
    }

    return directions;
}

// Every value in the render array and it's meaning
Maze.prototype.renderValues = {
    ERROR: 5,
    SPECIAL_CAPSULE: 2,
    CAPSULE: 1,
    EMPTY: 0,
    RIGHT: -1,
    LEFT: -2,
    UP: -3,
    BOTTOM: -4,
    TOP_RIGHT: -5,
    TOP_LEFT: -6,
    BOTTOM_RIGHT: -7,
    BOTTOM_LEFT: -8,
    NONE: -9,
    LONG_TOP_RIGHT: -10,
    LONG_TOP_LEFT: -11,
    LONG_BOTTOM_RIGHT: -12,
    LONG_BOTTOM_LEFT: -13,
    DOUBLE_LONG_TOP_RIGHT_LEFT: -14,
    DOUBLE_LONG_TOP_RIGHT_BOTTOM: -15,
    DOUBLE_LONG_TOP_LEFT_RIGHT: -16,
    DOUBLE_LONG_TOP_LEFT_BOTTOM: -17,
    DOUBLE_LONG_BOTTOM_RIGHT_LEFT: -18,
    DOUBLE_LONG_BOTTOM_RIGHT_TOP: -19,
    DOUBLE_LONG_BOTTOM_LEFT_RIGHT: -20,
    DOUBLE_LONG_BOTTOM_LEFT_TOP: -21,
    GHOST_WALL: -22,
    GHOST_WALL_DOWN: -23
};

// Every value possible in the input grid and it's meaning
Maze.prototype.gridValues = {
    INKY: 7,
    CLYDE: 6,
    PINKY: 5,
    BLINKY: 4,
    PACMAN: 3,
    SPECIAL_CAPSULE: 2,
    CAPSULE: 1,
    EMPTY: 0,
    WALL: -1,
    GHOST_WALL: -2,
    DOUBLE_WALL: -3,
    GHOST_SPAWN: -4
};

// for normal double lines
Maze.prototype.DOUBLE_LINE_OFFSET = -100;

Maze.prototype._generateWall = function() {
    for (var row = 0; row < this.nRows; row++) {
        for (var column = 0; column < this.nColumns; column++) {
            if (util.inArray([this.gridValues.PINKY, 
                              this.gridValues.INKY, 
                              this.gridValues.CLYDE], 
                              this.aGrid[row][column])) {
                this.aGrid[row][column] = this.gridValues.GHOST_SPAWN;
            }
        }
    }
    
    this.aRenderingWall = [];
    for (var i = 0; i < this.nRows; i++) {
        this.aRenderingWall.push([]);
        for (var j = 0; j < this.nColumns; j++) {
            var value = this._getRenderValue(i, j);
            this.aRenderingWall[i].push(value);
        }
    }
};

Maze.prototype.getEntityPos = function(gridValue) {
    for (var row = 0; row < this.nRows; row++) {
        for (var column = 0; column < this.nColumns; column++) {
            if (gridValue === this.aGrid[row][column]) {
                return {row: row, column: column};
            }
        }
    }
}

Maze.prototype.update = function(du) {
    var KEY_WALL = keyCode('1');
    var KEY_EMPTY = keyCode('2');
    var KEY_CAPSULE = keyCode('3');
    var KEY_SPECIAL_CAPSULE = keyCode('4');
    var KEY_DOUBLE_WALL = keyCode('5');
    var KEY_MIRROR = keyCode('0');

    if (eatKey(KEY_WALL)) {
        this.selectedBlock = this.gridValues.WALL;
    }
    if (eatKey(KEY_EMPTY)) {
        this.selectedBlock = this.gridValues.EMPTY;
    }
    if (eatKey(KEY_CAPSULE)) {
        this.selectedBlock = this.gridValues.CAPSULE;
    }
    if (eatKey(KEY_SPECIAL_CAPSULE)) {
        this.selectedBlock = this.gridValues.SPECIAL_CAPSULE;
    }
    if (eatKey(KEY_DOUBLE_WALL)) {
        this.selectedBlock = this.gridValues.DOUBLE_WALL;
    }

    if (eatKey(KEY_MIRROR)) {
        this.mirrorMaze();
        this.image = -1;
        this._generateWall();
        entityManager.regenerateCapsules(this.aGrid);
    }
    return;
};

Maze.prototype.editGrid = function(pos) {
    if (this.selectedBlock === Infinity || pos.row < 0 ||
        pos.column >= this.nColumns || pos.column < 0 ||
        pos.row >= this.nRows) {
        return;
    }
    this.aGrid[pos.row][pos.column] = this.selectedBlock;
    this.image = -1;
    this._generateWall();

    entityManager.regenerateCapsules(this.aGrid);
};

// mirrors the maze by y axis
Maze.prototype.mirrorMaze = function() {
    for (var i = 0; i < this.nRows; i++) {
        for (var j = Math.floor(this.nColumns/2)+1; j < this.nColumns; j++) {
            this.aGrid[i][j] = this.aGrid[i][this.nColumns - j - 1];
        }
    }
}

Maze.prototype.render = function(ctx) {
    if (this.image == -1) {
        var buffer = document.createElement('canvas');
        buffer.width = g_canvas.width;
        buffer.height = g_canvas.height;
        this.renderAll(buffer.getContext('2d'));

        this.image = buffer;
    }

    ctx.drawImage(this.image, 0, 0);
};

Maze.prototype.renderAll = function(ctx) {
    var renderValue, pos, i, j;
    ctx.strokeStyle = '#ff0000';
    for (i = 0; i < this.aRenderingWall.length; i++) {
        for (j = 0; j < this.aRenderingWall[i].length; j++) {
            renderValue = this.aRenderingWall[i][j];
            pos = util.getCoordsFromBox(i, j);
            this._drawPart(ctx, renderValue, pos.xPos, pos.yPos);
        }
    }
}

Maze.prototype._getRenderValue = function(row, column) {
    if (this.aGrid[row][column] == this.gridValues.GHOST_WALL) {
        if(this.aGrid[row-1][column] == this.gridValues.GHOST_SPAWN) {
            return this.renderValues.GHOST_WALL_DOWN;
        } else {
            return this.renderValues.GHOST_WALL;
        }
    } else if (this.aGrid[row][column] < this.gridValues.EMPTY) {
        return this._adjecentCheck(row, column);
    }
    if (this.aGrid[row][column] == this.gridValues.CAPSULE) {
        return this.renderValues.CAPSULE;
    }
    if (this.aGrid[row][column] == this.gridValues.SPECIAL_CAPSULE) {
        return this.renderValues.SPECIAL_CAPSULE;
    }
    return this.renderValues.EMPTY;
};

Maze.prototype._getRotation = function(direction) {
    switch(direction) {
        case this.renderValues.RIGHT:
        case this.renderValues.BOTTOM_RIGHT:
        case this.renderValues.LONG_TOP_LEFT:
            return Math.PI;
            break;
        case this.renderValues.LEFT:
        case this.renderValues.TOP_LEFT:
        case this.renderValues.LONG_BOTTOM_RIGHT:
            return 0;
            break;
        case this.renderValues.UP:
        case this.renderValues.TOP_RIGHT:
        case this.renderValues.LONG_BOTTOM_LEFT:
            return Math.PI/2;
            break;
        case this.renderValues.BOTTOM:
        case this.renderValues.BOTTOM_LEFT:
        case this.renderValues.LONG_TOP_RIGHT:
            return -Math.PI/2;
            break;
            
    }

    return -1;
};

Maze.prototype._drawPart = function(ctx, renderValue, x, y, isDouble) {
    if(isDouble === undefined) isDouble = false;
    var rotation;
    var doubleLine = false;

    if(renderValue < this.DOUBLE_LINE_OFFSET) {
        doubleLine = true;
        renderValue -= this.DOUBLE_LINE_OFFSET;
    }

    // special case for double lines where one needs to be curved 
    // and one straight
    switch(renderValue) {
        case this.renderValues.DOUBLE_LONG_BOTTOM_LEFT_TOP:
            this._drawPart(ctx, this.renderValues.LONG_BOTTOM_LEFT, x, y);
            this._drawPart(ctx, this.renderValues.UP, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_BOTTOM_LEFT_RIGHT:
            this._drawPart(ctx, this.renderValues.LONG_BOTTOM_LEFT, x, y);
            this._drawPart(ctx, this.renderValues.RIGHT, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_BOTTOM_RIGHT_TOP:
            this._drawPart(ctx, this.renderValues.LONG_BOTTOM_RIGHT, x, y);
            this._drawPart(ctx, this.renderValues.UP, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_BOTTOM_RIGHT_LEFT:
            this._drawPart(ctx, this.renderValues.LONG_BOTTOM_RIGHT, x, y);
            this._drawPart(ctx, this.renderValues.LEFT, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_TOP_LEFT_RIGHT:
            this._drawPart(ctx, this.renderValues.LONG_TOP_LEFT, x, y);
            this._drawPart(ctx, this.renderValues.RIGHT, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_TOP_LEFT_BOTTOM:
            this._drawPart(ctx, this.renderValues.LONG_TOP_LEFT, x, y);
            this._drawPart(ctx, this.renderValues.BOTTOM, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_TOP_RIGHT_BOTTOM:
            this._drawPart(ctx, this.renderValues.LONG_TOP_RIGHT, x, y);
            this._drawPart(ctx, this.renderValues.BOTTOM, x, y, true);
            return;
        case this.renderValues.DOUBLE_LONG_TOP_RIGHT_LEFT:
            this._drawPart(ctx, this.renderValues.LONG_TOP_RIGHT, x, y);
            this._drawPart(ctx, this.renderValues.LEFT, x, y, true);
            return;
    }

    rotation = this._getRotation(renderValue);
    
    var style = this.color;
    if(util.inArray([this.renderValues.RIGHT, 
                     this.renderValues.LEFT, 
                     this.renderValues.UP, 
                     this.renderValues.BOTTOM], renderValue)) {
        util.drawLine(ctx, x, y, rotation, style, doubleLine, isDouble);
    } else if(util.inArray([this.renderValues.BOTTOM_LEFT, 
                            this.renderValues.BOTTOM_RIGHT, 
                            this.renderValues.TOP_RIGHT, 
                            this.renderValues.TOP_LEFT], renderValue)) {
        util.drawCurve(ctx, x, y, rotation, style, doubleLine);
    } else if(util.inArray([this.renderValues.LONG_BOTTOM_LEFT, 
                            this.renderValues.LONG_BOTTOM_RIGHT, 
                            this.renderValues.LONG_TOP_RIGHT, 
                            this.renderValues.LONG_TOP_LEFT], renderValue)) {
        util.drawLongCurve(ctx, x, y, rotation, style, doubleLine);
    } else if(renderValue == this.renderValues.ERROR) {
        util.fillCenteredSquare(ctx, x, y, consts.BOX_DIMENSION/2, "green");
    } else if(renderValue == this.renderValues.GHOST_WALL) {
        var halfDimension = consts.BOX_DIMENSION/2;
        util.fillBox(ctx, x-halfDimension, y+halfDimension/2.5,
                     halfDimension*2, halfDimension/2, "#FBB382");
    } else if(renderValue == this.renderValues.GHOST_WALL_DOWN) {
        var halfDimension = consts.BOX_DIMENSION/2;
        util.fillBox(ctx, x-halfDimension, y-halfDimension/1.3,
                     halfDimension*2, halfDimension/2, "#FBB382");
    }
};

Maze.prototype._adjecentCheck = function(row, column) {
    var count = 0;
    var sides = {right: false, down: false, left: false, up: false};
    var offset = 0;

    if(this.aGrid[row][column] == this.gridValues.DOUBLE_WALL) {
        offset = this.DOUBLE_LINE_OFFSET;
    }

    if(row > 0 && this.aGrid[row-1][column] >= this.gridValues.EMPTY) {
        count++;
        sides.up = true;
    }
    if(row < this.aGrid.length-1 &&
       this.aGrid[row+1][column] >= this.gridValues.EMPTY) {
        count++;
        sides.down = true;
    }
    if(column > 0 && this.aGrid[row][column-1] >= this.gridValues.EMPTY) {
        count++;
        sides.left = true;
    }
    if(column < this.aGrid[0].length-1 &&
       this.aGrid[row][column+1] >= this.gridValues.EMPTY) {
        count++;
        sides.right = true;
    }

    if(count == 1) {
        if(sides.right) return this.renderValues.RIGHT + offset;
        if(sides.left) return this.renderValues.LEFT + offset;
        if(sides.up) return this.renderValues.UP + offset;
        if(sides.down) return this.renderValues.BOTTOM + offset;
    } else if(count == 2) {
        if(sides.right && sides.up)
            return this.renderValues.TOP_RIGHT + offset;
        if(sides.left && sides.up)
            return this.renderValues.TOP_LEFT + offset;
        if(sides.right && sides.down)
            return this.renderValues.BOTTOM_RIGHT + offset;
        if(sides.left && sides.down)
            return this.renderValues.BOTTOM_LEFT + offset;


    } else if(count == 0) {
        // if we are drawing double lines we might want to not do a
        // curved one for the outer line
        var horizontal = false;
        var vertical = false;
        if(offset == this.DOUBLE_LINE_OFFSET) {
            if(row > 0 && row < this.aGrid.length-1 &&
               this.aGrid[row-1][column] == this.gridValues.DOUBLE_WALL &&
               this.aGrid[row+1][column] == this.gridValues.DOUBLE_WALL) {
                vertical = true;
            } else if(column > 0 && column < this.aGrid[0].length-1 && 
                      this.aGrid[row][column-1] == this.gridValues.DOUBLE_WALL &&
                      this.aGrid[row][column+1] == this.gridValues.DOUBLE_WALL) {
                horizontal = true;
            }
        }

        if(row > 0 && column > 0 &&
           this.aGrid[row-1][column-1] >= this.gridValues.EMPTY) {
            if(vertical)
                return this.renderValues.DOUBLE_LONG_TOP_LEFT_RIGHT;
            else if(horizontal)
                return this.renderValues.DOUBLE_LONG_TOP_LEFT_BOTTOM;
            return this.renderValues.LONG_TOP_LEFT + offset;
        }
        
        if(row < this.aGrid.length-1 && column > 0 &&
           this.aGrid[row+1][column-1] >= this.gridValues.EMPTY) {
            if(vertical)
                return this.renderValues.DOUBLE_LONG_BOTTOM_LEFT_RIGHT;
            else if(horizontal)
                return this.renderValues.DOUBLE_LONG_BOTTOM_LEFT_TOP;
            return this.renderValues.LONG_BOTTOM_LEFT + offset;
        }
        if(column < this.aGrid[0].length-1 && row > 0 &&
           this.aGrid[row-1][column+1] >= this.gridValues.EMPTY) {
            if(vertical)
                return this.renderValues.DOUBLE_LONG_TOP_RIGHT_LEFT;
            else if(horizontal)
                return this.renderValues.DOUBLE_LONG_TOP_RIGHT_BOTTOM;
            return this.renderValues.LONG_TOP_RIGHT + offset;
        }
        if(column < this.aGrid[0].length-1 &&
           row < this.aGrid.length-1 &&
           this.aGrid[row+1][column+1] >= this.gridValues.EMPTY) {
            if(vertical)
                return this.renderValues.DOUBLE_LONG_BOTTOM_RIGHT_LEFT;
            else if(horizontal)
                return this.renderValues.DOUBLE_LONG_BOTTOM_RIGHT_TOP;
            return this.renderValues.LONG_BOTTOM_RIGHT + offset;
        }
        return this.renderValues.NONE;
    }

    return this.renderValues.ERROR;
};
