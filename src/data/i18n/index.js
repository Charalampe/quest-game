import en from './en.js';
import fr from './fr.js';

const STORAGE_KEY = 'questgame_language';
const DEFAULT_LANG = 'fr';
const translations = { en, fr };

let currentLang = null;
let currentStrings = null;

export function initLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    currentLang = (stored === 'en' || stored === 'fr') ? stored : DEFAULT_LANG;
    currentStrings = translations[currentLang];
}

export function getLanguage() {
    if (!currentLang) initLanguage();
    return currentLang;
}

export function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'fr') return currentLang;
    currentLang = lang;
    currentStrings = translations[lang];
    localStorage.setItem(STORAGE_KEY, lang);
    return lang;
}

export function toggleLanguage() {
    return setLanguage(currentLang === 'en' ? 'fr' : 'en');
}

export function t(keyPath, replacements = {}) {
    if (!currentStrings) initLanguage();

    const keys = keyPath.split('.');
    let value = currentStrings;
    for (const k of keys) {
        if (value == null || typeof value !== 'object') return keyPath;
        value = value[k];
    }
    if (value == null) return keyPath;

    if (typeof value === 'string') {
        return value.replace(/\{(\w+)\}/g, (_, name) => replacements[name] ?? `{${name}}`);
    }
    return value;
}

export function getDialogueLines(dialogId) {
    if (!currentStrings) initLanguage();
    return currentStrings.dialogues?.[dialogId] ?? null;
}

export function getItemText(itemId) {
    if (!currentStrings) initLanguage();
    return currentStrings.items?.[itemId] ?? null;
}

export function getQuestText(questId) {
    if (!currentStrings) initLanguage();
    return currentStrings.quests?.[questId] ?? null;
}
