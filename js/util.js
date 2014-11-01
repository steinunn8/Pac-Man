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
        if(style === undefined) {
            style = ctx.fillStyle;
        }
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = style;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = oldStyle;
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


    //EXTRAS WITH NO HOME

    getCoordsFromBox: function(row, column) {
        var dimension = consts.BOX_DIMENSION * consts.SCALING;
        var xPos = column * dimension + dimension / 2;
        var yPos = row * dimension + dimension / 2;
        return {xPos: xPos, yPos: yPos};
    },

    getBoxFromCoord: function(x, y) {
        var dimension = consts.BOX_DIMENSION * consts.SCALING;
        var column = (x - dimension/2) / dimension;
        var row = (y - dimension/2) / dimension;

        return {row: row, column: column};
    }

};
