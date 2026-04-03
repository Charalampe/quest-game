// Side quests — optional quests with objectives tracked via flags.
// Each side quest has a start flag (set when the player talks to the quest-giver),
// a complete flag, and objectives with associated flags.

export const SIDE_QUESTS = {
    paris_flowers: {
        id: 'paris_flowers',
        city: 'paris',
        name: 'Flower Deliveries',
        description: "Help Colette deliver flowers to her friends around Paris.",
        startFlag: 'side_paris_flowers_started',
        completeFlag: 'side_paris_flowers_complete',
        objectives: [
            { id: 'flower_sophie', text: 'Deliver flowers to Sophie', flag: 'side_flower_sophie' },
            { id: 'flower_marie', text: 'Deliver flowers to Marie', flag: 'side_flower_marie' },
            { id: 'flower_librarian', text: 'Deliver flowers to the Librarian', flag: 'side_flower_librarian' },
            { id: 'flower_report', text: 'Report back to Colette', flag: 'side_paris_flowers_complete' }
        ]
    },
    london_whistle: {
        id: 'london_whistle',
        city: 'london',
        name: "Bobby's Whistle",
        description: "Bobby lost his whistle somewhere in the museum basement. Find it and return it.",
        startFlag: 'side_london_whistle_started',
        completeFlag: 'side_london_whistle_complete',
        objectives: [
            { id: 'find_whistle', text: 'Find the whistle in the basement', flag: 'side_has_whistle' },
            { id: 'return_whistle', text: 'Return the whistle to Bobby', flag: 'side_london_whistle_complete' }
        ]
    },
    rome_music: {
        id: 'rome_music',
        city: 'rome',
        name: "Enzo's Music Sheets",
        description: "Help Enzo find his lost music sheets scattered around Rome.",
        startFlag: 'side_rome_music_started',
        completeFlag: 'side_rome_music_complete',
        objectives: [
            { id: 'find_sheet_1', text: 'Find music sheet in the Colosseum', flag: 'side_has_sheet_1' },
            { id: 'find_sheet_2', text: 'Find music sheet in the catacombs', flag: 'side_has_sheet_2' },
            { id: 'find_sheet_3', text: 'Get music sheet from Giulia', flag: 'side_has_sheet_3' },
            { id: 'return_sheets', text: 'Return all sheets to Enzo', flag: 'side_rome_music_complete' }
        ]
    },
    marrakech_stories: {
        id: 'marrakech_stories',
        city: 'marrakech',
        name: "Fatima's Stories",
        description: "Help Fatima collect stories from people around Marrakech.",
        startFlag: 'side_marrakech_stories_started',
        completeFlag: 'side_marrakech_stories_complete',
        objectives: [
            { id: 'story_amina', text: "Hear Amina's story", flag: 'side_story_amina' },
            { id: 'story_karim', text: "Hear Karim's story", flag: 'side_story_karim' },
            { id: 'story_zahra', text: "Hear Zahra's story", flag: 'side_story_zahra' },
            { id: 'story_report', text: 'Report back to Fatima', flag: 'side_marrakech_stories_complete' }
        ]
    },
    tokyo_cat: {
        id: 'tokyo_cat',
        city: 'tokyo',
        name: "Aiko's Lost Cat",
        description: "Help Aiko find her cat Mochi who wandered into the bamboo forest.",
        startFlag: 'side_tokyo_cat_started',
        completeFlag: 'side_tokyo_cat_complete',
        objectives: [
            { id: 'find_cat', text: 'Find Mochi in the bamboo forest', flag: 'side_has_cat' },
            { id: 'return_cat', text: 'Return Mochi to Aiko', flag: 'side_tokyo_cat_complete' }
        ]
    }
};

// Hidden items — one-time pickups placed in rooms, similar to journal pages.
// Each grants an item and sets a flag when collected.

export const HIDDEN_ITEMS = [
    {
        id: 'hidden_whistle',
        city: 'london',
        room: 'museum_basement',
        x: 7, y: 9,
        item: { id: 'whistle', name: 'Whistle', icon: 'item_key', description: "A brass police whistle." },
        setsFlag: 'side_has_whistle',
        requiresFlag: 'side_london_whistle_started'
    },
    {
        id: 'hidden_sheet_1',
        city: 'rome',
        room: 'colosseum',
        x: 18, y: 13,
        item: { id: 'music_sheet_1', name: 'Music Sheet (1/3)', icon: 'item_letter', description: "A page of violin music." },
        setsFlag: 'side_has_sheet_1',
        requiresFlag: 'side_rome_music_started'
    },
    {
        id: 'hidden_sheet_2',
        city: 'rome',
        room: 'catacombs_upper',
        x: 14, y: 12,
        item: { id: 'music_sheet_2', name: 'Music Sheet (2/3)', icon: 'item_letter', description: "A page of violin music." },
        setsFlag: 'side_has_sheet_2',
        requiresFlag: 'side_rome_music_started'
    },
    {
        id: 'hidden_cat',
        city: 'tokyo',
        room: 'bamboo_forest',
        x: 18, y: 15,
        item: { id: 'cat_mochi', name: 'Mochi the Cat', icon: 'item_locket', description: "Aiko's fluffy orange cat." },
        setsFlag: 'side_has_cat',
        requiresFlag: 'side_tokyo_cat_started'
    }
];
