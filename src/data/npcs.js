export const NPC_DATA = {
    paris: [
        // === MAIN PARIS ===
        { id: 'paris_grandma', name: 'Grand-mère Elise', sprite: 'grandma', x: 44, y: 32, defaultDialog: 'grandma_intro', questGiver: true, room: 'main' },
        { id: 'paris_librarian', name: 'Monsieur Dupont', sprite: 'librarian', x: 5, y: 27, defaultDialog: 'librarian_intro', questGiver: false, room: 'main' },
        { id: 'paris_guide', name: 'Sophie', sprite: 'guide', x: 25, y: 35, defaultDialog: 'sophie_intro', questGiver: false, room: 'main' },
        { id: 'paris_artist', name: 'Pierre', sprite: 'artist', x: 22, y: 12, defaultDialog: 'pierre_intro', questGiver: false, room: 'main' },
        { id: 'paris_florist', name: 'Madame Colette', sprite: 'flower_seller', x: 26, y: 29, defaultDialog: 'colette_intro', questGiver: false, room: 'main' },
        // === EIFFEL QUEUE (visible from main plaza) ===
        { id: 'paris_queue1', name: 'Tourist', sprite: 'tourist', x: 26, y: 10, defaultDialog: 'queue_grumble_1', questGiver: false, room: 'main' },
        { id: 'paris_queue2', name: 'Tourist', sprite: 'schoolkid', x: 27, y: 10, defaultDialog: 'queue_grumble_2', questGiver: false, room: 'main' },
        { id: 'paris_queue3', name: 'Tourist', sprite: 'tourist', x: 29, y: 10, defaultDialog: 'queue_grumble_3', questGiver: false, room: 'main' },
        { id: 'paris_queue4', name: 'Tourist', sprite: 'merchant', x: 26, y: 11, defaultDialog: 'queue_grumble_4', questGiver: false, room: 'main' },
        { id: 'paris_queue5', name: 'Tourist', sprite: 'schoolkid', x: 27, y: 11, defaultDialog: 'queue_grumble_5', questGiver: false, room: 'main' },
        { id: 'paris_queue6', name: 'Tourist', sprite: 'tourist', x: 29, y: 11, defaultDialog: 'queue_grumble_6', questGiver: false, room: 'main' },
        // === EIFFEL TOWER GROUND FLOOR ===
        { id: 'paris_tourist', name: 'Tourist Claude', sprite: 'tourist', x: 5, y: 10, defaultDialog: 'tourist_claude_intro', questGiver: false, room: 'eiffel_ground' },
        { id: 'paris_attendant', name: 'Ticket Attendant', sprite: 'attendant', x: 10, y: 5, defaultDialog: 'attendant_intro', questGiver: false, room: 'eiffel_ground' },
        // === EIFFEL TOWER 1ST FLOOR ===
        { id: 'paris_photographer', name: 'Marie', sprite: 'photographer', x: 14, y: 6, defaultDialog: 'marie_intro', questGiver: false, room: 'eiffel_first' }
    ],
    london: [
        // === MAIN LONDON ===
        { id: 'london_girl', name: 'Emma', sprite: 'guide', x: 12, y: 35, defaultDialog: 'emma_intro', questGiver: false, room: 'main' },
        { id: 'london_bobby', name: 'Bobby', sprite: 'policeman', x: 42, y: 10, defaultDialog: 'bobby_intro', questGiver: false, room: 'main' },
        { id: 'london_tea_lady', name: 'Mrs. Pemberton', sprite: 'grandma', x: 8, y: 29, defaultDialog: 'pemberton_intro', questGiver: false, room: 'main' },
        // === MUSEUM ENTRANCE HALL ===
        { id: 'london_curator', name: 'Dr. Wellington', sprite: 'curator', x: 11, y: 7, defaultDialog: 'curator_intro', questGiver: true, room: 'museum_hall' },
        { id: 'london_guard', name: 'Guard Roberts', sprite: 'librarian', x: 3, y: 8, defaultDialog: 'guard_intro', questGiver: false, room: 'museum_hall' },
        { id: 'london_clerk', name: 'Olivia', sprite: 'clerk', x: 18, y: 12, defaultDialog: 'olivia_intro', questGiver: false, room: 'museum_hall' },
        // === MUSEUM GALLERY ===
        { id: 'london_professor', name: 'Professor Higgins', sprite: 'professor', x: 10, y: 8, defaultDialog: 'higgins_intro', questGiver: false, room: 'museum_gallery' },
        { id: 'london_schoolkid', name: 'Thomas', sprite: 'schoolkid', x: 15, y: 14, defaultDialog: 'thomas_intro', questGiver: false, room: 'museum_gallery' }
    ],
    rome: [
        // === MAIN ROME ===
        { id: 'rome_girl', name: 'Giulia', sprite: 'guide', x: 35, y: 35, defaultDialog: 'giulia_intro', questGiver: false, room: 'main' },
        { id: 'rome_gelato', name: 'Lorenzo', sprite: 'gelato', x: 20, y: 20, defaultDialog: 'lorenzo_intro', questGiver: false, room: 'main' },
        { id: 'rome_musician', name: 'Enzo', sprite: 'musician', x: 8, y: 12, defaultDialog: 'enzo_intro', questGiver: false, room: 'main' },
        // === COLOSSEUM ENTRANCE ===
        { id: 'rome_historian', name: 'Professoressa Rossi', sprite: 'curator', x: 11, y: 10, defaultDialog: 'rossi_intro', questGiver: true, room: 'colosseum' },
        { id: 'rome_tour_guide', name: 'Alessandra', sprite: 'tour_guide', x: 5, y: 6, defaultDialog: 'alessandra_intro', questGiver: false, room: 'colosseum' },
        { id: 'rome_cat_lady', name: 'Bianca', sprite: 'cat_lady', x: 17, y: 12, defaultDialog: 'bianca_intro', questGiver: false, room: 'colosseum' },
        // === UPPER CATACOMBS ===
        { id: 'rome_artist', name: 'Marco', sprite: 'merchant', x: 9, y: 9, defaultDialog: 'marco_intro', questGiver: false, room: 'catacombs_upper' }
    ],
    marrakech: [
        // === MAIN MARRAKECH ===
        { id: 'marrakech_storyteller', name: 'Fatima', sprite: 'grandma', x: 25, y: 22, defaultDialog: 'fatima_intro', questGiver: false, room: 'main' },
        { id: 'marrakech_girl', name: 'Amina', sprite: 'guide', x: 13, y: 22, defaultDialog: 'amina_intro', questGiver: false, room: 'main' },
        { id: 'marrakech_spice', name: 'Karim', sprite: 'spice_merchant', x: 19, y: 16, defaultDialog: 'karim_intro', questGiver: false, room: 'main' },
        // === GRAND SOUK ===
        { id: 'marrakech_merchant', name: 'Hassan', sprite: 'merchant', x: 12, y: 8, defaultDialog: 'hassan_intro', questGiver: true, room: 'souk' },
        { id: 'marrakech_youssef', name: 'Youssef', sprite: 'storyteller', x: 6, y: 4, defaultDialog: 'youssef_intro', questGiver: false, room: 'souk' },
        { id: 'marrakech_tariq', name: 'Tariq', sprite: 'carpet_merchant', x: 18, y: 12, defaultDialog: 'tariq_intro', questGiver: false, room: 'souk' },
        // === HIDDEN RIAD ===
        { id: 'marrakech_zahra', name: 'Zahra', sprite: 'riad_keeper', x: 4, y: 7, defaultDialog: 'zahra_intro', questGiver: false, room: 'riad' },
        // === DESERT OASIS ===
        { id: 'marrakech_nadia', name: 'Nadia', sprite: 'desert_guide', x: 14, y: 10, defaultDialog: 'nadia_intro', questGiver: false, room: 'oasis' }
    ],
    tokyo: [
        // === MAIN TOKYO ===
        { id: 'tokyo_monk', name: 'Takeshi', sprite: 'librarian', x: 6, y: 15, defaultDialog: 'takeshi_intro', questGiver: false, room: 'main' },
        { id: 'tokyo_girl', name: 'Sakura', sprite: 'guide', x: 35, y: 31, defaultDialog: 'sakura_intro', questGiver: false, room: 'main' },
        { id: 'tokyo_chef', name: 'Hiro', sprite: 'ramen_chef', x: 42, y: 15, defaultDialog: 'hiro_intro', questGiver: false, room: 'main' },
        { id: 'tokyo_manga', name: 'Aiko', sprite: 'manga_artist', x: 18, y: 21, defaultDialog: 'aiko_intro', questGiver: false, room: 'main' },
        // === SHRINE ENTRANCE ===
        { id: 'tokyo_shrine_keeper', name: 'Tanaka', sprite: 'shrine_keeper', x: 9, y: 4, defaultDialog: 'tanaka_intro', questGiver: false, room: 'shrine' },
        // === BAMBOO FOREST ===
        { id: 'tokyo_gardener', name: 'Yuki-san', sprite: 'gardener', x: 11, y: 10, defaultDialog: 'yuki_intro', questGiver: true, room: 'bamboo_forest' },
        { id: 'tokyo_fox', name: 'Spirit Fox', sprite: 'spirit_fox', x: 5, y: 6, defaultDialog: 'fox_intro', questGiver: false, room: 'bamboo_forest' },
        // === SACRED GARDEN ===
        { id: 'tokyo_ghost', name: 'Ghost of Madeleine', sprite: 'ghost', x: 7, y: 5, defaultDialog: 'madeleine_intro', questGiver: false, room: 'sacred_garden' }
    ]
};
