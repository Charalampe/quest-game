export class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, data) {
        const textureKey = `npc_${data.sprite || 'librarian'}`;
        super(scene, x, y, textureKey, 0);

        this.npcData = data;
        this.cutsceneWalking = false;

        scene.add.existing(this);
        scene.physics.add.existing(this, true); // static body

        this.setSize(24, 24);
        this.setOffset(4, 24);
        this.setDepth(4);
        this.setImmovable(true);

        // Idle animation
        this.idleTimer = 0;
        this.currentFrame = 0;

        // Interaction indicator
        this.indicator = scene.add.image(x, y - 40, 'quest_marker');
        this.indicator.setDepth(10);
        this.indicator.setVisible(false);

        // Idle bobbing
        scene.tweens.add({
            targets: this.indicator,
            y: y - 44,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtle breathing animation
        scene.tweens.add({
            targets: this,
            scaleY: 1.01,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // NPC name label rendered in UIScene for crisp text
    }

    setInteractable(canInteract) {
        this.indicator.setVisible(canInteract);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.cutsceneWalking) return;
        this.idleTimer += delta;
        if (this.idleTimer > 600) {
            this.idleTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % 4;
            this.setFrame(this.currentFrame);
        }
    }

    updateIndicatorPosition() {
        if (this.indicator) {
            this.indicator.x = this.x;
            this.indicator.y = this.y - 40;
        }
    }

    destroy() {
        if (this.scene) {
            this.scene.tweens.killTweensOf(this.indicator);
            this.scene.tweens.killTweensOf(this);
        }
        if (this.indicator) this.indicator.destroy();
        super.destroy();
    }
}
