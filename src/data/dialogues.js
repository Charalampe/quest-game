export const DIALOGUES = {
    // === PARIS ===
    grandma_intro: {
        lines: [
            "Oh, Léa! Come here, my dear.",
            "I was cleaning the attic and found something extraordinary...",
            "This locket belonged to your great-great-grandmother, Madeleine Beaumont.",
            "She was a famous explorer! But her greatest discovery was never found...",
            "There's a coded message inside. Can you read it?",
            "'Where knowledge flows like the river, seek the keeper of stories.'",
            "That sounds like the old bookshop by the Seine! Go speak with Monsieur Dupont.",
            "But also... Madeleine's secret is said to be hidden at the top of the Eiffel Tower!"
        ],
        givesItem: { id: 'locket', name: 'Mysterious Locket', icon: 'item_locket', description: 'An ornate golden locket with a coded message inside.' },
        setsFlag: 'quest_started',
        completesObjective: 'paris_find_locket'
    },
    grandma_after_locket: {
        lines: [
            "Be careful out there, Léa!",
            "Madeleine's journal says the treasure is something truly special.",
            "Try visiting the Eiffel Tower — Pierre the artist near the plaza might help.",
            "I know you can find it. You have her spirit of adventure!"
        ]
    },

    librarian_intro: {
        lines: [
            "Bonjour! Welcome to Librairie du Pont.",
            "We have books from all over the world. Feel free to browse!"
        ]
    },
    librarian_with_letter: {
        lines: [
            "Mon Dieu! Is that... Madeleine's Letter from the Eiffel Tower?!",
            "I've read about this in the old archives!",
            "Madeleine Beaumont traveled the world collecting pieces of a map.",
            "Each piece leads to the next location...",
            "Let me see... Ah yes!",
            "'The guardian of history holds the first fragment, across the channel.'",
            "That must mean the British Museum in London!",
            "Show this letter to the curator there. It should help you gain access."
        ],
        setsFlag: 'paris_complete',
        completesObjective: 'paris_visit_librarian',
        unlocksCity: 'london'
    },
    librarian_after_quest: {
        lines: [
            "Safe travels, Léa! London awaits.",
            "Remember, the British Museum is your destination.",
            "Press M to open the world map when you're ready to travel."
        ]
    },

    sophie_intro: {
        lines: [
            "Hi there! I'm Sophie. I love exploring Paris!",
            "Have you visited the Eiffel Tower? It's just north of here.",
            "There's also a beautiful park to the northwest.",
            "Tip: Use WASD or arrow keys to move, and SPACE to interact!"
        ]
    },
    sophie_after_quest: {
        lines: [
            "I heard you're going on an adventure! How exciting!",
            "I wish I could come along. Be sure to tell me all about it!",
            "Press I to check your inventory, and Q for your quest log."
        ]
    },

    // New Paris NPCs
    pierre_intro: {
        lines: [
            "Bonjour! I'm Pierre, a street artist.",
            "I love painting the Eiffel Tower, but I've lost my paintbrush!",
            "I think I dropped it near the market square...",
            "If you find it, I could help you with something in return.",
            "I have connections at the tower — I could get you a Fast Pass!"
        ]
    },
    pierre_has_brush: {
        lines: [
            "My paintbrush! You found it! Merci beaucoup!",
            "As promised, here's a Fast Pass for the Eiffel Tower.",
            "Skip the queue and go right to the top!",
            "Show it to the attendant at the tower entrance."
        ],
        givesItem: { id: 'fastpass', name: 'Fast Pass', icon: 'item_letter', description: 'An express ticket to skip the Eiffel Tower queue.' },
        setsFlag: 'paris_has_fastpass',
        completesObjective: 'paris_return_paintbrush'
    },
    pierre_after_fastpass: {
        lines: [
            "The view from the top is magnifique!",
            "I hope you find what you're looking for up there."
        ]
    },

    colette_intro: {
        lines: [
            "Welcome to my flower stall! The freshest blooms in Paris!",
            "Oh, what's that on the ground? A paintbrush!",
            "It must belong to that artist, Pierre. He's always losing things.",
            "Here, take it. I'm sure he'll be grateful!"
        ],
        givesItem: { id: 'paintbrush', name: 'Paintbrush', icon: 'item_key', description: "Pierre's lost paintbrush." },
        setsFlag: 'paris_has_paintbrush',
        completesObjective: 'paris_find_paintbrush'
    },
    colette_after: {
        lines: [
            "Such beautiful flowers today! Pierre should paint them.",
            "He's usually near the Eiffel Tower plaza."
        ]
    },

    tourist_claude_intro: {
        lines: [
            "This queue is insane! I've been waiting for hours!",
            "They say you need a Fast Pass to skip ahead.",
            "Maybe that artist in the main square knows someone..."
        ]
    },
    attendant_intro: {
        lines: [
            "Welcome to the Eiffel Tower!",
            "I'm afraid the regular queue is very long today.",
            "If you have a Fast Pass, you can go right through!"
        ]
    },
    attendant_with_pass: {
        lines: [
            "A Fast Pass! Excellent, go right ahead!",
            "The stairs to the first floor are just through here.",
            "Enjoy the view!"
        ],
        setsFlag: 'paris_tower_access'
    },

    marie_intro: {
        lines: [
            "Oh, the view from here is incredible!",
            "I'm a photographer. I come here every week.",
            "I heard there's something special at the very top...",
            "An old sign from decades ago. Some kind of memorial."
        ]
    },

    // === LONDON ===
    curator_intro: {
        lines: [
            "Welcome to the British Museum. Please don't touch the exhibits.",
            "We have artifacts from every corner of the world."
        ]
    },
    curator_with_letter: {
        lines: [
            "What's this? A letter from... Madeleine Beaumont?!",
            "Extraordinary! I thought these were just legends.",
            "Yes, we do have a map fragment in our archives.",
            "It's in the basement, but the archive is restricted.",
            "You'll need a Research Pass to get in.",
            "Professor Higgins in the gallery might be able to help.",
            "He's the only one authorized to issue passes."
        ],
        setsFlag: 'london_met_curator',
        completesObjective: 'london_talk_curator'
    },
    curator_after_quest: {
        lines: [
            "The map points to Rome. The Colosseum specifically.",
            "Madeleine was brilliant at hiding her clues in plain sight.",
            "Good luck, young explorer!"
        ]
    },

    guard_intro: {
        lines: [
            "No running in the museum, please.",
            "The basement archive is off-limits without a Research Pass."
        ]
    },
    guard_with_pass: {
        lines: [
            "A Research Pass? Let me see... Yes, this is valid.",
            "You may enter the basement archive. Be careful down there!"
        ]
    },

    emma_intro: {
        lines: [
            "Hello! Are you visiting London?",
            "The museum is amazing. Dr. Wellington knows everything about ancient explorers.",
            "If you have something interesting, definitely show it to her!",
            "The museum entrance is just north of here."
        ]
    },

    bobby_intro: {
        lines: [
            "Good day! Welcome to London!",
            "The British Museum is just up the road. Quite impressive, I must say.",
            "If you need directions, just ask!"
        ]
    },

    pemberton_intro: {
        lines: [
            "Oh dear, would you like a cup of tea?",
            "That professor at the museum is always losing his reading glasses.",
            "I saw a young boy pick them up in the gallery earlier."
        ]
    },

    olivia_intro: {
        lines: [
            "Welcome to the museum gift shop!",
            "We have replicas of all the famous artifacts.",
            "Professor Higgins has been squinting at his books all day. Poor man needs his glasses!"
        ]
    },

    higgins_intro: {
        lines: [
            "Hmm... I can't read a thing without my spectacles!",
            "I lost them somewhere in this gallery.",
            "If you could find them, I'd be most grateful.",
            "I could even write you a Research Pass for the archives."
        ]
    },
    higgins_with_glasses: {
        lines: [
            "My glasses! Oh, wonderful! I can see again!",
            "As promised, here's a Research Pass for the basement archive.",
            "The Beaumont Collection is in the far corner. Good luck!"
        ],
        givesItem: { id: 'research_pass', name: 'Research Pass', icon: 'item_letter', description: 'Grants access to the museum basement archive.' },
        setsFlag: 'london_has_research_pass',
        completesObjective: 'london_return_glasses'
    },
    higgins_after: {
        lines: [
            "The Beaumont Collection in the basement is fascinating.",
            "Donated anonymously in 1935. Nobody knows who brought it."
        ]
    },

    thomas_intro: {
        lines: [
            "Hey! I'm on a school trip. This museum is HUGE!",
            "I found these funny glasses on a bench. They look old.",
            "Are they yours? No? Well, here — you can have them!",
            "I don't want to get in trouble for taking them."
        ],
        givesItem: { id: 'reading_glasses', name: 'Reading Glasses', icon: 'item_key', description: "Professor Higgins' lost spectacles." },
        setsFlag: 'london_has_glasses',
        completesObjective: 'london_find_glasses'
    },
    thomas_after: {
        lines: [
            "The Egyptian section is so cool!",
            "I want to be an archaeologist when I grow up!"
        ]
    },

    // === ROME ===
    rossi_intro: {
        lines: [
            "Buongiorno! Welcome to the Colosseum!",
            "This arena has seen thousands of years of history."
        ]
    },
    rossi_with_map: {
        lines: [
            "A map fragment? From the Beaumont collection?!",
            "I am a historian specializing in women explorers. This is incredible!",
            "The map mentions a secret passage beneath the Colosseum.",
            "I've been searching for it for years!",
            "Here, take this ancient key. I found it near the arena floor.",
            "It might open the passage to the catacombs below.",
            "Bianca and her cats seem to know where the door is..."
        ],
        givesItem: { id: 'key', name: 'Ancient Key', icon: 'item_key', description: 'A small ornate key with a compass rose engraving.' },
        setsFlag: 'rome_have_key',
        completesObjective: 'rome_talk_historian'
    },
    rossi_after_key: {
        lines: [
            "Use the key on the locked door in the Colosseum!",
            "The catacombs beneath should hold Madeleine's secret."
        ]
    },
    rossi_after_quest: {
        lines: [
            "Marrakech! What an adventure!",
            "The ancient trade routes connected Rome to North Africa.",
            "Madeleine must have taken a boat across the Mediterranean."
        ]
    },

    marco_intro: {
        lines: [
            "Ciao! I'm an archaeology student exploring these tunnels.",
            "The lower catacombs are just ahead — follow the torches.",
            "Be careful, the passages are narrow and dark.",
            "I saw a chest in the deepest chamber. It looks very old!"
        ]
    },
    giulia_intro: {
        lines: [
            "Welcome to Rome! The Eternal City!",
            "Every stone here tells a story thousands of years old.",
            "If you're looking for secrets, the Colosseum is the place!",
            "There's a door on the main road that leads inside."
        ]
    },

    lorenzo_intro: {
        lines: [
            "Ciao! Best gelato in Rome, right here!",
            "You know, I've heard strange music coming from under the Colosseum.",
            "The old legends say there are tunnels underneath.",
            "Talk to Professoressa Rossi in the Colosseum — she knows all about it."
        ]
    },

    enzo_intro: {
        lines: [
            "♪ La la la... Oh! You startled me!",
            "I'm Enzo. I play violin near the ancient ruins.",
            "I've heard about a secret door in the Colosseum.",
            "They say it has a keyhole shaped like a flower — a compass rose!"
        ]
    },

    alessandra_intro: {
        lines: [
            "Welcome to the Colosseum! I'm your tour guide.",
            "This arena could hold 50,000 spectators!",
            "The catacombs below were where gladiators prepared for battle.",
            "Some say there are still undiscovered passages..."
        ]
    },

    bianca_intro: {
        lines: [
            "Shhh... don't scare the cats!",
            "I feed them here every day. They know every secret of this place.",
            "My cat Nero keeps going to that wall on the right side...",
            "It's like there's something behind it. A door, maybe?"
        ]
    },

    // === MARRAKECH ===
    hassan_intro: {
        lines: [
            "Welcome, welcome! The finest treasures of the Sahara!",
            "Spices, fabrics, jewels — anything your heart desires!"
        ]
    },
    hassan_with_locket: {
        lines: [
            "Wait... that symbol on your locket...",
            "I have seen it before! My grandmother showed me.",
            "A woman came here many years ago. Madeleine, she was called.",
            "She left something with my family for safekeeping.",
            "A journal! Here it is.",
            "Inside, there's a strange drawing of a desert oasis...",
            "They say a guide named Nadia knows where it is.",
            "But she lost her grandmother's amulet. Maybe you can help?"
        ],
        givesItem: { id: 'journal', name: "Explorer's Journal", icon: 'item_journal', description: "Madeleine's journal with the final clue." },
        setsFlag: 'marrakech_has_journal',
        completesObjective: 'marrakech_find_journal'
    },
    hassan_after_quest: {
        lines: [
            "The journal speaks of a desert oasis and a portal stone.",
            "Find Nadia's amulet, and she will guide you there.",
            "May your journey be blessed, young explorer."
        ]
    },

    fatima_intro: {
        lines: [
            "Ah, a young traveler! Sit, sit.",
            "Let me tell you the story of the Red City...",
            "Marrakech has been a meeting place of cultures for centuries.",
            "If you seek something, enter the Grand Souk to the south. Hassan knows everyone."
        ]
    },
    amina_intro: {
        lines: [
            "Hi! I'm Amina. The medina is like a maze, isn't it?",
            "Don't worry, you can't really get lost. The paths always lead back to the square!",
            "The Grand Souk entrance is just south of the market area."
        ]
    },

    karim_intro: {
        lines: [
            "Welcome! The finest spices in all of Morocco!",
            "Cinnamon, saffron, turmeric — you name it!",
            "Looking for Hassan? He's deep in the Grand Souk.",
            "Enter through the south door of the market."
        ]
    },

    youssef_intro: {
        lines: [
            "Gather round, gather round! Let me tell you a tale...",
            "Of a magical oasis hidden in the desert!",
            "They say a guide named Nadia knows the way.",
            "But she lost her grandmother's amulet in the old riad.",
            "Find it, and perhaps she will trust you."
        ]
    },

    tariq_intro: {
        lines: [
            "The finest carpets in all of Marrakech!",
            "You look like you're searching for something...",
            "Nadia? Yes, I know her. She's the desert guide.",
            "But she's been sad — lost her grandmother's amulet.",
            "Someone said it fell in the old riad courtyard nearby."
        ]
    },

    zahra_intro: {
        lines: [
            "Welcome to the hidden riad. So few visitors find this place.",
            "I maintain this old building. It has a beautiful fountain.",
            "I saw something shiny near the fountain the other day...",
            "A little amulet, perhaps? Check near the water."
        ]
    },

    nadia_intro: {
        lines: [
            "Welcome to the oasis. The desert is beautiful, isn't it?",
            "But I'm afraid I can't help you right now.",
            "I lost my grandmother's amulet... it means everything to me."
        ]
    },
    nadia_with_amulet: {
        lines: [
            "My grandmother's amulet! You found it!",
            "Thank you so much! I thought it was gone forever.",
            "You wanted to find the portal stone? Let me show you.",
            "It's right here in the oasis. Madeleine hid it long ago.",
            "Open the chest — the portal stone is inside.",
            "It will activate the magical portal. Use it well!"
        ],
        setsFlag: 'marrakech_met_nadia',
        completesObjective: 'marrakech_return_amulet'
    },
    nadia_after: {
        lines: [
            "The portal stone is powerful. It connects distant places.",
            "Madeleine used it to travel the world in the blink of an eye.",
            "Be brave, young explorer. Tokyo awaits!"
        ]
    },

    // === TOKYO ===
    yuki_intro: {
        lines: [
            "Welcome to the bamboo forest. Few visitors find this place.",
            "The garden beyond is sacred. It holds ancient secrets."
        ]
    },
    yuki_with_journal: {
        lines: [
            "You carry Madeleine's journal? Then you are the one.",
            "She planted the cherry trees in the sacred garden herself.",
            "To enter, you'll need the Jade Key.",
            "Here — I've been keeping it safe for the right person.",
            "The gate to the sacred garden is just ahead."
        ],
        givesItem: { id: 'jade_key', name: 'Jade Key', icon: 'item_key', description: 'A beautiful jade key that opens the sacred garden gate.' },
        setsFlag: 'tokyo_has_jade_key',
        completesObjective: 'tokyo_talk_gardener'
    },
    yuki_after_quest: {
        lines: [
            "You found it! The treasure of Madeleine Beaumont!",
            "A gem that lets you understand any language in the world.",
            "She always said the greatest treasure is understanding between people.",
            "Your adventure has just begun, Léa. The world is full of wonders!"
        ]
    },

    takeshi_intro: {
        lines: [
            "Peace be with you, traveler.",
            "This shrine has stood for a thousand years.",
            "The shrine to the south holds a riddle you must solve.",
            "Seek wisdom from Hiro and Aiko before you enter."
        ]
    },
    sakura_intro: {
        lines: [
            "Konnichiwa! Welcome to Tokyo!",
            "The shrine entrance is on the main south path.",
            "They say a French explorer left something special here long ago.",
            "Talk to the locals — they might know parts of the riddle!"
        ]
    },

    hiro_intro: {
        lines: [
            "Welcome to my ramen shop! Best noodles in Tokyo!",
            "You want to enter the shrine? You'll need the riddle answer.",
            "Here's a proverb my grandfather taught me:",
            "'Patience is the key that unlocks all doors.'",
            "That's the first part. Aiko knows the second!"
        ],
        setsFlag: 'tokyo_riddle_part1'
    },

    aiko_intro: {
        lines: [
            "Oh! You want to solve the shrine riddle?",
            "I drew it in my manga once! Here, look at this page.",
            "'Courage lights the path through darkness.'",
            "That's the second part! The third is written on a sign in the shrine.",
            "Tanaka the shrine keeper will ask for all three parts."
        ],
        setsFlag: 'tokyo_riddle_part2'
    },

    tanaka_intro: {
        lines: [
            "Welcome to the sacred shrine.",
            "To pass through the sealed door, you must answer the riddle.",
            "Three proverbs, three truths. Do you know them all?"
        ]
    },
    tanaka_riddle_complete: {
        lines: [
            "'Patience, Courage, and Wisdom.'",
            "Yes! Those are the three truths!",
            "The sealed door is now open. You may enter the bamboo forest.",
            "Be careful — the forest is enchanted. Follow the fox if you get lost."
        ],
        setsFlag: 'tokyo_riddle_solved',
        completesObjective: 'tokyo_solve_riddle'
    },
    tanaka_waiting: {
        lines: [
            "You don't seem to have all three parts of the riddle yet.",
            "Seek wisdom from the people of Tokyo.",
            "Also, read the sign here in the shrine for the third part."
        ]
    },

    fox_intro: {
        lines: [
            "...",
            "The spirit fox watches you with ancient eyes.",
            "It gestures toward the clearing ahead.",
            "Follow the lanterns... Yuki-san waits for you there."
        ]
    },

    madeleine_intro: {
        lines: [
            "Léa... my dear great-great-granddaughter.",
            "You found me. After all these years...",
            "I planted these cherry trees when I was young, full of wonder.",
            "The treasure I left is not gold or jewels.",
            "It is the Gem of Understanding — the power to connect with all people.",
            "The world is vast and beautiful, Léa.",
            "Never stop exploring. Never stop being curious.",
            "I am so proud of you."
        ],
        setsFlag: 'tokyo_met_madeleine'
    }
};
