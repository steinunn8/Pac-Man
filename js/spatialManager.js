/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

    // "PRIVATE" DATA

    _nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

    _entities : [],

    // "PRIVATE" METHODS
    //
    // <none yet>


    // PUBLIC METHODS

    getNewSpatialID : function() {
        return this._nextSpatialID++;
    },

    register: function(entity) {
        // var pos = entity.getPos();
        var spatialID = entity.getSpatialID();
        this._entities[spatialID] = entity;
    },

    unregister: function(entity) {
        var spatialID = entity.getSpatialID();
        delete this._entities[spatialID];
    },

    findEntityInRange: function(posX, posY, radius) {

        for (var ID in this._entities) {
            var e = this._entities[ID];
            if (e === undefined) continue;
            
            var ePosX = e.getPos().posX;
            var ePosY = e.getPos().posY;
            var eRadi = e.getRadius();
            
            var sqDistCenters = util.distSq(posX,posY, ePosX, ePosY);
            var sqRadiusSums = util.square(radius+eRadi);
            
            if ( sqDistCenters <= sqRadiusSums) {
                return e;
            }
        }
        return null;
    },

    render: function(ctx) {
        var oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = "red";
        
        for (var ID in this._entities) {
            var e = this._entities[ID];
            if (e === undefined) continue;
            var pos = e.getPos();
            var radius = e.getRadius();
            util.strokeCircle(ctx, pos.posX, pos.posY, radius);
        }
        ctx.strokeStyle = oldStyle;
    }
};
