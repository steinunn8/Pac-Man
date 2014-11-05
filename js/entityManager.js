/*

 entityManager.js

 A module which handles arbitrary entity-management for "Asteroids"


 We create this module as a single global object, and initialise it
 with suitable 'data' and 'methods'.

 "Private" properties are denoted by an underscore prefix convention.

 */


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

    // "PRIVATE" DATA

    _pacMans  : [],
    _ghosts   : [],
    _maze     : [],
    _capsules : [],


    // "PRIVATE" METHODS

    _forEachOf: function(aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

    // PUBLIC METHODS

    // A special return value, used by other objects,
    // to request the blessed release of death!
    //
    KILL_ME_NOW : -1,

    // Some things must be deferred until after initial construction
    // i.e. thing which need `this` to be defined.
    //
    deferredSetup : function () {
        this._categories = [this._maze, this._ghosts, this._pacMans];
    },

    init: function() {
        
        //~ this._generateGhosts();
        this._generateMaze();
        this._generatePacMan();
    },
    
    _generateMaze : function(descr) {
        console.log("Pushin maze!");
        console.log(this._maze);
        this._maze.push(new Maze({}));
        console.log(this._maze);
    },
    
    _generateCapsules : function(descr) {
        //~ TODO: Implement double for-loops that iterate through the
        //~       input array and generates capsules from the value 1
        return;
    },
    
    _generateGhost : function(descr) {
        this._ghosts.push(new Ghost(descr));
    },

    _generatePacMan : function(descr) {
        this._pacMans.push(new PacMan({
            sprite: g_sprites.pacMan,
            column: 14,
            row: 20,
            speed: 2, // columns per second
            rotation: 0
        }));
        
        //Testing sounds, uncomment for PacMan-party 
        //this._pacMans[0].introSound.play();
    },
    
    getMazeColumns : function() {
        return this._maze[0].aGrid[0].length;
    },
    
    getMazeRows : function() {
        return this._maze[0].aGrid.length;
    },
    
    generateCapsule : function(descr){
        this._capsules.push(new Capsule(descr));
    },

    update: function(du) {

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i,1);
                }
                else {
                    ++i;
                }
            }
        }
    },

    render: function(ctx) {

        var debugX = 10, debugY = 100;

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);
                //debug.text(".", debugX + i * 10, debugY);

            }
            debugY += 10;
        }
    }

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
