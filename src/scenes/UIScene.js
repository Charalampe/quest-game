export class UIScene extends Phaser.Scene {
    constructor() {
        super('UI');
    }

    init(data) {
        this.dialogManager = data.dialogManager;
        this.questManager = data.questManager;
        this.inventoryManager = data.inventoryManager;
        this.cityName = data.cityName;
        this.inventoryVisible = false;
        this.questLogVisible = false;
    }

    create() {
        const { width, height } = this.cameras.main;

        // === HUD BAR (top) ===
        this.hudBar = this.add.rectangle(width / 2, 6, width, 12, 0x1a1a2e, 0.8);
        this.hudCityText = this.add.text(4, 2, this.cityName || '', {
            fontSize: '7px', fontFamily: 'monospace', color: '#ccaaff'
        });
        this.hudHints = this.add.text(width - 4, 2, 'I:Items Q:Quests M:Map', {
            fontSize: '6px', fontFamily: 'monospace', color: '#666688'
        }).setOrigin(1, 0);

        // === DIALOG BOX ===
        this.dialogContainer = this.add.container(0, 0).setVisible(false).setDepth(50);

        this.dialogBg = this.add.rectangle(width / 2, height - 32, width - 16, 56, 0x1a1a2e, 0.95);
        this.dialogBg.setStrokeStyle(2, 0x8866cc);
        this.dialogContainer.add(this.dialogBg);

        const innerBorder = this.add.rectangle(width / 2, height - 32, width - 20, 52, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.dialogContainer.add(innerBorder);

        this.dialogSpeaker = this.add.text(16, height - 58, '', {
            fontSize: '8px', fontFamily: 'monospace', color: '#f1c40f',
            backgroundColor: '#1a1a2e', padding: { x: 4, y: 2 }
        });
        this.dialogContainer.add(this.dialogSpeaker);

        this.dialogText = this.add.text(16, height - 48, '', {
            fontSize: '7px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: width - 36 }, lineSpacing: 2
        });
        this.dialogContainer.add(this.dialogText);

        this.dialogAdvance = this.add.text(width - 20, height - 10, '\u25BC', {
            fontSize: '8px', fontFamily: 'monospace', color: '#ccaaff'
        });
        this.tweens.add({
            targets: this.dialogAdvance,
            alpha: 0.3, duration: 400, yoyo: true, repeat: -1
        });
        this.dialogContainer.add(this.dialogAdvance);

        this.dialogProgress = this.add.text(width - 60, height - 10, '', {
            fontSize: '6px', fontFamily: 'monospace', color: '#666688'
        });
        this.dialogContainer.add(this.dialogProgress);

        // === CHOICE MENU ===
        this.choiceContainer = this.add.container(0, 0).setVisible(false).setDepth(51);
        this.choiceButtons = [];

        // === INVENTORY PANEL ===
        this.inventoryContainer = this.add.container(0, 0).setVisible(false).setDepth(40);
        this.buildInventoryPanel();

        // === QUEST LOG PANEL ===
        this.questLogContainer = this.add.container(0, 0).setVisible(false).setDepth(40);
        this.buildQuestLogPanel();

        // === NOTIFICATION ===
        this.notifText = this.add.text(width / 2, 20, '', {
            fontSize: '8px', fontFamily: 'monospace', color: '#f1c40f',
            backgroundColor: '#1a1a2eee', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(60).setVisible(false);
    }

    // === DIALOG METHODS ===

    showDialog(speaker, text, lineIndex, totalLines) {
        this.dialogContainer.setVisible(true);
        this.dialogSpeaker.setText(speaker || '');
        this.dialogText.setText('');
        this.dialogProgress.setText(`${lineIndex + 1}/${totalLines}`);
    }

    updateDialogText(text) {
        this.dialogText.setText(text);
    }

    hideDialog() {
        this.dialogContainer.setVisible(false);
        this.choiceContainer.setVisible(false);
    }

    showChoices(prompt, choices, callback) {
        this.choiceContainer.removeAll(true);
        this.choiceButtons = [];

        const { width, height } = this.cameras.main;

        // Background
        const bgH = 20 + choices.length * 16;
        const bg = this.add.rectangle(width / 2, height / 2, 200, bgH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0x8866cc);
        this.choiceContainer.add(bg);

        // Prompt
        const promptText = this.add.text(width / 2, height / 2 - bgH / 2 + 8, prompt, {
            fontSize: '7px', fontFamily: 'monospace', color: '#ccaaff',
            wordWrap: { width: 180 }
        }).setOrigin(0.5, 0);
        this.choiceContainer.add(promptText);

        // Choice buttons
        const startY = height / 2 - bgH / 2 + 26;
        choices.forEach((choice, i) => {
            const btnBg = this.add.rectangle(width / 2, startY + i * 16, 180, 14, 0x2d1b69)
                .setInteractive({ useHandCursor: true });
            const btnText = this.add.text(width / 2, startY + i * 16, choice.text, {
                fontSize: '7px', fontFamily: 'monospace', color: '#ccaaff'
            }).setOrigin(0.5);

            btnBg.on('pointerover', () => {
                btnBg.setFillStyle(0x4a2d8e);
                btnText.setColor('#ffffff');
            });
            btnBg.on('pointerout', () => {
                btnBg.setFillStyle(0x2d1b69);
                btnText.setColor('#ccaaff');
            });
            btnBg.on('pointerdown', () => {
                callback(choice.value);
            });

            this.choiceContainer.add(btnBg);
            this.choiceContainer.add(btnText);
            this.choiceButtons.push({ bg: btnBg, text: btnText });
        });

        this.choiceContainer.setVisible(true);
    }

    // === INVENTORY ===

    buildInventoryPanel() {
        const { width, height } = this.cameras.main;
        const panelW = 150;
        const panelH = 180;
        const px = width / 2;
        const py = height / 2;

        const bg = this.add.rectangle(px, py, panelW, panelH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0x8866cc);
        this.inventoryContainer.add(bg);

        const innerBorder = this.add.rectangle(px, py, panelW - 4, panelH - 4, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.inventoryContainer.add(innerBorder);

        const title = this.add.text(px, py - panelH / 2 + 8, 'INVENTORY', {
            fontSize: '8px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);
        this.inventoryContainer.add(title);

        // Separator line
        const sep = this.add.rectangle(px, py - panelH / 2 + 18, panelW - 16, 1, 0x4a3388);
        this.inventoryContainer.add(sep);

        // Item list area
        this.inventoryItemsText = this.add.text(px - panelW / 2 + 12, py - panelH / 2 + 24, '', {
            fontSize: '7px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: panelW - 24 }, lineSpacing: 4
        });
        this.inventoryContainer.add(this.inventoryItemsText);

        const closeHint = this.add.text(px, py + panelH / 2 - 8, 'Press I to close', {
            fontSize: '6px', fontFamily: 'monospace', color: '#666688'
        }).setOrigin(0.5);
        this.inventoryContainer.add(closeHint);
    }

    toggleInventory() {
        this.inventoryVisible = !this.inventoryVisible;
        if (this.inventoryVisible) {
            this.questLogContainer.setVisible(false);
            this.questLogVisible = false;
            this.refreshInventory();
        }
        this.inventoryContainer.setVisible(this.inventoryVisible);
    }

    refreshInventory() {
        if (!this.inventoryManager) return;
        const items = this.inventoryManager.getItems();
        if (items.length === 0) {
            this.inventoryItemsText.setText('No items yet.\n\nExplore and talk to\npeople to find clues!');
        } else {
            const text = items.map(item => `\u2022 ${item.name}\n  ${item.description || ''}`).join('\n\n');
            this.inventoryItemsText.setText(text);
        }
    }

    // === QUEST LOG ===

    buildQuestLogPanel() {
        const { width, height } = this.cameras.main;
        const panelW = 200;
        const panelH = 190;
        const px = width / 2;
        const py = height / 2;

        const bg = this.add.rectangle(px, py, panelW, panelH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0x8866cc);
        this.questLogContainer.add(bg);

        const innerBorder = this.add.rectangle(px, py, panelW - 4, panelH - 4, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.questLogContainer.add(innerBorder);

        const title = this.add.text(px, py - panelH / 2 + 8, 'QUEST LOG', {
            fontSize: '8px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);
        this.questLogContainer.add(title);

        const sep = this.add.rectangle(px, py - panelH / 2 + 18, panelW - 16, 1, 0x4a3388);
        this.questLogContainer.add(sep);

        this.questLogText = this.add.text(px - panelW / 2 + 12, py - panelH / 2 + 24, '', {
            fontSize: '7px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: panelW - 24 }, lineSpacing: 3
        });
        this.questLogContainer.add(this.questLogText);

        const closeHint = this.add.text(px, py + panelH / 2 - 8, 'Press Q to close', {
            fontSize: '6px', fontFamily: 'monospace', color: '#666688'
        }).setOrigin(0.5);
        this.questLogContainer.add(closeHint);
    }

    toggleQuestLog() {
        this.questLogVisible = !this.questLogVisible;
        if (this.questLogVisible) {
            this.inventoryContainer.setVisible(false);
            this.inventoryVisible = false;
            this.refreshQuestLog();
        }
        this.questLogContainer.setVisible(this.questLogVisible);
    }

    refreshQuestLog() {
        if (!this.questManager) return;
        const quests = this.questManager.getActiveQuests();
        if (quests.length === 0) {
            this.questLogText.setText('No active quests.\n\nTalk to people to\ndiscover adventures!');
        } else {
            const text = quests.map(q => {
                const objectives = q.objectives.map(o => {
                    const check = o.completed ? '\u2713' : '\u25CB';
                    return `  ${check} ${o.text}`;
                }).join('\n');
                return `\u2606 ${q.name}\n${objectives}`;
            }).join('\n\n');
            this.questLogText.setText(text);
        }
    }

    closeAllMenus() {
        this.inventoryContainer.setVisible(false);
        this.questLogContainer.setVisible(false);
        this.inventoryVisible = false;
        this.questLogVisible = false;
    }

    // === NOTIFICATIONS ===

    showNotification(text) {
        this.notifText.setText(text);
        this.notifText.setVisible(true);
        this.notifText.setAlpha(1);

        this.tweens.add({
            targets: this.notifText,
            alpha: 0,
            delay: 2500,
            duration: 500,
            onComplete: () => this.notifText.setVisible(false)
        });
    }
}
