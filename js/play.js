var ScenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        // Constructor
        function ScenePlay() {
            // New Scene
            Phaser.Scene.call(this, {
                key: 'sceneplay'
            });
        },

    preload: function () {
        // function started before gameplay
        this.load.image('background', 'assets/BG.png');
        this.load.image('foreground', 'assets/FG.png');
        this.load.image('foreground_start', 'assets/FG_Awal.png');
        this.load.image('button_play', 'assets/Button_Play.png');
        this.load.image('title', 'assets/Title.png');

        this.load.image('chara', 'assets/Chara.png');
        this.load.image('peluru', 'assets/Peluru.png');
        this.load.image('panel', 'assets/Panel_Nilai.png');

        this.load.image('particle_blue', 'assets/particle_blue.png');

        this.load.audio('ambience', [
            'assets/audio/ambience.ogg',
            'assets/audio/ambience.mp3',
        ]);

        this.load.audio('dead', [
            'assets/audio/dead.ogg',
            'assets/audio/dead.mp3',
        ]);

        this.load.audio('klik_1', [
            'assets/audio/klik_1.ogg',
            'assets/audio/klik_1.mp3',
        ]);

        this.load.audio('klik_2', [
            'assets/audio/klik_2.ogg',
            'assets/audio/klik_2.mp3',
        ]);

        this.load.audio('klik_3', [
            'assets/audio/klik_3.ogg',
            'assets/audio/klik_3.mp3',
        ]);

        this.load.audio('touch', [
            'assets/audio/touch.ogg',
            'assets/audio/touch.mp3',
        ]);

        this.load.audio('transisi_menu', [
            'assets/audio/transisi_menu.ogg',
            'assets/audio/transisi_menu.mp3',
        ]);

        this.score = 0;

        this.isGameRunning = false;
        this.backgrounds = [];

        this.timer_halangan = 0;
        this.halangan = [];

        this.highscore = localStorage["highscore"] || 0;

    },

    startGame: function () {
        this.tweens.add({
            targets: this.foreground_start,
            ease: 'Power1',
            duration: 500,
            y: 1366 / 2 - 1366
        });

        this.tweens.add({
            targets: this.button_play,
            ease: 'Back.easeIn',
            duration: 750,
            scaleX: 0,
            scaleY: 0
        });

        this.tweens.add({
            targets: this.title,
            ease: 'Elastic',
            duration: 750,
            scaleX: 0,
            scaleY: 0
        });

        this.isGameRunning = true;

        this.chara.setPosition(768 / 2, 130);
        this.chara.setVisible(true);
        this.chara.setScale(1);

        this.trail.setVisible(true);

        this.score = 0;
        this.label_score.setText(this.score);
    },

    finishGame: function () {
        this.tweens.add({
            targets: this.foreground_start,
            duration: 750,
            y: 1366 / 2
        });

        this.tweens.add({
            targets: this.button_play,
            ease: 'Back',
            duration: 1000,
            delay: 1500,
            scaleX: 1.5,
            scaleY: 1.5
        });

        this.tweens.add({
            targets: this.title,
            ease: 'Elastic',
            duration: 1000,
            delay: 1000,
            scaleX: 1.5,
            scaleY: 1.5
        });

        this.chara.setVisible(false);

        this.trail.setVisible(false);

        for (let i = 0; i < this.halangan.length; i++) {
            this.halangan[i].destroy();
        }

        this.halangan.splice(0, this.halangan.length);

        // save to local storage
        if (this.score > this.highscore) {
            this.highscore = this.score;
            localStorage["highscore"] = this.highscore;
        }

        this.label_score.setText("Highscore " + this.highscore);

        this.sTransition.play({ 'delay': 0.75 });
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

        if (!this.isGameRunning && gameObject == this.button_play) {
            this.sTouch.play();
            this.startGame();
        }

        this.label_score.setText("Highscore: " + this.highscore);
    },

    onPointerUp: function (pointer, currentlyOver) {
        console.log('Mouse Up');

        if (!this.isGameRunning) return;

        this.charaTweens = this.tweens.add({
            targets: this.chara,
            ease: 'Power1',
            duration: 750,
            y: this.chara.y + 200
        });

        // sound click
        this.sClick[Math.floor((Math.random() * 2))].play();
    },

    startInputEvents: function () {
        this.input.on('pointerup', this.onPointerUp, this);
        this.input.on('gameobjectdown', this.onObjectClick, this);
        this.input.on('gameobjectup', this.onObjectClickEnd, this);
        this.input.on('gameobjectover', this.onObjectOver, this);
        this.input.on('gameobjecout', this.onObjectOut, this);
    },

    create: function () {
        //function started when gameplay
        // this.add.image(x,y,name asset)
        this.time.delayedCall(0, this.startInputEvents, [], this);



        this.mAmbience = this.sound.add('ambience');
        this.mAmbience.loop = true;
        this.mAmbience.setVolume(0.35);
        this.mAmbience.play();

        this.sDead = this.sound.add('dead');
        this.sClick = [];
        this.sClick.push(this.sound.add('klik_1'));
        this.sClick.push(this.sound.add('klik_2'));
        this.sClick.push(this.sound.add('klik_3'));

        for (let i = 0; i < this.sClick.length; i++) {
            this.sClick[i].setVolume(0.5);
        }

        this.sTouch = this.sound.add('touch');
        this.sTransition = this.sound.add('transisi_menu');

        this.sTransition.play({ 'delay': 0.75 });

        this.panel_score = this.add.image(768 / 2, 100, 'panel');
        this.panel_score.setOrigin(0.5);
        this.panel_score.setDepth(11);
        this.panel_score.setAlpha(0.8);
        this.panel_score.setScale(1.5);

        this.label_score = this.add.text(this.panel_score.x + 25, this.panel_score.y, this.score);
        this.label_score.setOrigin(0.5);
        this.label_score.setDepth(11);
        this.label_score.setFontSize(40);
        this.label_score.setTint(0xff732e);

        this.label_score.setText("Highscore " + this.highscore);

        var bg_x = 768 / 2;

        for (let i = 0; i < 2; i++) {
            var bg_awal = [];

            //background
            var bg = this.add.image(bg_x, 1366 / 2, 'background');
            var fg = this.add.image(bg_x, 1366 / 2, 'foreground');
            //custom data
            bg.setData('kecepatan', 2);
            fg.setData('kecepatan', 2);
            fg.setDepth(2);

            bg_awal.push(bg);
            bg_awal.push(fg);

            this.backgrounds.push(bg_awal);

            bg_x += 768;

        }

        this.foreground_start = this.add.image(768 / 2, 1366 / 2, 'foreground_start');
        this.foreground_start.setDepth(10);

        this.button_play = this.add.image(768 / 2, 1366 / 2 + 200, 'button_play');
        this.button_play.setDepth(10);

        this.title = this.add.image(768 / 2, 350, 'title');
        this.title.setDepth(10);


        this.foreground_start.y -= 1366;

        this.tweens.add({
            targets: this.foreground_start,
            duration: 750,
            y: 1366 / 2
        });

        this.button_play.setScale(0);

        this.tweens.add({
            targets: this.button_play,
            ease: 'Back',
            duration: 1000,
            delay: 1500,
            scaleX: 1.5,
            scaleY: 1.5
        });

        this.title.setScale(0);

        this.tweens.add({
            targets: this.title,
            ease: 'Elastic',
            duration: 1500,
            delay: 1000,
            scaleX: 1.5,
            scaleY: 1.5
        });

        this.button_play.setInteractive(); // button clickable
        this.chara = this.add.image(130, 1366 / 2, 'chara');
        this.chara.setDepth(2);

        this.chara.setVisible(false);

        this.trail = this.add.particles('particle_blue');

        this.trailEmiter = this.trail.createEmitter({
            x: 0,
            y: 0,
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 1,
                end: 0
            },
            blendMode: 'SCREEN',
            lifespan: 400,
            speed: 100,
            on: true,
            follow: this.chara,
            tint: 0xff1d00
        });

        this.trailEmiter.emitParticle(16);
        this.trail.setDepth(20);
        this.trail.setVisible(false);
    },

    update: function (time, delta) {
        if (this.isGameRunning) {
            this.chara.y -= 5;

            if (this.chara.y > 1290) {
                this.chara.y = 1290;
            }

            //background
            for (let i = 0; i < this.backgrounds.length; i++) {

                for (let j = 0; j < this.backgrounds[i].length; j++) {
                    this.backgrounds[i][j].x -= this.backgrounds[i][j].getData('kecepatan');

                    if (this.backgrounds[i][j].x <= -(768 / 2)) {
                        var diff = this.backgrounds[i][j].x + (768 / 2);

                        this.backgrounds[i][j].x = 768 + 768 / 2 + diff;
                    }

                }

            }

            // create obstacle
            if (this.timer_halangan == 0) {
                var acak_y = Math.floor((Math.random() * 1280) + 60);

                var peluru = this.add.image(850, acak_y, 'peluru');

                peluru.setOrigin(0.0);
                peluru.setData("status_aktif", true);
                peluru.setData("kecepatan", Math.floor((Math.random() * 15) + 10));
                peluru.setDepth(5);

                this.halangan.push(peluru);

                this.timer_halangan = Math.floor((Math.random() * 50) + 10);
            }

            // move obstacle
            for (let i = this.halangan.length - 1; i >= 0; i--) {
                this.halangan[i].x -= this.halangan[i].getData("kecepatan");

                if (this.halangan[i].x < -200) {
                    this.halangan[i].destroy();
                    this.halangan.splice(i, 1);
                }
            }

            // score
            for (let i = this.halangan.length - 1; i >= 0; i--) {
                if (this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData("status_aktif") == true) {
                    this.halangan[i].setData('status_aktif', false);

                    this.score++;

                    this.label_score.setText(this.score);
                }

            }

            // collisions
            for (let i = this.halangan.length - 1; i >= 0; i--) {
                if (this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y)) {
                    this.halangan[i].setData("status_Aktif", false);

                    this.charaTweens.stop();

                    this.isGameRunning = false;

                    var myScene = this;

                    this.sDead.play();

                    this.charaTweens = this.tweens.add({
                        targets: this.chara,
                        ease: 'Power1',
                        duration: 2000,
                        scaleX: 3,
                        scaleY: 0,
                        onCompleteParams: [myScene],
                        onComplete: function () { myScene.finishGame(); }
                    });
                }
            }

            if (this.chara.y < -50) {
                this.isGameRunning = false;
                var myScene = this;

                this.sDead.play();

                this.charaTweens = this.tweens.add({
                    targets: this.chara,
                    ease: 'Power1',
                    duration: 2000,
                    scaleX: 3,
                    scaleY: 0,
                    onCompleteParams: [myScene],
                    onComplete: function () { myScene.finishGame(); }
                });
            }

            this.timer_halangan--;
        }
    }
});

var config = {
    type: Phaser.AUTO,
    width: 768,
    height: 1366,
    audio: {
        disableWebAudio: true
    },
    scene: [ScenePlay],
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '100%';
            game.canvas.style.height = '100%';
        }
    }
}

var game = new Phaser.Game(config);