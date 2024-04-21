class LoadingScene extends Phaser.Scene {

    constructor() {
        super({ key: 'Loading' });
    }

    preload() {
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.image('block', 'assets/images/block.png');
        this.load.image('goal', 'assets/images/gorilla3.png');
        this.load.image('barrel', 'assets/images/barrel.png');

        this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
            frameWidth: 28,
            frameHeight: 30,
            margin: 1,
            spacing: 1
        });

        this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
            frameWidth: 20,
            frameHeight: 21,
            margin: 1,
            spacing: 1
        });

        this.load.json('level', 'assets/json/level.json');
    }

    create() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player', {
                frames: [3, 4]
            }),
            repeat: -1,
            yoyo: true,
            frameRate: .5
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('player', {
                frames: [0, 1, 2]
            }),
            repeat: -1,
            yoyo: true,
            frameRate: 10
        });

        this.anims.create({
            key: 'burning',
            frames: this.anims.generateFrameNames('fire', {
                frames: [0, 1]
            }),
            repeat: -1,
            frameRate: 10
        });

        this.scene.start('Game');
    }
}

const loadingScene = new LoadingScene();