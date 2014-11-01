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
    this._generateWall();

};

Maze.prototype._generateWall = function() {
    // TODO gera render wall byggt a neighboring cells
    this.aRenderingWall = [];
    var self = this;
    for(var i = 0; i < this.aGrid.length; i++) {
        this.aRenderingWall.push([]);
        for(var j = 0; j < this.aGrid[i].length; j++) {
            var gildi = self._getRenderValue(i, j);
            this.aRenderingWall[i].push(gildi);
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
    if(this.aGrid[row][column] == -1) return 1;
    if(this.aGrid[row][column] == 1) return 2;
    if(this.aGrid[row][column] == 2) return 3;
    return 0;
};

Maze.prototype._drawPart = function(ctx, renderValue, x, y) {
    if(renderValue == 1) {
        util.fillCenteredSquare(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2, "blue");
    } else if(renderValue == 2) {
        util.fillCircle(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/8, "yellow");
    } else if(renderValue == 3) {
        util.fillCircle(ctx, x, y, consts.SCALING*consts.BOX_DIMENSION/2.5, "yellow");
    }
}

Maze.prototype._getDefaultMazeArray = function() {
    return [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
            [-1, 0,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1, 0,-1],
            [-1, 0,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1, 0,-1]
            ]
}