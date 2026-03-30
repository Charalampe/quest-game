import { TravelManager, CITY_MAP_POSITIONS, TRAVEL_ROUTES } from '../systems/TravelManager.js';
import { CITIES } from '../data/cities.js';

export class WorldMapScene extends Phaser.Scene {
    constructor() {
        super('WorldMap');
    }

    init(data) {
        this.fromCity = data.from || 'paris';
        this.selectedCity = null;
        this.traveling = false;
    }

    create() {
        const { width, height } = this.cameras.main;

        this.travelManager = new TravelManager(this);

        // Background
        this.add.image(width / 2, height / 2, 'world_map_bg');

        // Title
        this.add.text(width / 2, 8, 'WORLD MAP', {
            fontSize: '10px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);

        // Draw travel routes (lines between cities)
        this.drawRoutes();

        // Draw city dots
        this.cityDots = {};
        this.drawCities();

        // Info panel at bottom
        this.infoBg = this.add.rectangle(width / 2, height - 20, width - 16, 32, 0x1a1a2e, 0.9);
        this.infoBg.setStrokeStyle(1, 0x8866cc);

        this.infoText = this.add.text(width / 2, height - 24, 'Select a destination', {
            fontSize: '8px', fontFamily: 'monospace', color: '#ccaaff',
            align: 'center'
        }).setOrigin(0.5);

        this.infoSubtext = this.add.text(width / 2, height - 14, 'Click a city or press ESC to return', {
            fontSize: '6px', fontFamily: 'monospace', color: '#666688',
            align: 'center'
        }).setOrigin(0.5);

        // Travel button (hidden initially)
        this.travelButton = this.add.text(width / 2, height - 14, '', {
            fontSize: '7px', fontFamily: 'monospace', color: '#1a1a2e',
            backgroundColor: '#f1c40f', padding: { x: 8, y: 2 }
        }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });

        this.travelButton.on('pointerdown', () => this.startTravel());
        this.travelButton.on('pointerover', () => this.travelButton.setColor('#ffffff'));
        this.travelButton.on('pointerout', () => this.travelButton.setColor('#1a1a2e'));

        // Current city indicator
        const currentPos = CITY_MAP_POSITIONS[this.fromCity];
        this.currentMarker = this.add.text(currentPos.x, currentPos.y - 12, 'YOU', {
            fontSize: '6px', fontFamily: 'monospace', color: '#ffffff',
            backgroundColor: '#e74c3c', padding: { x: 2, y: 1 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.currentMarker,
            y: currentPos.y - 14,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ESC to return
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.traveling) this.returnToExplore();
        });

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    drawRoutes() {
        const unlocked = this.registry.get('unlockedCities') || ['paris'];
        const graphics = this.add.graphics();

        const drawn = new Set();

        for (const cityId of unlocked) {
            const from = CITY_MAP_POSITIONS[cityId];
            const routes = TRAVEL_ROUTES[cityId] || {};

            for (const [destId, route] of Object.entries(routes)) {
                if (!unlocked.includes(destId)) continue;

                const key = [cityId, destId].sort().join('-');
                if (drawn.has(key)) continue;
                drawn.add(key);

                const to = CITY_MAP_POSITIONS[destId];

                // Route color by type
                const colors = { train: 0xe74c3c, boat: 0x3498db, portal: 0x9b59b6 };
                const color = colors[route.type] || 0xffffff;

                // Draw dotted line
                graphics.lineStyle(1, color, 0.6);
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const steps = Math.floor(dist / 4);

                for (let i = 0; i < steps; i += 2) {
                    const t1 = i / steps;
                    const t2 = Math.min((i + 1) / steps, 1);
                    graphics.lineBetween(
                        from.x + dx * t1, from.y + dy * t1,
                        from.x + dx * t2, from.y + dy * t2
                    );
                }
            }
        }
    }

    drawCities() {
        const unlocked = this.registry.get('unlockedCities') || ['paris'];
        const visited = this.registry.get('visitedCities') || [];

        for (const [cityId, pos] of Object.entries(CITY_MAP_POSITIONS)) {
            const isUnlocked = unlocked.includes(cityId);
            const isCurrent = cityId === this.fromCity;

            // City dot
            const dot = this.add.image(pos.x, pos.y, isUnlocked ? 'city_dot' : 'city_locked');
            dot.setInteractive({ useHandCursor: isUnlocked });

            // City label
            const labelColor = isCurrent ? '#f1c40f' : (isUnlocked ? '#ffffff' : '#555555');
            const label = this.add.text(pos.x, pos.y + 8, pos.label, {
                fontSize: '6px', fontFamily: 'monospace', color: labelColor
            }).setOrigin(0.5);

            if (isUnlocked && !isCurrent) {
                dot.on('pointerdown', () => this.selectCity(cityId));
                dot.on('pointerover', () => {
                    dot.setScale(1.5);
                    label.setColor('#f1c40f');
                });
                dot.on('pointerout', () => {
                    dot.setScale(1);
                    label.setColor(this.selectedCity === cityId ? '#f1c40f' : '#ffffff');
                });
            }

            this.cityDots[cityId] = { dot, label };
        }
    }

    selectCity(cityId) {
        if (this.traveling || cityId === this.fromCity) return;

        this.selectedCity = cityId;

        const route = this.travelManager.getRoute(this.fromCity, cityId);
        const cityName = CITIES[cityId].name;

        if (route) {
            this.infoText.setText(`${cityName} - ${route.label}`);
            this.travelButton.setText(`Travel to ${cityName}`);
            this.travelButton.setVisible(true);
            this.infoSubtext.setVisible(false);
        } else {
            // No direct route, check if we can travel at all
            this.infoText.setText(`No direct route to ${cityName}`);
            this.travelButton.setVisible(false);
            this.infoSubtext.setText('Try traveling through another city');
            this.infoSubtext.setVisible(true);
        }

        // Highlight selected city
        Object.entries(this.cityDots).forEach(([id, { label }]) => {
            if (id !== this.fromCity) {
                label.setColor(id === cityId ? '#f1c40f' : '#ffffff');
            }
        });
    }

    startTravel() {
        if (this.traveling || !this.selectedCity) return;
        this.traveling = true;

        const route = this.travelManager.getRoute(this.fromCity, this.selectedCity);
        if (!route) return;

        const from = CITY_MAP_POSITIONS[this.fromCity];
        const to = CITY_MAP_POSITIONS[this.selectedCity];

        // Animate travel
        this.infoText.setText(`Traveling by ${route.label}...`);
        this.travelButton.setVisible(false);

        // Travel dot animation
        const traveler = this.add.circle(from.x, from.y, 3, 0xf1c40f);
        this.tweens.add({
            targets: traveler,
            x: to.x,
            y: to.y,
            duration: route.duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Explore', { city: this.selectedCity });
                });
            }
        });

        // Draw trailing line
        const graphics = this.add.graphics();
        const colors = { train: 0xe74c3c, boat: 0x3498db, portal: 0x9b59b6 };
        graphics.lineStyle(2, colors[route.type] || 0xffffff, 0.8);

        let progress = 0;
        this.time.addEvent({
            delay: 16,
            callback: () => {
                progress += 16 / route.duration;
                if (progress > 1) progress = 1;
                graphics.clear();
                graphics.lineStyle(2, colors[route.type] || 0xffffff, 0.8);
                graphics.lineBetween(
                    from.x, from.y,
                    from.x + (to.x - from.x) * progress,
                    from.y + (to.y - from.y) * progress
                );
            },
            repeat: Math.floor(route.duration / 16)
        });
    }

    returnToExplore() {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Explore', { city: this.fromCity });
        });
    }
}
