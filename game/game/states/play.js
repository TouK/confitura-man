'use strict';

var Devo = require('../prefabs/devo');
var Platform = require('../prefabs/platform');
var PlatformGroup = require('../prefabs/platformGroup');
var Skullchick = require('../prefabs/skullchick');

function Play() {

}

Play.prototype = {
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;

        // background
        this.background = this.game.add.tileSprite(0, 0, 1280, 720, 'background2');
        this.clouds = this.game.add.group();
        this.clouds.enableBody = true;

        // 1st platform
        this.initialGrounds = [ new Platform(this.game, 0, this.game.height * 0.9, 400, 400),
            new Platform(this.game, this.game.width * 0.2, this.game.height * 0.9, 400, 400),
            new Platform(this.game, this.game.width * 0.4, this.game.height * 0.9, 400, 400),
            new Platform(this.game, this.game.width * 0.6, this.game.height * 0.9, 400, 400),
            new Platform(this.game, this.game.width * 0.8, this.game.height * 0.9, 400, 400) ];
        this.initialGrounds.forEach(function(ground) {
            this.game.add.existing(ground);
            ground.body.velocity.x = -130;
        }, this);

        // gamepad
        this.indicator = this.game.add.sprite(this.game.width * 0.9, 10, 'controller-indicator');
        this.indicator.scale.x = this.indicator.scale.y = 2;
        this.indicator.animations.frame = 1;

        this.game.input.gamepad.start();
        this.pad1 = this.game.input.gamepad.pad1;

        // Create a new devo object
        this.devo = new Devo(this.game, 100, 50);
        this.game.add.existing(this.devo);
        this.game.camera.follow(this.devo);

        this.platforms = this.game.add.group();
        this.enemies = this.game.add.group();
        this.collectibles = this.game.add.group();
        this.collectibles.enableBody = true;

        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.DOWN,
            Phaser.Keyboard.UP, Phaser.Keyboard.SPACEBAR]);

        this.terrainGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.generateTerrain, this);
        this.terrainGenerator.timer.start();

        this.cloudGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.generateClouds, this);
        this.cloudGenerator.timer.start();

        this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateEnemies, this);
        this.enemyGenerator.timer.start();

        this.collectiblesGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.addCollectibles, this);
        this.collectiblesGenerator.timer.start();

        this.velocityTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.increaseVelocity, this);
        this.velocityTimer.timer.start();

        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width * 0.05, 10, 'flappyfont',
                                                  ":: " + decodeURIComponent(this.game.uid) + " ::" + " Points: " + this.score.toString(), 26);
        this.scoreText.visible = true;
    },
    update: function () {
        this.background.tilePosition.x -= 1;
        this.initialGrounds.forEach(function (ground) {
            this.game.physics.arcade.collide(this.devo, ground, null, null, this);
            this.game.physics.arcade.collide(this.enemies, ground, null, null, this);
            this.game.physics.arcade.collide(this.collectibles, ground, null, null, this);
        }, this);

        this.game.physics.arcade.overlap(this.devo, this.collectibles, this.collectStar, null, this);
        this.game.physics.arcade.collide(this.devo, this.enemies, this.interactWithEnemy, null, this);

        this.platforms.forEach(function (platformGroup) {
            this.game.physics.arcade.collide(this.devo, platformGroup, null, null, this);
            this.game.physics.arcade.collide(this.enemies, platformGroup, this.enemyOnPlatform, null, this);
            this.game.physics.arcade.collide(this.collectibles, platformGroup, null, null, this);
        }, this);

        if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad1.connected) {
            this.indicator.animations.frame = 0;
        } else {
            this.indicator.animations.frame = 1;
        }

        this.handleMovement();
        if (this.pad1.connected) {
            this.handlePadMovement();
        }
    },
    handleMovement: function() {
        if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1
            || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.devo.left();
        }
        if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1
            || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.devo.right();
        }
        if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1
            || this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.devo.jump();
        }
        if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1
            || this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            // empty?
        }
        if (!(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
            && !(this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

          this.devo.idle();
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.devo.jump();
        }

        if (this.game.input.keyboard.justPressed(Phaser.Keyboard.SHIFT)) {
          this.devo.turbo(true);
        }
        if (this.game.input.keyboard.justReleased(Phaser.Keyboard.SHIFT)){
          this.devo.turbo(false);
        }
    },
    handlePadMovement: function() {
        var rightStickX = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
        var rightStickY = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

        if (this.pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
            this.devo.jump();
        }
        if (this.pad1.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
          this.devo.turbo(true);
        }
        if (this.pad1.justReleased(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
          this.devo.turbo(false);
        }

        if (rightStickX) {
            sprite.x += rightStickX * 10;
        }
        if (rightStickY) {
            sprite.y += rightStickY * 10;
        }
    },
    generateTerrain: function() {
        var lastPlatformGroup = this.platforms.getAt(this.platforms.length - 1);
        var platformGroup = this.platforms.getFirstExists(false);
        if (lastPlatformGroup == -1) {
            var startY = this.game.rnd.integerInRange(this.game.height * 0.75, this.game.height * 0.95);
            platformGroup = new PlatformGroup(this.game, this.platforms);
            platformGroup.reset(this.game.width + this.game.rnd.integerInRange(30, 40), startY);
        }

        if(this.canCreateNewPlatform(lastPlatformGroup) && this.shouldCreatePlatform()) {
            this.putNewPlatform(lastPlatformGroup);
        }
    },
    canCreateNewPlatform: function(lastPlatformGroup) {
        return lastPlatformGroup != -1 && lastPlatformGroup.isRightSideOnScreen(this.game.width);
    },
    shouldCreatePlatform: function() {
        return this.game.rnd.integerInRange(0, 100) > 25;
    },
    putNewPlatform: function(lastPlatformGroup) {
        var platformGroup = new PlatformGroup(this.game, this.platforms, false);
        var newY = this.calculateNewVerticalPositionForPlatform(lastPlatformGroup);
        platformGroup.reset(this.game.width, newY);
    },
    calculateNewVerticalPositionForPlatform: function(lastPlatformGroup) {
        var deltaUp = 60;
        var deltaDown = 100;
        var lastY = lastPlatformGroup.getBottomTerrain().body.y;
        return this.game.rnd.integerInRange(Math.max(lastY - deltaUp, this.game.height * 0.2), Math.min(lastY + deltaDown, this.game.height * 0.95));
    },
    addCollectibles: function() {
        if(this.game.rnd.integerInRange(0, 100) > 60) {
            var collectiblesCount = this.game.rnd.integerInRange(5, 12);
            for (var i = 0; i < collectiblesCount; i++) {
                //  Create a star inside of the 'collectibles' group
                var collectibleSprite = ['confitura', 'star', 'rpt-ptak', 'piorko-01', 'piorko-02'];
                var rnd = this.game.rnd.integerInRange(0, collectibleSprite.length - 1);
                //var deltaForDrop = this.game.width / collectiblesCount;
                var deltaForDrop = this.game.rnd.integerInRange(0, this.game.width);
                var star = this.collectibles.create(i * deltaForDrop, 0, collectibleSprite[rnd]);

                //  Let gravity do its thing
                star.body.gravity.y = 10;

                //  This just gives each star a slightly random bounce value
                star.body.bounce.y = 0.5 + Math.random() * 0.2;
            }
        }
    },
    generateClouds: function() {
        var cloudY = this.game.rnd.integerInRange(20, 250);
        var cloud = this.clouds.getFirstExists(false);
        if (!cloud) {
            var spriteName = 'cloud1.png';
            if (cloudY % 3 == 0) {
                spriteName = 'cloud2.png';
            }
            cloud = this.clouds.create(this.game.width, cloudY, 'tiles', spriteName);
            cloud.body.enableGravity = true;
            cloud.body.allowGravity = false;
            cloud.body.immovable = true;

            cloud.body.velocity.x = -1 * this.game.rnd.integerInRange(20, 70);
        }
    },
    generateEnemies : function () {
        var enemy = this.enemies.getFirstExists(false);
        if (!enemy) {
            enemy = new Skullchick(this.game, 100, 50);
            this.enemies.add(enemy);
        }
        enemy.reset(this.game.width + 50, 30);
    },
    deathHandler: function () {
        this.postToScoreboard(this.score);
        this.game.state.start('gameover');
    },
    shutdown: function () {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.devo.destroy();
        this.platforms.destroy();
        this.enemies.destroy();
    },
    setScore: function(score) {
        this.score += score;
        this.scoreText.setText(":: " + decodeURIComponent(this.game.uid) + " ::" + " Points: " + this.score);
    },
    collectStar: function(player, star) {
      // Removes the star from the screen
      star.kill();
      this.setScore(10);
    },
    enemyOnPlatform : function(enemy, object) {
        var turnOffset = 15;
        if(enemy.body.x > object.body.right - 80) {
            enemy.body.x -= turnOffset;
            enemy.turn();
        }
        if(enemy.body.x < object.body.x + 10) {
            enemy.body.x += turnOffset;
            enemy.turn();
        }
    },
    interactWithEnemy: function(player, enemy) {
        if (player.body.wasTouching.down == false && player.body.touching.down == true) {
            enemy.killWithFadeOut();
            this.setScore(20);
        } else if (enemy.isLethal) {
            this.deathHandler();
        }
    },
    increaseVelocity : function() {
        this.platforms.forEach(function (platformGroup) {
           // VELOCITY
           platformGroup.setAll("body.velocity.x", platformGroup.getTop().body.velocity.x - 10);
        });
    },
    postToScoreboard: function(score) {
      console.log("posting to scoreboard");
      var r = new XMLHttpRequest();
      r.open("POST", "http://localhost:3000/score", true);
      r.setRequestHeader("Content-Type","application/json");
      r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        console.log(r.responseText);
      };
      r.send('{ "uid": "' + this.game.uid + '", "score": ' + score + ', "time": ' + new Date().getTime() + '}');
    }
};

module.exports = Play;
