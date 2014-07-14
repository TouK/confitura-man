'use strict';

function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function () {
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.asset);

        this.load.image('background', 'assets/background.png');
        this.load.image('background2', 'assets/background02a_2.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('startButton', 'assets/start-button.png');

        this.load.image('star', 'assets/star.png');
        this.load.image('confitura', 'assets/confitura.png');
        this.load.image('rpt-ptak', 'assets/rpt-ptak.png');
        this.load.image('piorko-01', 'assets/piorko-01.png');
        this.load.image('piorko-02', 'assets/piorko-02.png');

        // devo
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);

        // enemies
        this.load.spritesheet('skullchick', 'assets/enemies/skullchick.png', 60, 90);
        // tiles
        this.load.atlas('tiles', 'assets/tiles/out.png', 'assets/tiles/out.json');

        this.load.spritesheet('controller-indicator', 'assets/misc/controller-indicator.png', 16, 16);

        //this.load.audio('pixies', ['assets/audio/pixies_wave_of_mutilation.mp3']);
        this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');
    },
    create: function () {
        this.asset.cropEnabled = false;
    },
    update: function () {
        if (!!this.ready) {
            // menu is in active so far
            this.game.state.start('menu');
//            this.game.state.start('play');
        }
    },
    onLoadComplete: function () {
        this.ready = true;
    }
};

module.exports = Preload;
