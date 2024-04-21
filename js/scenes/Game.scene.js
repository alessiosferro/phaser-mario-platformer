class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'Game' });
    }

    init() {
        this.playerSpeed = 125;
    }

    create() {
        this.platforms = this.add.group();

        const ground = this.add.sprite(180, 604, 'ground');
        this.physics.add.existing(ground, true);
        this.platforms.add(ground, true);

        const platform = this.add.tileSprite(180, 500, 36 * 5, 30, 'block');
        this.physics.add.existing(platform, true);
        this.platforms.add(platform, true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.player = this.physics.add.sprite(180, 400, 'player', 3);
        this.physics.add.collider(this.platforms, this.player);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('player', {
                frames: [0, 1, 2]
            }),
            repeat: -1,
            yoyo: true,
            frameRate: 10
        });

    }

    update() {
        this.updatePlayerVelocity();
    }

    updatePlayerVelocity() {
        if (this.cursors.left.isDown && this.cursors.right.isDown) {
            return this.stopPlayer();
        }

        if (this.cursors.left.isDown) {
            return this.movePlayer();
        }

        if (this.cursors.right.isDown) {
            return this.movePlayer(true)
        }

       this.stopPlayer();
    }

    movePlayer(flipX = false) {
        this.player.setVelocityX(flipX ? this.playerSpeed : -this.playerSpeed);
        this.player.flipX = flipX;
        this.player.anims.play('run', true);
    }

    stopPlayer() {
        this.player.anims.stop();
        this.player.setVelocityX(0);
        this.player.setFrame(3);
    }
}

const gameScene = new GameScene();