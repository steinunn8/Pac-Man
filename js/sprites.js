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
        this._ghosts = {red:[], pink:[], cyan:[], orange:[], eatable:[], dead:[]};
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
    },

    cutGhostSprite: function(attr, attrAttr, x, y, count){
        var sprite;
        sprite = new Sprite(g_images, x * 20, y * 20, 20, 20, 16, 16, 2);
        this._ghosts[attr][attrAttr].push(sprite);
    },

    makePacmans: function(){

    },

    makeFruits: function(){

    }

}
