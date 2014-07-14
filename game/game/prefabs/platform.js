'use strict';

var Platform = function(game, x, y, width, height) { // TODO add frame name as param?
    var platforms = ['jungle1.png', 'jungle2.png'];

    var platform = game.rnd.integerInRange(0, 1);
    Phaser.TileSprite.call(this, game, x, y, width, height, 'tiles', platforms[platform]);

    this.scale.setTo(2, 2);

    this.game.physics.arcade.enableBody(this);

    this.body.immovable = true;
    this.body.allowGravity = false;
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {

  // write your prefab's specific update code here

};
module.exports = Platform;