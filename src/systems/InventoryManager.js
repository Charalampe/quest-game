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
            uiScene.showNotification(`Got: ${item.name}`);
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
