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
    LONG_BOTTOM_LEFT: -13
};

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
    if(this.aGrid[row][column] == -1) {
        return this._adjecentCount(row, column);
    }
    if(this.aGrid[row][column] == 1) return 1;
    if(this.aGrid[row][column] == 2) return 2;
    return 0;
};

Maze.prototype._drawPart = function(ctx, renderValue, x, y) {
    var rotation;
    switch(renderValue) {
        case this.directions.RIGHT:
        case this.directions.BOTTOM_RIGHT:
        case this.directions.LONG_TOP_LEFT:
            rotation = Math.PI;
            break;
        case this.directions.LEFT:
        case this.directions.TOP_LEFT:
        case this.directions.LONG_BOTTOM_RIGHT:
            rotation = 0;
            break;
        case this.directions.UP:
        case this.directions.TOP_RIGHT:
        case this.directions.LONG_BOTTOM_LEFT:
            rotation = Math.PI/2;
            break;
        case this.directions.BOTTOM:
        case this.directions.BOTTOM_LEFT:
        case this.directions.LONG_TOP_RIGHT:
            rotation = -Math.PI/2;
            break;
            
    }
    var style = "blue"
    if(util.inArray([this.directions.RIGHT, 
                     this.directions.LEFT, 
                     this.directions.UP, 
                     this.directions.BOTTOM], renderValue)) {
        util.drawLine(ctx, x, y, rotation, style);
    } else if(util.inArray([this.directions.BOTTOM_LEFT, 
                            this.directions.BOTTOM_RIGHT, 
                            this.directions.TOP_RIGHT, 
                            this.directions.TOP_LEFT], renderValue)) {
        util.drawCurve(ctx, x, y, rotation, style);
    } else if(util.inArray([this.directions.LONG_BOTTOM_LEFT, 
                            this.directions.LONG_BOTTOM_RIGHT, 
                            this.directions.LONG_TOP_RIGHT, 
                            this.directions.LONG_TOP_LEFT], renderValue)) {
        util.drawLongCurve(ctx, x, y, rotation, style);
    } else if(renderValue == 5) {
        util.fillCenteredSquare(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2, "green");
    } else if(renderValue == 1) {
        util.fillCircle(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/8, "#FBB382");
    } else if(renderValue == 2) {
        util.fillCircle(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2.5, "FBB382");
    }
};

Maze.prototype._adjecentCount = function(row, column) {
    var count = 0;
    var hlidar = {right: false, down: false, left: false, up: false};
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
        if(hlidar.right) return this.directions.RIGHT;
        if(hlidar.left) return this.directions.LEFT;
        if(hlidar.up) return this.directions.UP;
        if(hlidar.down) return this.directions.BOTTOM;
    } else if(count == 2) {
        if(hlidar.right && hlidar.up) return this.directions.TOP_RIGHT;
        if(hlidar.left && hlidar.up) return this.directions.TOP_LEFT;
        if(hlidar.right && hlidar.down) return this.directions.BOTTOM_RIGHT;
        if(hlidar.left && hlidar.down) return this.directions.BOTTOM_LEFT;
    } else if(count == 0) {
        if(row > 0 && column > 0 && this.aGrid[row-1][column-1] > -1) {
            return this.directions.LONG_TOP_LEFT;
        }
        if(row < this.aGrid.length-1 && column > 0 && this.aGrid[row+1][column-1] > -1) {
            return this.directions.LONG_BOTTOM_LEFT;
        }
        if(column < this.aGrid[0].length-1 && row > 0 && this.aGrid[row-1][column+1] > -1) {
            return this.directions.LONG_TOP_RIGHT;
        }
        if(column < this.aGrid[0].length-1 && row < this.aGrid.length-1 && this.aGrid[row+1][column+1] > -1) {
            return this.directions.LONG_BOTTOM_RIGHT;
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
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
            [-1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1],
            [-1, 2,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 2,-1],
            [-1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1],
            [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
            [-1, 1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1, 1,-1],
            [-1, 1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1, 1,-1],
            [-1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0,-1,-1,-1,-2,-2,-1,-1,-1, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            
            [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 1, 0, 0, 0, 0, 0,- 0],
            
            [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0,-1, 0, 0, 0, 0, 0, 0,-1, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 1,-1,-1,-1,-1,-1,-1],
            [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
            [-1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1],
            [-1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1],
            [-1, 2, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 2,-1],
            [-1,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-1],
            [-1,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1, 1,-1,-1,-1],
            [-1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1,-1],
            [-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1],
            [-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,-1],
            [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
        ]
}
