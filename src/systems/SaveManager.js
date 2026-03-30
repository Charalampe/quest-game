export class SaveManager {
    static SAVE_KEY = 'questgame_save';

    static save(registry) {
        const data = {
            currentCity: registry.get('currentCity'),
            inventory: registry.get('inventory') || [],
            questState: registry.get('questState') || {},
            unlockedCities: registry.get('unlockedCities') || ['paris'],
            visitedCities: registry.get('visitedCities') || ['paris'],
            flags: registry.get('flags') || {},
            timestamp: Date.now()
        };

        localStorage.setItem(SaveManager.SAVE_KEY, JSON.stringify(data));
        return true;
    }

    static load() {
        const raw = localStorage.getItem(SaveManager.SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    }

    static hasSave() {
        return localStorage.getItem(SaveManager.SAVE_KEY) !== null;
    }

    static deleteSave() {
        localStorage.removeItem(SaveManager.SAVE_KEY);
    }
}
