'use strict';

function GameOver() {}

GameOver.prototype = {
    preload: function () {
    },
    create: function () {
        this.background = this.game.add.tileSprite(0, 0, 1280, 720, 'background2');

        this.displayGameOver();
        this.displayScore(this.game.state.states.play.score);
        this.displayInstructions();

        this.pad1 = this.game.input.gamepad.pad1;
    },
    displayGameOver: function(score) {
        var style = {
            font: '80px Ubuntu',
            fill: '#ff0000',
            align: 'center'
        };
        this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
        this.titleText.anchor.setTo(0.5, 0.5);
        this.titleText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
    },
    displayScore: function(score) {
        var style = {
            font: '80px Ubuntu',
            fill: '#ff0000',
            align: 'center'
        };
        this.titleText = this.game.add.text(this.game.world.centerX, 200, 'You scored ' + score + ' points!', style);
        this.titleText.anchor.setTo(0.5, 0.5);
        this.titleText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
    },
    displayInstructions: function() {
        this.instructionText = this.game.add.text(this.game.world.centerX, 400, 'Click or press jump to play again', { font: '48px Ubuntu', fill: '#ff0000', align: 'center'});
        this.instructionText.anchor.setTo(0.5, 0.5);
        this.instructionText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);

        this.instructionText = this.game.add.text(this.game.world.centerX, 500, 'Press Back for new player', { font: '48px Ubuntu', fill: '#ff0000', align: 'center'});
        this.instructionText.anchor.setTo(0.5, 0.5);
        this.instructionText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
    },
    update: function () {
        this.background.tilePosition.x -= 1;
        if (this.game.input.activePointer.justPressed()
            || this.pad1.justPressed(Phaser.Gamepad.XBOX360_A)
            || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('play');
        }
        if (this.pad1.justPressed(Phaser.Gamepad.XBOX360_B) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
          window.location.replace("/start.html");
        }
    }
};

module.exports = GameOver;
