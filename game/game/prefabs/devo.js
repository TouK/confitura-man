'use strict';

var Devo = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'dude', frame);

  this.anchor.setTo(0.5, 0.5);

  this.animations.add('left', [0, 1, 2, 3], 10, true);
  this.animations.add('turn', [4], 20, true);
  this.animations.add('right', [5, 6, 7, 8], 10, true);

  this.game.physics.arcade.enableBody(this);

  this.body.gravity.y = 1500;
  this.body.maxVelocity.y = 2000;

  this.facing = 'left';
  this.jumpTimer = 0;
  this.turboTimer = 0;
};

Devo.prototype = Object.create(Phaser.Sprite.prototype);
Devo.prototype.constructor = Devo;

Devo.prototype.setVelocity = function(velocity) {
    this.velocity = velocity;
};

Devo.prototype.getVelocity = function() {
    return this.velocity;
};

Devo.prototype.update = function() {
    if(this.body.x <= 0) {
        this.body.x = 0;
    }
    if(this.body.x > this.game.width - 10) {
        this.body.x = this.game.width - 10;
    }
    this.checkFalling();
};

Devo.prototype.left = function() {
    this.body.velocity.x = -130;

    if (this.facing != 'left') {
        this.animations.play('left');
        this.facing = 'left';
    }
};

Devo.prototype.right = function() {
    this.body.velocity.x = 130;

    if (this.facing != 'right') {
        this.animations.play('right');
        this.facing = 'right';
    }
};

Devo.prototype.idle = function() {
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

Devo.prototype.turbo = function(enable) {
  /*if (this.game.time.now > this.turboTimer) {
    this.body.velocity.x = this.body.velocity.x * 2;
    this.turboTimer = this.game.time.now + 1000;
  }*/

  if (enable) {
    this.body.velocity.x = this.body.velocity.x * 2;
  } else {
    this.body.velocity.x = this.body.velocity.x / 2;
  }
};

Devo.prototype.jump = function() {
    if (this.game.time.now > this.jumpTimer) {
        this.body.velocity.y = -1000;
        this.jumpTimer = this.game.time.now + 1000;
    }
};

Devo.prototype.checkFalling = function() {
    if(this.body.y > this.game.height) {
        this.exists = false;
        this.game.state.states.play.deathHandler();
    }
};

module.exports = Devo;

