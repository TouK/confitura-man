'use strict';

var Skullchick = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'skullchick', frame);

  this.anchor.setTo(0.5, 0.5);

  this.animations.add('left', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
  this.animations.add('turn', [0, 4, 5, 6, 7], 20, true);
  this.animations.add('right', [16, 17, 18, 19, 20, 21, 22, 23, 24], 10, true);

  this.game.physics.arcade.enableBody(this);

  this.body.gravity.y = 1000;
  this.body.maxVelocity.y = 500;

  this.facing = 'left';
  this.isLethal = true;
};

Skullchick.prototype = Object.create(Phaser.Sprite.prototype);
Skullchick.prototype.constructor = Skullchick;

Skullchick.prototype.update = function() {
    if(this.facing == 'left') {
        this.left();
    } else {
        this.right();
    }
};

Skullchick.prototype.left = function() {
    if (!this.isLethal) return;

    this.body.velocity.x = -150;

    this.animations.play('left');
    this.facing = 'left';
};

Skullchick.prototype.right = function() {
    if (!this.isLethal) return;

    this.body.velocity.x = 150;

    this.animations.play('right');
    this.facing = 'right';
};

Skullchick.prototype.idle = function() {
  if (this.facing != 'idle') {
      this.body.velocity.x = 0;
      this.animations.stop();

      if (this.facing == 'left') {
          this.frame = 0;
      } else {
          this.frame = 5;
      }

      this.facing = 'idle';
  }
};

Skullchick.prototype.turn = function() {
    if (this.facing == 'left') {
        this.right();
    } else if (this.facing == 'right') {
        this.left()
    }
};

Skullchick.prototype.killWithFadeOut = function() {
    var fadeOut = this.game.add.tween(this.body.sprite);
    this.isLethal = false;
    this.body.checkCollision = false;
    this.idle();
    fadeOut.onLoop.add(function() {
        this.kill();
    }, this);
    fadeOut.to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1, false);
};

module.exports = Skullchick;
