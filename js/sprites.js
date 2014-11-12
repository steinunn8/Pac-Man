/*
Stuff to load inn all the sprite images
*/

var sprites = {
    _pacMans  : [],
    _ghosts   : [],
    _extras   : [],
    


    makeSpritesArray: function() {
    this.makeGhosts();
    this.makePacmans();
    this.makeFruits();
    },

    makeGhosts: function(){
        this._ghosts = {red:[], pink:[], cyan:[], orange:[]};
        var row = 4;
        var col = 0;
        for(attr in this._ghosts){
            this._ghosts[attr] = {up:[], down:[], left:[], right:[]};
            col = 0;
            for (attrAttr in this._ghosts[attr]){
                this.cutGhostSprite(attr, attrAttr, col, row, 2);
                this.cutGhostSprite(attr, attrAttr, col + 1, row, 2);
                col += 2;
            }
            row++;
        }
        this.addEatable();
        this.addDead();
    },

    addEatable: function(){
        this._ghosts["eatable"] = { blue:[], white:[] };
        var color = "blue";
        var row = 8;
        for(var i = 0; i < 4; i++){
            if(i == 2){color = "white";}
            this.cutGhostSprite("eatable", color, i, row, 2);
        }
    },

    addDead: function(){
        this._ghosts["dead"] = {eyes:[]};
        var row = 10;
        for(var i = 0; i < 4; i++){
            this.cutGhostSprite("dead", "eyes", i, row, 2);
        }
    },


    cutGhostSprite: function(attr, attrAttr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        this._ghosts[attr][attrAttr].push(sprite);
    },

    makePacmans: function(){
        var row = 0;
        var col = 0;
        this._pacMans = {left:[], right:[], up:[], down:[], dying:[]}
        for(attr in this._pacMans){
            if(attr == "dying"){ continue; }
            this.cutPacManSprite(attr, col, row, 2);
            this.cutPacManSprite(attr, col + 1, row, 2);
            this.cutPacManSprite(attr, col + 2, row, 2);
            row++;
        }
        this.addDying();
    },

    addDying: function(){
        this._pacMans["dying"] = []
        var row = 12;
        for(var i = 0; i < 11; i++){
            this.cutPacManSprite("dying", i, row, 2);
        }
    },

    cutPacManSprite: function(attr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        this._pacMans[attr].push(sprite);
    },

    makeFruits: function(){
        var col = 8.5;
        this._extras = { fruits:[]}
        for(var i = 8; i < 12; i++){
            this.cutExtraSprite("fruits", col, i, 2);
        }
    },

    cutExtraSprite: function(attr, x, y, scale){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, scale);
        this._extras[attr].push(sprite);
    }


}
