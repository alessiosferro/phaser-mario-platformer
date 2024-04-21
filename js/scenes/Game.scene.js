class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'Game' });
    }

    init() {
        this.isDebugMode = this.sys.game.config.physics.arcade.debug;

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

        if (this.isDebugMode) {
            this.input.on('pointerdown', pointer => {
                console.log({
                    x: Math.round(pointer.x),
                    y: Math.round(pointer.y)
                });
            })
        }
    }

    createPlatforms() {
        this.platforms = this.add.group();
        const levelData = this.cache.json.get('level');

        for (const { x, y, numTiles, key } of levelData.platforms) {
            let sprite;

            if (numTiles > 1) {
                const width = this.textures.get(key).get(0).width;
                const height = this.textures.get(key).get(0).height;

                sprite = this.add.tileSprite(x, y, width * numTiles, height, key).setOrigin(0);
            } else {
                sprite = this.add.sprite(x, y, key).setOrigin(0);
            }

            this.physics.add.existing(sprite, true);
            this.platforms.add(sprite, true);
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