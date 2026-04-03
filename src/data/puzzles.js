// Puzzle objects — bells, paintings, and other puzzle interactables placed in rooms.
// Each object has a position, type, and ID used by the puzzle logic in ExploreScene.

export const PUZZLE_OBJECTS = {
    paris: [
        // 3 bells in the south-west park — ring in correct order: Gold, Silver, Bronze
        { id: 'bell_gold', city: 'paris', room: 'main', x: 3, y: 30, type: 'bell', label: 'Gold Bell' },
        { id: 'bell_silver', city: 'paris', room: 'main', x: 5, y: 30, type: 'bell', label: 'Silver Bell' },
        { id: 'bell_bronze', city: 'paris', room: 'main', x: 7, y: 30, type: 'bell', label: 'Bronze Bell' }
    ],
    london: [
        // 4 paintings on north wall of museum gallery — swap to correct order
        { id: 'painting_a', city: 'london', room: 'museum_gallery', x: 5, y: 2, type: 'painting', label: 'Greek Vase', correctOrder: 0 },
        { id: 'painting_b', city: 'london', room: 'museum_gallery', x: 9, y: 2, type: 'painting', label: 'Egyptian Mask', correctOrder: 1 },
        { id: 'painting_c', city: 'london', room: 'museum_gallery', x: 13, y: 2, type: 'painting', label: 'Roman Coin', correctOrder: 2 },
        { id: 'painting_d', city: 'london', room: 'museum_gallery', x: 17, y: 2, type: 'painting', label: 'Celtic Shield', correctOrder: 3 }
    ]
};

// Puzzle configuration — sequences, completion flags, prerequisites
export const PUZZLES = {
    paris_bells: {
        id: 'paris_bells',
        city: 'paris',
        room: 'main',
        type: 'bell_sequence',
        correctSequence: ['bell_gold', 'bell_silver', 'bell_bronze'],
        completionFlag: 'paris_bells_solved',
        requiredFlag: null  // optional puzzle, no prerequisite
    },
    london_paintings: {
        id: 'london_paintings',
        city: 'london',
        room: 'museum_gallery',
        type: 'painting_swap',
        // Paintings start scrambled: [C, A, D, B] — must be reordered to [A, B, C, D]
        initialOrder: ['painting_c', 'painting_a', 'painting_d', 'painting_b'],
        correctOrder: ['painting_a', 'painting_b', 'painting_c', 'painting_d'],
        completionFlag: 'london_paintings_solved',
        requiredFlag: null  // optional puzzle
    },
    rome_torch: {
        id: 'rome_torch',
        city: 'rome',
        room: 'catacombs_upper',
        type: 'choice_dialog',
        // Handled via marco_torch_choice in dialogChoices.js
        completionFlag: 'rome_torch_solved',
        requiredFlag: 'rome_have_key'
    },
    marrakech_trading: {
        id: 'marrakech_trading',
        city: 'marrakech',
        room: 'main',
        type: 'trading_chain',
        // Handled via NPC dialog routes and flag chain
        completionFlag: 'marrakech_trading_complete',
        requiredFlag: 'marrakech_has_journal'
    },
    tokyo_riddle: {
        id: 'tokyo_riddle',
        city: 'tokyo',
        room: 'shrine',
        type: 'choice_dialog',
        // Enhanced: wrong answers give hints, don't solve
        completionFlag: 'tokyo_riddle_solved',
        requiredFlag: null  // riddle parts are the prerequisite
    }
};
