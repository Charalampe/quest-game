const CITY_FLAGS = {
    paris: 'flag_france',
    london: 'flag_uk',
    rome: 'flag_italy',
    marrakech: 'flag_morocco',
    tokyo: 'flag_japan'
};

export class TravelScene extends Phaser.Scene {
    constructor() {
        super('Travel');
    }

    init(data) {
        this.fromCity = data.from || 'paris';
        this.toCity = data.to || 'london';
        this.travelType = data.type || 'train';
        this.routeLabel = data.label || '';
        this.skipAnimation = data.skipAnimation || false;
        this._tweens = [];
        this._timers = [];
        this._bgSprite = null;
        this._playerSprite = null;
        this._vehicleSprite = null;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Skip animation for tests
        if (this.skipAnimation) {
            this.scene.start('Explore', { city: this.toCity, room: 'main' });
            return;
        }

        // Black background
        this.cameras.main.setBackgroundColor('#000000');

        // Info bar at bottom (60px)
        const barY = height - 30;
        this.add.rectangle(width / 2, barY, width, 60, 0x1a1a2e, 0.95);
        this.add.rectangle(width / 2, barY - 30, width, 2, 0x8866cc, 1);

        // Origin flag (left)
        const fromFlag = CITY_FLAGS[this.fromCity];
        if (fromFlag) {
            this._fromFlagImg = this.add.image(60, barY, fromFlag).setScale(2);
        }

        // Route label (center)
        this.add.text(width / 2, barY, this.routeLabel, {
            fontSize: '22px', fontFamily: 'monospace', color: '#ccaaff'
        }).setOrigin(0.5);

        // Destination flag (right)
        const toFlag = CITY_FLAGS[this.toCity];
        if (toFlag) {
            this._toFlagImg = this.add.image(width - 60, barY, toFlag).setScale(2);
        }

        // Dispatch to animation type
        if (this.travelType === 'train') {
            this._playTrainSequence();
        } else if (this.travelType === 'boat') {
            this._playBoatSequence();
        } else if (this.travelType === 'portal') {
            this._playPortalSequence();
        } else {
            this._fadeToExplore(300);
        }

        // Cleanup on shutdown
        this.events.on('shutdown', () => {
            this._tweens.forEach(tw => { if (tw && tw.isPlaying) tw.stop(); });
            this._tweens = [];
            this._timers.forEach(t => { if (t) t.remove(false); });
            this._timers = [];
            this._bgSprite = null;
            this._playerSprite = null;
            this._vehicleSprite = null;
            this._fromFlagImg = null;
            this._toFlagImg = null;
        });
    }

    update() {
        // Scroll background if active
        if (this._bgSprite && this._scrollSpeed) {
            this._bgSprite.tilePositionX += this._scrollSpeed;
        }
    }

    // --- Train Sequence (~4s) ---
    _playTrainSequence() {
        const { width, height } = this.cameras.main;
        const actionY = height - 60; // bottom of action area

        // Background (scrolling countryside)
        this._bgSprite = this.add.tileSprite(width / 2, actionY / 2, width, 180, 'travel_bg_land');
        this._bgSprite.setScale(actionY / 180);
        this._scrollSpeed = 0;

        // Platform strip at bottom of action area
        const platform = this.add.image(width / 2, actionY - 30, 'travel_platform');
        platform.setDisplaySize(width, 60);

        // Train parked at center
        this._vehicleSprite = this.add.image(width / 2, actionY - 60 - 24, 'travel_train').setScale(2);

        // Player starts left of train, walks right
        this._playerSprite = this.add.sprite(width / 2 - 200, actionY - 60 - 24, 'player');
        this._playerSprite.setScale(2);
        if (this.anims.exists('player_right')) {
            this._playerSprite.play('player_right');
        }

        // Phase 1: Player walks toward train (1s)
        const walkTween = this.tweens.add({
            targets: this._playerSprite,
            x: width / 2 - 40,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                // Phase 2: Player boards (hides) + brief pause
                if (this._playerSprite) {
                    this._playerSprite.setVisible(false);
                    if (this._playerSprite.anims) this._playerSprite.stop();
                }

                const boardTimer = this.time.delayedCall(200, () => {
                    // Phase 3: Background scrolls (train "moving"), speed accelerates (2s)
                    this._scrollSpeed = 1;
                    const accelTween = this.tweens.add({
                        targets: this,
                        _scrollSpeed: 8,
                        duration: 2000,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            // Phase 4: Train tweens off-screen right (800ms)
                            if (this._vehicleSprite) {
                                const exitTween = this.tweens.add({
                                    targets: this._vehicleSprite,
                                    x: width + 200,
                                    duration: 800,
                                    ease: 'Quad.easeIn',
                                    onComplete: () => {
                                        this._scrollSpeed = 0;
                                        this._fadeToExplore(500);
                                    }
                                });
                                this._tweens.push(exitTween);
                            }
                        }
                    });
                    this._tweens.push(accelTween);
                });
                this._timers.push(boardTimer);
            }
        });
        this._tweens.push(walkTween);
    }

    // --- Boat Sequence (~4s) ---
    _playBoatSequence() {
        const { width, height } = this.cameras.main;
        const actionY = height - 60;

        // Background (scrolling seascape)
        this._bgSprite = this.add.tileSprite(width / 2, actionY / 2, width, 180, 'travel_bg_sea');
        this._bgSprite.setScale(actionY / 180);
        this._scrollSpeed = 0;

        // Dock strip at bottom
        const dock = this.add.image(width / 2, actionY - 30, 'travel_dock');
        dock.setDisplaySize(width, 60);

        // Boat parked
        this._vehicleSprite = this.add.image(width / 2 + 60, actionY - 60 - 24, 'travel_boat').setScale(2);

        // Player starts left, walks toward boat
        this._playerSprite = this.add.sprite(width / 2 - 200, actionY - 60 - 24, 'player');
        this._playerSprite.setScale(2);
        if (this.anims.exists('player_right')) {
            this._playerSprite.play('player_right');
        }

        // Phase 1: Walk toward boat (1s)
        const walkTween = this.tweens.add({
            targets: this._playerSprite,
            x: width / 2,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                // Phase 2: Board + bob
                if (this._playerSprite) {
                    this._playerSprite.setVisible(false);
                    if (this._playerSprite.anims) this._playerSprite.stop();
                }

                // Remove dock, start water scrolling
                const boardTimer = this.time.delayedCall(200, () => {
                    dock.setVisible(false);
                    this._scrollSpeed = 2;

                    // Phase 3: Water scrolls, boat oscillates (2s)
                    const bobTween = this.tweens.add({
                        targets: this._vehicleSprite,
                        y: this._vehicleSprite.y - 6,
                        duration: 400,
                        yoyo: true,
                        repeat: 4,
                        ease: 'Sine.easeInOut'
                    });
                    this._tweens.push(bobTween);

                    const sailTimer = this.time.delayedCall(2000, () => {
                        // Phase 4: Boat exits right (800ms)
                        if (this._vehicleSprite) {
                            const exitTween = this.tweens.add({
                                targets: this._vehicleSprite,
                                x: width + 200,
                                duration: 800,
                                ease: 'Quad.easeIn',
                                onComplete: () => {
                                    this._scrollSpeed = 0;
                                    this._fadeToExplore(500);
                                }
                            });
                            this._tweens.push(exitTween);
                        }
                    });
                    this._timers.push(sailTimer);
                });
                this._timers.push(boardTimer);
            }
        });
        this._tweens.push(walkTween);
    }

    // --- Portal Sequence (~2.5s) ---
    _playPortalSequence() {
        const { width, height } = this.cameras.main;
        const centerX = width / 2;
        const centerY = (height - 60) / 2;

        // Dark starfield background
        this.cameras.main.setBackgroundColor('#0a0020');
        const stars = this.add.graphics();
        stars.fillStyle(0xffffff, 0.6);
        for (let i = 0; i < 80; i++) {
            const sx = Math.random() * width;
            const sy = Math.random() * (height - 60);
            stars.fillRect(sx, sy, 2, 2);
        }

        // Purple swirl (circle that grows)
        const swirl = this.add.graphics();
        this._swirlScale = 0;

        const drawSwirl = (scale) => {
            swirl.clear();
            if (scale <= 0) return;
            const r = 60 * scale;
            // Outer glow
            swirl.fillStyle(0x9b59b6, 0.2);
            swirl.fillCircle(centerX, centerY, r * 1.5);
            // Mid ring
            swirl.fillStyle(0x8e44ad, 0.4);
            swirl.fillCircle(centerX, centerY, r);
            // Inner core
            swirl.fillStyle(0xc39bd3, 0.6);
            swirl.fillCircle(centerX, centerY, r * 0.5);
        };

        // Player at center (hidden initially)
        this._playerSprite = this.add.sprite(centerX, centerY, 'player');
        this._playerSprite.setScale(2);
        this._playerSprite.setAlpha(0);

        // Phase 1: Swirl grows (500ms)
        const swirlTween = this.tweens.add({
            targets: this,
            _swirlScale: 1,
            duration: 500,
            ease: 'Quad.easeOut',
            onUpdate: () => drawSwirl(this._swirlScale),
            onComplete: () => {
                // Show player briefly
                if (this._playerSprite) this._playerSprite.setAlpha(1);

                // Phase 2: Player fades out with purple burst (700ms)
                const burstTimer = this.time.delayedCall(100, () => {
                    // Particle burst effect (expanding circles)
                    const burst = this.add.graphics();
                    let burstRadius = 10;
                    const burstExpand = this.tweens.add({
                        targets: { r: 10 },
                        r: 80,
                        duration: 600,
                        ease: 'Quad.easeOut',
                        onUpdate: (tween) => {
                            burstRadius = tween.getValue();
                            burst.clear();
                            burst.fillStyle(0x9b59b6, 0.5 * (1 - burstRadius / 80));
                            burst.fillCircle(centerX, centerY, burstRadius);
                        }
                    });
                    this._tweens.push(burstExpand);

                    if (this._playerSprite) {
                        const fadeOutTween = this.tweens.add({
                            targets: this._playerSprite,
                            alpha: 0,
                            duration: 600,
                            ease: 'Quad.easeIn'
                        });
                        this._tweens.push(fadeOutTween);
                    }

                    // Phase 3: Flag swap (600ms)
                    const flagTimer = this.time.delayedCall(700, () => {
                        // Fade origin flag out, destination flag in at center
                        if (this._fromFlagImg) {
                            const ffOut = this.tweens.add({
                                targets: this._fromFlagImg,
                                alpha: 0,
                                duration: 300
                            });
                            this._tweens.push(ffOut);
                        }
                        if (this._toFlagImg) {
                            const tfIn = this.tweens.add({
                                targets: this._toFlagImg,
                                alpha: 0,
                                duration: 0
                            });
                            this._tweens.push(tfIn);
                            // Brief delay then fade in destination flag at center
                            const flagShowTimer = this.time.delayedCall(200, () => {
                                if (this._toFlagImg) {
                                    this._toFlagImg.setPosition(centerX, centerY);
                                    this._toFlagImg.setScale(3);
                                    const tfShow = this.tweens.add({
                                        targets: this._toFlagImg,
                                        alpha: 1,
                                        duration: 300,
                                        ease: 'Quad.easeOut'
                                    });
                                    this._tweens.push(tfShow);
                                }
                            });
                            this._timers.push(flagShowTimer);
                        }

                        // Phase 4: Player fades back in (400ms)
                        const returnTimer = this.time.delayedCall(600, () => {
                            // Converging particles
                            const converge = this.add.graphics();
                            let convRadius = 80;
                            const convTween = this.tweens.add({
                                targets: { r: 80 },
                                r: 0,
                                duration: 300,
                                ease: 'Quad.easeIn',
                                onUpdate: (tween) => {
                                    convRadius = tween.getValue();
                                    converge.clear();
                                    converge.fillStyle(0xc39bd3, 0.3 * (convRadius / 80));
                                    converge.fillCircle(centerX, centerY, convRadius);
                                }
                            });
                            this._tweens.push(convTween);

                            if (this._playerSprite) {
                                const fadeInTween = this.tweens.add({
                                    targets: this._playerSprite,
                                    alpha: 1,
                                    duration: 400,
                                    ease: 'Quad.easeOut',
                                    onComplete: () => {
                                        this._fadeToExplore(300);
                                    }
                                });
                                this._tweens.push(fadeInTween);
                            } else {
                                this._fadeToExplore(300);
                            }
                        });
                        this._timers.push(returnTimer);
                    });
                    this._timers.push(flagTimer);
                });
                this._timers.push(burstTimer);
            }
        });
        this._tweens.push(swirlTween);
    }

    // --- Utility ---
    _fadeToExplore(duration) {
        this.cameras.main.fadeOut(duration, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Explore', { city: this.toCity, room: 'main' });
        });
    }
}
