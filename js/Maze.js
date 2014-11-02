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
    this.aGrid = this._getDefaultMazeArray();
    this.nRows = this.aGrid.length;
    this.nColumns = this.aGrid[0].length;

    this._generateWall();
};

Maze.prototype.penetrable = function(row, column) {
    return this.aGrid[row][column] >= 0;
};

Maze.prototype.directions = {
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
    GHOST_WALL: -22
};

// for normal double lines
Maze.prototype.DOUBLE_LINE_OFFSET = -100;
Maze.prototype.WALL = -1;
Maze.prototype.GHOST_WALL = -2;
Maze.prototype.DOUBLE_WALL = -3;

Maze.prototype._generateWall = function() {
    // TODO gera render wall byggt a neighboring cells
    this.aRenderingWall = [];
    for(var i = 0; i < this.nRows; i++) {
        this.aRenderingWall.push([]);
        for(var j = 0; j < this.nColumns; j++) {
            var value = this._getRenderValue(i, j);
            this.aRenderingWall[i].push(value);
        }
    }

    console.log(this.aRenderingWall);
};

Maze.prototype.render = function(ctx) {
    for(var i = 0; i < this.aRenderingWall.length; i++) {
        for(var j = 0; j < this.aRenderingWall[i].length; j++) {
            var renderValue = this.aRenderingWall[i][j];
            var pos = util.getCoordsFromBox(i, j);
            this._drawPart(ctx, renderValue, pos.xPos, pos.yPos);
        }
    }
};

Maze.prototype._getRenderValue = function(row, column) {
    if(this.aGrid[row][column] == this.GHOST_WALL) {
        return this.directions.GHOST_WALL;
    } else if(this.aGrid[row][column] < 0) {
        return this._adjecentCount(row, column);
    }
    if(this.aGrid[row][column] == 1) return 1;
    if(this.aGrid[row][column] == 2) return 2;
    return 0;
};

Maze.prototype._getRotation = function(direction) {
    switch(direction) {
        case this.directions.RIGHT:
        case this.directions.BOTTOM_RIGHT:
        case this.directions.LONG_TOP_LEFT:
            return Math.PI;
            break;
        case this.directions.LEFT:
        case this.directions.TOP_LEFT:
        case this.directions.LONG_BOTTOM_RIGHT:
            return 0;
            break;
        case this.directions.UP:
        case this.directions.TOP_RIGHT:
        case this.directions.LONG_BOTTOM_LEFT:
            return Math.PI/2;
            break;
        case this.directions.BOTTOM:
        case this.directions.BOTTOM_LEFT:
        case this.directions.LONG_TOP_RIGHT:
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
        case this.directions.DOUBLE_LONG_BOTTOM_LEFT_TOP:
            this._drawPart(ctx, this.directions.LONG_BOTTOM_LEFT, x, y);
            this._drawPart(ctx, this.directions.UP, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_BOTTOM_LEFT_RIGHT:
            this._drawPart(ctx, this.directions.LONG_BOTTOM_LEFT, x, y);
            this._drawPart(ctx, this.directions.RIGHT, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_BOTTOM_RIGHT_TOP:
            this._drawPart(ctx, this.directions.LONG_BOTTOM_RIGHT, x, y);
            this._drawPart(ctx, this.directions.UP, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_BOTTOM_RIGHT_LEFT:
            this._drawPart(ctx, this.directions.LONG_BOTTOM_RIGHT, x, y);
            this._drawPart(ctx, this.directions.LEFT, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_TOP_LEFT_RIGHT:
            this._drawPart(ctx, this.directions.LONG_TOP_LEFT, x, y);
            this._drawPart(ctx, this.directions.RIGHT, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_TOP_LEFT_BOTTOM:
            this._drawPart(ctx, this.directions.LONG_TOP_LEFT, x, y);
            this._drawPart(ctx, this.directions.BOTTOM, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_TOP_RIGHT_BOTTOM:
            this._drawPart(ctx, this.directions.LONG_TOP_RIGHT, x, y);
            this._drawPart(ctx, this.directions.BOTTOM, x, y, true);
            return;
        case this.directions.DOUBLE_LONG_TOP_RIGHT_LEFT:
            this._drawPart(ctx, this.directions.LONG_TOP_RIGHT, x, y);
            this._drawPart(ctx, this.directions.LEFT, x, y, true);
            return;
    }

    rotation = this._getRotation(renderValue);
    
    var style = "blue"
    if(util.inArray([this.directions.RIGHT, 
                     this.directions.LEFT, 
                     this.directions.UP, 
                     this.directions.BOTTOM], renderValue)) {
        util.drawLine(ctx, x, y, rotation, style, doubleLine, isDouble);
    } else if(util.inArray([this.directions.BOTTOM_LEFT, 
                            this.directions.BOTTOM_RIGHT, 
                            this.directions.TOP_RIGHT, 
                            this.directions.TOP_LEFT], renderValue)) {
        util.drawCurve(ctx, x, y, rotation, style, doubleLine);
    } else if(util.inArray([this.directions.LONG_BOTTOM_LEFT, 
                            this.directions.LONG_BOTTOM_RIGHT, 
                            this.directions.LONG_TOP_RIGHT, 
                            this.directions.LONG_TOP_LEFT], renderValue)) {
        util.drawLongCurve(ctx, x, y, rotation, style, doubleLine);
    } else if(renderValue == 5) {
        util.fillCenteredSquare(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2, "green");
    } else if(renderValue == 1) {
        util.fillCircle(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/8, "#FBB382");
    } else if(renderValue == 2) {
        util.fillCircle(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2.5, "#FBB382");
    } else if(renderValue == this.directions.GHOST_WALL) {
        var halfDimension = consts.SCALING*consts.BOX_DIMENSION/2;
        util.fillBox(ctx, x-halfDimension, y+halfDimension/2.5, halfDimension*2, halfDimension/2, "#FBB382")
//        util.fillCenteredSquare(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2, "#FBB382");
    }
};

Maze.prototype._adjecentCount = function(row, column) {
    var count = 0;
    var hlidar = {right: false, down: false, left: false, up: false};
    var offset = 0;

    if(this.aGrid[row][column] == this.DOUBLE_WALL) {
        offset = this.DOUBLE_LINE_OFFSET;
    }

    if(row > 0 && this.aGrid[row-1][column] > -1) {
        count++;
        hlidar.up = true;
    }
    if(row < this.aGrid.length-1 && this.aGrid[row+1][column] > -1) {
        count++;
        hlidar.down = true;
    }
    if(column > 0 && this.aGrid[row][column-1] > -1) {
        count++;
        hlidar.left = true;
    }
    if(column < this.aGrid[0].length-1 && this.aGrid[row][column+1] > -1) {
        count++;
        hlidar.right = true;
    }

    if(count == 1) {
        if(hlidar.right) return this.directions.RIGHT + offset;
        if(hlidar.left) return this.directions.LEFT + offset;
        if(hlidar.up) return this.directions.UP + offset;
        if(hlidar.down) return this.directions.BOTTOM + offset;
    } else if(count == 2) {
        if(hlidar.right && hlidar.up) return this.directions.TOP_RIGHT + offset;
        if(hlidar.left && hlidar.up) return this.directions.TOP_LEFT + offset;
        if(hlidar.right && hlidar.down) return this.directions.BOTTOM_RIGHT + offset;
        if(hlidar.left && hlidar.down) return this.directions.BOTTOM_LEFT + offset;


    } else if(count == 0) {
        // if we are drawing double lines we might want to not do a curved one for the outer line
        var horizontal = false;
        var vertical = false;
        if(offset == this.DOUBLE_LINE_OFFSET) {
            if(row > 0 && row < this.aGrid.length-1 && this.aGrid[row-1][column] == -3 && this.aGrid[row+1][column] == -3) {
                vertical = true;
            } else if(column > 0 && column < this.aGrid[0].length-1 && this.aGrid[row][column-1] == -3 && this.aGrid[row][column+1] == -3) {
                horizontal = true;
            }
        }

        if(row > 0 && column > 0 && this.aGrid[row-1][column-1] > -1) {
            if(vertical) return this.directions.DOUBLE_LONG_TOP_LEFT_RIGHT;
            else if(horizontal) return this.directions.DOUBLE_LONG_TOP_LEFT_BOTTOM;
            return this.directions.LONG_TOP_LEFT + offset;
        }
        if(row < this.aGrid.length-1 && column > 0 && this.aGrid[row+1][column-1] > -1) {
            if(vertical) return this.directions.DOUBLE_LONG_BOTTOM_LEFT_RIGHT;
            else if(horizontal) return this.directions.DOUBLE_LONG_BOTTOM_LEFT_TOP;
            return this.directions.LONG_BOTTOM_LEFT + offset;
        }
        if(column < this.aGrid[0].length-1 && row > 0 && this.aGrid[row-1][column+1] > -1) {
            if(vertical) return this.directions.DOUBLE_LONG_TOP_RIGHT_LEFT;
            else if(horizontal) return this.directions.DOUBLE_LONG_TOP_RIGHT_BOTTOM;
            return this.directions.LONG_TOP_RIGHT + offset;
        }
        if(column < this.aGrid[0].length-1 && row < this.aGrid.length-1 && this.aGrid[row+1][column+1] > -1) {
            if(vertical) return this.directions.DOUBLE_LONG_BOTTOM_RIGHT_LEFT;
            else if(horizontal) return this.directions.DOUBLE_LONG_BOTTOM_RIGHT_TOP;
            return this.directions.LONG_BOTTOM_RIGHT + offset;
        }
        return this.directions.NONE;
    }

    return 5;
}

Maze.prototype._getDefaultMazeArray = function() {
    return [
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3],
            [-3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-3],
            [-3, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-3],
            [-3, 2,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 2,-3],
            [-3, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-3],
            [-3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-3],
            [-3, 1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1, 1,-3],
            [-3, 1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1, 1,-3],
            [-3, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1,-3],
            [-3,-3,-3,-3,-3,-3, 1,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 1,-3,-3,-3,-3,-3,-3],
            [-1,-1,-1,-1,-1,-3, 1,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 1,-3,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-3, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 1,-3,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-3, 1,-1,-1, 0,-3,-3,-3,-2,-2,-3,-3,-3, 0,-1,-1, 1,-3,-1,-1,-1,-1,-1],
            [-3,-3,-3,-3,-3,-3, 1,-1,-1, 0,-3,-4,-4,-4,-4,-4,-4,-3, 0,-1,-1, 1,-3,-3,-3,-3,-3,-3],            
            [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,-3,-4,-4,-4,-4,-4,-4,-3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [-3,-3,-3,-3,-3,-3, 1,-1,-1, 0,-3,-4,-4,-4,-4,-4,-4,-3, 0,-1,-1, 1,-3,-3,-3,-3,-3,-3],
            [-1,-1,-1,-1,-1,-3, 1,-1,-1, 0,-3,-3,-3,-3,-3,-3,-3,-3, 0,-1,-1, 1,-3,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-3, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 1,-3,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-3, 1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 1,-3,-1,-1,-1,-1,-1],
            [-3,-3,-3,-3,-3,-3, 1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 1,-3,-3,-3,-3,-3,-3],
            [-3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-3],
            [-3, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-3],
            [-3, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-3],
            [-3, 2, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 2,-3],
            [-3,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-3],
            [-3,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-3],
            [-3, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1,-3],
            [-3, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-3],
            [-3, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-3],
            [-3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-3],
            [-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3,-3],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ]
}
