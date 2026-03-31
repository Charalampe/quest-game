export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(20, 20);
        this.setOffset(6, 28);
        this.setCollideWorldBounds(true);

        this.speed = 90;
        this.direction = 'down';
        this.isMoving = false;

        // Input (SPACE/I/Q/M/ESC handled by ExploreScene)
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        if (this.scene.dialogActive || this.scene.menuOpen) {
            this.setVelocity(0, 0);
            this.play(`player_idle_${this.direction}`, true);
            return;
        }

        const up = this.cursors.up.isDown || this.wasd.up.isDown;
        const down = this.cursors.down.isDown || this.wasd.down.isDown;
        const left = this.cursors.left.isDown || this.wasd.left.isDown;
        const right = this.cursors.right.isDown || this.wasd.right.isDown;

        let vx = 0;
        let vy = 0;

        if (left) { vx = -this.speed; this.direction = 'left'; }
        else if (right) { vx = this.speed; this.direction = 'right'; }

        if (up) { vy = -this.speed; this.direction = 'up'; }
        else if (down) { vy = this.speed; this.direction = 'down'; }

        // Normalize diagonal movement
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }

        this.setVelocity(vx, vy);

        if (vx !== 0 || vy !== 0) {
            this.play(`player_${this.direction}`, true);
            this.isMoving = true;
        } else {
            this.play(`player_idle_${this.direction}`, true);
            this.isMoving = false;
        }
    }

    getFacingPoint(distance = 32) {
        const dx = { left: -1, right: 1, up: 0, down: 0 }[this.direction];
        const dy = { left: 0, right: 0, up: -1, down: 1 }[this.direction];
        return {
            x: this.x + dx * distance,
            y: this.y + dy * distance
        };
    }
}
