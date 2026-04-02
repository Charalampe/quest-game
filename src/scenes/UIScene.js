import { t, getItemText, getQuestText } from '../data/i18n/index.js';
import { LEA_JOURNAL_ENTRIES } from '../data/leaJournal.js';
import { JOURNAL_PAGES } from '../data/journalPages.js';

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
        this.journalVisible = false;
        this.journalScrollOffset = 0;
        this.npcLabelPool = [];
    }

    create() {
        const { width, height } = this.cameras.main;

        // === TOUCH DETECTION ===
        // pointer:coarse = primary input is a finger (phone/tablet), not a mouse
        // Falls back to Phaser touch detection + small screen heuristic
        const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
        const smallScreen = window.innerWidth <= 1024 && window.innerHeight <= 1024;
        this.isTouchDevice = coarsePointer || (this.sys.game.device.input.touch && smallScreen);
        this.touchDpad = { up: false, down: false, left: false, right: false };

        // === HUD BAR (top) ===
        this.hudBar = this.add.rectangle(width / 2, 18, width, 36, 0x1a1a2e, 0.8);
        this.hudCityText = this.add.text(12, 6, this.cityName || '', {
            fontSize: '21px', fontFamily: 'monospace', color: '#ccaaff'
        });
        this.hudHints = this.add.text(width - 12, 6, t('ui.hudHints'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688'
        }).setOrigin(1, 0);

        // Hide keyboard hints on touch devices
        if (this.isTouchDevice) {
            this.hudHints.setVisible(false);
        }

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

        // === LEA'S JOURNAL PANEL ===
        this.journalContainer = this.add.container(0, 0).setVisible(false).setDepth(40);
        this.buildJournalPanel();

        // === NOTIFICATION ===
        this.notifText = this.add.text(width / 2, 60, '', {
            fontSize: '24px', fontFamily: 'monospace', color: '#f1c40f',
            backgroundColor: '#1a1a2eee', padding: { x: 18, y: 9 }
        }).setOrigin(0.5).setDepth(60).setVisible(false);

        // === DIALOG TAP-TO-ADVANCE ===
        this.dialogBg.setInteractive();
        this.dialogBg.on('pointerdown', () => {
            const explore = this.scene.get('Explore');
            if (explore && explore.dialogActive) {
                explore.handleInteract();
            }
        });

        // === PANEL CLOSE BUTTONS ===
        this.addPanelCloseButton(this.inventoryContainer, 450, 540, 'inventory');
        this.addPanelCloseButton(this.questLogContainer, 600, 570, 'questLog');
        this.addPanelCloseButton(this.journalContainer, 660, 600, 'journal');

        // === TOUCH CONTROLS ===
        if (this.isTouchDevice) {
            this.createTouchControls();
        }

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
        this.updateTouchControlVisibility(false);
    }

    updateDialogText(text) {
        this.dialogText.setText(text);
    }

    hideDialog() {
        this.dialogContainer.setVisible(false);
        this.choiceContainer.setVisible(false);
        this.updateTouchControlVisibility(true);
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
            this.journalContainer.setVisible(false);
            this.journalVisible = false;
            this.refreshInventory();
        }
        this.inventoryContainer.setVisible(this.inventoryVisible);
        this.updateTouchControlVisibility(!this.inventoryVisible);
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
            this.journalContainer.setVisible(false);
            this.journalVisible = false;
            this.refreshQuestLog();
        }
        this.questLogContainer.setVisible(this.questLogVisible);
        this.updateTouchControlVisibility(!this.questLogVisible);
    }

    refreshQuestLog() {
        if (!this.questManager) return;
        const quests = this.questManager.getActiveQuests();

        // Add journal pages counter
        const foundPages = this.scene.get('Explore')?.registry?.get('foundJournalPages') || [];
        const pagesText = t('ui.journalPagesCount', { found: foundPages.length, total: 15 });

        if (quests.length === 0) {
            this.questLogText.setText(t('ui.questLogEmpty') + '\n\n' + pagesText);
        } else {
            const text = quests.map(q => {
                const objectives = q.objectives.map(o => {
                    const check = o.completed ? '\u2713' : '\u25CB';
                    return `  ${check} ${o.text}`;
                }).join('\n');
                return `\u2606 ${q.name}\n${objectives}`;
            }).join('\n\n');
            this.questLogText.setText(text + '\n\n' + pagesText);
        }
    }

    // === LEA'S JOURNAL ===

    buildJournalPanel() {
        const { width, height } = this.cameras.main;
        const panelW = 660;
        const panelH = 600;
        const px = width / 2;
        const py = height / 2;

        const bg = this.add.rectangle(px, py, panelW, panelH, 0x1a1a2e, 0.95);
        bg.setStrokeStyle(2, 0xccaaff);
        this.journalContainer.add(bg);

        const innerBorder = this.add.rectangle(px, py, panelW - 12, panelH - 12, 0x000000, 0);
        innerBorder.setStrokeStyle(1, 0x4a3388);
        this.journalContainer.add(innerBorder);

        // Title with a different colour for the journal feel
        const title = this.add.text(px, py - panelH / 2 + 24, t('ui.journal'), {
            fontSize: '24px', fontFamily: 'monospace', color: '#f1c40f'
        }).setOrigin(0.5);
        this.journalContainer.add(title);

        const sep = this.add.rectangle(px, py - panelH / 2 + 54, panelW - 48, 1, 0x4a3388);
        this.journalContainer.add(sep);

        this.journalText = this.add.text(px - panelW / 2 + 36, py - panelH / 2 + 72, '', {
            fontSize: '18px', fontFamily: 'monospace', color: '#ffffff',
            wordWrap: { width: panelW - 72 }, lineSpacing: 8
        });
        this.journalContainer.add(this.journalText);

        const closeHint = this.add.text(px, py + panelH / 2 - 24, t('ui.journalClose'), {
            fontSize: '18px', fontFamily: 'monospace', color: '#666688'
        }).setOrigin(0.5);
        this.journalContainer.add(closeHint);
    }

    toggleJournal() {
        this.journalVisible = !this.journalVisible;
        if (this.journalVisible) {
            this.inventoryContainer.setVisible(false);
            this.inventoryVisible = false;
            this.questLogContainer.setVisible(false);
            this.questLogVisible = false;
            this.refreshJournal();
        }
        this.journalContainer.setVisible(this.journalVisible);
        this.updateTouchControlVisibility(!this.journalVisible);
    }

    refreshJournal() {
        const exploreScene = this.scene.get('Explore');
        const flags = exploreScene?.registry?.get('flags') || {};

        // Filter journal entries by which flags are set
        const activeEntries = LEA_JOURNAL_ENTRIES.filter(entry => flags[entry.trigger]);

        if (activeEntries.length === 0) {
            this.journalText.setText(t('ui.journalEmpty'));
        } else {
            // Show most recent entries first (reverse order)
            const text = [...activeEntries].reverse().map(entry => {
                const cityIcon = {
                    paris: '\u2764', london: '\u2618', rome: '\u2600',
                    marrakech: '\u2605', tokyo: '\u273F'
                }[entry.city] || '\u2022';
                return `${cityIcon} ${entry.title}\n"${entry.text}"`;
            }).join('\n\n');
            this.journalText.setText(text);
        }
    }

    closeAllMenus() {
        this.inventoryContainer.setVisible(false);
        this.questLogContainer.setVisible(false);
        this.journalContainer.setVisible(false);
        this.inventoryVisible = false;
        this.questLogVisible = false;
        this.journalVisible = false;
        this.updateTouchControlVisibility(true);
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

    // === PANEL CLOSE BUTTON ===

    addPanelCloseButton(container, panelW, panelH, panelType) {
        const { width, height } = this.cameras.main;
        const px = width / 2;
        const py = height / 2;
        const btnX = px + panelW / 2 - 24;
        const btnY = py - panelH / 2 + 24;

        const closeBtn = this.add.text(btnX, btnY, 'X', {
            fontSize: '24px', fontFamily: 'monospace', color: '#ff6666',
            backgroundColor: '#1a1a2e', padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            this.closeAllMenus();
            const explore = this.scene.get('Explore');
            if (explore) explore.menuOpen = false;
        });
        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#ff6666'));

        container.add(closeBtn);
    }

    // === TOUCH CONTROLS ===

    createTouchControls() {
        const { width, height } = this.cameras.main;
        this.touchControls = [];

        // --- D-PAD (bottom-left) ---
        const padCX = 120;
        const padCY = height - 120;
        const btnSize = 56;
        const gap = 4;

        // D-pad background circle
        const padBg = this.add.circle(padCX, padCY, 86, 0x000000, 0.15).setDepth(90);
        this.touchControls.push(padBg);

        const dirs = [
            { dir: 'up',    x: padCX,              y: padCY - btnSize - gap, label: '\u25B2' },
            { dir: 'down',  x: padCX,              y: padCY + btnSize + gap, label: '\u25BC' },
            { dir: 'left',  x: padCX - btnSize - gap, y: padCY,              label: '\u25C0' },
            { dir: 'right', x: padCX + btnSize + gap, y: padCY,              label: '\u25B6' }
        ];

        for (const d of dirs) {
            const btn = this.add.rectangle(d.x, d.y, btnSize, btnSize, 0x8866cc, 0.3)
                .setDepth(91).setInteractive();
            btn.setStrokeStyle(1, 0xccaaff, 0.4);
            const lbl = this.add.text(d.x, d.y, d.label, {
                fontSize: '24px', fontFamily: 'monospace', color: '#ccaaff'
            }).setOrigin(0.5).setDepth(92).setAlpha(0.5);

            btn.on('pointerdown', () => { this.touchDpad[d.dir] = true; btn.setFillStyle(0x8866cc, 0.6); });
            btn.on('pointerup', () => { this.touchDpad[d.dir] = false; btn.setFillStyle(0x8866cc, 0.3); });
            btn.on('pointerout', () => { this.touchDpad[d.dir] = false; btn.setFillStyle(0x8866cc, 0.3); });

            this.touchControls.push(btn, lbl);
        }

        // --- ACTION BUTTON (bottom-right) ---
        const actX = width - 100;
        const actY = height - 120;
        const actBtn = this.add.circle(actX, actY, 40, 0x8866cc, 0.3)
            .setDepth(91).setInteractive();
        actBtn.setStrokeStyle(2, 0xccaaff, 0.4);
        const actLbl = this.add.text(actX, actY, 'A', {
            fontSize: '30px', fontFamily: 'monospace', color: '#ccaaff', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(92).setAlpha(0.5);

        actBtn.on('pointerdown', () => {
            actBtn.setFillStyle(0x8866cc, 0.6);
            const explore = this.scene.get('Explore');
            if (explore) explore.handleInteract();
        });
        actBtn.on('pointerup', () => actBtn.setFillStyle(0x8866cc, 0.3));
        actBtn.on('pointerout', () => actBtn.setFillStyle(0x8866cc, 0.3));

        this.touchControls.push(actBtn, actLbl);

        // --- MENU BUTTONS (top-right strip) ---
        const menuDefs = [
            { label: 'INV', action: () => this.scene.get('Explore')?.toggleInventory() },
            { label: 'QST', action: () => this.scene.get('Explore')?.toggleQuestLog() },
            { label: 'JRN', action: () => this.scene.get('Explore')?.toggleJournal() },
            { label: 'MAP', action: () => this.scene.get('Explore')?.openWorldMap() },
            { label: 'X',   action: () => this.scene.get('Explore')?.handleEscape() }
        ];

        const menuY = 54;
        const menuBtnW = 60;
        const menuGap = 6;
        const totalMenuW = menuDefs.length * menuBtnW + (menuDefs.length - 1) * menuGap;
        const menuStartX = width - totalMenuW - 12;

        for (let i = 0; i < menuDefs.length; i++) {
            const mx = menuStartX + i * (menuBtnW + menuGap) + menuBtnW / 2;
            const def = menuDefs[i];

            const bg = this.add.rectangle(mx, menuY, menuBtnW, 32, 0x2d1b69, 0.8)
                .setDepth(91).setInteractive({ useHandCursor: true });
            bg.setStrokeStyle(1, 0x8866cc, 0.6);
            const txt = this.add.text(mx, menuY, def.label, {
                fontSize: '16px', fontFamily: 'monospace', color: '#ccaaff'
            }).setOrigin(0.5).setDepth(92);

            bg.on('pointerdown', () => {
                bg.setFillStyle(0x4a2d8e, 0.8);
                def.action();
            });
            bg.on('pointerup', () => bg.setFillStyle(0x2d1b69, 0.8));
            bg.on('pointerout', () => bg.setFillStyle(0x2d1b69, 0.8));

            this.touchControls.push(bg, txt);
        }
    }

    updateTouchControlVisibility(visible) {
        if (!this.touchControls) return;
        for (const obj of this.touchControls) {
            obj.setVisible(visible);
        }
    }

}
