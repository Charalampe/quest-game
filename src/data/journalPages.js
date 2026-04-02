// Madeleine's Journal Pages — 3 hidden per city (15 total)
// Each page is placed at a specific tile position in a specific room.
// Pages appear as shimmering ground tiles (decor tile 24 repurposed as 'journal_page' interactable).
// Finding all 3 in a city unlocks a bonus dialog with the city's main NPC.

export const JOURNAL_PAGES = {
    paris: [
        {
            id: 'paris_page_1',
            city: 'paris',
            room: 'main',
            x: 8, y: 6,
            title: "Madeleine's Diary - Paris, 1923",
            text: "Today I climbed the Eiffel Tower for the first time. The whole city spread out below me like a painting. I hid my first clue at the very top. Someday, someone worthy will find it."
        },
        {
            id: 'paris_page_2',
            city: 'paris',
            room: 'main',
            x: 15, y: 32,
            title: "Madeleine's Diary - Paris, 1923",
            text: "Monsieur Dupont's grandfather sold me my first map today. He said: 'The world is a book, and those who do not travel read only one page.' I intend to read every page."
        },
        {
            id: 'paris_page_3',
            city: 'paris',
            room: 'eiffel_first',
            x: 3, y: 10,
            title: "Madeleine's Diary - Paris, 1924",
            text: "I return to the tower often. From here I can see the Seine winding through the city like a silver ribbon. London awaits — the curator at the British Museum has written to me."
        }
    ],
    london: [
        {
            id: 'london_page_1',
            city: 'london',
            room: 'main',
            x: 6, y: 8,
            title: "Madeleine's Diary - London, 1924",
            text: "London fog is thick as soup! But the museum... oh, the museum! Artifacts from every corner of the world. I donated my collection anonymously. Best they don't know a woman brought it."
        },
        {
            id: 'london_page_2',
            city: 'london',
            room: 'museum_hall',
            x: 18, y: 3,
            title: "Madeleine's Diary - London, 1924",
            text: "The professor here is brilliant but absent-minded. He loses his spectacles daily! I left a map fragment in the basement archive. Hidden in plain sight, as always."
        },
        {
            id: 'london_page_3',
            city: 'london',
            room: 'museum_basement',
            x: 3, y: 3,
            title: "Madeleine's Diary - London, 1925",
            text: "I sail for Rome tomorrow. The ancient passages beneath the Colosseum hold secrets older than any museum. I feel I'm getting closer to understanding something important."
        }
    ],
    rome: [
        {
            id: 'rome_page_1',
            city: 'rome',
            room: 'main',
            x: 42, y: 12,
            title: "Madeleine's Diary - Rome, 1925",
            text: "The cats of Rome are my favourite guides. They know every hidden corner, every secret passage. One orange tabby led me straight to the Colosseum's forgotten entrance."
        },
        {
            id: 'rome_page_2',
            city: 'rome',
            room: 'colosseum',
            x: 17, y: 4,
            title: "Madeleine's Diary - Rome, 1925",
            text: "I discovered the catacombs today! Beneath the arena floor, tunnels stretch in every direction. I hid my book in the deepest chamber. Only the persistent will find it."
        },
        {
            id: 'rome_page_3',
            city: 'rome',
            room: 'catacombs_upper',
            x: 3, y: 4,
            title: "Madeleine's Diary - Rome, 1926",
            text: "A musician named Giovanni played violin for me at sunset. The music echoed through the ancient stones. I leave for North Africa — Morocco calls to me."
        }
    ],
    marrakech: [
        {
            id: 'marrakech_page_1',
            city: 'marrakech',
            room: 'main',
            x: 7, y: 15,
            title: "Madeleine's Diary - Marrakech, 1926",
            text: "The colours of Marrakech! Saffron, indigo, crimson — every market stall is a treasure chest. I entrusted my journal to a merchant family. They promised to keep it safe."
        },
        {
            id: 'marrakech_page_2',
            city: 'marrakech',
            room: 'souk',
            x: 18, y: 4,
            title: "Madeleine's Diary - Marrakech, 1926",
            text: "The storytellers in the square speak of a magical oasis in the desert. I found it — and something more. A portal stone, shimmering with impossible light. How is this possible?"
        },
        {
            id: 'marrakech_page_3',
            city: 'marrakech',
            room: 'oasis',
            x: 5, y: 5,
            title: "Madeleine's Diary - Marrakech, 1927",
            text: "The portal stone transported me to Japan in an instant! I clutched the stone, closed my eyes, and when I opened them — cherry blossoms. I wept with wonder."
        }
    ],
    tokyo: [
        {
            id: 'tokyo_page_1',
            city: 'tokyo',
            room: 'main',
            x: 12, y: 8,
            title: "Madeleine's Diary - Tokyo, 1927",
            text: "The shrine keeper taught me three proverbs: Patience, Courage, Wisdom. He said they are the keys to understanding not just the shrine, but life itself."
        },
        {
            id: 'tokyo_page_2',
            city: 'tokyo',
            room: 'shrine',
            x: 3, y: 8,
            title: "Madeleine's Diary - Tokyo, 1927",
            text: "I planted cherry trees in the sacred garden today. Yuki-san helped me. We worked in silence, but I felt we understood each other perfectly. That is the real treasure."
        },
        {
            id: 'tokyo_page_3',
            city: 'tokyo',
            room: 'bamboo_forest',
            x: 2, y: 12,
            title: "Madeleine's Diary - Tokyo, 1928",
            text: "My journey ends here, but it is not truly an ending. I leave the Gem of Understanding for whoever follows my path. The greatest treasure is not what you find — it's what you learn along the way."
        }
    ]
};

// Bonus dialogs unlocked by finding all 3 pages in a city
export const JOURNAL_BONUS_DIALOGS = {
    paris: {
        npcId: 'paris_grandma',
        dialogId: 'grandma_journal_bonus'
    },
    london: {
        npcId: 'london_curator',
        dialogId: 'curator_journal_bonus'
    },
    rome: {
        npcId: 'rome_historian',
        dialogId: 'rossi_journal_bonus'
    },
    marrakech: {
        npcId: 'marrakech_merchant',
        dialogId: 'hassan_journal_bonus'
    },
    tokyo: {
        npcId: 'tokyo_gardener',
        dialogId: 'yuki_journal_bonus'
    }
};
