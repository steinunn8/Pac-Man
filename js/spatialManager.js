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
    }
};
