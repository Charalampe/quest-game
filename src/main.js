import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { ExploreScene } from './scenes/ExploreScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { UIScene } from './scenes/UIScene.js';
import { initLanguage } from './data/i18n/index.js';

initLanguage();

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    pixelArt: true,
    roundPixels: true,
    parent: document.body,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, TitleScene, ExploreScene, WorldMapScene, UIScene]
};

const game = new Phaser.Game(config);
window.game = game;
