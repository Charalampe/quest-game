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
    librarian_with_locket: {
        lines: [
            "Oh! You must be Elise's granddaughter — Léa, isn't it?",
            "I knew your great-great-grandmother Madeleine well... through her books, of course!",
            "The Beaumonts were a family of explorers. Quite remarkable, really.",
            "There's an old legend among us booksellers... They say Madeleine hid something at the very top of the Eiffel Tower.",
            "Nobody ever found it. But with that locket of hers... who knows?",
            "If you ever find anything up there, bring it to me. Old letters are my specialty!"
        ]
    },
    librarian_progress: {
        lines: [
            "Back already? Have you been to the top of the tower yet?",
            "I keep thinking about that old legend... Madeleine's hidden letter.",
            "If it exists, I'd love to see it. I can read old scripts that most people can't!"
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
    librarian_bells_hint: {
        lines: [
            "By the way, Madeleine left something in the park south of here.",
            "Three bells — she tuned them herself in 1923!",
            "Ring them in the right order — Gold, Silver, Bronze — and you'll find a hidden note.",
            "She loved musical puzzles. Said music was her 'first language.'"
        ]
    },
    librarian_bells_done: {
        lines: [
            "You solved Madeleine's bell puzzle! Wonderful!",
            "She wrote in her diary that music was her 'first language.'",
            "Before French, before words — music.",
            "You truly are following in her footsteps, Léa."
        ],
        setsFlag: 'paris_bells_acknowledged'
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
    queue_grumble_1: {
        lines: [ "Ugh, I've been standing here since this morning!", "At this rate I'll see the tower at sunset..." ]
    },
    queue_grumble_2: {
        lines: [ "My feet are killing me...", "Is this line even moving?!" ]
    },
    queue_grumble_3: {
        lines: [ "I heard someone got a Fast Pass and skipped the whole queue!", "So unfair... or maybe so smart?" ]
    },
    queue_grumble_4: {
        lines: [ "*sigh* We should have come earlier.", "This is the longest queue I've ever seen." ]
    },
    queue_grumble_5: {
        lines: [ "Are we there yet? Are we there yet?", "Moooom, I'm bored!" ]
    },
    queue_grumble_6: {
        lines: [ "I could have climbed the tower by hand by now!", "Patience is a virtue... that I don't have." ]
    },
    iqueue_grumble_1: {
        lines: [ "Almost there... just a few more people ahead!", "I can practically see the ticket counter from here." ]
    },
    iqueue_grumble_2: {
        lines: [ "Dad said we'd be quick. That was two hours ago.", "I've counted every tile on this floor. Twice." ]
    },
    iqueue_grumble_3: {
        lines: [ "I sell souvenirs outside, but even I had to queue!", "The view better be worth this wait." ]
    },
    iqueue_grumble_4: {
        lines: [ "Excuse me, no cutting! I've been here since noon.", "Unless you have a Fast Pass, of course..." ]
    },
    iqueue_grumble_5: {
        lines: [ "My friend got a Fast Pass and she's already at the top!", "I should have planned better..." ]
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
    higgins_paintings_hint: {
        lines: [
            "Oh, one more thing! The paintings in the gallery — the Beaumont Collection ones —",
            "they're all scrambled! Madeleine rearranged them as a puzzle before she donated them.",
            "The catalog on the wall shows the correct order.",
            "Quite the prankster, your ancestor!"
        ]
    },
    higgins_paintings_done: {
        lines: [
            "The paintings are in order! Madeleine would be pleased.",
            "She always said art was the one thing that could never be lost in translation.",
            "A woman after my own heart, that Madeleine Beaumont."
        ],
        setsFlag: 'london_paintings_acknowledged'
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
    rossi_torch_hint: {
        lines: [
            "One more thing — Madeleine mapped these catacombs in 1925.",
            "She lit torches along the true path herself.",
            "If you find Marco down there, ask him about the torch patterns.",
            "The steady flames are Madeleine's — still burning after all these years."
        ]
    },
    rossi_torch_done: {
        lines: [
            "You followed Madeleine's torches through the catacombs!",
            "She mapped every tunnel. The map is still in our archives — we just never knew it was hers.",
            "What an incredible woman she was."
        ],
        setsFlag: 'rome_torch_acknowledged'
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
    fatima_after_amulet: {
        lines: [
            "I see you carry Nadia's amulet! She's been searching for it.",
            "The desert oasis is to the east — follow the path along the city wall.",
            "Nadia is kind. She will help you on your journey."
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
    youssef_after_amulet: {
        lines: [
            "You found the amulet! What a tale this will make!",
            "Nadia awaits at the oasis. Go east through the main square!",
            "The path to the desert is on the far east side of town."
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
    tariq_after_amulet: {
        lines: [
            "Is that the amulet? Nadia will be overjoyed!",
            "Hurry to the oasis — head east from the main square.",
            "You can't miss the path along the eastern edge of town."
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
    zahra_after_amulet: {
        lines: [
            "You found the amulet! Nadia will be so happy.",
            "She's been waiting at the desert oasis, east of the main square.",
            "Head back through the souk, then look for the path on the far east side of town."
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
    yuki_cat_hint: {
        lines: [
            "You know, Madeleine befriended a temple cat when she was here.",
            "An orange cat named Hana. She loved to explore the bamboo forest.",
            "The cats here are all Hana's descendants.",
            "Aiko's cat Mochi looks just like her — same orange fur, same curious eyes."
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
    },

    // === PUZZLE FEEDBACK ===
    bell_ring_gold: {
        lines: ["*DONG* The gold bell rings with a deep, warm tone."]
    },
    bell_ring_silver: {
        lines: ["*DING* The silver bell chimes with a bright, clear note."]
    },
    bell_ring_bronze: {
        lines: ["*BONG* The bronze bell resonates with a rich, mellow sound."]
    },
    bells_correct: {
        lines: [
            "The three bells ring in perfect harmony!",
            "A hidden compartment opens in the wall nearby...",
            "Inside, you find a folded note from Madeleine!",
            "The note reads: 'Music connects what words cannot. — Madeleine, 1923'"
        ],
        setsFlag: 'paris_bells_solved'
    },
    bells_wrong: {
        lines: [
            "The notes clash discordantly...",
            "That didn't sound right. Maybe there's a clue nearby about the correct order?"
        ]
    },
    painting_select: {
        lines: ["You examine the painting carefully. Select another painting to swap with it."]
    },
    paintings_correct: {
        lines: [
            "The paintings are in the correct order!",
            "A small drawer slides open beneath the display...",
            "You find a note: 'Art speaks across centuries. You see what I saw. — M.B., 1924'"
        ],
        setsFlag: 'london_paintings_solved'
    },
    paintings_wrong: {
        lines: ["The paintings have been swapped, but the order doesn't seem right yet."]
    },

    // === SIDE QUEST DIALOGS ===
    // Paris - Flower Deliveries
    colette_side_start: {
        lines: [
            "Oh, Léa! Could you do me a favour?",
            "I have three flower bouquets to deliver today, but I can't leave my stall.",
            "Sophie, Marie, and Monsieur Dupont each ordered one.",
            "Could you deliver them for me? I'd be so grateful!"
        ],
        setsFlag: 'side_paris_flowers_started',
        givesItem: { id: 'flower_bouquet', name: 'Flower Bouquets', icon: 'item_key', description: "Three bouquets for Sophie, Marie, and the Librarian." }
    },
    sophie_side_flower: {
        lines: [
            "Flowers from Colette? How lovely!",
            "Sunflowers are my favourite — she remembered!",
            "Tell Colette I said merci beaucoup!"
        ],
        setsFlag: 'side_flower_sophie'
    },
    marie_side_flower: {
        lines: [
            "Oh! Roses from Colette! They're perfect for my photos.",
            "I'll photograph them with the Eiffel Tower in the background.",
            "Thank you for delivering these!"
        ],
        setsFlag: 'side_flower_marie'
    },
    librarian_side_flower: {
        lines: [
            "Lavender! My favourite. Colette knows me well.",
            "Did you know Madeleine loved lavender too?",
            "She pressed a sprig inside every book she read.",
            "Thank you, Léa. Tell Colette the flowers are beautiful."
        ],
        setsFlag: 'side_flower_librarian'
    },
    colette_side_complete: {
        lines: [
            "You delivered all three? Wonderful!",
            "You're a natural errand-runner, Léa.",
            "You know, Madeleine used to buy flowers from my grandmother.",
            "She always said flowers are the universal language.",
            "Here — keep one bouquet for yourself. You've earned it!"
        ],
        setsFlag: 'side_paris_flowers_complete',
        removesItem: 'flower_bouquet'
    },

    // London - Bobby's Whistle
    bobby_side_start: {
        lines: [
            "Oh dear... I seem to have lost my whistle!",
            "It's not just any whistle — it was my grandfather's.",
            "He was a bobby too, you know. Fifty years on the beat!",
            "I think I dropped it when I visited the museum basement.",
            "Could you look for it? I can't go down there without a Research Pass."
        ],
        setsFlag: 'side_london_whistle_started'
    },
    bobby_side_return: {
        lines: [
            "My grandfather's whistle! You found it!",
            "Oh, thank you so much! I was worried sick.",
            "You know, your great-great-grandmother Madeleine once helped my grandfather too.",
            "He told me the story when I was little...",
            "She returned a lost badge to him in 1924. Small world, isn't it?",
            "Thank you, Léa. You're just like her."
        ],
        setsFlag: 'side_london_whistle_complete',
        removesItem: 'whistle'
    },
    bobby_madeleine_story: {
        lines: [
            "Did I ever tell you about Madeleine and my grandfather?",
            "He was guarding the museum when a young French woman approached.",
            "She'd found his badge in the street and walked two miles to return it!",
            "He said she had 'the heart of a lion and the smile of a summer day.'",
            "That was your Madeleine. Quite a lady."
        ]
    },

    // Rome - Enzo's Music Sheets
    enzo_side_start: {
        lines: [
            "Oh no, oh no, oh no!",
            "I've lost three pages of my best composition!",
            "The wind scattered them when I was playing near the Colosseum.",
            "One blew into the arena, one into the catacombs...",
            "And I think Giulia picked one up. Could you find them for me?",
            "This piece is special — it's based on a melody my grandfather Giovanni wrote!"
        ],
        setsFlag: 'side_rome_music_started'
    },
    giulia_side_sheet: {
        lines: [
            "This music sheet? I found it blowing down the street!",
            "It looked too beautiful to leave on the ground.",
            "The melody is lovely — tell Enzo I'd love to hear him play it!"
        ],
        givesItem: { id: 'music_sheet_3', name: 'Music Sheet (3/3)', icon: 'item_letter', description: "A page of violin music." },
        setsFlag: 'side_has_sheet_3'
    },
    enzo_side_return: {
        lines: [
            "All three sheets! You found them all!",
            "Let me play it for you...",
            "♪ ♫ ♪ ... A beautiful melody fills the air...",
            "My grandfather Giovanni wrote this when he met a French explorer.",
            "She told him music was the language that needs no translation.",
            "That explorer was Madeleine Beaumont — your great-great-grandmother!",
            "Thank you, Léa. This music connects us across time."
        ],
        setsFlag: 'side_rome_music_complete',
        removesItem: 'music_sheet_1'
    },
    enzo_plays_song: {
        lines: [
            "♪ ♫ ♪ ... The melody of Madeleine and Giovanni...",
            "Every note tells a story of two people who spoke different languages,",
            "but understood each other perfectly through music.",
            "Madeleine would be proud to know the song lives on."
        ]
    },

    // Marrakech - Fatima's Stories
    fatima_side_start: {
        lines: [
            "Ah, Léa! I am writing a book of stories from Marrakech.",
            "But my old legs can't carry me around the medina like they used to.",
            "Could you collect stories for me?",
            "Talk to Amina, Karim, and Zahra — each has a tale worth telling.",
            "Then come back and share them with me!"
        ],
        setsFlag: 'side_marrakech_stories_started'
    },
    amina_side_story: {
        lines: [
            "A story for Fatima? I know a good one!",
            "My grandmother said that on the night of the full moon,",
            "the fountains of Marrakech whisper the names of everyone who ever drank from them.",
            "She said if you listen carefully, you can hear Madeleine's name.",
            "Tell Fatima — she'll love that one!"
        ],
        setsFlag: 'side_story_amina'
    },
    karim_side_story: {
        lines: [
            "A story? Hmm... Here's one about my spices.",
            "Long ago, a merchant traveled the Silk Road carrying one precious saffron flower.",
            "He planted it here in Marrakech, and from that single flower,",
            "grew the entire saffron trade of Morocco!",
            "My family has tended those fields for generations. Tell Fatima!"
        ],
        setsFlag: 'side_story_karim'
    },
    zahra_side_story: {
        lines: [
            "A story about the riad? Of course!",
            "This building was once a meeting place for explorers from all over the world.",
            "They would share maps, stories, and dreams under these stars.",
            "Your great-great-grandmother Madeleine sat in this very courtyard.",
            "She said: 'The best stories are the ones that bring people together.'",
            "Please tell Fatima — she knew Madeleine too."
        ],
        setsFlag: 'side_story_zahra'
    },
    fatima_side_complete: {
        lines: [
            "Three wonderful stories! Amina, Karim, Zahra — all magnificent!",
            "You know, I once knew a storyteller even better than me.",
            "Madeleine Beaumont came to my mother's house when I was a little girl.",
            "She told us about Paris, London, Rome... places I'd never seen.",
            "She made the whole world feel close, like it was just next door.",
            "Her stories changed my life. That's why I became a storyteller too.",
            "Thank you, Léa. You carry her gift."
        ],
        setsFlag: 'side_marrakech_stories_complete'
    },
    fatima_madeleine_tale: {
        lines: [
            "Let me tell you one more story about Madeleine...",
            "When she came to Marrakech, she didn't speak a word of Arabic.",
            "But she sat in the market square and drew pictures in the dust.",
            "Children gathered around, then adults. Soon the whole square was watching!",
            "She drew the Eiffel Tower, Big Ben, the Colosseum...",
            "And everyone understood her perfectly. That is the power of stories."
        ]
    },

    // Tokyo - Aiko's Cat
    aiko_side_start: {
        lines: [
            "Oh no! My cat Mochi has escaped again!",
            "She loves chasing butterflies into the bamboo forest.",
            "But it's dangerous in there — the paths twist and turn!",
            "Could you bring her back if you find her?",
            "She's orange and fluffy. You can't miss her!",
            "She looks just like the cat in Yuki-san's old photos... the one Madeleine played with!"
        ],
        setsFlag: 'side_tokyo_cat_started'
    },
    aiko_side_return: {
        lines: [
            "Mochi! You found her! Oh, thank you, thank you!",
            "She looks like she had quite an adventure.",
            "Yuki-san says Mochi is descended from Madeleine's cat Hana.",
            "That's why she always runs to the sacred garden — it's in her blood!",
            "To say thank you, let me teach you something...",
            "In Japanese, we say 'Arigatou gozaimasu' — it means 'thank you very much.'",
            "And 'Tomodachi' means 'friend.' You are my tomodachi, Léa!",
            "Madeleine-san knew these words too. Yuki-san told me."
        ],
        setsFlag: 'side_tokyo_cat_complete',
        removesItem: 'cat_mochi'
    },

    // === TRADING CHAIN (Marrakech) ===
    karim_wants_scroll: {
        lines: [
            "Hmm, you want a rare spice? I might have something...",
            "But first, I need an ancient story scroll for my collection.",
            "Youssef the storyteller might have one. He collects old manuscripts."
        ],
        setsFlag: 'marrakech_karim_wants_scroll'
    },
    karim_trade: {
        lines: [
            "A story scroll! This is exactly what I was looking for!",
            "The calligraphy is exquisite... 14th century, I'd say.",
            "As promised, here is a bundle of my rarest spice — Star of the Atlas.",
            "It's worth more than gold in some places!"
        ],
        givesItem: { id: 'rare_spice', name: 'Star of the Atlas', icon: 'item_gem', description: "An extremely rare spice from the Atlas Mountains." },
        setsFlag: 'marrakech_trading_complete',
        removesItem: 'story_scroll'
    },
    tariq_wants_spice: {
        lines: [
            "A fine carpet, you say? I have the finest!",
            "But for my best carpet, I need a bundle of rare spice.",
            "Karim the spice merchant has what I need.",
            "Bring me a spice bundle and the carpet is yours!"
        ],
        setsFlag: 'marrakech_tariq_wants_spice'
    },
    tariq_trade: {
        lines: [
            "Ah, spice_bundle! These are excellent quality!",
            "Here is my finest carpet — woven with patterns from the Atlas Mountains.",
            "It's said that Madeleine once sat on this very carpet to read her maps!"
        ],
        givesItem: { id: 'fine_carpet', name: 'Fine Carpet', icon: 'item_book', description: "A beautifully woven carpet from Marrakech." },
        setsFlag: 'marrakech_has_carpet',
        removesItem: 'spice_bundle'
    },
    youssef_wants_carpet: {
        lines: [
            "A story scroll? I have a wonderful one!",
            "But I need a fine carpet to sit on when I tell my tales.",
            "Tariq the carpet merchant has the best. Bring me one of his carpets!"
        ],
        setsFlag: 'marrakech_youssef_wants_carpet'
    },
    youssef_trade: {
        lines: [
            "What a magnificent carpet! I'll look wonderful telling stories on this!",
            "As promised, here's an ancient story scroll.",
            "It tells the tale of a merchant princess who traveled the Silk Road.",
            "Take it to Karim — he's been looking for one like this."
        ],
        givesItem: { id: 'story_scroll', name: 'Story Scroll', icon: 'item_letter', description: "An ancient scroll with a tale from the Silk Road." },
        setsFlag: 'marrakech_has_scroll',
        removesItem: 'fine_carpet'
    },
    karim_gives_spice: {
        lines: [
            "You want to start the great trade? Very well!",
            "Here's a bundle of my finest spices to get you started.",
            "Take them to Tariq the carpet merchant — he's been asking for spices.",
            "He'll give you something good in return, and the trading goes round!"
        ],
        givesItem: { id: 'spice_bundle', name: 'Spice Bundle', icon: 'item_key', description: "A fragrant bundle of Moroccan spices." },
        setsFlag: 'marrakech_has_spice'
    },

    // === JOURNAL PAGE BONUS DIALOGS ===
    grandma_journal_bonus: {
        lines: [
            "You found Madeleine's diary pages! All three from Paris!",
            "I never knew she kept a diary... this is extraordinary.",
            "She writes about the Eiffel Tower, the bookshop, even the flower sellers.",
            "You know, she once told my mother: 'Paris is where every adventure begins.'",
            "I think she would have loved you, Léa."
        ],
        setsFlag: 'paris_bonus_seen'
    },
    curator_journal_bonus: {
        lines: [
            "Three diary pages from London? This is a major historical find!",
            "We knew Madeleine donated the Beaumont Collection, but we never knew why.",
            "These pages reveal she wanted to share her discoveries with the world.",
            "I shall add these to our archives — with your permission, of course!",
            "You've done remarkable work, young explorer."
        ],
        setsFlag: 'london_bonus_seen'
    },
    rossi_journal_bonus: {
        lines: [
            "Madeleine's diary entries from Rome! Incredible!",
            "She writes about the cats leading her to the catacombs!",
            "And a musician named Giovanni — could that be Enzo's grandfather?",
            "History is full of these beautiful connections.",
            "Thank you for bringing these to light, Léa."
        ],
        setsFlag: 'rome_bonus_seen'
    },
    hassan_journal_bonus: {
        lines: [
            "You found all her Marrakech diary pages? Mashallah!",
            "She writes about the colours, the spices, the stories...",
            "And the portal stone! My grandmother always said it was magic, but I thought she was just telling tales.",
            "Madeleine truly loved this city. She was one of us.",
            "May her memory be a blessing."
        ],
        setsFlag: 'marrakech_bonus_seen'
    },
    yuki_journal_bonus: {
        lines: [
            "All three diary pages from Tokyo... I can feel her spirit in these words.",
            "She writes about planting the cherry trees together with me... well, with my grandmother.",
            "The Yuki women have tended this garden for three generations.",
            "Madeleine's last entry is the most beautiful.",
            "'The greatest treasure is not what you find — it's what you learn along the way.'",
            "Wise words. Words to live by."
        ],
        setsFlag: 'tokyo_bonus_seen'
    }
};
