const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: [loadingScene, gameScene],
  title: 'Monster Kong',
  backgroundColor: 0x88bbff,
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);
