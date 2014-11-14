/*
Stuff to load inn all the sprite images
*/

var sprites = function() {
    var pacMans;
    var ghosts;
    var extras;

    var makeGhosts = function(){
        ghosts = {red:[], pink:[], cyan:[], orange:[]};
        var row = 4;
        var col = 0;
        for(var attr in ghosts){
            ghosts[attr] = {up:[], down:[], left:[], right:[]};
            col = 0;
            for (var attrAttr in ghosts[attr]){
                cutGhostSprite(attr, attrAttr, col, row, 2);
                cutGhostSprite(attr, attrAttr, col + 1, row, 2);
                col += 2;
            }
            row++;
        }
        addEatable();
        addDead();
    };

    var addEatable = function(){
        ghosts["eatable"] = { blue:[], white:[] };
        var color = "blue";
        var row = 8;
        for(var i = 0; i < 4; i++){
            if(i == 2){color = "white";}
                cutGhostSprite("eatable", color, i, row, 2);
        }
    };

    var addDead = function(){
        ghosts["dead"] = {eyes:[]};
        var row = 10;
        for(var i = 0; i < 4; i++){
            cutGhostSprite("dead", "eyes", i, row, 2);
        }
    };

    var cutGhostSprite = function(attr, attrAttr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        ghosts[attr][attrAttr].push(sprite);
    };

    var makePacMan = function(){
        var row = 0;
        var col = 0;
        pacMans = {left:[], right:[], up:[], down:[], dying:[]}
        for(var attr in pacMans){
            if(attr == "dying"){ continue; }
            cutPacManSprite(attr, col, row, 2);
            cutPacManSprite(attr, col + 1, row, 2);
            cutPacManSprite(attr, col + 2, row, 2);
            row++;
        }
        addDying();
    };

    var addDying = function(){
        pacMans["dying"] = []
        var row = 12;
        for(var i = 0; i < 11; i++){
            cutPacManSprite("dying", i, row, 2);
        }
    };

    var cutPacManSprite = function(attr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        pacMans[attr].push(sprite);
    };

    var makeExtras = function(){
        makeFruits();
        makePoints();
        addText();
        addLives();
    };

    var makeFruits = function(){
        var col = 8.5;
        extras = { fruits:[], points:[]}
        for(var i = 8; i < 12; i++){
            cutExtrasSprite("fruits", col, i, 2);
        }
    };

    var makePoints = function(){
        var row = 11;
        for(var i = 0; i < 4; i++){
            cutExtrasSprite("points", i, row, 1.2);
        }
    };

    var addText = function(){
        extras["gameOver"] = new Sprite(g_images, 0.5*20, 9.5 * 20, 90, 10, 90, 10, 1);
        extras["ready"] = new Sprite(g_images, 10*20, 0, 60, 10, 60, 10, 1);
        extras["1up"] = new Sprite(g_images, 10.5*20, 3.5*20, 30, 10, 30, 10, 1);
        extras["2up"] = new Sprite(g_images, 10.5*20, 4*20, 30, 10, 30, 10, 1);
    };

    var addLives = function(){

    };

    var cutExtrasSprite = function(attr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        extras[attr].push(sprite);
    };

    makePacMan();
    makeGhosts();
    makeExtras();

    return {
        ghosts  : ghosts,
        pacMans : pacMans,
        extras  : extras
    };
};
