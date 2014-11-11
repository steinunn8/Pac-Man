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
    
    
    // PUBLIC DATA
    
    entityTypes : {
        PacMan : "PacMan",
        Ghost : "Ghost",
        Capsule : "Capsule",
        SpecialCapsule : "Special Capsule"
    },
    

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
        this._generateCapsules();
        this._generatePacMan();
        this._generateGhosts();
    },
    
    _generateMaze : function(descr) {
        console.log("Generating maze");
        console.log(this._maze);
        this._maze.push(new Maze({}));
        console.log(this._maze);
    },
    
    _generateCapsules : function(descr) {
        //~ TODO: Implement double for-loops that iterate through the
        //~       input array and generates capsules from the value 1
        console.log("Generating capsules");
        return;
    },
    
    _generateGhosts : function(descr) {
        console.log("Generating ghosts");
        this._ghosts.push(new Ghost({
            name: "blinky",
            color: "red",
            sprite: g_sprites.pacMan,
            column: 14,
            row: 14,
            speed: 1.5, // columns per second
            direction: "left",
            target_: {
                row: 0,
                column: this.getMazeColumns()
            },
            updateTarget: function() {
                // targets pacman
                var pos = entityManager.getPacmanPos();
                this.target_.row = pos.row;
                this.target_.column = pos.column;
            }
        }));

        this._ghosts.push(new Ghost({
            name: "pinky",
            color: "pink",
            sprite: g_sprites.pacMan,
            column: 14,
            row: 14,
            speed: 1.5, // columns per second
            direction: "left",
            target_: {
                row: 0,
                column: 0
            },
            updateTarget: function() {
                // targets 4 tiles in front of pacman
                var pos = entityManager.getPacmanPos();
                var direction = entityManager.getPacmanDirection();
                var offset = this.getOffset(direction, 4);
                this.target_.row = pos.row + offset.row;
                this.target_.column = pos.column + offset.column;
            }
        }));

        this._ghosts.push(new Ghost({
            name: "clyde",
            color: "orange",
            sprite: g_sprites.pacMan,
            column: 14,
            row: 14,
            speed: 1.5, // columns per second
            direction: "left",
            target_: {
                row: this.getMazeRows(),
                column: 0
            },
            updateTarget: function() {
                // targets pacman when the distance between
                // them is >= 8
                var pos = entityManager.getPacmanPos();
                
                if (util.distSq(pos.column, pos.row, this.column, this.row) >= 64) {
                    this.target_.row = pos.row;
                    this.target_.column = pos.column;
                } else {
                    this.resetTarget();
                }
                
            }
        }));

        this._ghosts.push(new Ghost({
            name: "inky",
            color: "cyan",
            sprite: g_sprites.pacMan,
            column: 14,
            row: 14,
            speed: 1.5, // columns per second
            direction: "left",
            target_: {
                row: this.getMazeRows(),
                column: this.getMazeColumns()
            },
            updateTarget: function() {
                // targets 2 tiles in front of pacman
                // then doubles the vector between that
                // target and blinky
                var pacmanPos = entityManager.getPacmanPos();
                var direction = entityManager.getPacmanDirection();
                var blinkyPos = entityManager.getBlinkyPos();
                var offset = this.getOffset(direction, 2);
                this.target_.row = (pacmanPos.row + offset.row - blinkyPos.row) * 2;
                this.target_.column = (pacmanPos.column + offset.column - blinkyPos.column) * 2;
            }
        }));
    },

    _generatePacMan : function(descr) {
        console.log("Generating Pac-Man");
        this._pacMans.push(new PacMan({
            sprite: g_sprites.pacMan,
            column: 14,
            row: 20,
            speed: 2, // columns per second
            direction: "left"
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

    getPacmanPos : function() {
        return this._pacMans[0].getPos();
    },

    getPacmanDirection : function() {
        return this._pacMans[0].getDirection();
    },

    getBlinkyPos : function() {
        for (var i = 0; i < this._ghosts.length; i++) {
            if (this._ghosts[i].name == "blinky") {
                return this._ghosts[i].getPos();
            }
        }
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
