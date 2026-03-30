import { SaveManager } from '../systems/SaveManager.js';
import { t, getLanguage, toggleLanguage } from '../data/i18n/index.js';

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
            const y = Phaser.Math.Between(0, height - 180);
            const star = this.add.rectangle(x, y, 2, 2, 0xffffff);
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
        const title = this.add.text(width / 2, 150, t('ui.title'), {
            fontSize: '60px',
            fontFamily: 'monospace',
            color: '#ccaaff',
            align: 'center',
            lineSpacing: 12
        }).setOrigin(0.5);

        // Locket icon
        const locket = this.add.image(width / 2, 300, 'item_locket').setScale(6);
        this.tweens.add({
            targets: locket,
            y: 312,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Glow effect on locket
        const glow = this.add.circle(width / 2, 300, 48, 0xffd700, 0.2);
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
        this.add.text(width / 2, 390, t('ui.subtitle'), {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#8866cc'
        }).setOrigin(0.5);

        // Menu buttons
        this.createButton(width / 2, 510, t('ui.newGame'), () => this.startNewGame());
        this.createButton(width / 2, 588, t('ui.continue'), () => this.continueGame());

        // Language toggle button (top-right)
        const langBg = this.add.rectangle(width - 40, 30, 56, 32, 0x2d1b69)
            .setInteractive({ useHandCursor: true });
        langBg.setStrokeStyle(1, 0x8866cc);
        const langText = this.add.text(width - 40, 30, getLanguage().toUpperCase(), {
            fontSize: '18px', fontFamily: 'monospace', color: '#ccaaff'
        }).setOrigin(0.5);

        langBg.on('pointerover', () => { langBg.setFillStyle(0x4a2d8e); langText.setColor('#ffffff'); });
        langBg.on('pointerout', () => { langBg.setFillStyle(0x2d1b69); langText.setColor('#ccaaff'); });
        langBg.on('pointerdown', () => {
            toggleLanguage();
            this.scene.restart();
        });

        // Version text
        this.add.text(width / 2, height - 30, t('ui.version'), {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#444466'
        }).setOrigin(0.5);

        // Fade in
        this.cameras.main.fadeIn(500, 26, 26, 46);
    }

    createButton(x, y, label, callback) {
        const bg = this.add.rectangle(x, y, 360, 60, 0x2d1b69)
            .setInteractive({ useHandCursor: true });
        bg.setStrokeStyle(2, 0x8866cc);

        const text = this.add.text(x, y, label, {
            fontSize: '30px',
            fontFamily: 'monospace',
            color: '#ccaaff'
        }).setOrigin(0.5);

        bg.on('pointerover', () => {
            bg.setFillStyle(0x4a2d8e);
            bg.setStrokeStyle(2, 0xccaaff);
            text.setColor('#ffffff');
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x2d1b69);
            bg.setStrokeStyle(2, 0x8866cc);
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
