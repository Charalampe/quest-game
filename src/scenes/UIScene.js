import { t, getItemText, getQuestText } from '../data/i18n/index.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super('UI');
    }

    init(data) {
        this.dialogManager = data.dialogManager;
        this.questManager = data.questManager;
        this.inventoryManager = data.inventoryManager;
        this.cityName = data.cityName;
        this.cityDescription = data.cityDescription;
        this.inventoryVisible = false;
        this.questLogVisible = false;
        this.npcLabelPool = [];
    }

    create() {
        const { width, height } = this.cameras.main;

        // === HUD BAR (top) ===
        this.hudBar = this.add.rectangle(width / 2, 18, width, 36, 0x1a1a2e, 0.8);
        this.hudCityText = this.add.text(12, 6, this.cityName || '', {
            fontSize: '21px', fontFamily: 'monospace', color: '#ccaaff'
        });
        this.hudHints = this.add.text(width - 12, 6, t('ui.hudHints'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688'
        }).setOrigin(1, 0);

        // === DIALOG BOX ===
        this.dialogContainer = this.add.container(0, 0).setVisible(false).setDepth(50);

        this.dialogBg = this.add.rectangle(width / 2, height - 96, width - 48, 168, 0x1a1a2e, 0.95);
        this.dialogBg.setStrokeStyle(2, 0x8866cc);
        this.dialogContainer.add(this.dialogBg);

        const innerBorder = this.add.rectangle(width / 2, height - 96, width - 60, 156, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.dialogContainer.add(innerBorder);

        this.dialogSpeaker = this.add.text(48, height - 174, '', {
            fontSize: '24px', fontFamily: 'monospace', color: '#f1c40f',
            backgroundColor: '#1a1a2e', padding: { x: 12, y: 6 }
        });
        this.dialogContainer.add(this.dialogSpeaker);

        this.dialogText = this.add.text(48, height - 144, '', {
            fontSize: '21px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: width - 108 }, lineSpacing: 6
        });
        this.dialogContainer.add(this.dialogText);

        this.dialogAdvance = this.add.text(width - 60, height - 30, '\u25BC', {
            fontSize: '24px', fontFamily: 'monospace', color: '#ccaaff'
        });
        this.tweens.add({
            targets: this.dialogAdvance,
            alpha: 0.3, duration: 400, yoyo: true, repeat: -1
        });
        this.dialogContainer.add(this.dialogAdvance);

        this.dialogProgress = this.add.text(width - 180, height - 30, '', {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688'
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
        this.notifText = this.add.text(width / 2, 60, '', {
            fontSize: '24px', fontFamily: 'monospace', color: '#f1c40f',
            backgroundColor: '#1a1a2eee', padding: { x: 18, y: 9 }
        }).setOrigin(0.5).setDepth(60).setVisible(false);

        // Show city name on entry
        if (this.cityName) {
            this.showCityName(this.cityName, this.cityDescription);
        }
    }

    // === CITY NAME DISPLAY ===

    showCityName(name, description) {
        const { width } = this.cameras.main;

        const text = this.add.text(width / 2, 60, name, {
            fontSize: '42px',
            fontFamily: 'monospace',
            color: '#ffffff',
            backgroundColor: '#1a1a2ecc',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setDepth(100);

        const subText = this.add.text(width / 2, 114, description, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ccaaff',
            backgroundColor: '#1a1a2ecc',
            padding: { x: 18, y: 6 }
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: [text, subText],
            alpha: 0,
            delay: 2500,
            duration: 500,
            onComplete: () => { text.destroy(); subText.destroy(); }
        });
    }

    // === NPC LABEL METHODS ===

    updateNPCLabels(labels) {
        if (!this.npcLabelPool) return;

        // Hide all existing labels
        for (const label of this.npcLabelPool) {
            label.setVisible(false);
        }

        // Show/create labels for visible NPCs
        for (let i = 0; i < labels.length; i++) {
            const { name, screenX, screenY } = labels[i];
            if (i >= this.npcLabelPool.length) {
                const label = this.add.text(0, 0, '', {
                    fontSize: '18px', fontFamily: 'monospace', color: '#ffffff',
                    backgroundColor: '#1a1a2ecc', padding: { x: 6, y: 3 }
                }).setOrigin(0.5).setDepth(10);
                this.npcLabelPool.push(label);
            }
            const label = this.npcLabelPool[i];
            label.setText(name);
            label.setPosition(screenX, screenY);
            label.setVisible(true);
        }
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
        const bgH = 60 + choices.length * 48;
        const bg = this.add.rectangle(width / 2, height / 2, 600, bgH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0x8866cc);
        this.choiceContainer.add(bg);

        // Prompt
        const promptText = this.add.text(width / 2, height / 2 - bgH / 2 + 24, prompt, {
            fontSize: '21px', fontFamily: 'monospace', color: '#ccaaff',
            wordWrap: { width: 540 }
        }).setOrigin(0.5, 0);
        this.choiceContainer.add(promptText);

        // Choice buttons
        const startY = height / 2 - bgH / 2 + 78;
        choices.forEach((choice, i) => {
            const btnBg = this.add.rectangle(width / 2, startY + i * 48, 540, 42, 0x2d1b69)
                .setInteractive({ useHandCursor: true });
            const btnText = this.add.text(width / 2, startY + i * 48, choice.text, {
                fontSize: '21px', fontFamily: 'monospace', color: '#ccaaff'
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
        const panelW = 450;
        const panelH = 540;
        const px = width / 2;
        const py = height / 2;

        const bg = this.add.rectangle(px, py, panelW, panelH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0x8866cc);
        this.inventoryContainer.add(bg);

        const innerBorder = this.add.rectangle(px, py, panelW - 12, panelH - 12, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.inventoryContainer.add(innerBorder);

        const title = this.add.text(px, py - panelH / 2 + 24, t('ui.inventory'), {
            fontSize: '24px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);
        this.inventoryContainer.add(title);

        // Separator line
        const sep = this.add.rectangle(px, py - panelH / 2 + 54, panelW - 48, 1, 0x4a3388);
        this.inventoryContainer.add(sep);

        // Item list area
        this.inventoryItemsText = this.add.text(px - panelW / 2 + 36, py - panelH / 2 + 72, '', {
            fontSize: '21px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: panelW - 72 }, lineSpacing: 12
        });
        this.inventoryContainer.add(this.inventoryItemsText);

        const closeHint = this.add.text(px, py + panelH / 2 - 24, t('ui.inventoryClose'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688'
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
            this.inventoryItemsText.setText(t('ui.inventoryEmpty'));
        } else {
            const text = items.map(item => {
                const itemText = getItemText(item.id);
                const name = itemText ? itemText.name : item.name;
                const desc = itemText ? itemText.description : (item.description || '');
                return `\u2022 ${name}\n  ${desc}`;
            }).join('\n\n');
            this.inventoryItemsText.setText(text);
        }
    }

    // === QUEST LOG ===

    buildQuestLogPanel() {
        const { width, height } = this.cameras.main;
        const panelW = 600;
        const panelH = 570;
        const px = width / 2;
        const py = height / 2;

        const bg = this.add.rectangle(px, py, panelW, panelH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0x8866cc);
        this.questLogContainer.add(bg);

        const innerBorder = this.add.rectangle(px, py, panelW - 12, panelH - 12, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.questLogContainer.add(innerBorder);

        const title = this.add.text(px, py - panelH / 2 + 24, t('ui.questLog'), {
            fontSize: '24px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);
        this.questLogContainer.add(title);

        const sep = this.add.rectangle(px, py - panelH / 2 + 54, panelW - 48, 1, 0x4a3388);
        this.questLogContainer.add(sep);

        this.questLogText = this.add.text(px - panelW / 2 + 36, py - panelH / 2 + 72, '', {
            fontSize: '21px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: panelW - 72 }, lineSpacing: 9
        });
        this.questLogContainer.add(this.questLogText);

        const closeHint = this.add.text(px, py + panelH / 2 - 24, t('ui.questLogClose'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688'
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
            this.questLogText.setText(t('ui.questLogEmpty'));
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
