export class SaveManager {
    static SAVE_KEY = 'questgame_save';

    static save(registry) {
        const data = {
            currentCity: registry.get('currentCity'),
            currentRoom: registry.get('currentRoom') || 'main',
            inventory: registry.get('inventory') || [],
            questState: registry.get('questState') || {},
            unlockedCities: registry.get('unlockedCities') || ['paris'],
            visitedCities: registry.get('visitedCities') || ['paris'],
            flags: registry.get('flags') || {},
            openedChests: registry.get('openedChests') || [],
            foundJournalPages: registry.get('foundJournalPages') || [],
            timestamp: Date.now()
        };

        localStorage.setItem(SaveManager.SAVE_KEY, JSON.stringify(data));
        return true;
    }

    static load() {
        const raw = localStorage.getItem(SaveManager.SAVE_KEY);
        if (!raw) return null;
        try {
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object' || !data.currentCity) {
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    static hasSave() {
        return SaveManager.load() !== null;
    }

    static deleteSave() {
        localStorage.removeItem(SaveManager.SAVE_KEY);
    }
}
