import { QUESTS, NPC_DIALOG_ROUTES, CHEST_REWARDS } from '../data/quests.js';
import { t, getQuestText } from '../data/i18n/index.js';

export class QuestManager {
    constructor(scene) {
        this.scene = scene;

        // Load quest state from registry
        const savedState = scene.registry.get('questState') || {};
        this.completedObjectives = savedState.completedObjectives || [];
        this.questStarted = savedState.questStarted || false;

        // Auto-start quest if flag is set
        const flags = scene.registry.get('flags') || {};
        if (flags.quest_started) {
            this.questStarted = true;
        }
    }

    saveState() {
        this.scene.registry.set('questState', {
            completedObjectives: this.completedObjectives,
            questStarted: this.questStarted
        });
    }

    onEnterCity(cityId) {
        // Auto-start quest on first entry to Paris
        if (cityId === 'paris' && !this.questStarted) {
            this.questStarted = true;
            this.saveState();
        }
    }

    getNPCDialogId(npcId) {
        const routes = NPC_DIALOG_ROUTES[npcId];
        if (!routes) return null;

        const flags = this.scene.registry.get('flags') || {};

        for (const route of routes) {
            if (route.condition(flags)) {
                return route.dialog;
            }
        }

        return null;
    }

    onDialogComplete(npcId, dialogId) {
        this.saveState();
    }

    completeObjective(objectiveId) {
        if (!this.completedObjectives.includes(objectiveId)) {
            this.completedObjectives.push(objectiveId);
            this.saveState();

            // Notify UI
            const uiScene = this.scene.scene.get('UI');
            if (uiScene && uiScene.showNotification) {
                uiScene.showNotification(t('ui.objectiveComplete'));
            }

            // Check if quest is complete
            this.checkQuestCompletion();
        }
    }

    onItemFound(itemId) {
        this.saveState();
    }

    getChestReward(chestId) {
        const chestData = CHEST_REWARDS[chestId];
        if (!chestData) return null;

        const flags = this.scene.registry.get('flags') || {};
        if (chestData.requiresFlag && !flags[chestData.requiresFlag]) {
            return null;
        }

        // Handle chest-specific flags and objectives
        if (chestData.setsFlag) {
            flags[chestData.setsFlag] = true;
            this.scene.registry.set('flags', flags);
        }
        if (chestData.completesObjective) {
            this.completeObjective(chestData.completesObjective);
        }
        if (chestData.unlocksCity) {
            const unlocked = this.scene.registry.get('unlockedCities') || ['paris'];
            if (!unlocked.includes(chestData.unlocksCity)) {
                unlocked.push(chestData.unlocksCity);
                this.scene.registry.set('unlockedCities', unlocked);

                const uiScene = this.scene.scene.get('UI');
                if (uiScene && uiScene.showNotification) {
                    const cityName = chestData.unlocksCity.charAt(0).toUpperCase() + chestData.unlocksCity.slice(1);
                    uiScene.showNotification(t('ui.newDestination', { city: cityName }));
                }
            }
        }

        return chestData.item;
    }

    getActiveQuests() {
        if (!this.questStarted) return [];

        const quest = QUESTS.main_quest;
        const flags = this.scene.registry.get('flags') || {};
        const questText = getQuestText(quest.id);

        // Determine which objectives are visible
        const visibleObjectives = quest.objectives.filter(obj => {
            if (obj.requires) {
                return this.completedObjectives.includes(obj.requires);
            }
            return true;
        });

        const objectives = visibleObjectives.map(obj => ({
            id: obj.id,
            text: questText?.objectives?.[obj.id]?.text ?? obj.text,
            completed: this.completedObjectives.includes(obj.id),
            hint: questText?.objectives?.[obj.id]?.hint ?? obj.hint,
            city: obj.city
        }));

        return [{
            id: quest.id,
            name: questText?.name ?? quest.name,
            description: questText?.description ?? quest.description,
            objectives
        }];
    }

    getCurrentObjective() {
        const quest = QUESTS.main_quest;
        for (const obj of quest.objectives) {
            if (!this.completedObjectives.includes(obj.id)) {
                // Check if requirements are met
                if (obj.requires && !this.completedObjectives.includes(obj.requires)) {
                    continue;
                }
                return obj;
            }
        }
        return null;
    }

    checkQuestCompletion() {
        const flags = this.scene.registry.get('flags') || {};
        if (flags.game_complete) {
            // Show victory screen after a delay
            this.scene.time.delayedCall(1500, () => {
                this.showVictory();
            });
        }
    }

    showVictory() {
        const uiScene = this.scene.scene.get('UI');
        if (uiScene) {
            uiScene.showNotification(t('ui.congratulations'));
        }

        this.scene.time.delayedCall(3000, () => {
            this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
            this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.scene.stop('UI');
                this.scene.scene.start('Title');
            });
        });
    }
}
