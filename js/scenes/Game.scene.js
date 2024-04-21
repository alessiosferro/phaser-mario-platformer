class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'Game' });
    }

    init() {
        this.playerConfig = {
            speed: {
                x: 125,
                y: 500
            },
            isTouchingGround: null
        }

        this.physics.world.bounds.width = 360;
        this.physics.world.bounds.height = 700;
    }

    create() {
        this.createPlatforms();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.player = this.physics.add.sprite(180, 400, 'player', 3);
        this.physics.add.collider(this.platforms, this.player);
        this.player.body.setCollideWorldBounds(true);

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
    }

    createPlatforms() {
        this.platforms = this.add.group();

        const ground = this.add.sprite(180, 604, 'ground');
        this.physics.add.existing(ground, true);
        this.platforms.add(ground, true);

        const platforms = [
            {
                x: 180,
                y: 500,
                tileLength: 5,
            },
            {
                x: 100,
                y: 400,
                tileLength: 3
            },
            {
                x: 260,
                y: 400,
                tileLength: 3
            },
            {
                x: 180,
                y: 300,
                tileLength: 4
            },
        ];

        for (const { x, y, tileLength} of platforms) {
            const platform = this.add.tileSprite(x, y, 36 * tileLength, 30, 'block');
            this.physics.add.existing(platform, true);
            this.platforms.add(platform, true);
        }

    }

    update() {
        this.updatePlayerVelocity();
    }

    updatePlayerVelocity() {
        this.playerConfig.isTouchingGround = this.player.body.touching.down;

        if (this.cursors.space.isDown || this.cursors.up.isDown) {
            this.jumpPlayer();
        }

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

    jumpPlayer() {
        this.player.anims.stop();
        this.player.setFrame(2);

        if (this.playerConfig.isTouchingGround) {
            this.player.setVelocityY(-this.playerConfig.speed.y);
        }
    }

    movePlayer(flipX = false) {
        if (this.playerConfig.isTouchingGround) {
            this.player.anims.play('run', true);
        }

        this.player.setVelocityX(flipX ? this.playerConfig.speed.x : -this.playerConfig.speed.x);
        this.player.flipX = flipX;
    }

    stopPlayer() {
        if (this.playerConfig.isTouchingGround) {
            this.player.anims.play('idle', true);
        }

        this.player.setVelocityX(0);
    }
}

const gameScene = new GameScene();