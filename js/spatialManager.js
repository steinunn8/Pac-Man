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


    // PUBLIC METHODS
    
    getNewSpatialID : function() {
        return this._nextSpatialID++;
    },
    
    register: function(entity) {
        var spatialID = entity.getSpatialID();
        this._entities[spatialID] = entity;
    },
    
    unregister: function(entity) {
        var spatialID = entity.getSpatialID();
        delete this._entities[spatialID];
    },
    
    _findEntitiesAt: function(row, column) {
        var entities = [];
        for (var ID in this._entities) {
            var e = this._entities[ID];
            if (!e) continue;
            
            var pos = e.getPos();
            if (pos.row===row && pos.column===column)
                entities.push(e);
        }
        return entities;
    }, 
    
    imGoingHere: function(aggressor, row, column) {
        var entities = this._findEntitiesAt(row, column);
        for (var i=0; i<entities.length; i++) {
            var entity = entities[i];
            entity.hitMe(aggressor);
        }
    },

    render: function(ctx) {
        for (var i = 0; i < this._entities.length-1; i++) {
            var e = this._entities[i];
            if (!e) continue;
            var boxPos = e.getPos();
            var pos = util.getCoordsFromBox(boxPos.row, boxPos.column);
            util.fillBox(ctx, pos.xPos - consts.BOX_DIMENSION/2, 
                         pos.yPos - consts.BOX_DIMENSION/2, 
                         consts.BOX_DIMENSION, 
                         consts.BOX_DIMENSION, 
                         "red");
        }
    }
};
