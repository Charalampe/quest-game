export const QUESTS = {
    main_quest: {
        id: 'main_quest',
        name: "The Locket of Worlds",
        description: "Follow the trail of Madeleine Beaumont's hidden treasure across the world.",
        objectives: [
            { id: 'paris_find_locket', text: 'Find the mysterious locket in Paris', city: 'paris', hint: "Visit Grand-mère Elise in eastern Paris." },
            { id: 'paris_find_paintbrush', text: 'Find Pierre\'s lost paintbrush', city: 'paris', hint: 'Talk to Madame Colette in the market square.', requires: 'paris_find_locket' },
            { id: 'paris_return_paintbrush', text: 'Return the paintbrush to Pierre', city: 'paris', hint: 'Pierre is near the Eiffel Tower plaza.', requires: 'paris_find_paintbrush' },
            { id: 'paris_find_letter', text: 'Climb the Eiffel Tower and find the letter', city: 'paris', hint: 'Show the Fast Pass to the attendant, then climb to the top.', requires: 'paris_return_paintbrush' },
            { id: 'paris_visit_librarian', text: 'Show the letter to the librarian', city: 'paris', hint: 'Visit Monsieur Dupont at the bookshop near the Seine.', requires: 'paris_find_letter' },
            { id: 'london_talk_curator', text: 'Visit Dr. Wellington at the British Museum', city: 'london', hint: 'Enter the museum through the main entrance.', requires: 'paris_visit_librarian' },
            { id: 'london_find_glasses', text: 'Find the professor\'s reading glasses', city: 'london', hint: 'Talk to Thomas in the museum gallery.', requires: 'london_talk_curator' },
            { id: 'london_return_glasses', text: 'Return glasses to Professor Higgins', city: 'london', hint: 'Professor Higgins is in the gallery.', requires: 'london_find_glasses' },
            { id: 'london_find_map', text: 'Find the map fragment in the basement', city: 'london', hint: 'Open the chest in the basement archive.', requires: 'london_return_glasses' },
            { id: 'rome_talk_historian', text: 'Talk to Professoressa Rossi in the Colosseum', city: 'rome', hint: 'Enter the Colosseum from the main road.', requires: 'london_find_map' },
            { id: 'rome_open_chest', text: 'Find the hidden book in the catacombs', city: 'rome', hint: 'Use the Ancient Key to enter the catacombs, then descend to the lowest level.', requires: 'rome_talk_historian' },
            { id: 'marrakech_find_journal', text: "Find Madeleine's journal in the Souk", city: 'marrakech', hint: 'Enter the Grand Souk and talk to Hassan.', requires: 'rome_open_chest' },
            { id: 'marrakech_find_amulet', text: "Find Nadia's amulet in the Riad", city: 'marrakech', hint: 'Search the hidden riad courtyard accessible from the souk.', requires: 'marrakech_find_journal' },
            { id: 'marrakech_return_amulet', text: 'Return the amulet to Nadia', city: 'marrakech', hint: 'Nadia is at the desert oasis.', requires: 'marrakech_find_amulet' },
            { id: 'marrakech_get_portal', text: 'Get the Portal Stone', city: 'marrakech', hint: 'Open the chest in the oasis.', requires: 'marrakech_return_amulet' },
            { id: 'tokyo_solve_riddle', text: 'Solve the shrine riddle', city: 'tokyo', hint: 'Learn proverbs from Hiro and Aiko, then read the shrine sign.', requires: 'marrakech_get_portal' },
            { id: 'tokyo_talk_gardener', text: 'Find Yuki-san in the bamboo forest', city: 'tokyo', hint: 'Navigate the bamboo maze. Follow the spirit fox.', requires: 'tokyo_solve_riddle' },
            { id: 'tokyo_find_treasure', text: 'Discover the treasure in the sacred garden', city: 'tokyo', hint: 'Use the Jade Key to enter the sacred garden.', requires: 'tokyo_talk_gardener' }
        ]
    }
};

// NPC dialog routing based on quest state
export const NPC_DIALOG_ROUTES = {
    paris_grandma: [
        { dialog: 'grandma_intro', condition: (flags) => !flags.quest_started },
        { dialog: 'grandma_journal_bonus', condition: (flags) => flags.paris_pages_complete && !flags.paris_bonus_seen },
        { dialog: 'grandma_after_locket', condition: (flags) => flags.quest_started }
    ],
    paris_librarian: [
        { dialog: 'librarian_with_letter', condition: (flags) => flags.paris_has_eiffel_letter && !flags.paris_complete },
        { dialog: 'librarian_after_quest', condition: (flags) => flags.paris_complete },
        { dialog: 'librarian_progress', condition: (flags) => flags.quest_started && flags.paris_has_paintbrush },
        { dialog: 'librarian_with_locket', condition: (flags) => flags.quest_started },
        { dialog: 'librarian_intro', condition: () => true }
    ],
    paris_guide: [
        { dialog: 'sophie_after_quest', condition: (flags) => flags.quest_started },
        { dialog: 'sophie_intro', condition: () => true }
    ],
    paris_artist: [
        { dialog: 'pierre_has_brush_choice', condition: (flags) => flags.paris_has_paintbrush && !flags.paris_has_fastpass },
        { dialog: 'pierre_after_fastpass', condition: (flags) => flags.paris_has_fastpass },
        { dialog: 'pierre_intro', condition: (flags) => flags.quest_started },
        { dialog: 'pierre_intro', condition: () => true }
    ],
    paris_florist: [
        { dialog: 'colette_intro', condition: (flags) => flags.quest_started && !flags.paris_has_paintbrush },
        { dialog: 'colette_after', condition: (flags) => flags.paris_has_paintbrush },
        { dialog: 'colette_after', condition: () => true }
    ],
    paris_tourist: [
        { dialog: 'tourist_claude_intro', condition: () => true }
    ],
    paris_queue1: [ { dialog: 'queue_grumble_1', condition: () => true } ],
    paris_queue2: [ { dialog: 'queue_grumble_2', condition: () => true } ],
    paris_queue3: [ { dialog: 'queue_grumble_3', condition: () => true } ],
    paris_queue4: [ { dialog: 'queue_grumble_4', condition: () => true } ],
    paris_queue5: [ { dialog: 'queue_grumble_5', condition: () => true } ],
    paris_queue6: [ { dialog: 'queue_grumble_6', condition: () => true } ],
    paris_iqueue1: [ { dialog: 'iqueue_grumble_1', condition: () => true } ],
    paris_iqueue2: [ { dialog: 'iqueue_grumble_2', condition: () => true } ],
    paris_iqueue3: [ { dialog: 'iqueue_grumble_3', condition: () => true } ],
    paris_iqueue4: [ { dialog: 'iqueue_grumble_4', condition: () => true } ],
    paris_iqueue5: [ { dialog: 'iqueue_grumble_5', condition: () => true } ],
    paris_attendant: [
        { dialog: 'attendant_with_pass', condition: (flags) => flags.paris_has_fastpass && !flags.paris_tower_access },
        { dialog: 'attendant_intro', condition: () => true }
    ],
    paris_photographer: [
        { dialog: 'marie_intro', condition: () => true }
    ],

    london_curator: [
        { dialog: 'curator_with_letter', condition: (flags) => flags.paris_complete && !flags.london_met_curator },
        { dialog: 'curator_journal_bonus', condition: (flags) => flags.london_pages_complete && !flags.london_bonus_seen },
        { dialog: 'curator_after_quest', condition: (flags) => flags.london_complete },
        { dialog: 'curator_intro', condition: () => true }
    ],
    london_guard: [
        { dialog: 'guard_with_pass', condition: (flags) => flags.london_has_research_pass },
        { dialog: 'guard_intro', condition: () => true }
    ],
    london_girl: [
        { dialog: 'emma_intro', condition: () => true }
    ],
    london_bobby: [
        { dialog: 'bobby_intro', condition: () => true }
    ],
    london_tea_lady: [
        { dialog: 'pemberton_intro', condition: () => true }
    ],
    london_clerk: [
        { dialog: 'olivia_intro', condition: () => true }
    ],
    london_professor: [
        { dialog: 'higgins_with_glasses', condition: (flags) => flags.london_has_glasses && !flags.london_has_research_pass },
        { dialog: 'higgins_after', condition: (flags) => flags.london_has_research_pass },
        { dialog: 'higgins_intro', condition: () => true }
    ],
    london_schoolkid: [
        { dialog: 'thomas_intro_choice', condition: (flags) => !flags.london_has_glasses },
        { dialog: 'thomas_after', condition: () => true }
    ],

    rome_historian: [
        { dialog: 'rossi_with_map', condition: (flags) => flags.london_complete && !flags.rome_have_key },
        { dialog: 'rossi_after_key', condition: (flags) => flags.rome_have_key && !flags.rome_complete },
        { dialog: 'rossi_journal_bonus', condition: (flags) => flags.rome_pages_complete && !flags.rome_bonus_seen },
        { dialog: 'rossi_after_quest', condition: (flags) => flags.rome_complete },
        { dialog: 'rossi_intro', condition: () => true }
    ],
    rome_artist: [
        { dialog: 'marco_intro', condition: () => true }
    ],
    rome_girl: [
        { dialog: 'giulia_intro', condition: () => true }
    ],
    rome_gelato: [
        { dialog: 'lorenzo_intro', condition: () => true }
    ],
    rome_musician: [
        { dialog: 'enzo_intro', condition: () => true }
    ],
    rome_tour_guide: [
        { dialog: 'alessandra_intro', condition: () => true }
    ],
    rome_cat_lady: [
        { dialog: 'bianca_intro', condition: () => true }
    ],

    marrakech_merchant: [
        { dialog: 'hassan_with_locket_choice', condition: (flags) => flags.rome_complete && !flags.marrakech_has_journal },
        { dialog: 'hassan_journal_bonus', condition: (flags) => flags.marrakech_pages_complete && !flags.marrakech_bonus_seen },
        { dialog: 'hassan_after_quest', condition: (flags) => flags.marrakech_has_journal },
        { dialog: 'hassan_intro', condition: () => true }
    ],
    marrakech_storyteller: [
        { dialog: 'fatima_after_amulet', condition: (flags) => flags.marrakech_has_amulet && !flags.marrakech_met_nadia },
        { dialog: 'fatima_intro', condition: () => true }
    ],
    marrakech_girl: [
        { dialog: 'amina_intro', condition: () => true }
    ],
    marrakech_spice: [
        { dialog: 'karim_intro', condition: () => true }
    ],
    marrakech_youssef: [
        { dialog: 'youssef_after_amulet', condition: (flags) => flags.marrakech_has_amulet && !flags.marrakech_met_nadia },
        { dialog: 'youssef_intro', condition: () => true }
    ],
    marrakech_tariq: [
        { dialog: 'tariq_after_amulet', condition: (flags) => flags.marrakech_has_amulet && !flags.marrakech_met_nadia },
        { dialog: 'tariq_intro', condition: () => true }
    ],
    marrakech_zahra: [
        { dialog: 'zahra_after_amulet', condition: (flags) => flags.marrakech_has_amulet && !flags.marrakech_met_nadia },
        { dialog: 'zahra_intro', condition: () => true }
    ],
    marrakech_nadia: [
        { dialog: 'nadia_with_amulet', condition: (flags) => flags.marrakech_has_amulet && !flags.marrakech_met_nadia },
        { dialog: 'nadia_after', condition: (flags) => flags.marrakech_met_nadia },
        { dialog: 'nadia_intro', condition: () => true }
    ],

    tokyo_gardener: [
        { dialog: 'yuki_with_journal', condition: (flags) => flags.marrakech_complete && !flags.tokyo_has_jade_key },
        { dialog: 'yuki_journal_bonus', condition: (flags) => flags.tokyo_pages_complete && !flags.tokyo_bonus_seen },
        { dialog: 'yuki_after_quest', condition: (flags) => flags.tokyo_has_jade_key },
        { dialog: 'yuki_intro', condition: () => true }
    ],
    tokyo_monk: [
        { dialog: 'takeshi_intro', condition: () => true }
    ],
    tokyo_girl: [
        { dialog: 'sakura_intro', condition: () => true }
    ],
    tokyo_chef: [
        { dialog: 'hiro_intro', condition: () => true }
    ],
    tokyo_manga: [
        { dialog: 'aiko_intro', condition: () => true }
    ],
    tokyo_shrine_keeper: [
        { dialog: 'tanaka_riddle_choice', condition: (flags) => flags.tokyo_riddle_part1 && flags.tokyo_riddle_part2 && flags.tokyo_riddle_part3 && !flags.tokyo_riddle_solved },
        { dialog: 'tanaka_waiting', condition: (flags) => !flags.tokyo_riddle_solved && (flags.tokyo_riddle_part1 || flags.tokyo_riddle_part2) },
        { dialog: 'tanaka_intro', condition: () => true }
    ],
    tokyo_fox: [
        { dialog: 'fox_intro', condition: () => true }
    ],
    tokyo_ghost: [
        { dialog: 'madeleine_intro', condition: () => true }
    ]
};

// Chest rewards
export const CHEST_REWARDS = {
    // Paris park chest
    'paris_chest_7_5': {
        requiresFlag: 'quest_started',
        item: { id: 'coin', name: 'Old Coin', icon: 'item_coin', description: 'An old French coin with a compass rose engraved on it.' }
    },
    // Paris Eiffel Tower top chest — Madeleine's Letter
    'paris_eiffel_top_chest_6_3': {
        requiresFlag: 'paris_has_fastpass',
        item: { id: 'eiffel_letter', name: "Madeleine's Letter", icon: 'item_letter', description: "A letter found at the top of the Eiffel Tower, written by Madeleine Beaumont." },
        setsFlag: 'paris_has_eiffel_letter',
        completesObjective: 'paris_find_letter'
    },
    // London basement chest — Map Fragment
    'london_museum_basement_chest_8_6': {
        requiresFlag: 'london_has_research_pass',
        item: { id: 'map_fragment', name: 'Map Fragment', icon: 'item_map_fragment', description: 'A piece of an ancient map pointing to Rome.' },
        setsFlag: 'london_complete',
        completesObjective: 'london_find_map',
        unlocksCity: 'rome'
    },
    // Rome fountain chest (legacy ID kept for compatibility)
    'rome_chest_30_22': {
        requiresFlag: 'rome_have_key',
        item: { id: 'book', name: 'Hidden Book', icon: 'item_book', description: "A book hidden behind the fountain with notes about Marrakech." },
        setsFlag: 'rome_complete',
        completesObjective: 'rome_open_chest',
        unlocksCity: 'marrakech'
    },
    // Rome lower catacombs chest — Hidden Book
    'rome_catacombs_lower_chest_7_5': {
        requiresFlag: 'rome_have_key',
        item: { id: 'book', name: 'Hidden Book', icon: 'item_book', description: "Madeleine's book with notes about Marrakech, hidden in the catacombs." },
        setsFlag: 'rome_complete',
        completesObjective: 'rome_open_chest',
        unlocksCity: 'marrakech'
    },
    // Marrakech riad chest — Nadia's Amulet
    'marrakech_riad_chest_10_7': {
        requiresFlag: 'marrakech_has_journal',
        item: { id: 'amulet', name: "Nadia's Amulet", icon: 'item_locket', description: "A family heirloom lost in the riad courtyard." },
        setsFlag: 'marrakech_has_amulet',
        completesObjective: 'marrakech_find_amulet'
    },
    // Marrakech oasis chest — Portal Stone
    'marrakech_oasis_chest_10_10': {
        requiresFlag: 'marrakech_met_nadia',
        item: { id: 'portal_stone', name: 'Portal Stone', icon: 'item_gem', description: 'A magical stone that activates portal travel.' },
        setsFlag: 'marrakech_complete',
        completesObjective: 'marrakech_get_portal',
        unlocksCity: 'tokyo',
        unlocksPortal: true
    },
    // Tokyo main map chest (legacy)
    'tokyo_chest_25_3': {
        requiresFlag: 'tokyo_has_jade_key',
        item: { id: 'gem', name: 'Gem of Understanding', icon: 'item_gem', description: 'A magical gem that lets you understand any language. The greatest treasure!' },
        setsFlag: 'game_complete',
        completesObjective: 'tokyo_find_treasure'
    },
    // Tokyo sacred garden chest — Gem of Understanding
    'tokyo_sacred_garden_chest_7_5': {
        requiresFlag: 'tokyo_has_jade_key',
        item: { id: 'gem', name: 'Gem of Understanding', icon: 'item_gem', description: 'A magical gem that lets you understand any language. The greatest treasure!' },
        setsFlag: 'game_complete',
        completesObjective: 'tokyo_find_treasure'
    }
};
