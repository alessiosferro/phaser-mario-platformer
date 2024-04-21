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
        this.setupPlatforms();
        this.setupPlayer();
        this.setupFires();
        this.setupGoal();

        this.debugDrag([
            ...this.platforms.getChildren(),
            ...this.fires.getChildren(),
            this.player,
            this.goal,
        ]);

        this.cursors = this.input.keyboard.createCursorKeys();

        if (this.isDebugMode) {
            this.input.on('pointerdown', pointer => {
                console.log({
                    x: Math.round(pointer.x),
                    y: Math.round(pointer.y)
                });
            })
        }
    }

    debugDrag(gameObjects) {
        if (!this.isDebugMode) return;

        gameObjects.forEach(obj => {
            obj.setInteractive();
            this.input.setDraggable(obj);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;

            console.log({ dragX, dragY })
        });
    }

    setupPlatforms() {
        this.platforms = this.add.group();
        const { platforms } = this.cache.json.get('level');

        for (const { x, y, numTiles, key } of platforms) {
            let sprite;

            if (numTiles > 1) {
                const { width, height } = this.textures.get(key).get(0);
                sprite = this.add.tileSprite(x, y, width * numTiles, height, key).setOrigin(0);
            } else {
                sprite = this.add.sprite(x, y, key).setOrigin(0);
            }

            this.physics.add.existing(sprite, true);
            this.platforms.add(sprite, true);
        }
    }

    setupPlayer() {
        const { player } = this.cache.json.get('level');
        this.player = this.physics.add.sprite(player.x, player.y, 'player', 3);
        this.physics.add.collider(this.platforms, this.player);
        this.player.body.setCollideWorldBounds(true);
    }

    setupFires() {
        this.fires = this.add.group();
        const { fires } = this.cache.json.get('level');

        for (const { x, y } of fires) {
            const sprite = this.physics.add.sprite(x, y, 'fire');
            sprite.body.allowGravity = false;
            sprite.body.immovable = true;
            sprite.anims.play('burning');
            this.fires.add(sprite, true);
        }
    }

    setupGoal() {
        const { goal } = this.cache.json.get('level');

        this.goal = this.physics.add.sprite(goal.x, goal.y, 'goal');

        this.physics.add.collider(this.goal, this.platforms);
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