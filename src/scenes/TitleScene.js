import { SaveManager } from '../systems/SaveManager.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Stars
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height - 60);
            const star = this.add.rectangle(x, y, 1, 1, 0xffffff);
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 1 },
                duration: Phaser.Math.Between(800, 2000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 1000)
            });
        }

        // Title text
        const title = this.add.text(width / 2, 50, 'The Locket\n  of Worlds', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#ccaaff',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Locket icon
        const locket = this.add.image(width / 2, 100, 'item_locket').setScale(2);
        this.tweens.add({
            targets: locket,
            y: 104,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Glow effect on locket
        const glow = this.add.circle(width / 2, 100, 16, 0xffd700, 0.2);
        this.tweens.add({
            targets: glow,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        this.add.text(width / 2, 130, "A Mystery Across the World", {
            fontSize: '8px',
            fontFamily: 'monospace',
            color: '#8866cc'
        }).setOrigin(0.5);

        // Menu buttons
        this.createButton(width / 2, 170, 'New Game', () => this.startNewGame());
        this.createButton(width / 2, 196, 'Continue', () => this.continueGame());

        // Version text
        this.add.text(width / 2, height - 10, 'v1.0', {
            fontSize: '6px',
            fontFamily: 'monospace',
            color: '#444466'
        }).setOrigin(0.5);

        // Fade in
        this.cameras.main.fadeIn(500, 26, 26, 46);
    }

    createButton(x, y, label, callback) {
        const bg = this.add.image(x, y, 'button_bg').setInteractive({ useHandCursor: true });
        const text = this.add.text(x, y, label, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ccaaff'
        }).setOrigin(0.5);

        bg.on('pointerover', () => {
            bg.setTexture('button_hover');
            text.setColor('#ffffff');
        });

        bg.on('pointerout', () => {
            bg.setTexture('button_bg');
            text.setColor('#ccaaff');
        });

        bg.on('pointerdown', () => {
            this.cameras.main.fadeOut(300, 26, 26, 46);
            this.cameras.main.once('camerafadeoutcomplete', callback);
        });

        return { bg, text };
    }

    startNewGame() {
        // Reset game state
        this.registry.set('currentCity', 'paris');
        this.registry.set('inventory', []);
        this.registry.set('questState', {});
        this.registry.set('unlockedCities', ['paris']);
        this.registry.set('visitedCities', ['paris']);
        this.registry.set('flags', {});
        this.registry.set('openedChests', []);
        this.scene.start('Explore', { city: 'paris' });
    }

    continueGame() {
        const data = SaveManager.load();
        if (data) {
            this.registry.set('currentCity', data.currentCity);
            this.registry.set('inventory', data.inventory || []);
            this.registry.set('questState', data.questState || {});
            this.registry.set('unlockedCities', data.unlockedCities || ['paris']);
            this.registry.set('visitedCities', data.visitedCities || ['paris']);
            this.registry.set('flags', data.flags || {});
            this.registry.set('openedChests', data.openedChests || []);
            this.scene.start('Explore', { city: data.currentCity });
        } else {
            this.startNewGame();
        }
    }
}
