// GENERIC RENDERING

var g_doClear = true;
var g_doBox = false;
var g_undoBox = false;
var g_doFlipFlop = false;
var g_doRender = true;
var g_debugEnabled = false;

var g_frameCounter = 1;

var TOGGLE_CLEAR = 'C'.charCodeAt(0);
var TOGGLE_RENDER = 'R'.charCodeAt(0);
var TOGGLE_DEBUG_KEY = 'Z'.charCodeAt(0);

function render(ctx) {
    
    // Process various option toggles
    //
    if (eatKey(TOGGLE_DEBUG_KEY)) {
        var dd = document.querySelector(".debug-mode-dd");
        if (g_debugEnabled) {
            dd.classList.add("highlight");            
        } else {
            dd.classList.remove("highlight");
        }
        g_debugEnabled = !g_debugEnabled;
    }
    if (eatKey(TOGGLE_CLEAR) && g_debugEnabled) g_doClear = !g_doClear;
    if (eatKey(TOGGLE_RENDER) && g_debugEnabled) g_doRender = !g_doRender;
    if (eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;

    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //
    if (g_doClear) util.clearCanvas(ctx);
    
    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //
    if (g_doBox) util.fillBox(ctx, 200, 200, 50, 50, "red");
    
    
    // The core rendering of the actual game / simulation
    //
    if (g_doRender) renderSimulation(ctx);
    
    
    // This flip-flip mechanism illustrates the pattern of alternation
    // between frames, which provides a crude illustration of whether
    // we are running "in sync" with the display refresh rate.
    //
    // e.g. in pathological cases, we might only see the "even" frames.
    //
    if (g_doFlipFlop) {
        var boxX = 250,
            boxY = g_isUpdateOdd ? 100 : 200;
        
        // Draw flip-flop box
        util.fillBox(ctx, boxX, boxY, 50, 50, "green");
        
        // Display the current frame-counter in the box...
        ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
        // ..and its odd/even status too
        var text = g_frameCounter % 2 ? "odd" : "even";
        ctx.fillText(text, boxX + 10, boxY + 40);
    }
    
    // Optional erasure of diagnostic "box",
    // to illustrate flicker-proof double-buffering
    //
    if (g_undoBox) ctx.clearRect(200, 200, 50, 50);
    
    ++g_frameCounter;
}
