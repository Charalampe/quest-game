export class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, data) {
        const textureKey = `npc_${data.sprite || 'librarian'}`;
        super(scene, x, y, textureKey, 0);

        this.npcData = data;

        scene.add.existing(this);
        scene.physics.add.existing(this, true); // static body

        this.setSize(12, 12);
        this.setOffset(2, 4);
        this.setDepth(4);
        this.setImmovable(true);

        // Idle animation
        this.idleTimer = 0;
        this.currentFrame = 0;

        // Interaction indicator
        this.indicator = scene.add.image(x, y - 12, 'quest_marker');
        this.indicator.setDepth(10);
        this.indicator.setVisible(false);

        // Idle bobbing
        scene.tweens.add({
            targets: this.indicator,
            y: y - 14,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // NPC name label (shown on hover)
        this.nameLabel = scene.add.text(x, y + 10, data.name, {
            fontSize: '6px',
            fontFamily: 'monospace',
            color: '#ffffff',
            backgroundColor: '#1a1a2ecc',
            padding: { x: 2, y: 1 }
        }).setOrigin(0.5).setDepth(10).setVisible(false);
    }

    setInteractable(canInteract) {
        this.indicator.setVisible(canInteract);
        this.nameLabel.setVisible(canInteract);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.idleTimer += delta;
        if (this.idleTimer > 800) {
            this.idleTimer = 0;
            this.currentFrame = this.currentFrame === 0 ? 1 : 0;
            this.setFrame(this.currentFrame);
        }
    }

    destroy() {
        if (this.scene) {
            this.scene.tweens.killTweensOf(this.indicator);
        }
        if (this.indicator) this.indicator.destroy();
        if (this.nameLabel) this.nameLabel.destroy();
        super.destroy();
    }
}
