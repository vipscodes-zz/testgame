var Scene2 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        // Constructor
        function Scene2() {
            // New Scene
            Phaser.Scene.call(this, {
                key: 'scene2'
            });
        },

    preload: function () {
        // function started before gameplay
        console.log('scene 2');
    },

    onObjectClick: function (pointer, gameObject) {
        console.log('Object Click');
    },

    onObjectOver: function (pointer, gameObject) {
        console.log('Object Over');
    },

    onObjectOut: function (pointer, gameObject) {
        console.log('Object Out');
    },

    onObjectClickEnd: function (pointer, gameObject) {
        console.log('Object End Click');

    },

    onPointerUp: function (pointer, currentlyOver) {
        console.log('Mouse Up');
    },

    startInputEvents: function () {

    },

    create: function () {


    }
});