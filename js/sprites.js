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
        pacMans = {left:[], right:[], up:[], down:[], dying:[]};
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
        pacMans["dying"] = [];
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
    };

    var makeFruits = function(){
        var col = 8.5;
        extras = { fruits:[]};
        for(var i = 8; i < 12; i++){
            cutExtrasSprite("fruits", col, i, 2);
        }
    };

    var makePoints = function() {
        extras.points = [];
        for(var i = 1; i < 11; i++) {
            extras.points.push(
                new Sprite(g_images, 2+10*i, 180, 10, 10, 16, 16)
            );
        }
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
