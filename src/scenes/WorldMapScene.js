import { TravelManager, CITY_MAP_POSITIONS, TRAVEL_ROUTES } from '../systems/TravelManager.js';
import { CITIES } from '../data/cities.js';
import { t } from '../data/i18n/index.js';

// Scale factor for converting 320x240 map coords to 960x720
const MAP_SCALE = 3;

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

        // Background (320x240 texture scaled to 960x720)
        this.add.image(width / 2, height / 2, 'world_map_bg').setScale(MAP_SCALE);

        // Title
        this.add.text(width / 2, 24, t('ui.worldMap'), {
            fontSize: '30px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);

        // Draw travel routes (lines between cities)
        this.drawRoutes();

        // Draw city dots
        this.cityDots = {};
        this.drawCities();

        // Info panel at bottom
        this.infoBg = this.add.rectangle(width / 2, height - 60, width - 48, 96, 0x1a1a2e, 0.9);
        this.infoBg.setStrokeStyle(1, 0x8866cc);

        this.infoText = this.add.text(width / 2, height - 72, t('ui.selectDestination'), {
            fontSize: '24px', fontFamily: 'monospace', color: '#ccaaff',
            align: 'center'
        }).setOrigin(0.5);

        this.infoSubtext = this.add.text(width / 2, height - 42, t('ui.worldMapHint'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688',
            align: 'center'
        }).setOrigin(0.5);

        // Travel button (hidden initially)
        this.travelButton = this.add.text(width / 2, height - 42, '', {
            fontSize: '21px', fontFamily: 'monospace', color: '#1a1a2e',
            backgroundColor: '#f1c40f', padding: { x: 24, y: 6 }
        }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });

        this.travelButton.on('pointerdown', () => this.startTravel());
        this.travelButton.on('pointerover', () => this.travelButton.setColor('#ffffff'));
        this.travelButton.on('pointerout', () => this.travelButton.setColor('#1a1a2e'));

        // Current city indicator
        const currentPos = CITY_MAP_POSITIONS[this.fromCity];
        this.currentMarker = this.add.text(currentPos.x * MAP_SCALE, currentPos.y * MAP_SCALE - 36, t('ui.youMarker'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#ffffff',
            backgroundColor: '#e74c3c', padding: { x: 6, y: 3 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.currentMarker,
            y: currentPos.y * MAP_SCALE - 42,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ESC to return (store ref for cleanup)
        this._onEsc = () => {
            if (!this.traveling) this.returnToExplore();
        };
        this.input.keyboard.on('keydown-ESC', this._onEsc);

        // Cleanup on scene shutdown
        this.events.on('shutdown', () => {
            this.input.keyboard.off('keydown-ESC', this._onEsc);
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

                // Draw dotted line (scale positions to 960x720)
                const fromX = from.x * MAP_SCALE, fromY = from.y * MAP_SCALE;
                const toX = to.x * MAP_SCALE, toY = to.y * MAP_SCALE;
                graphics.lineStyle(3, color, 0.6);
                const dx = toX - fromX;
                const dy = toY - fromY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const steps = Math.floor(dist / 12);

                for (let i = 0; i < steps; i += 2) {
                    const t1 = i / steps;
                    const t2 = Math.min((i + 1) / steps, 1);
                    graphics.lineBetween(
                        fromX + dx * t1, fromY + dy * t1,
                        fromX + dx * t2, fromY + dy * t2
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

            // City dot (scaled up from pixel art)
            const sx = pos.x * MAP_SCALE;
            const sy = pos.y * MAP_SCALE;
            const dot = this.add.image(sx, sy, isUnlocked ? 'city_dot' : 'city_locked').setScale(MAP_SCALE);
            dot.setInteractive({ useHandCursor: isUnlocked });

            // City label
            const labelColor = isCurrent ? '#f1c40f' : (isUnlocked ? '#ffffff' : '#555555');
            const label = this.add.text(sx, sy + 24, pos.label, {
                fontSize: '18px', fontFamily: 'monospace', color: labelColor
            }).setOrigin(0.5);

            if (isUnlocked && !isCurrent) {
                dot.on('pointerdown', () => this.selectCity(cityId));
                dot.on('pointerover', () => {
                    dot.setScale(MAP_SCALE * 1.5);
                    label.setColor('#f1c40f');
                });
                dot.on('pointerout', () => {
                    dot.setScale(MAP_SCALE);
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
        const flags = this.registry.get('flags') || {};
        const cityName = CITIES[cityId].name;

        if (route && (!route.requiresFlag || flags[route.requiresFlag])) {
            const routeLabel = route.labelKey ? t(`travel.${route.labelKey}`) : route.label;
            this.infoText.setText(`${cityName} - ${routeLabel}`);
            this.travelButton.setText(t('ui.travelTo', { city: cityName }));
            this.travelButton.setVisible(true);
            this.infoSubtext.setVisible(false);
        } else if (route && route.requiresFlag && !flags[route.requiresFlag]) {
            this.infoText.setText(`${cityName} - ${t('ui.routeLocked')}`);
            this.travelButton.setVisible(false);
            this.infoSubtext.setText(t('ui.routeLockedHint'));
            this.infoSubtext.setVisible(true);
        } else {
            this.infoText.setText(t('ui.noDirectRoute', { city: cityName }));
            this.travelButton.setVisible(false);
            this.infoSubtext.setText(t('ui.noDirectRouteHint'));
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

        const fromX = from.x * MAP_SCALE, fromY = from.y * MAP_SCALE;
        const toX = to.x * MAP_SCALE, toY = to.y * MAP_SCALE;

        // Animate travel
        const routeLabel = route.labelKey ? t(`travel.${route.labelKey}`) : route.label;
        this.infoText.setText(t('ui.travelingBy', { route: routeLabel }));
        this.travelButton.setVisible(false);

        // Travel dot animation
        const traveler = this.add.circle(fromX, fromY, 9, 0xf1c40f);
        this.tweens.add({
            targets: traveler,
            x: toX,
            y: toY,
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
        graphics.lineStyle(6, colors[route.type] || 0xffffff, 0.8);

        let progress = 0;
        this.time.addEvent({
            delay: 16,
            callback: () => {
                progress += 16 / route.duration;
                if (progress > 1) progress = 1;
                graphics.clear();
                graphics.lineStyle(6, colors[route.type] || 0xffffff, 0.8);
                graphics.lineBetween(
                    fromX, fromY,
                    fromX + (toX - fromX) * progress,
                    fromY + (toY - fromY) * progress
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
