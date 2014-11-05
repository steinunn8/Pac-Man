// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {

    // RANGES
    // ======

    clampRange: function(value, lowBound, highBound) {
        if (value < lowBound) {
            value = lowBound;
        } else if (value > highBound) {
            value = highBound;
        }
        return value;
    },

    wrapRange: function(value, lowBound, highBound) {
        while (value < lowBound) {
            value += (highBound - lowBound);
        }
        while (value > highBound) {
            value -= (highBound - lowBound);
        }
        return value;
    },

    isBetween: function(value, lowBound, highBound) {
        if (value < lowBound) { return false; }
        if (value > highBound) { return false; }
        return true;
    },

    wrapPosition: function(row, column) {
        var pos = {row: row, column: column};
        if (column >= g_maze.nColumns) { pos.column -= g_maze.nColumns; }
        else if (column < 0) { pos.column += g_maze.nColumns; }

        if (row >= g_maze.nRows) { pos.row -= g_maze.nRows; }
        else if (row < 0) { pos.row += g_maze.nRows; }

        return pos;
    },


    // RANDOMNESS
    // ==========

    randRange: function(min, max) {
        return (min + Math.random() * (max - min));
    },


    // MISC
    // ====

    square: function(x) {
        return x*x;
    },


    // DISTANCES
    // =========

    distSq: function(x1, y1, x2, y2) {
        return this.square(x2-x1) + this.square(y2-y1);
    },

    wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
        var dx = Math.abs(x2-x1),
            dy = Math.abs(y2-y1);
        if (dx > xWrap/2) {
            dx = xWrap - dx;
        };
        if (dy > yWrap/2) {
            dy = yWrap - dy;
        }
        return this.square(dx) + this.square(dy);
    },


    // CANVAS OPS
    // ==========

    clearCanvas: function (ctx) {
        var prevfillStyle = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = prevfillStyle;
    },

    strokeCircle: function (ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    },

    fillCircle: function (ctx, x, y, r, style) {
        if(style !== undefined) {
            var oldStyle = ctx.fillStyle;
            ctx.fillStyle = style;
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        if(style !== undefined) {
            ctx.fillStyle = oldStyle;
        }
    },

    fillBox: function (ctx, x, y, w, h, style) {
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = style;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = oldStyle;
    },

    fillCenteredSquare: function (ctx, x, y, halfSquareDimension, style) {
        this.fillBox(ctx, x - halfSquareDimension, y - halfSquareDimension, halfSquareDimension*2, halfSquareDimension*2, style);
    },

    prepareLine: function(ctx, x, y, rotation, style) {
        if(rotation === undefined) rotation = 0;
        if(style === undefined) style = ctx.strokeStyle;
        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(rotation);
        var oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = style;
        ctx.beginPath();
    },

    finishLine: function(oldStyle) {
        ctx.stroke();
        ctx.fillStyle = oldStyle;
        ctx.restore();
    },

    drawLine: function(ctx, x, y, rotation, style, doubleLine, isDouble) {
        if(isDouble) {
            this.drawDoubleLine(ctx, x, y, rotation, style);
            return;
        }

        var oldStyle = this.prepareLine(ctx, x, y, rotation, style);

        var xOffset = 0.1 * consts.BOX_DIMENSION;
        var yOffset = 0.5 * consts.BOX_DIMENSION;
        ctx.moveTo(xOffset, -yOffset);
        ctx.lineTo(xOffset, yOffset);

        if(doubleLine) {
            ctx.moveTo(yOffset, -yOffset);
            ctx.lineTo(yOffset, yOffset);
        }

        this.finishLine(oldStyle);
    },

    drawDoubleLine: function(ctx, x, y, rotation, style) {
        var oldStyle = this.prepareLine(ctx, x, y, rotation, style);

        var offset = 0.5 * consts.BOX_DIMENSION;
        ctx.moveTo(-offset, -offset);
        ctx.lineTo(-offset, offset);

        this.finishLine(oldStyle);
    },

    drawCurve: function(ctx, x, y, rotation, style, doubleLine) {
        var oldStyle = this.prepareLine(ctx, x, y, rotation, style);

        var dimension = consts.BOX_DIMENSION;
        var offset = 0.1 * dimension;
        var centerOffset = 0.5 * dimension;
        ctx.moveTo(offset, centerOffset);
        ctx.quadraticCurveTo(0, 0, centerOffset, offset);
/*
        if(doubleLine) {
            ctx.moveTo(centerOffset, centerOffset+offset);
            ctx.quadraticCurveTo(centerOffset, centerOffset, centerOffset+offset, centerOffset);
        }
*/
        this.finishLine(oldStyle);
    },

    drawLongCurve: function(ctx, x, y, rotation, style, doubleLine) {
        var oldStyle = this.prepareLine(ctx, x, y, rotation, style);

        var offset = 0.1 * consts.BOX_DIMENSION;
        var centerOffset = 0.5 * consts.BOX_DIMENSION;
        ctx.moveTo(-offset, centerOffset);
        ctx.quadraticCurveTo(0, 0, centerOffset, -offset);

        if(doubleLine) {
            ctx.moveTo(-centerOffset, centerOffset);
            ctx.quadraticCurveTo(-centerOffset, -centerOffset, centerOffset, -centerOffset);
        }
        
        this.finishLine(oldStyle);
    },


    //EXTRAS WITH NO HOME

    getCoordsFromBox: function(row, column) {
        var dimension = consts.BOX_DIMENSION;
        var xPos = column * dimension + dimension / 2;
        var yPos = row * dimension + dimension / 2;
        return {xPos: xPos, yPos: yPos};
    },

    getBoxFromCoord: function(x, y) {
        var dimension = consts.BOX_DIMENSION;
        var dimension = consts.BOX_DIMENSION;
        var column = (x - dimension/2) / dimension;
        var row = (y - dimension/2) / dimension;

        return {row: row, column: column};
    },

    inArray: function(arr, value) {
        return arr.indexOf(value) > -1;
    }

};
