// Lea's Journal — auto-populated diary entries triggered by flags.
// Each entry has a flag trigger (the entry appears when the flag is set)
// and a journal text written from Lea's perspective.
// Entries are displayed in order (first = oldest).

export const LEA_JOURNAL_ENTRIES = [
    {
        id: 'journal_quest_start',
        trigger: 'quest_started',
        city: 'paris',
        title: 'The Locket',
        text: "Grandma gave me the locket today. I can't believe my great-great-grandmother was a real explorer! The coded message inside is so mysterious... I HAVE to find out what it means."
    },
    {
        id: 'journal_paintbrush',
        trigger: 'paris_has_paintbrush',
        city: 'paris',
        title: 'A Favour for Pierre',
        text: "Found Pierre's paintbrush at Colette's flower stall. He promised me a Fast Pass for the Eiffel Tower in return. Sounds like a fair deal!"
    },
    {
        id: 'journal_eiffel_letter',
        trigger: 'paris_has_eiffel_letter',
        city: 'paris',
        title: 'The Eiffel Tower Letter',
        text: "I made it to the top of the Eiffel Tower! The letter I found... Madeleine was here, standing in this exact spot almost 100 years ago. I wonder what she was thinking when she hid it."
    },
    {
        id: 'journal_paris_complete',
        trigger: 'paris_complete',
        city: 'paris',
        title: 'London Awaits',
        text: "Monsieur Dupont decoded the letter! It points to the British Museum in London. My first real adventure — I'm actually leaving Paris! This is happening!"
    },
    {
        id: 'journal_london_curator',
        trigger: 'london_met_curator',
        city: 'london',
        title: 'The British Museum',
        text: "London is so different from Paris. Everything is so... proper. But the museum curator seemed really excited about the letter. I think I'm on to something big."
    },
    {
        id: 'journal_london_glasses',
        trigger: 'london_has_glasses',
        city: 'london',
        title: "Thomas's Find",
        text: "A schoolboy named Thomas found the professor's glasses! He just handed them over, no questions asked. Kids are pretty cool sometimes."
    },
    {
        id: 'journal_london_complete',
        trigger: 'london_complete',
        city: 'london',
        title: 'A Map to Rome',
        text: "Found the map fragment in the basement archive! It points to Rome — the Colosseum! Madeleine hid clues across the whole world. She was incredible."
    },
    {
        id: 'journal_rome_key',
        trigger: 'rome_have_key',
        city: 'rome',
        title: 'The Ancient Key',
        text: "Professoressa Rossi gave me an ancient key with a compass rose! The catacombs beneath the Colosseum... I'm a little scared, but mostly excited."
    },
    {
        id: 'journal_rome_complete',
        trigger: 'rome_complete',
        city: 'rome',
        title: 'Secrets of the Catacombs',
        text: "Found Madeleine's hidden book in the deepest catacomb! The notes mention Marrakech. I'm sailing across the Mediterranean — just like Madeleine did!"
    },
    {
        id: 'journal_marrakech_journal',
        trigger: 'marrakech_has_journal',
        city: 'marrakech',
        title: "Madeleine's Journal",
        text: "Hassan recognized the locket symbol! His family kept Madeleine's journal safe for nearly 100 years. The trust between them... it's beautiful."
    },
    {
        id: 'journal_marrakech_amulet',
        trigger: 'marrakech_has_amulet',
        city: 'marrakech',
        title: "Nadia's Amulet",
        text: "Found an amulet in the old riad courtyard. It belongs to Nadia the desert guide. Maybe if I return it, she'll help me find the oasis."
    },
    {
        id: 'journal_marrakech_complete',
        trigger: 'marrakech_complete',
        city: 'marrakech',
        title: 'The Portal Stone',
        text: "A portal stone! It actually glows with magical energy. Madeleine used this to travel to Japan instantly. I'm holding real magic in my hands!"
    },
    {
        id: 'journal_tokyo_riddle',
        trigger: 'tokyo_riddle_solved',
        city: 'tokyo',
        title: 'Three Truths',
        text: "Patience, Courage, Wisdom — the three proverbs opened the sealed door! The bamboo forest beyond is enchanted. A spirit fox appeared to guide me."
    },
    {
        id: 'journal_tokyo_jade_key',
        trigger: 'tokyo_has_jade_key',
        city: 'tokyo',
        title: 'The Jade Key',
        text: "Yuki-san gave me the jade key. She said Madeleine planted the cherry trees herself. This garden has been waiting for me."
    },
    {
        id: 'journal_tokyo_madeleine',
        trigger: 'tokyo_met_madeleine',
        city: 'tokyo',
        title: "Madeleine's Ghost",
        text: "I met her. I actually met Madeleine — or her spirit. She said she's proud of me. I couldn't stop crying. She was so kind."
    },
    {
        id: 'journal_game_complete',
        trigger: 'game_complete',
        city: 'tokyo',
        title: 'The Real Treasure',
        text: "The Gem of Understanding. Not gold, not jewels — the power to connect with all people. Madeleine was right. The journey taught me more than any treasure could. But I'm not done exploring. Not even close."
    }
];
