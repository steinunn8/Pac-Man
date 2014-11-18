// HACKED-IN AUDIO (no preloading)
var eatSound = new Audio("sounds/pacman_chomp.wav");
var warpSound = new Audio("sounds/pacman_death.wav");
var eatFruit = new Audio("sounds/pacman_eatfruit.wav");
var eatGhost = new Audio("sounds/pacman_eatghost.wav");
var newLive = new Audio("sounds/pacman_extrapac.wav");
var intermission = new Audio("sounds/pacman_intermission.wav");
var introSound = new Audio("sounds/pacman_beginning.wav");
var siren = new Audio("sounds/pacman_siren.mp3");
var frightened = new Audio("sounds/pacman_frightened.wav");

var audioManager = {
    muted: false,
    chomp: false,
    siren: false,
    frightened: false,

    sounds: [
        eatSound,
        warpSound,
        eatFruit,
        eatGhost,
        newLive,
        intermission,
        introSound,
        siren,
        frightened
    ],

    toggleMute: function() {
        this.setMuted(!this.muted);
    },

    getMuted: function() {
        return this.muted;
    },

    setMuted: function(muted) {
        this.muted = muted;

        if (this.muted) {
            this.setVolume(0);
        } else {
            this.setVolume(1);
        }
    },

    setVolume: function(volume) {
        for (var i=0; i<this.sounds.length; i++) {
            var sound = this.sounds[i];
            sound.volume = volume;
        }
    },

    play: function(sound) {
        if (sound === eatSound) {
            this.chomp = true;
        } else if (sound === siren) {
            this.siren = true;
        } else if (!this.muted) {
            sound.play();
        }
    },

    handleLoop: function(sound, loopTime, startTime, stopTime, shouldPlay) {
        if(shouldPlay && !this.muted) {
            // loop at correct time
            if(sound.currentTime > loopTime) {
                sound.currentTime = startTime;
            }
            sound.play();
        }

        // don't play the whole sound
        if (sound.currentTime > stopTime) {
            sound.pause();
        }
    },

    update: function(du) {
        this.handleLoop(eatSound, 0.28, 0.01, 0.4, this.chomp);
        this.chomp = false;

        this.handleLoop(siren, 0.35, 0, 0.4, this.siren);
        this.siren = false;

        this.handleLoop(frightened, 0.1, 0, 0.2, this.frightened);
        this.frightened = false;
    }
}
