  'use strict';
  function Menu() {}

  Menu.prototype = {
    preload: function() {
    },
    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background2');

        this.titleGroup = this.game.add.group();

        this.game.add.tween(this.titleGroup).to({y:15}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

        this.startButton = this.game.add.button(this.game.width/2, this.game.height*0.75, 'startButton', this.startClick, this);
        this.startButton.anchor.setTo(0.5,0.5);

        this.game.input.gamepad.start();
        this.pad1 = this.game.input.gamepad.pad1;

        this.displayInstructions();
    },
    displayInstructions: function() {
      this.instructionText = this.game.add.text(this.game.world.centerX, 400, 'Click or press jump to start game', { font: '48px Ubuntu', fill: '#ff0000', align: 'center'});
      this.instructionText.anchor.setTo(0.5, 0.5);
      this.instructionText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 15);
    },
    update: function() {
        if (this.game.input.activePointer.justPressed()
            || this.pad1.justPressed(Phaser.Gamepad.XBOX360_A)
            || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('play');
        }
    },
    startClick: function() {
        this.game.state.start('play');
    }
  };
  module.exports = Menu;
