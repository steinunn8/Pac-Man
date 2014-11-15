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
    _fruits   : [],
    _modeTimer: 0,
    _modeFrightened: {duration: 7, timer: 0},
    _modes: [{duration: 7, mode: "scatter"}, {duration: 20, mode: "chase"}, 
             {duration: 7, mode: "scatter"}, {duration: 20, mode: "chase"},
             {duration: 5, mode: "scatter"}, {duration: Infinity, mode: "chase"}],

    editingEnabled: false,
    level: 1,
    levels: [],
    
    
    // PUBLIC DATA
    
    entityTypes : {
        PacMan : "PacMan",
        Ghost : "Ghost",
        Capsule : "Capsule",
        SpecialCapsule : "Special Capsule",
        Fruits : "Fruits"
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
        this._categories = [this._maze, this._capsules, this._ghosts, this._pacMans, this._fruits];
    },

    init: function(levels) {
        this.levels = levels;
        this.setLevel(1);
    },

    setLevel: function(levelNumber) {
        if (consts.LEVEL_ARRAY.length < levelNumber) {
            //~ return;
            console.log("All levels won by player. Starting again.");
            levelNumber = 1;
        }
        this.level = levelNumber;
        var level = this.levels[this.level-1];
        var grid = level.grid;
        this.killAll();
        this._generateMaze(level);
        this._generateCapsules(grid);
        this._generatePacMan(grid); //use the grid to initialise Pac-Man (position etc.)
        this._generateGhosts(grid); //use the grid to initialise Ghosts
        this._generateFruits(grid);
    },

    killAll: function() {
        for (var c = 0; c < this._categories.length; ++c) {
            var aCategory = this._categories[c];
            while (aCategory.length > 0) {
                aCategory.pop().kill();
            }
        }
    },
    
    _generateMaze : function(level) {
        this._maze.push(new Maze({ aGrid : level.grid, color : level.color }));
    },
    
    _generateCapsules : function(grid) {
        for (var i=0; i<grid.length; i++) {
            for (var j=0; j<grid[i].length; j++) {
                if (grid[i][j] === this._maze[0].gridValues.CAPSULE) {
                    this._capsules.push(new Capsule({ row : i , column : j }));
                } else if (grid[i][j] === this._maze[0].gridValues.SPECIAL_CAPSULE) {
                    this._capsules.push(new SpecialCapsule({ row : i , column : j }));
                }
            }
        }
    },

    _generateFruits : function(grid){
        this._fruits.push(new Fruit({row : 20, column : 14, type : 0}))
    },

    regenerateCapsules : function(grid) {
        while(this._capsules.length > 0) {
            this._capsules.pop().kill();
        }
        this._generateCapsules(grid);
    },
    
    _generateGhosts : function(grid) {
        var pos = this._maze[0].getEntityPos(this._maze[0].gridValues.BLINKY);
        this._ghosts.push(new Ghost({
            name: "blinky",
            color: "red",
            mode: "scatter",
            sprite: g_sprites.ghosts.red,
            column: pos.column,
            row: pos.row,
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

        pos = this._maze[0].getEntityPos(this._maze[0].gridValues.PINKY);
        this._ghosts.push(new Ghost({
            name: "pinky",
            color: "pink",
            mode: "home",
            homeTime: 1, //seconds
            sprite: g_sprites.ghosts.pink,
            column: 14,
            row: 17,
            speed: 1.5, // columns per second
            direction: 0,
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

        pos = this._maze[0].getEntityPos(this._maze[0].gridValues.CLYDE);
        this._ghosts.push(new Ghost({
            name: "clyde",
            color: "orange",
            mode: "home",
            homeTime: 8, //seconds
            sprite: g_sprites.ghosts.orange,
            column: 16,
            row: 17,
            speed: 1.5, // columns per second
            direction: 0,
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

        pos = this._maze[0].getEntityPos(this._maze[0].gridValues.INKY);
        this._ghosts.push(new Ghost({
            name: "inky",
            color: "cyan",
            mode: "home",
            homeTime: 12, //seconds
            sprite: g_sprites.ghosts.cyan,
            column: 12,
            row: 17,
            speed: 1.5, // columns per second
            direction: 0,
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

    _generatePacMan : function(grid) {
        var pos = this._maze[0].getEntityPos(this._maze[0].gridValues.PACMAN);
        this._pacMans.push(new PacMan({

            sprite: g_sprites.pacMans,
            column: pos.column,
            row: pos.row,
            speed: 2, // columns per second
            direction: "left"
        }));
    },
    
    getMazeColumns : function() {
        return this._maze[0].aGrid[0].length;
    },
    
    getMazeRows : function() {
        return this._maze[0].aGrid.length;
    },

    getMazeGrid : function() {
        return this._maze[0].aGrid;
    },

    getMazeDirections : function(row, column) {
        return this._maze[0].getDirections(row, column);
    },

    penetrable : function(row, column) {
        return this._maze[0].penetrable(row, column);
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
    
    setFrightenedMode : function() {
        console.log("setFrightenedMode");
        this._modeFrightened.timer = 0;
        this.setGhostMode("frightened");
    },
    
    setGhostMode : function(mode) {
        console.log("setting mode: " + mode);
        for (var i = 0; i < this._ghosts.length; i++) {
            this._ghosts[i].changeMode(mode);
        }
    },

    getGhostMode : function() {
        return this._modes[0].mode;
    },
    
    generateCapsule : function(descr) {
        this._capsules.push(new Capsule(descr));
    },

    resetGhosts : function() {
        for (var i=0; i<this._ghosts.length; i++){
            this._ghosts[i].reset();
        }
    },

    score: 0,
    highScore: localStorage.highScore || 0,
    updateScore: function(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.highScore = this.highScore;
        }
    },
    renderScore: function(ctx) {
        var scoreStr = (this.score || "00") + "";
        var scoreMargin = 7-scoreStr.length;
        Array.prototype.forEach.call(scoreStr, function(digit, i) {
            // Points are drawn at row 1 ending at column 7
            var pos = util.getCoordsFromBox(1, scoreMargin+i);
            g_sprites.extras.points[+digit]
                .drawCentredAt(ctx, pos.xPos, pos.yPos);
        });
        var highScoreStr = (this.highScore + "") || "";
        var highScoreMargin = 17-highScoreStr.length;
        Array.prototype.forEach.call(highScoreStr, function(digit, i) {
            var pos = util.getCoordsFromBox(1, highScoreMargin+i);
            g_sprites.extras.points[+digit]
                .drawCentredAt(ctx, pos.xPos, pos.yPos);
        });
    },

    mouseClick: function(x, y) {
        var pos = util.getBoxFromCoord(x + consts.BOX_DIMENSION/2, y + consts.BOX_DIMENSION/2);
        pos.row = Math.floor(pos.row);
        pos.column = Math.floor(pos.column);
        if (this.editingEnabled) {
            this._maze[0].editGrid(pos);
        }
    },

    update: function(du) {
        var TOGGLE_LEVEL_EDIT = keyCode('L');
        if (eatKey(TOGGLE_LEVEL_EDIT)) this.editingEnabled = !this.editingEnabled;

        if (this.editingEnabled) {
            this._maze[0].update(du);
            return;
        }

        var KEY_NEXT_LEVEL = keyCode('N');
        if (this._capsules.length == 0 || eatKey(KEY_NEXT_LEVEL)) {
            console.log("Next level");
            this.setLevel(this.level + 1);
        }
        
        var KEY_E = keyCode('E');
        if (eatKey(KEY_E)) {
            this.setFrightenedMode();
        }

        this._modeTimer += du;
        this._modeFrightened.timer += du;
        
        if (this._modes.length > 0 &&
            this._modeTimer >= this._modes[0].duration * SECS_TO_NOMINALS) {
                this._modes.splice(0, 1);
                this._modeTimer = 0;
                if (this._modes.length > 0 &&
                    this._modeFrightened.timer > this._modeFrightened.duration) {
                        //~ Changing mode
                        this.setGhostMode(this._modes[0].mode);
                }
        }

        audioManager.update(du);

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

        this.renderScore(ctx);

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
