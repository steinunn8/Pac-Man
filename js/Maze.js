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
    this._generateWall();
}

Maze.prototype._generateWall = function() {
    // TODO gera render wall byggt a neighboring cells
    this.aRenderingWall = [];
    for(var i = 0; i < this.aGrid.length; i++) {
        this.aRenderingWall.push([]);
        for(var j = 0; j < this.aGrid[i].length; j++) {
            this.aRenderingWall[i].push(this._getRenderValue(i, j));
        }
    }
}

Maze.property.render = function() {
    for(var i = 0; i < this.aRenderingWall.length; i++) {
        for(var j = 0; j < this.aRenderingWall[i].length; j++) {
            if(this.aRenderingWall[i][j] == 1) {
                var pos = _getCoordsFromBox(i, j);
                util.fillCenteredSquare(g_ctx, pos.xPos, pos.yPos, const.BOX_DIMENSION/2, "blue");
            }
        }
    }
}

Maze.prototype._getRenderValue = function(row, column) {
    if(this.aGrid[row][column] == -1) return 1;
    return 0;
}

Maze.prototype._getCoordsFromBox = function(row, column) {
    var xPos = column * const.BOX_DIMENSION + const.BOX_DIMENSION / 2;
    var yPos = row * const.BOX_DIMENSION + const.BOX_DIMENSION / 2;
    return {xPos: xPos, yPos: yPos};
}
