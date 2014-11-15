// HACKED-IN AUDIO (no preloading)
var eatSound = new Audio("sounds/pacman_chomp.wav");
var warpSound = new Audio("sounds/pacman_death.wav");
var eatFruit = new Audio("sounds/pacman_eatfruit.wav");
var eatGhost = new Audio("sounds/pacman_eatghost.wav");
var newLive = new Audio("sounds/pacman_extrapac.wav");
var intermission = new Audio("sounds/pacman_intermission.wav");
var introSound = new Audio("sounds/pacman_beginning.wav");

var audioManager = {
    muted: false,
    chompTimer: 0,
    chompDuration: 0.1,

    toggleMute: function() {
        this.muted = !this.muted
    },

    play: function(sound) {
        if(sound === eatSound) {
            this.chompTimer = this.chompDuration * SECS_TO_NOMINALS;
        } else if(!this.muted) {
            sound.play();
        }
    },

    update: function(du) {
        this.chompTimer -= du;
        if(this.chompTimer > 0 && !this.muted) {
            // loop at correct time
            if(eatSound.currentTime > 0.28) {
                eatSound.currentTime = 0;
            }
            eatSound.play();
        }

        // don't play the whole sound
        if (eatSound.currentTime > 0.4) {
            eatSound.pause();
        }
    }
}
