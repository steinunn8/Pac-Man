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
        ghosts["frightened"] = { blue:[], white:[] };
        var color = "blue";
        var row = 8;
        for(var i = 0; i < 4; i++){
            if(i == 2){color = "white";}
            cutGhostSprite("frightened", color, i, row, 2);
        }
    };

    var addDead = function(){
        ghosts["dead"] = {};
        var row = 10;
        ghosts.dead.up = new Sprite(
            g_images, 0*20, row*20, 20, 20, 16, 16, 2
        );
        ghosts.dead.down = new Sprite(
            g_images, 1*20, row*20, 20, 20, 16, 16, 2
        );
        ghosts.dead.left = new Sprite(
            g_images, 2*20, row*20, 20, 20, 16, 16, 2
        );
        ghosts.dead.right = new Sprite(
            g_images, 3*20, row*20, 20, 20, 16, 16, 2
        );
    };

    var cutGhostSprite = function(attr, attrAttr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        ghosts[attr][attrAttr].push(sprite);
    };

    var makePacMan = function(){
        var row = 0;
        var col = 0;
        pacMans = {left:[], right:[], up:[], down:[]};
        for(var attr in pacMans){
            cutPacManSprite(attr, col, row, 2);
            cutPacManSprite(attr, col + 1, row, 2);
            cutPacManSprite(attr, col + 2, row, 2);
            row++;
        }
        addDying();
        addLives();
    };

    var addLives = function(){
        pacMans["lives"] = [];
        pacMans["lives"].push(pacMans.left[0]);
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
        makeFruitPoints();
        makeGhostPoints();
        addText();
        addLives();
    };

    var makeFruits = function(){
        var col = 8.5;
        extras = { fruits:{}, points:[], ghostPoints:[]};
        extras.fruits.cherries = new Sprite(
            g_images, 8.5*20, 8*20, 20, 20, 16, 16, 2
        );
        extras.fruits.strawberry = new Sprite(
            g_images, 8.5*20, 9*20, 20, 20, 16, 16, 2
        );
        extras.fruits.peach = new Sprite(
            g_images, 8.5*20, 10*20, 20, 20, 16, 16, 2
        );
        extras.fruits.apple = new Sprite(
            g_images, 8.5*20, 11*20, 20, 20, 16, 16, 2
        );
        extras.fruits.grapes = new Sprite(
            g_images, 10.5*20, 8*20, 20, 20, 16, 16, 2
        );
        extras.fruits.galaxian = new Sprite(
            g_images, 10.5*20, 9*20, 20, 20, 16, 16, 2
        );
        extras.fruits.bell = new Sprite(
            g_images, 10.5*20, 10*20, 20, 20, 16, 16, 2
        );
        extras.fruits.key = new Sprite(
            g_images, 10.5*20, 11*20, 20, 20, 16, 16, 2
        );
    };

    var makeGhostPoints = function(){
        var row = 11;
        for(var i = 0; i < 4; i++){
            cutExtrasSprite("ghostPoints", i, row, 2);
        }
    };

    var makeFruitPoints = function(){
        extras.fruitPoints = [];
        var col = 8.25;
        for(var i = 0; i < 8; i++){
            extras.fruitPoints.push(
                new Sprite(g_images, col*20, i*20, 30, 20, 20, 16, 2));
        }
    };

    var addText = function(){
        extras["highScore"] = new Sprite(g_images, 200, 26, 80, 8, 160, 14, 1);
        extras["gameOver"] = new Sprite(g_images, 0.5*20, 9.5 * 20, 90, 10, 90, 10, 2);
        extras["ready"] = new Sprite(g_images, 10*20, 0, 60, 10, 96, 16);
        extras["1up"] = new Sprite(g_images, 10.5*20, 3.5*20, 30, 10, 30, 10, 1);
        extras["2up"] = new Sprite(g_images, 10.5*20, 4*20, 30, 10, 30, 10, 1);
        extras["extraLive"] = new Sprite(g_images, 4*20, 8*20, 20, 20, 16, 16, 2);
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
