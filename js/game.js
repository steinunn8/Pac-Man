// =========
// Pac-Man
// =========


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function createPacMan() {
    entityManager.generatePacMan({
        sprite: g_sprites.pacMan,
        column: 14,
        row: 20,
        speed: 0.33,
        rotation: 0
    });
}

var g_maze;

function createMaze() {
    g_maze = new Maze({});
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    g_maze.render(ctx);
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        sprites   : "sprite.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    g_sprites.pacMan  = new Sprite(g_images.sprites,
                                   268, 162,
                                   16, 16, 1);
    g_sprites.wall  = new Sprite(g_images.sprites,
                                   270, 164,
                                   8, 8);
    g_sprites.capsule = new Sprite(g_images.sprites,
                                   293, 79,
                                   4, 4);
    //g_sprites.specialCapsule;

    entityManager.init();
    createPacMan();

    main.init();

    createMaze();
    g_canvas.width = g_maze.nColumns*consts.BOX_DIMENSION;
    g_canvas.height = g_maze.nRows*consts.BOX_DIMENSION;
    // TODO lata spatial manager vita af tilvist maze
}

// Kick it off
requestPreloads();
