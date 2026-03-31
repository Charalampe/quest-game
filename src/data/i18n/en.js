export default {
    ui: {
        title: "The Locket\n  of Worlds",
        subtitle: "A Mystery Across the World",
        newGame: "New Game",
        continue: "Continue",
        version: "v1.0",
        hudHints: "I:Items Q:Quests M:Map",
        inventory: "INVENTORY",
        inventoryEmpty: "No items yet.\n\nExplore and talk to\npeople to find clues!",
        inventoryClose: "Press I to close",
        questLog: "QUEST LOG",
        questLogEmpty: "No active quests.\n\nTalk to people to\ndiscover adventures!",
        questLogClose: "Press Q to close",
        worldMap: "WORLD MAP",
        selectDestination: "Select a destination",
        worldMapHint: "Click a city or press ESC to return",
        travelTo: "Travel to {city}",
        youMarker: "YOU",
        routeLocked: "Route locked",
        routeLockedHint: "You need to unlock this travel method first",
        noDirectRoute: "No direct route to {city}",
        noDirectRouteHint: "Try traveling through another city",
        travelingBy: "Traveling by {route}...",
        noTravelRoutes: "You haven't unlocked any travel routes yet.",
        cancel: "Cancel",
        chestEmpty: "The chest is empty.",
        chestLocked: "The chest is locked.",
        chestFound: "Found: {name}!",
        portalActive: "The portal shimmers with magical energy. Where do you want to go?",
        portalInactive: "A strange shimmer hangs in the air, but nothing happens...",
        signDefault: "A weathered sign.",
        objectiveComplete: "Objective complete!",
        newDestination: "New destination: {city}!",
        congratulations: "Congratulations! You found the treasure!",
        gotItem: "Got: {name}",
        doorLocked: "The door is locked.",
        doorEnter: "You enter the building...",
        fallbackDialog: "..."
    },
    travel: {
        eurostar: "Eurostar Train",
        nightTrain: "Night Train",
        trainViaParis: "Train via Paris",
        boatMediterranean: "Boat across Mediterranean",
        boatItaly: "Boat to Italy",
        magicPortal: "Magic Portal"
    },
    signs: {
        paris_sign_4_12: "Librairie du Pont - Books & Maps",
        paris_sign_27_12: "Grand-m\u00E8re's House",
        paris_eiffel_top_sign_6_1: "Madeleine Beaumont visited this tower in 1923",
        paris_eiffel_ground_sign_10_1: "Eiffel Tower - Express Queue",
        london_sign_14_5: "The British Museum - Est. 1753",
        london_museum_hall_sign_11_1: "British Museum - Founded 1753",
        london_museum_gallery_sign_10_1: "Gallery of Ancient Civilizations",
        london_museum_basement_sign_8_1: "Beaumont Collection - Donated 1935",
        rome_sign_14_9: "Fontana di Trevi - Make a Wish",
        rome_colosseum_sign_11_1: "The Colosseum - Built 70-80 AD",
        rome_catacombs_upper_sign_9_1: "Ancient passages — proceed with caution",
        rome_catacombs_lower_sign_7_1: "Only the worthy shall find what was lost — M.B.",
        marrakech_sign_23_7: "Merchant of Wonders",
        tokyo_sign_14_5: "Secret Garden - Enter with Care",
        tokyo_shrine_sign_5_4: "'Wisdom completes what patience and courage begin.'"
    },
    cities: {
        paris: "The City of Light",
        london: "The Old Smoke",
        rome: "The Eternal City",
        marrakech: "The Red City",
        tokyo: "The City of Harmony"
    },
    items: {
        locket: { name: "Mysterious Locket", description: "An ornate golden locket with a coded message inside." },
        letter: { name: "Madeleine's Letter", description: "A letter of introduction written by Madeleine Beaumont." },
        map_fragment: { name: "Map Fragment", description: "A piece of an ancient map pointing to Rome." },
        key: { name: "Ancient Key", description: "A small ornate key with a compass rose engraving." },
        journal: { name: "Explorer's Journal", description: "Madeleine's journal with the final clue." },
        coin: { name: "Old Coin", description: "An old French coin with a compass rose engraved on it." },
        book: { name: "Hidden Book", description: "A book hidden behind the fountain with notes about Marrakech." },
        gem: { name: "Gem of Understanding", description: "A magical gem that lets you understand any language. The greatest treasure!" },
        paintbrush: { name: "Paintbrush", description: "Pierre's lost paintbrush." },
        fastpass: { name: "Fast Pass", description: "An express ticket to skip the Eiffel Tower queue." },
        eiffel_letter: { name: "Madeleine's Letter", description: "A letter found at the top of the Eiffel Tower, written by Madeleine Beaumont." },
        reading_glasses: { name: "Reading Glasses", description: "Professor Higgins' lost spectacles." },
        research_pass: { name: "Research Pass", description: "Grants access to the museum basement archive." },
        amulet: { name: "Nadia's Amulet", description: "A family heirloom lost in the riad courtyard." },
        portal_stone: { name: "Portal Stone", description: "A magical stone that activates portal travel." },
        jade_key: { name: "Jade Key", description: "A beautiful jade key that opens the sacred garden gate." }
    },
    quests: {
        main_quest: {
            name: "The Locket of Worlds",
            description: "Follow the trail of Madeleine Beaumont's hidden treasure across the world.",
            objectives: {
                paris_find_locket: { text: "Find the mysterious locket in Paris", hint: "Visit Grand-m\u00E8re Elise in eastern Paris." },
                paris_find_paintbrush: { text: "Find Pierre's lost paintbrush", hint: "Talk to Madame Colette in the market square." },
                paris_return_paintbrush: { text: "Return the paintbrush to Pierre", hint: "Pierre is near the Eiffel Tower plaza." },
                paris_find_letter: { text: "Find the letter at the top of the Eiffel Tower", hint: "Show the Fast Pass to the attendant." },
                paris_visit_librarian: { text: "Show the locket to the librarian", hint: "Visit Monsieur Dupont at the bookshop near the Seine." },
                london_talk_curator: { text: "Visit Dr. Wellington at the British Museum", hint: "Enter through the museum entrance." },
                london_find_glasses: { text: "Find the professor's reading glasses", hint: "Talk to Thomas in the gallery." },
                london_return_glasses: { text: "Return glasses to Professor Higgins", hint: "The professor is in the gallery." },
                london_find_map: { text: "Find the map fragment in the basement", hint: "Open the chest in the basement archive." },
                rome_talk_historian: { text: "Investigate the Trevi Fountain in Rome", hint: "Talk to Professoressa Rossi near the fountain." },
                rome_open_chest: { text: "Use the key to unlock the fountain secret", hint: "Open the chest near the fountain." },
                marrakech_find_journal: { text: "Find Madeleine's journal in Marrakech", hint: "Show the locket to Hassan the merchant." },
                marrakech_find_amulet: { text: "Find Nadia's amulet in the Riad", hint: "Search the hidden riad courtyard." },
                marrakech_return_amulet: { text: "Return the amulet to Nadia", hint: "Nadia is at the desert oasis." },
                marrakech_get_portal: { text: "Get the Portal Stone", hint: "Open the chest in the oasis." },
                tokyo_solve_riddle: { text: "Solve the shrine riddle", hint: "Learn proverbs from Hiro and Aiko." },
                tokyo_talk_gardener: { text: "Find the secret garden keeper in Tokyo", hint: "Show the journal to Yuki-san in the garden." },
                tokyo_find_treasure: { text: "Discover the treasure", hint: "Open the chest in the secret garden." }
            }
        }
    },
    dialogues: {
        // === PARIS ===
        grandma_intro: [
            "Oh, L\u00E9a! Come here, my dear.",
            "I was cleaning the attic and found something extraordinary...",
            "This locket belonged to your great-great-grandmother, Madeleine Beaumont.",
            "She was a famous explorer! But her greatest discovery was never found...",
            "There's a coded message inside. Can you read it?",
            "'Where knowledge flows like the river, seek the keeper of stories.'",
            "That sounds like the old bookshop by the Seine! Go speak with Monsieur Dupont.",
            "But also... Madeleine's secret is said to be hidden at the top of the Eiffel Tower!"
        ],
        grandma_after_locket: [
            "Be careful out there, L\u00E9a!",
            "Madeleine's journal says the treasure is something truly special.",
            "Try visiting the Eiffel Tower — Pierre the artist near the plaza might help.",
            "I know you can find it. You have her spirit of adventure!"
        ],
        librarian_intro: [
            "Bonjour! Welcome to Librairie du Pont.",
            "We have books from all over the world. Feel free to browse!"
        ],
        librarian_with_letter: [
            "Mon Dieu! Is that... Madeleine's Letter from the Eiffel Tower?!",
            "I've read about this in the old archives!",
            "Madeleine Beaumont traveled the world collecting pieces of a map.",
            "Each piece leads to the next location...",
            "Let me see... Ah yes!",
            "'The guardian of history holds the first fragment, across the channel.'",
            "That must mean the British Museum in London!",
            "Show this letter to the curator there. It should help you gain access."
        ],
        librarian_after_quest: [
            "Safe travels, L\u00E9a! London awaits.",
            "Remember, the British Museum is your destination.",
            "Press M to open the world map when you're ready to travel."
        ],
        sophie_intro: [
            "Hi there! I'm Sophie. I love exploring Paris!",
            "Have you visited the Eiffel Tower? It's just north of here.",
            "There's also a beautiful park to the northwest.",
            "Tip: Use WASD or arrow keys to move, and SPACE to interact!"
        ],
        sophie_after_quest: [
            "I heard you're going on an adventure! How exciting!",
            "I wish I could come along. Be sure to tell me all about it!",
            "Press I to check your inventory, and Q for your quest log."
        ],

        // New Paris NPCs
        pierre_intro: [
            "Bonjour! I'm Pierre, a street artist.",
            "I love painting the Eiffel Tower, but I've lost my paintbrush!",
            "I think I dropped it near the market square...",
            "If you find it, I could help you with something in return.",
            "I have connections at the tower — I could get you a Fast Pass!"
        ],
        pierre_has_brush: [
            "My paintbrush! You found it! Merci beaucoup!",
            "As promised, here's a Fast Pass for the Eiffel Tower.",
            "Skip the queue and go right to the top!",
            "Show it to the attendant at the tower entrance."
        ],
        pierre_after_fastpass: [
            "The view from the top is magnifique!",
            "I hope you find what you're looking for up there."
        ],

        colette_intro: [
            "Welcome to my flower stall! The freshest blooms in Paris!",
            "Oh, what's that on the ground? A paintbrush!",
            "It must belong to that artist, Pierre. He's always losing things.",
            "Here, take it. I'm sure he'll be grateful!"
        ],
        colette_after: [
            "Such beautiful flowers today! Pierre should paint them.",
            "He's usually near the Eiffel Tower plaza."
        ],

        tourist_claude_intro: [
            "This queue is insane! I've been waiting for hours!",
            "They say you need a Fast Pass to skip ahead.",
            "Maybe that artist in the main square knows someone..."
        ],
        attendant_intro: [
            "Welcome to the Eiffel Tower!",
            "I'm afraid the regular queue is very long today.",
            "If you have a Fast Pass, you can go right through!"
        ],
        attendant_with_pass: [
            "A Fast Pass! Excellent, go right ahead!",
            "The stairs to the first floor are just through here.",
            "Enjoy the view!"
        ],

        marie_intro: [
            "Oh, the view from here is incredible!",
            "I'm a photographer. I come here every week.",
            "I heard there's something special at the very top...",
            "An old sign from decades ago. Some kind of memorial."
        ],

        // === LONDON ===
        curator_intro: [
            "Welcome to the British Museum. Please don't touch the exhibits.",
            "We have artifacts from every corner of the world."
        ],
        curator_with_letter: [
            "What's this? A letter from... Madeleine Beaumont?!",
            "Extraordinary! I thought these were just legends.",
            "Yes, we do have a map fragment in our archives.",
            "It's in the basement, but the archive is restricted.",
            "You'll need a Research Pass to get in.",
            "Professor Higgins in the gallery might be able to help.",
            "He's the only one authorized to issue passes."
        ],
        curator_after_quest: [
            "The map points to Rome. The Colosseum specifically.",
            "Madeleine was brilliant at hiding her clues in plain sight.",
            "Good luck, young explorer!"
        ],
        guard_intro: [
            "No running in the museum, please.",
            "The basement archive is off-limits without a Research Pass."
        ],
        guard_with_pass: [
            "A Research Pass? Let me see... Yes, this is valid.",
            "You may enter the basement archive. Be careful down there!"
        ],
        emma_intro: [
            "Hello! Are you visiting London?",
            "The museum is amazing. Dr. Wellington knows everything about ancient explorers.",
            "If you have something interesting, definitely show it to her!",
            "The museum entrance is just north of here."
        ],

        bobby_intro: [
            "Good day! Welcome to London!",
            "The British Museum is just up the road. Quite impressive, I must say.",
            "If you need directions, just ask!"
        ],
        pemberton_intro: [
            "Oh dear, would you like a cup of tea?",
            "That professor at the museum is always losing his reading glasses.",
            "I saw a young boy pick them up in the gallery earlier."
        ],
        olivia_intro: [
            "Welcome to the museum gift shop!",
            "We have replicas of all the famous artifacts.",
            "Professor Higgins has been squinting at his books all day. Poor man needs his glasses!"
        ],

        higgins_intro: [
            "Hmm... I can't read a thing without my spectacles!",
            "I lost them somewhere in this gallery.",
            "If you could find them, I'd be most grateful.",
            "I could even write you a Research Pass for the archives."
        ],
        higgins_with_glasses: [
            "My glasses! Oh, wonderful! I can see again!",
            "As promised, here's a Research Pass for the basement archive.",
            "The Beaumont Collection is in the far corner. Good luck!"
        ],
        higgins_after: [
            "The Beaumont Collection in the basement is fascinating.",
            "Donated anonymously in 1935. Nobody knows who brought it."
        ],

        thomas_intro: [
            "Hey! I'm on a school trip. This museum is HUGE!",
            "I found these funny glasses on a bench. They look old.",
            "Are they yours? No? Well, here — you can have them!",
            "I don't want to get in trouble for taking them."
        ],
        thomas_after: [
            "The Egyptian section is so cool!",
            "I want to be an archaeologist when I grow up!"
        ],

        // === ROME ===
        rossi_intro: [
            "Buongiorno! Welcome to the Colosseum!",
            "This arena has seen thousands of years of history."
        ],
        rossi_with_map: [
            "A map fragment? From the Beaumont collection?!",
            "I am a historian specializing in women explorers. This is incredible!",
            "The map mentions a secret passage beneath the Colosseum.",
            "I've been searching for it for years!",
            "Here, take this ancient key. I found it near the arena floor.",
            "It might open the passage to the catacombs below.",
            "Bianca and her cats seem to know where the door is..."
        ],
        rossi_after_key: [
            "Use the key on the locked door in the Colosseum!",
            "The catacombs beneath should hold Madeleine's secret."
        ],
        rossi_after_quest: [
            "Marrakech! What an adventure!",
            "The ancient trade routes connected Rome to North Africa.",
            "Madeleine must have taken a boat across the Mediterranean."
        ],
        marco_intro: [
            "Ciao! I'm an archaeology student exploring these tunnels.",
            "The lower catacombs are just ahead — follow the torches.",
            "Be careful, the passages are narrow and dark.",
            "I saw a chest in the deepest chamber. It looks very old!"
        ],
        giulia_intro: [
            "Welcome to Rome! The Eternal City!",
            "Every stone here tells a story thousands of years old.",
            "If you're looking for secrets, the Colosseum is the place!",
            "There's a door on the main road that leads inside."
        ],

        lorenzo_intro: [
            "Ciao! Best gelato in Rome, right here!",
            "You know, I've heard strange music coming from under the Colosseum.",
            "The old legends say there are tunnels underneath.",
            "Talk to Professoressa Rossi in the Colosseum — she knows all about it."
        ],
        enzo_intro: [
            "\u266A La la la... Oh! You startled me!",
            "I'm Enzo. I play violin near the ancient ruins.",
            "I've heard about a secret door in the Colosseum.",
            "They say it has a keyhole shaped like a flower — a compass rose!"
        ],
        alessandra_intro: [
            "Welcome to the Colosseum! I'm your tour guide.",
            "This arena could hold 50,000 spectators!",
            "The catacombs below were where gladiators prepared for battle.",
            "Some say there are still undiscovered passages..."
        ],
        bianca_intro: [
            "Shhh... don't scare the cats!",
            "I feed them here every day. They know every secret of this place.",
            "My cat Nero keeps going to that wall on the right side...",
            "It's like there's something behind it. A door, maybe?"
        ],

        // === MARRAKECH ===
        hassan_intro: [
            "Welcome, welcome! The finest treasures of the Sahara!",
            "Spices, fabrics, jewels \u2014 anything your heart desires!"
        ],
        hassan_with_locket: [
            "Wait... that symbol on your locket...",
            "I have seen it before! My grandmother showed me.",
            "A woman came here many years ago. Madeleine, she was called.",
            "She left something with my family for safekeeping.",
            "A journal! Here it is.",
            "Inside, there's a strange drawing of a desert oasis...",
            "They say a guide named Nadia knows where it is.",
            "But she lost her grandmother's amulet. Maybe you can help?"
        ],
        hassan_after_quest: [
            "The journal speaks of a desert oasis and a portal stone.",
            "Find Nadia's amulet, and she will guide you there.",
            "May your journey be blessed, young explorer."
        ],
        fatima_intro: [
            "Ah, a young traveler! Sit, sit.",
            "Let me tell you the story of the Red City...",
            "Marrakech has been a meeting place of cultures for centuries.",
            "If you seek something, enter the Grand Souk to the south. Hassan knows everyone."
        ],
        fatima_after_amulet: [
            "I see you carry Nadia's amulet! She's been searching for it.",
            "The desert oasis is to the east \u2014 follow the path along the city wall.",
            "Nadia is kind. She will help you on your journey."
        ],
        amina_intro: [
            "Hi! I'm Amina. The medina is like a maze, isn't it?",
            "Don't worry, you can't really get lost. The paths always lead back to the square!",
            "The Grand Souk entrance is just south of the market area."
        ],

        karim_intro: [
            "Welcome! The finest spices in all of Morocco!",
            "Cinnamon, saffron, turmeric — you name it!",
            "Looking for Hassan? He's deep in the Grand Souk.",
            "Enter through the south door of the market."
        ],
        youssef_intro: [
            "Gather round, gather round! Let me tell you a tale...",
            "Of a magical oasis hidden in the desert!",
            "They say a guide named Nadia knows the way.",
            "But she lost her grandmother's amulet in the old riad.",
            "Find it, and perhaps she will trust you."
        ],
        youssef_after_amulet: [
            "You found the amulet! What a tale this will make!",
            "Nadia awaits at the oasis. Go east through the main square!",
            "The path to the desert is on the far east side of town."
        ],
        tariq_intro: [
            "The finest carpets in all of Marrakech!",
            "You look like you're searching for something...",
            "Nadia? Yes, I know her. She's the desert guide.",
            "But she's been sad — lost her grandmother's amulet.",
            "Someone said it fell in the old riad courtyard nearby."
        ],
        tariq_after_amulet: [
            "Is that the amulet? Nadia will be overjoyed!",
            "Hurry to the oasis \u2014 head east from the main square.",
            "You can't miss the path along the eastern edge of town."
        ],
        zahra_intro: [
            "Welcome to the hidden riad. So few visitors find this place.",
            "I maintain this old building. It has a beautiful fountain.",
            "I saw something shiny near the fountain the other day...",
            "A little amulet, perhaps? Check near the water."
        ],
        zahra_after_amulet: [
            "You found the amulet! Nadia will be so happy.",
            "She's been waiting at the desert oasis, east of the main square.",
            "Head back through the souk, then look for the path on the far east side of town."
        ],

        nadia_intro: [
            "Welcome to the oasis. The desert is beautiful, isn't it?",
            "But I'm afraid I can't help you right now.",
            "I lost my grandmother's amulet... it means everything to me."
        ],
        nadia_with_amulet: [
            "My grandmother's amulet! You found it!",
            "Thank you so much! I thought it was gone forever.",
            "You wanted to find the portal stone? Let me show you.",
            "It's right here in the oasis. Madeleine hid it long ago.",
            "Open the chest — the portal stone is inside.",
            "It will activate the magical portal. Use it well!"
        ],
        nadia_after: [
            "The portal stone is powerful. It connects distant places.",
            "Madeleine used it to travel the world in the blink of an eye.",
            "Be brave, young explorer. Tokyo awaits!"
        ],

        // === TOKYO ===
        yuki_intro: [
            "Welcome to the bamboo forest. Few visitors find this place.",
            "The garden beyond is sacred. It holds ancient secrets."
        ],
        yuki_with_journal: [
            "You carry Madeleine's journal? Then you are the one.",
            "She planted the cherry trees in the sacred garden herself.",
            "To enter, you'll need the Jade Key.",
            "Here — I've been keeping it safe for the right person.",
            "The gate to the sacred garden is just ahead."
        ],
        yuki_after_quest: [
            "You found it! The treasure of Madeleine Beaumont!",
            "A gem that lets you understand any language in the world.",
            "She always said the greatest treasure is understanding between people.",
            "Your adventure has just begun, L\u00E9a. The world is full of wonders!"
        ],
        takeshi_intro: [
            "Peace be with you, traveler.",
            "This shrine has stood for a thousand years.",
            "The shrine to the south holds a riddle you must solve.",
            "Seek wisdom from Hiro and Aiko before you enter."
        ],
        sakura_intro: [
            "Konnichiwa! Welcome to Tokyo!",
            "The shrine entrance is on the main south path.",
            "They say a French explorer left something special here long ago.",
            "Talk to the locals — they might know parts of the riddle!"
        ],

        hiro_intro: [
            "Welcome to my ramen shop! Best noodles in Tokyo!",
            "You want to enter the shrine? You'll need the riddle answer.",
            "Here's a proverb my grandfather taught me:",
            "'Patience is the key that unlocks all doors.'",
            "That's the first part. Aiko knows the second!"
        ],
        aiko_intro: [
            "Oh! You want to solve the shrine riddle?",
            "I drew it in my manga once! Here, look at this page.",
            "'Courage lights the path through darkness.'",
            "That's the second part! The third is written on a sign in the shrine.",
            "Tanaka the shrine keeper will ask for all three parts."
        ],

        tanaka_intro: [
            "Welcome to the sacred shrine.",
            "To pass through the sealed door, you must answer the riddle.",
            "Three proverbs, three truths. Do you know them all?"
        ],
        tanaka_riddle_complete: [
            "'Patience, Courage, and Wisdom.'",
            "Yes! Those are the three truths!",
            "The sealed door is now open. You may enter the bamboo forest.",
            "Be careful — the forest is enchanted. Follow the fox if you get lost."
        ],
        tanaka_waiting: [
            "You don't seem to have all three parts of the riddle yet.",
            "Seek wisdom from the people of Tokyo.",
            "Also, read the sign here in the shrine for the third part."
        ],

        fox_intro: [
            "...",
            "The spirit fox watches you with ancient eyes.",
            "It gestures toward the clearing ahead.",
            "Follow the lanterns... Yuki-san waits for you there."
        ],

        madeleine_intro: [
            "L\u00E9a... my dear great-great-granddaughter.",
            "You found me. After all these years...",
            "I planted these cherry trees when I was young, full of wonder.",
            "The treasure I left is not gold or jewels.",
            "It is the Gem of Understanding — the power to connect with all people.",
            "The world is vast and beautiful, L\u00E9a.",
            "Never stop exploring. Never stop being curious.",
            "I am so proud of you."
        ]
    }
};
