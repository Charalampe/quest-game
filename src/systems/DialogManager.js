import { DIALOGUES } from '../data/dialogues.js';
import { DIALOG_CHOICES } from '../data/dialogChoices.js';
import { t, getDialogueLines, getItemText } from '../data/i18n/index.js';

export class DialogManager {
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        this.currentDialog = null;
        this.currentLine = 0;
        this.callback = null;
        this.typewriterTimer = null;
        this.displayedText = '';
        this.fullText = '';
        this.isTyping = false;
        this.choiceMode = false;
        this.choices = [];
        this.advanceCooldown = 0;
        this.selectedChoice = 0;
        this.choiceCallback = null;
    }

    startDialog(dialogId, speakerName, callback) {
        // Check if this dialog has a branching choice version
        const choiceDialog = DIALOG_CHOICES[dialogId];
        if (choiceDialog) {
            this._startChoiceDialog(choiceDialog, speakerName, callback);
            return;
        }

        const dialog = DIALOGUES[dialogId];
        if (!dialog) {
            this.showMessage(t('ui.fallbackDialog'), callback);
            return;
        }

        this.active = true;
        const localizedLines = getDialogueLines(dialogId);
        this.currentDialog = {
            ...dialog,
            lines: localizedLines || dialog.lines
        };
        this.currentLine = 0;
        this.callback = callback;
        this.speakerName = speakerName;

        this.showLine();
    }

    _startChoiceDialog(choiceDialog, speakerName, callback) {
        this.active = true;
        this.speakerName = speakerName;

        // Show preamble lines first, then present choices
        const preamble = choiceDialog.preamble || [];
        if (preamble.length > 0) {
            this.currentDialog = { lines: preamble };
            this.currentLine = 0;
            this.callback = () => {
                // After preamble, show choices
                this._presentDialogChoices(choiceDialog, speakerName, callback);
            };
            this.showLine();
        } else {
            this._presentDialogChoices(choiceDialog, speakerName, callback);
        }
    }

    _presentDialogChoices(choiceDialog, speakerName, originalCallback) {
        const choices = choiceDialog.choices.map((c, i) => ({
            text: c.text,
            value: i
        }));

        this.showChoice(
            '',
            choices,
            (choiceIndex) => {
                const chosen = choiceDialog.choices[choiceIndex];

                // Apply choice-specific flag
                if (chosen.setsFlag) {
                    const flags = this.scene.registry.get('flags') || {};
                    flags[chosen.setsFlag] = true;
                    this.scene.registry.set('flags', flags);
                }

                // Show the response lines, then apply shared rewards
                const responseLines = chosen.response || [];
                if (responseLines.length > 0) {
                    // Create a synthetic dialog with shared + choice-level rewards
                    this.active = true;
                    this.currentDialog = {
                        lines: responseLines,
                        givesItem: choiceDialog.givesItem || chosen.givesItem,
                        removesItem: choiceDialog.removesItem || chosen.removesItem,
                        setsFlag: choiceDialog.setsFlag || chosen.completionFlag,
                        completesObjective: choiceDialog.completesObjective || chosen.completesObjective,
                        unlocksCity: choiceDialog.unlocksCity || chosen.unlocksCity,
                        unlocksPortal: choiceDialog.unlocksPortal || chosen.unlocksPortal
                    };
                    this.currentLine = 0;
                    this.callback = originalCallback;
                    this.speakerName = speakerName;
                    this.showLine();
                } else {
                    // No response lines — apply rewards directly
                    this.currentDialog = {
                        givesItem: choiceDialog.givesItem || chosen.givesItem,
                        removesItem: choiceDialog.removesItem || chosen.removesItem,
                        setsFlag: choiceDialog.setsFlag || chosen.completionFlag,
                        completesObjective: choiceDialog.completesObjective || chosen.completesObjective,
                        unlocksCity: choiceDialog.unlocksCity || chosen.unlocksCity,
                        unlocksPortal: choiceDialog.unlocksPortal || chosen.unlocksPortal
                    };
                    this.callback = originalCallback;
                    this.endDialog();
                }
            }
        );
    }

    showLine() {
        if (!this.currentDialog || this.currentLine >= this.currentDialog.lines.length) {
            this.endDialog();
            return;
        }

        this.fullText = this.currentDialog.lines[this.currentLine];
        this.displayedText = '';
        this.isTyping = true;

        // Notify UI scene
        const uiScene = this.scene.scene.get('UI');
        if (uiScene && uiScene.showDialog) {
            uiScene.showDialog(this.speakerName, this.fullText, this.currentLine, this.currentDialog.lines.length);
        }

        // Start typewriter effect
        this.typewriterIndex = 0;
        if (this.typewriterTimer) {
            this.typewriterTimer.remove();
        }
        this.typewriterTimer = this.scene.time.addEvent({
            delay: 25,
            callback: () => {
                if (this.typewriterIndex < this.fullText.length) {
                    this.displayedText = this.fullText.substring(0, this.typewriterIndex + 1);
                    this.typewriterIndex++;
                    const uiScene = this.scene.scene.get('UI');
                    if (uiScene && uiScene.updateDialogText) {
                        uiScene.updateDialogText(this.displayedText);
                    }
                } else {
                    this.isTyping = false;
                    this.typewriterTimer.remove();
                }
            },
            loop: true
        });
    }

    advance() {
        if (this.choiceMode) return;

        // Prevent rapid-fire advancing that skips lines
        const now = Date.now();
        if (now - this.advanceCooldown < 100) return;
        this.advanceCooldown = now;

        if (this.isTyping) {
            // Skip typewriter, show full text
            this.isTyping = false;
            if (this.typewriterTimer) this.typewriterTimer.remove();
            this.displayedText = this.fullText;
            const uiScene = this.scene.scene.get('UI');
            if (uiScene && uiScene.updateDialogText) {
                uiScene.updateDialogText(this.displayedText);
            }
        } else {
            // Next line
            this.currentLine++;
            this.showLine();
        }
    }

    endDialog() {
        this.active = false;

        // Handle dialog rewards
        if (this.currentDialog) {
            if (this.currentDialog.removesItem) {
                const inv = this.scene.inventoryManager;
                if (inv) inv.removeItem(this.currentDialog.removesItem);
            }
            if (this.currentDialog.givesItem) {
                const inv = this.scene.inventoryManager;
                if (inv) inv.addItem(this.currentDialog.givesItem);
            }
            if (this.currentDialog.setsFlag) {
                const flags = this.scene.registry.get('flags') || {};
                flags[this.currentDialog.setsFlag] = true;
                this.scene.registry.set('flags', flags);
            }
            if (this.currentDialog.unlocksCity) {
                const unlocked = this.scene.registry.get('unlockedCities') || ['paris'];
                if (!unlocked.includes(this.currentDialog.unlocksCity)) {
                    unlocked.push(this.currentDialog.unlocksCity);
                    this.scene.registry.set('unlockedCities', unlocked);

                    // Show unlock notification
                    const uiScene = this.scene.scene.get('UI');
                    if (uiScene && uiScene.showNotification) {
                        const cityName = this.currentDialog.unlocksCity.charAt(0).toUpperCase() + this.currentDialog.unlocksCity.slice(1);
                        uiScene.showNotification(t('ui.newDestination', { city: cityName }));
                    }
                }
            }
            if (this.currentDialog.unlocksPortal) {
                const flags = this.scene.registry.get('flags') || {};
                flags.portal_unlocked = true;
                this.scene.registry.set('flags', flags);
            }
            if (this.currentDialog.completesObjective) {
                const qm = this.scene.questManager;
                if (qm) qm.completeObjective(this.currentDialog.completesObjective);
            }
        }

        // Hide dialog UI
        const uiScene = this.scene.scene.get('UI');
        if (uiScene && uiScene.hideDialog) {
            uiScene.hideDialog();
        }

        if (this.callback) {
            this.callback();
        }
    }

    showMessage(text, callback) {
        this.active = true;
        this.currentDialog = { lines: [text] };
        this.currentLine = 0;
        this.callback = callback;
        this.speakerName = '';
        this.showLine();
    }

    showChoice(prompt, choices, callback) {
        this.active = true;
        this.choiceMode = true;
        this.choices = choices;
        this.selectedChoice = 0;
        this.choiceCallback = callback;

        const uiScene = this.scene.scene.get('UI');
        if (uiScene && uiScene.showChoices) {
            uiScene.showChoices(prompt, choices, (choice) => {
                this.choiceMode = false;
                this.active = false;
                uiScene.hideDialog();
                if (this.choiceCallback) {
                    this.choiceCallback(choice);
                }
            });
        }
    }
}
