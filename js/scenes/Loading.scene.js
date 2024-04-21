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
        this.scene.start('Game');
    }
}

const loadingScene = new LoadingScene();