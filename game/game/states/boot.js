'use strict';

function Boot() {
}

Boot.prototype = {
    preload: function () {
        this.load.image('preloader', 'assets/preloader.gif');
    },
    create: function () {
        this.game.input.maxPointers = 1;
        var uid = location.search.split('uid=')[1];
        console.log("uid: " + uid);
        this.game.uid = uid;
        this.game.state.start('preload');
    }
};

module.exports = Boot;
