import { t, getItemText } from '../data/i18n/index.js';

export class InventoryManager {
    constructor(scene) {
        this.scene = scene;
        this.items = scene.registry.get('inventory') || [];
    }

    addItem(item) {
        // Don't add duplicates
        if (this.items.find(i => i.id === item.id)) return;

        this.items.push({
            id: item.id,
            name: item.name,
            icon: item.icon,
            description: item.description || ''
        });

        this.scene.registry.set('inventory', this.items);

        // Show notification
        const uiScene = this.scene.scene.get('UI');
        if (uiScene && uiScene.showNotification) {
            const itemText = getItemText(item.id);
            const localName = itemText ? itemText.name : item.name;
            uiScene.showNotification(t('ui.gotItem', { name: localName }));
        }
    }

    removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        this.scene.registry.set('inventory', this.items);
    }

    hasItem(itemId) {
        return this.items.some(i => i.id === itemId);
    }

    getItems() {
        return [...this.items];
    }

    getItem(itemId) {
        return this.items.find(i => i.id === itemId) || null;
    }
}
