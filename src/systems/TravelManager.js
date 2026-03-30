export const TRAVEL_ROUTES = {
    paris: {
        london: { type: 'train', label: 'Eurostar Train', duration: 1000 },
        rome: { type: 'train', label: 'Night Train', duration: 1500 }
    },
    london: {
        paris: { type: 'train', label: 'Eurostar Train', duration: 1000 },
        rome: { type: 'train', label: 'Train via Paris', duration: 2000 }
    },
    rome: {
        paris: { type: 'train', label: 'Night Train', duration: 1500 },
        london: { type: 'train', label: 'Train via Paris', duration: 2000 },
        marrakech: { type: 'boat', label: 'Boat across Mediterranean', duration: 2000 }
    },
    marrakech: {
        rome: { type: 'boat', label: 'Boat to Italy', duration: 2000 },
        tokyo: { type: 'portal', label: 'Magic Portal', duration: 800, requiresFlag: 'portal_unlocked' }
    },
    tokyo: {
        marrakech: { type: 'portal', label: 'Magic Portal', duration: 800, requiresFlag: 'portal_unlocked' }
    }
};

// City positions on the world map (pixel coordinates at 320x240)
export const CITY_MAP_POSITIONS = {
    paris: { x: 108, y: 58, label: 'Paris' },
    london: { x: 96, y: 40, label: 'London' },
    rome: { x: 132, y: 82, label: 'Rome' },
    marrakech: { x: 110, y: 130, label: 'Marrakech' },
    tokyo: { x: 288, y: 62, label: 'Tokyo' }
};

export class TravelManager {
    constructor(scene) {
        this.scene = scene;
    }

    getAvailableDestinations(fromCity) {
        const unlocked = this.scene.registry.get('unlockedCities') || ['paris'];
        const flags = this.scene.registry.get('flags') || {};
        const routes = TRAVEL_ROUTES[fromCity] || {};
        const destinations = [];

        for (const [cityId, route] of Object.entries(routes)) {
            if (!unlocked.includes(cityId)) continue;
            if (route.requiresFlag && !flags[route.requiresFlag]) continue;
            destinations.push({
                cityId,
                ...route
            });
        }

        return destinations;
    }

    getRoute(from, to) {
        return (TRAVEL_ROUTES[from] || {})[to] || null;
    }
}
