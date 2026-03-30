export const QUESTS = {
    main_quest: {
        id: 'main_quest',
        name: "The Locket of Worlds",
        description: "Follow the trail of Madeleine Beaumont's hidden treasure across the world.",
        objectives: [
            {
                id: 'paris_find_locket',
                text: 'Find the mysterious locket in Paris',
                city: 'paris',
                hint: "Visit Grand-m\u00E8re Elise in eastern Paris."
            },
            {
                id: 'paris_visit_librarian',
                text: 'Show the locket to the librarian',
                city: 'paris',
                hint: 'Visit Monsieur Dupont at the bookshop near the Seine.',
                requires: 'paris_find_locket'
            },
            {
                id: 'london_find_map',
                text: 'Find the map fragment in London',
                city: 'london',
                hint: 'Show the letter to Dr. Wellington at the British Museum.',
                requires: 'paris_visit_librarian'
            },
            {
                id: 'rome_talk_historian',
                text: 'Investigate the Trevi Fountain in Rome',
                city: 'rome',
                hint: 'Talk to Professoressa Rossi near the fountain.',
                requires: 'london_find_map'
            },
            {
                id: 'rome_open_chest',
                text: 'Use the key to unlock the fountain secret',
                city: 'rome',
                hint: 'Open the chest near the fountain.',
                requires: 'rome_talk_historian'
            },
            {
                id: 'marrakech_find_journal',
                text: "Find Madeleine's journal in Marrakech",
                city: 'marrakech',
                hint: 'Show the locket to Hassan the merchant.',
                requires: 'rome_open_chest'
            },
            {
                id: 'tokyo_talk_gardener',
                text: 'Find the secret garden keeper in Tokyo',
                city: 'tokyo',
                hint: 'Show the journal to Yuki-san in the garden.',
                requires: 'marrakech_find_journal'
            },
            {
                id: 'tokyo_find_treasure',
                text: 'Discover the treasure',
                city: 'tokyo',
                hint: 'Open the chest in the secret garden.',
                requires: 'tokyo_talk_gardener'
            }
        ]
    }
};

// NPC dialog routing based on quest state
export const NPC_DIALOG_ROUTES = {
    paris_grandma: [
        { dialog: 'grandma_intro', condition: (flags) => !flags.quest_started },
        { dialog: 'grandma_after_locket', condition: (flags) => flags.quest_started }
    ],
    paris_librarian: [
        { dialog: 'librarian_with_locket', condition: (flags) => flags.quest_started && !flags.paris_complete },
        { dialog: 'librarian_after_quest', condition: (flags) => flags.paris_complete },
        { dialog: 'librarian_intro', condition: () => true }
    ],
    paris_guide: [
        { dialog: 'sophie_after_quest', condition: (flags) => flags.quest_started },
        { dialog: 'sophie_intro', condition: () => true }
    ],
    london_curator: [
        { dialog: 'curator_with_letter', condition: (flags) => flags.paris_complete && !flags.london_complete },
        { dialog: 'curator_after_quest', condition: (flags) => flags.london_complete },
        { dialog: 'curator_intro', condition: () => true }
    ],
    london_guard: [
        { dialog: 'guard_intro', condition: () => true }
    ],
    london_girl: [
        { dialog: 'emma_intro', condition: () => true }
    ],
    rome_historian: [
        { dialog: 'rossi_with_map', condition: (flags) => flags.london_complete && !flags.rome_have_key },
        { dialog: 'rossi_after_key', condition: (flags) => flags.rome_have_key && !flags.rome_complete },
        { dialog: 'rossi_after_quest', condition: (flags) => flags.rome_complete },
        { dialog: 'rossi_intro', condition: () => true }
    ],
    rome_artist: [
        { dialog: 'marco_intro', condition: () => true }
    ],
    rome_girl: [
        { dialog: 'giulia_intro', condition: () => true }
    ],
    marrakech_merchant: [
        { dialog: 'hassan_with_locket', condition: (flags) => flags.rome_complete && !flags.marrakech_complete },
        { dialog: 'hassan_after_quest', condition: (flags) => flags.marrakech_complete },
        { dialog: 'hassan_intro', condition: () => true }
    ],
    marrakech_storyteller: [
        { dialog: 'fatima_intro', condition: () => true }
    ],
    marrakech_girl: [
        { dialog: 'amina_intro', condition: () => true }
    ],
    tokyo_gardener: [
        { dialog: 'yuki_with_journal', condition: (flags) => flags.marrakech_complete && !flags.tokyo_chest_unlocked },
        { dialog: 'yuki_after_quest', condition: (flags) => flags.tokyo_chest_unlocked },
        { dialog: 'yuki_intro', condition: () => true }
    ],
    tokyo_monk: [
        { dialog: 'takeshi_intro', condition: () => true }
    ],
    tokyo_girl: [
        { dialog: 'sakura_intro', condition: () => true }
    ]
};

// Chest rewards
export const CHEST_REWARDS = {
    'paris_chest_7_5': {
        requiresFlag: 'quest_started',
        item: { id: 'coin', name: 'Old Coin', icon: 'item_coin', description: 'An old French coin with a compass rose engraved on it.' }
    },
    'rome_chest_30_22': {
        requiresFlag: 'rome_have_key',
        item: { id: 'book', name: 'Hidden Book', icon: 'item_book', description: "A book hidden behind the fountain with notes about Marrakech." },
        setsFlag: 'rome_complete',
        completesObjective: 'rome_open_chest',
        unlocksCity: 'marrakech'
    },
    'tokyo_chest_25_3': {
        requiresFlag: 'tokyo_chest_unlocked',
        item: { id: 'gem', name: 'Gem of Understanding', icon: 'item_gem', description: 'A magical gem that lets you understand any language. The greatest treasure!' },
        setsFlag: 'game_complete',
        completesObjective: 'tokyo_find_treasure'
    }
};
