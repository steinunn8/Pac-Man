// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// Construct a "sprite" from the given `image`,
//
function Sprite(image, sx, sy, sWidth, sHeight, width, height, scale) {
    this.image = image;

    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.width = width;
    this.height = height;
    this.scale = scale || 1;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image,
                  this.sx, this.sy, 
                  this.sWidth, this.sHeight,
                  x, y, 
                  this.width, this.height);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;

    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);

    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    this.drawAt(ctx, -w/2, -h/2);

    ctx.restore();
};

Sprite.prototype.drawWrapedCentredAt = function(ctx, cx, cy, rotation) {
    var w = g_canvas.width;
    var h = g_canvas.height;
    
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    this.drawCentredAt(ctx, cx+w, cy, rotation);
    this.drawCentredAt(ctx, cx-w, cy, rotation);
    this.drawCentredAt(ctx, cx, cy+h, rotation);
    this.drawCentredAt(ctx, cx, cy-h, rotation);
};
