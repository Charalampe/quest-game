import { MangaSpriteProvider } from '../assets/MangaSpriteProvider.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    init() {
        // Create provider here (not in constructor) so scene managers are available
        this.provider = new MangaSpriteProvider(this);
    }

    preload() {
        // Show loading text
        const { width, height } = this.cameras.main;
        this.add.text(width / 2, height / 2, 'Loading...', {
            fontSize: '36px',
            fontFamily: 'monospace',
            color: '#ccaaff'
        }).setOrigin(0.5);

        // Load external sprite sheets (PNGs) if the provider uses them
        this.provider.loadSpriteSheets();
    }

    async create() {
        await this.provider.generateTextures();
        await this.provider.createAnimations();
        this.scene.start('Title');
    }
}
