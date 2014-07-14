'use strict';

var Platform = require('./platform');

var platformSpeed = -130;

var PlatformGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.bottomTerrain = new Platform(this.game, 0, 0, 300, 300);
    this.add(this.bottomTerrain);

    this.width = this.bottomTerrain.width;
    this.hasScored = false;
    this.setAll('body.velocity.x', platformSpeed);
};

PlatformGroup.prototype = Object.create(Phaser.Group.prototype);
PlatformGroup.prototype.constructor = PlatformGroup;

PlatformGroup.prototype.update = function() {
    this.checkWorldBounds();
};

PlatformGroup.prototype.reset = function(x, y) {
    this.bottomTerrain.reset(0, 0);

    this.x = x;
    this.y = y;

    this.setAll('body.velocity.x', platformSpeed);
    this.hasScored = false;
    this.exists = true;
};

PlatformGroup.prototype.checkWorldBounds = function() {
    if(!this.bottomTerrain.body.right < 0) {
        this.exists = false;
    }
};

PlatformGroup.prototype.isRightSideOnScreen = function(width) {
    return this.bottomTerrain.body.right < width;
};

PlatformGroup.prototype.getBottomTerrain = function() {
    return this.bottomTerrain;
};

PlatformGroup.prototype.increaseVelocity = function() {
    platformSpeed -= 5;
};


module.exports = PlatformGroup;
