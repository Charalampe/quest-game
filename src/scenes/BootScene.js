import { ProceduralAssetProvider } from '../assets/ProceduralAssetProvider.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Show loading text
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, height / 2, 'Loading...', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ccaaff'
        }).setOrigin(0.5);
    }

    async create() {
        const provider = new ProceduralAssetProvider(this);
        await provider.generateTextures();
        await provider.createAnimations();
        this.scene.start('Title');
    }
}
