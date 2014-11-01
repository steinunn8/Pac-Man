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
            if(renderValue == 1) {
                var pos = util.getCoordsFromBox(i, j);
                util.fillCenteredSquare(ctx, pos.xPos, pos.yPos, consts.SCALING*consts.BOX_DIMENSION/2, "blue");
            } else if(renderValue) {
                var pos = util.getCoordsFromBox(i, j);
                util.fillCircle(ctx, pos.xPos, pos.yPos, consts.SCALING*consts.BOX_DIMENSION/8, "yellow");
            }
        }
    }
};

Maze.prototype._getRenderValue = function(row, column) {
    if(this.aGrid[row][column] == -1) return 1;
    if(this.aGrid[row][column] == 1) return 2;
    return 0;
};

Maze.prototype._getDefaultMazeArray = function() {
    return [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
            [-1, 0,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1, 0,-1],
            [-1, 0,-1,-1,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1, 0,-1,-1,-1,-1, 0,-1],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1,-1,-1,-1,-1, 0,-1,-1, 0,-1,-1,-1,-1, 0,-1]
            ]
}
