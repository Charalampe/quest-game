/**
 * Base class defining the asset provider contract.
 * Subclasses must implement all three methods.
 * To swap rendering backends, change the import in BootScene.
 */
export class AssetProvider {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Generate all texture keys consumed by the game.
     * Must create: player, npc_*, tileset, particle_*, dialog_bg, button_bg,
     * button_hover, inventory_bg, interact_icon, quest_marker, arrow,
     * city_dot, city_locked, transport_*, world_map_bg, item_*
     */
    async generateTextures() {
        throw new Error('AssetProvider.generateTextures() must be implemented');
    }

    /**
     * Create all animation keys (player walk/idle).
     * Must create: player_down, player_left, player_right, player_up,
     * player_idle_down, player_idle_left, player_idle_right, player_idle_up
     */
    async createAnimations() {
        throw new Error('AssetProvider.createAnimations() must be implemented');
    }

    /**
     * Returns the list of NPC sprite type names this provider supports.
     * @returns {string[]}
     */
    getNPCTypeNames() {
        throw new Error('AssetProvider.getNPCTypeNames() must be implemented');
    }
}
