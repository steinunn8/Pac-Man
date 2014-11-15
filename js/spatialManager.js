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
        var spatialID = entity.getSpatialID();
        this._entities[spatialID] = entity;
    },
    
    unregister: function(entity) {
        var spatialID = entity.getSpatialID();
        delete this._entities[spatialID];
    },
    
    _findEntityAt: function(row, column) {
        //~ XXX: More than one entity can be on the same (row,column),
        //~      this implemention finds the first and returns it.
        //~      PacMan and Ghosts get higher priority than capsules
        //~      because capsules are registered once but PacMan and
        //~      Ghosts keep unregistering and registering
        for (var ID = this._entities.length-1; ID >= 0; ID--) {            
            var e = this._entities[ID];
            if (!e || !e.isAlive) continue;
            
            var pos = e.getPos();
            if (pos.row===row && pos.column===column)
                return e;
        }
        return null;
    }, 
    
    imGoingHere: function(aggressor, row, column) {
        //~ console.log("spatialManager reckons that " + myEntityType +
        //~ " is going to (row,column)=(" + row + "," + column + ").");
        
        var entity = this._findEntityAt(row, column);
        if (entity) {
            //~ console.log(myEntityType + " ran into " + entity.entityType);
            entity.hitMe(aggressor);
        }
    },

    render: function(ctx) {
        for (var i = 0; i < this._entities.length-1; i++) {
            var e = this._entities[i];
            if (!e) continue;
            var boxPos = e.getPos();
            var pos = util.getCoordsFromBox(boxPos.row, boxPos.column);
            util.fillBox(ctx, pos.xPos - consts.BOX_DIMENSION/2, pos.yPos - consts.BOX_DIMENSION/2, consts.BOX_DIMENSION, consts.BOX_DIMENSION, "red");
        }
    }
};
