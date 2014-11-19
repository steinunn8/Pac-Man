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

var KEY_MUTE   = keyCode('M');
var KEY_SPATIAL = keyCode('X');
var KEY_LOG_MAZE = keyCode('V');
var KEY_NEW_GAME = keyCode('9');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL) && g_debugEnabled) g_renderSpatialDebug = !g_renderSpatialDebug;

    // prints pretty level data to console
    if (eatKey(KEY_LOG_MAZE)) {
        var levelArray = [];
        var maze = entityManager.getMazeGrid();
        for(var i = 0; i < maze.length; i++) {
            levelArray.push(JSON.stringify(maze[i]).replace(/\-?\d+/g, function(x) {
                return (" " + x).slice(-2);
            }));
        }
        console.log(JSON.stringify(levelArray, undefined, 4).replace(/"/g, ""));
    }

    if (eatKey(KEY_MUTE)) {
        audioManager.toggleMute();
    }

    if(eatKey(KEY_NEW_GAME)){
        preloadDone();
    }
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

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images;
var g_sprites = {};
function requestPreloads() {
    g_images = new Image();
    g_images.onload = preloadDone;
    g_images.src = "sprite2.png";

    g_sprites = sprites(); 
}

function preloadDone() {
    entityManager.init(consts.LEVEL_ARRAY);
    main.init();
    g_canvas.width = (consts.BOX_DIMENSION *
                      entityManager.getMazeColumns());
    g_canvas.height = (consts.BOX_DIMENSION *
                       entityManager.getMazeRows());
}

// Kick it off
requestPreloads();
