export default {
    ui: {
        title: "The Locket\n  of Worlds",
        subtitle: "A Mystery Across the World",
        newGame: "New Game",
        continue: "Continue",
        version: "v1.0",
        hudHints: "I:Items Q:Quests J:Journal M:Map",
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
        fallbackDialog: "...",
        journal: "LEA'S JOURNAL",
        journalEmpty: "No entries yet.\n\nYour journal will fill\nas you explore!",
        journalClose: "Press J to close",
        journalPageFound: "Found: Madeleine's diary page!",
        journalPageAlready: "You've already read this page.",
        journalPagesCount: "Diary Pages: {found}/{total}",
        journalBonusUnlocked: "All pages found in {city}! Talk to {npc} for a surprise!",
        tapToClose: "Tap X to close",
        back: "Back",
        sideQuestLabel: "\u2726 Side Quest",
        bellRingGold: "*DONG* The gold bell rings with a deep, warm tone.",
        bellRingSilver: "*DING* The silver bell chimes with a bright, clear note.",
        bellRingBronze: "*BONG* The bronze bell resonates with a rich, mellow sound.",
        bellsCorrect: "The three bells ring in perfect harmony!",
        bellsWrong: "The notes clash discordantly... Try a different order.",
        paintingSelect: "You examine the painting. Select another to swap.",
        paintingsCorrect: "The paintings are in the correct order!",
        paintingsWrong: "The paintings have been swapped, but the order doesn't seem right yet.",
        hiddenItemCollected: "Found: {name}!"
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
        tokyo_shrine_sign_5_4: "'Wisdom completes what patience and courage begin.'",
        paris_sign_3_27: "The Three Bells of the Bookshop: Ring Gold, then Silver, then Bronze to hear the harmony.",
        london_museum_gallery_sign_5_1: "Gallery Catalog: Greek Vase, Egyptian Mask, Roman Coin, Celtic Shield."
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
        jade_key: { name: "Jade Key", description: "A beautiful jade key that opens the sacred garden gate." },
        whistle: { name: "Whistle", description: "A brass police whistle." },
        music_sheet_1: { name: "Music Sheet (1/3)", description: "A page of violin music." },
        music_sheet_2: { name: "Music Sheet (2/3)", description: "A page of violin music." },
        music_sheet_3: { name: "Music Sheet (3/3)", description: "A page of violin music." },
        spice_bundle: { name: "Spice Bundle", description: "A fragrant bundle of Moroccan spices." },
        fine_carpet: { name: "Fine Carpet", description: "A beautifully woven carpet from Marrakech." },
        story_scroll: { name: "Story Scroll", description: "An ancient scroll with a tale from the Silk Road." },
        rare_spice: { name: "Star of the Atlas", description: "An extremely rare spice from the Atlas Mountains." },
        flower_bouquet: { name: "Flower Bouquets", description: "Three bouquets for Sophie, Marie, and the Librarian." },
        cat_mochi: { name: "Mochi the Cat", description: "Aiko's fluffy orange cat." }
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
        },
        paris_flowers: {
            name: "Flower Deliveries",
            description: "Help Colette deliver flowers to her friends around Paris."
        },
        london_whistle: {
            name: "Bobby's Whistle",
            description: "Bobby lost his whistle somewhere in the museum basement."
        },
        rome_music: {
            name: "Enzo's Music Sheets",
            description: "Help Enzo find his lost music sheets scattered around Rome."
        },
        marrakech_stories: {
            name: "Fatima's Stories",
            description: "Help Fatima collect stories from people around Marrakech."
        },
        tokyo_cat: {
            name: "Aiko's Lost Cat",
            description: "Help Aiko find her cat Mochi who wandered into the bamboo forest."
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
        librarian_with_locket: [
            "Oh! You must be Elise's granddaughter \u2014 L\u00E9a, isn't it?",
            "I knew your great-great-grandmother Madeleine well... through her books, of course!",
            "The Beaumonts were a family of explorers. Quite remarkable, really.",
            "There's an old legend among us booksellers... They say Madeleine hid something at the very top of the Eiffel Tower.",
            "Nobody ever found it. But with that locket of hers... who knows?",
            "If you ever find anything up there, bring it to me. Old letters are my specialty!"
        ],
        librarian_progress: [
            "Back already? Have you been to the top of the tower yet?",
            "I keep thinking about that old legend... Madeleine's hidden letter.",
            "If it exists, I'd love to see it. I can read old scripts that most people can't!"
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
        queue_grumble_1: [
            "Ugh, I've been standing here since this morning!",
            "At this rate I'll see the tower at sunset..."
        ],
        queue_grumble_2: [
            "My feet are killing me...",
            "Is this line even moving?!"
        ],
        queue_grumble_3: [
            "I heard someone got a Fast Pass and skipped the whole queue!",
            "So unfair... or maybe so smart?"
        ],
        queue_grumble_4: [
            "*sigh* We should have come earlier.",
            "This is the longest queue I've ever seen."
        ],
        queue_grumble_5: [
            "Are we there yet? Are we there yet?",
            "Moooom, I'm bored!"
        ],
        queue_grumble_6: [
            "I could have climbed the tower by hand by now!",
            "Patience is a virtue... that I don't have."
        ],
        iqueue_grumble_1: [
            "Almost there... just a few more people ahead!",
            "I can practically see the ticket counter from here."
        ],
        iqueue_grumble_2: [
            "Dad said we'd be quick. That was two hours ago.",
            "I've counted every tile on this floor. Twice."
        ],
        iqueue_grumble_3: [
            "I sell souvenirs outside, but even I had to queue!",
            "The view better be worth this wait."
        ],
        iqueue_grumble_4: [
            "Excuse me, no cutting! I've been here since noon.",
            "Unless you have a Fast Pass, of course..."
        ],
        iqueue_grumble_5: [
            "My friend got a Fast Pass and she's already at the top!",
            "I should have planned better..."
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
            "It is the Gem of Understanding \u2014 the power to connect with all people.",
            "The world is vast and beautiful, L\u00E9a.",
            "Never stop exploring. Never stop being curious.",
            "I am so proud of you."
        ],

        // === JOURNAL PAGE BONUS DIALOGS ===
        grandma_journal_bonus: [
            "You found Madeleine's diary pages! All three from Paris!",
            "I never knew she kept a diary... this is extraordinary.",
            "She writes about the Eiffel Tower, the bookshop, even the flower sellers.",
            "You know, she once told my mother: 'Paris is where every adventure begins.'",
            "I think she would have loved you, L\u00E9a."
        ],
        curator_journal_bonus: [
            "Three diary pages from London? This is a major historical find!",
            "We knew Madeleine donated the Beaumont Collection, but we never knew why.",
            "These pages reveal she wanted to share her discoveries with the world.",
            "I shall add these to our archives \u2014 with your permission, of course!",
            "You've done remarkable work, young explorer."
        ],
        rossi_journal_bonus: [
            "Madeleine's diary entries from Rome! Incredible!",
            "She writes about the cats leading her to the catacombs!",
            "And a musician named Giovanni \u2014 could that be Enzo's grandfather?",
            "History is full of these beautiful connections.",
            "Thank you for bringing these to light, L\u00E9a."
        ],
        hassan_journal_bonus: [
            "You found all her Marrakech diary pages? Mashallah!",
            "She writes about the colours, the spices, the stories...",
            "And the portal stone! My grandmother always said it was magic, but I thought she was just telling tales.",
            "Madeleine truly loved this city. She was one of us.",
            "May her memory be a blessing."
        ],
        yuki_journal_bonus: [
            "All three diary pages from Tokyo... I can feel her spirit in these words.",
            "She writes about planting the cherry trees together with me... well, with my grandmother.",
            "The Yuki women have tended this garden for three generations.",
            "Madeleine's last entry is the most beautiful.",
            "'The greatest treasure is not what you find \u2014 it's what you learn along the way.'",
            "Wise words. Words to live by."
        ],

        // === PUZZLE FEEDBACK ===
        bell_ring_gold: ["*DONG* The gold bell rings with a deep, warm tone."],
        bell_ring_silver: ["*DING* The silver bell chimes with a bright, clear note."],
        bell_ring_bronze: ["*BONG* The bronze bell resonates with a rich, mellow sound."],
        bells_correct: [
            "The three bells ring in perfect harmony!",
            "A hidden compartment opens in the wall nearby...",
            "Inside, you find a folded note from Madeleine!"
        ],
        bells_wrong: [
            "The notes clash discordantly...",
            "That didn't sound right. Maybe there's a clue nearby about the correct order?"
        ],
        painting_select: ["You examine the painting carefully. Select another painting to swap with it."],
        paintings_correct: [
            "The paintings are in the correct order!",
            "A small drawer slides open beneath the display...",
            "You find a note: 'Order reveals truth \u2014 M.B.'"
        ],
        paintings_wrong: ["The paintings have been swapped, but the order doesn't seem right yet."],

        // === SIDE QUEST DIALOGS ===
        colette_side_start: [
            "Oh, L\u00E9a! Could you do me a favour?",
            "I have three flower bouquets to deliver today, but I can't leave my stall.",
            "Sophie, Marie, and Monsieur Dupont each ordered one.",
            "Could you deliver them for me? I'd be so grateful!"
        ],
        sophie_side_flower: [
            "Flowers from Colette? How lovely!",
            "Sunflowers are my favourite \u2014 she remembered!",
            "Tell Colette I said merci beaucoup!"
        ],
        marie_side_flower: [
            "Oh! Roses from Colette! They're perfect for my photos.",
            "I'll photograph them with the Eiffel Tower in the background.",
            "Thank you for delivering these!"
        ],
        librarian_side_flower: [
            "Lavender! My favourite. Colette knows me well.",
            "Did you know Madeleine loved lavender too?",
            "She pressed a sprig inside every book she read.",
            "Thank you, L\u00E9a. Tell Colette the flowers are beautiful."
        ],
        colette_side_complete: [
            "You delivered all three? Wonderful!",
            "You're a natural errand-runner, L\u00E9a.",
            "You know, Madeleine used to buy flowers from my grandmother.",
            "She always said flowers are the universal language.",
            "Here \u2014 keep one bouquet for yourself. You've earned it!"
        ],

        bobby_side_start: [
            "Oh dear... I seem to have lost my whistle!",
            "It's not just any whistle \u2014 it was my grandfather's.",
            "He was a bobby too, you know. Fifty years on the beat!",
            "I think I dropped it when I visited the museum basement.",
            "Could you look for it? I can't go down there without a Research Pass."
        ],
        bobby_side_return: [
            "My grandfather's whistle! You found it!",
            "Oh, thank you so much! I was worried sick.",
            "You know, your great-great-grandmother Madeleine once helped my grandfather too.",
            "He told me the story when I was little...",
            "She returned a lost badge to him in 1924. Small world, isn't it?",
            "Thank you, L\u00E9a. You're just like her."
        ],
        bobby_madeleine_story: [
            "Did I ever tell you about Madeleine and my grandfather?",
            "He was guarding the museum when a young French woman approached.",
            "She'd found his badge in the street and walked two miles to return it!",
            "He said she had 'the heart of a lion and the smile of a summer day.'",
            "That was your Madeleine. Quite a lady."
        ],

        enzo_side_start: [
            "Oh no, oh no, oh no!",
            "I've lost three pages of my best composition!",
            "The wind scattered them when I was playing near the Colosseum.",
            "One blew into the arena, one into the catacombs...",
            "And I think Giulia picked one up. Could you find them for me?",
            "This piece is special \u2014 it's based on a melody my grandfather Giovanni wrote!"
        ],
        giulia_side_sheet: [
            "This music sheet? I found it blowing down the street!",
            "It looked too beautiful to leave on the ground.",
            "The melody is lovely \u2014 tell Enzo I'd love to hear him play it!"
        ],
        enzo_side_return: [
            "All three sheets! You found them all!",
            "Let me play it for you...",
            "\u266A \u266B \u266A ... A beautiful melody fills the air...",
            "My grandfather Giovanni wrote this when he met a French explorer.",
            "She told him music was the language that needs no translation.",
            "That explorer was Madeleine Beaumont \u2014 your great-great-grandmother!",
            "Thank you, L\u00E9a. This music connects us across time."
        ],
        enzo_plays_song: [
            "\u266A \u266B \u266A ... The melody of Madeleine and Giovanni...",
            "Every note tells a story of two people who spoke different languages,",
            "but understood each other perfectly through music.",
            "Madeleine would be proud to know the song lives on."
        ],

        fatima_side_start: [
            "Ah, L\u00E9a! I am writing a book of stories from Marrakech.",
            "But my old legs can't carry me around the medina like they used to.",
            "Could you collect stories for me?",
            "Talk to Amina, Karim, and Zahra \u2014 each has a tale worth telling.",
            "Then come back and share them with me!"
        ],
        amina_side_story: [
            "A story for Fatima? I know a good one!",
            "My grandmother said that on the night of the full moon,",
            "the fountains of Marrakech whisper the names of everyone who ever drank from them.",
            "She said if you listen carefully, you can hear Madeleine's name.",
            "Tell Fatima \u2014 she'll love that one!"
        ],
        karim_side_story: [
            "A story? Hmm... Here's one about my spices.",
            "Long ago, a merchant traveled the Silk Road carrying one precious saffron flower.",
            "He planted it here in Marrakech, and from that single flower,",
            "grew the entire saffron trade of Morocco!",
            "My family has tended those fields for generations. Tell Fatima!"
        ],
        zahra_side_story: [
            "A story about the riad? Of course!",
            "This building was once a meeting place for explorers from all over the world.",
            "They would share maps, stories, and dreams under these stars.",
            "Your great-great-grandmother Madeleine sat in this very courtyard.",
            "She said: 'The best stories are the ones that bring people together.'",
            "Please tell Fatima \u2014 she knew Madeleine too."
        ],
        fatima_side_complete: [
            "Three wonderful stories! Amina, Karim, Zahra \u2014 all magnificent!",
            "You know, I once knew a storyteller even better than me.",
            "Madeleine Beaumont came to my mother's house when I was a little girl.",
            "She told us about Paris, London, Rome... places I'd never seen.",
            "She made the whole world feel close, like it was just next door.",
            "Her stories changed my life. That's why I became a storyteller too.",
            "Thank you, L\u00E9a. You carry her gift."
        ],
        fatima_madeleine_tale: [
            "Let me tell you one more story about Madeleine...",
            "When she came to Marrakech, she didn't speak a word of Arabic.",
            "But she sat in the market square and drew pictures in the dust.",
            "Children gathered around, then adults. Soon the whole square was watching!",
            "She drew the Eiffel Tower, Big Ben, the Colosseum...",
            "And everyone understood her perfectly. That is the power of stories."
        ],

        aiko_side_start: [
            "Oh no! My cat Mochi has escaped again!",
            "She loves chasing butterflies into the bamboo forest.",
            "But it's dangerous in there \u2014 the paths twist and turn!",
            "Could you bring her back if you find her?",
            "She's orange and fluffy. You can't miss her!"
        ],
        aiko_side_return: [
            "Mochi! You found her! Oh, thank you, thank you!",
            "She looks like she had quite an adventure.",
            "To say thank you, let me teach you something...",
            "In Japanese, we say 'Arigatou gozaimasu' \u2014 it means 'thank you very much.'",
            "And 'Tomodachi' means 'friend.' You are my tomodachi, L\u00E9a!",
            "Madeleine-san knew these words too. Yuki-san told me."
        ],

        // === TRADING CHAIN ===
        karim_wants_scroll: [
            "Hmm, you want a rare spice? I might have something...",
            "But first, I need an ancient story scroll for my collection.",
            "Youssef the storyteller might have one. He collects old manuscripts."
        ],
        karim_trade: [
            "A story scroll! This is exactly what I was looking for!",
            "The calligraphy is exquisite... 14th century, I'd say.",
            "As promised, here is a bundle of my rarest spice \u2014 Star of the Atlas.",
            "It's worth more than gold in some places!"
        ],
        karim_gives_spice: [
            "You want to start the great trade? Very well!",
            "Here's a bundle of my finest spices to get you started.",
            "Take them to Tariq the carpet merchant \u2014 he's been asking for spices.",
            "He'll give you something good in return, and the trading goes round!"
        ],
        tariq_wants_spice: [
            "A fine carpet, you say? I have the finest!",
            "But for my best carpet, I need a bundle of rare spice.",
            "Karim the spice merchant has what I need.",
            "Bring me a spice bundle and the carpet is yours!"
        ],
        tariq_trade: [
            "Ah, spice bundle! These are excellent quality!",
            "Here is my finest carpet \u2014 woven with patterns from the Atlas Mountains.",
            "It's said that Madeleine once sat on this very carpet to read her maps!"
        ],
        youssef_wants_carpet: [
            "A story scroll? I have a wonderful one!",
            "But I need a fine carpet to sit on when I tell my tales.",
            "Tariq the carpet merchant has the best. Bring me one of his carpets!"
        ],
        youssef_trade: [
            "What a magnificent carpet! I'll look wonderful telling stories on this!",
            "As promised, here's an ancient story scroll.",
            "It tells the tale of a merchant princess who traveled the Silk Road.",
            "Take it to Karim \u2014 he's been looking for one like this."
        ],

        // === CHOICE DIALOG LOCALIZATIONS ===
        pierre_has_brush_choice: {
            preamble: [
                "My paintbrush! You found it! Merci beaucoup!",
                "But tell me \u2014 how did you find it?"
            ],
            choices: [
                { text: "Colette at the flower stall had it!", response: ["Ah, Colette! She's always looking out for me.", "You know, she once found my entire paint set in her tulips!", "As promised, here's a Fast Pass for the Eiffel Tower.", "And a little secret \u2014 tell the photographer Marie I sent you. She knows the best views!"] },
                { text: "I just stumbled on it by accident.", response: ["Ha! Sometimes the best discoveries are accidents!", "That's what Madeleine always said too, you know.", "As promised, here's a Fast Pass for the Eiffel Tower.", "Show it to the attendant at the tower entrance."] },
                { text: "A little bird told me where to look!", response: ["Ha ha! A little bird? In Paris, even the pigeons are helpful!", "You remind me of someone... an explorer who came here long ago.", "As promised, here's a Fast Pass for the Eiffel Tower.", "Good luck up there \u2014 I have a feeling you'll find something special!"] }
            ]
        },
        thomas_intro_choice: {
            preamble: [
                "Hey! I'm on a school trip. This museum is HUGE!",
                "I found these funny glasses on a bench. They look old.",
                "I think they belong to that professor... but I'm nervous to return them.",
                "What should I do?"
            ],
            choices: [
                { text: "Don't worry, you did the right thing!", response: ["You think so? Thanks! That makes me feel better.", "Here, you can return them for me. Tell the professor Thomas found them!", "I want to be an archaeologist when I grow up.", "Finding things is what we do, right?"] },
                { text: "Professor Higgins really needs them back.", response: ["Yeah, you're right. He's been squinting at everything all day!", "Here, take them. I don't want to get in trouble.", "Good luck with your adventure \u2014 I can tell you're looking for something!"] },
                { text: "You could keep them as a souvenir...", response: ["Ha! Tempting, but... no, that wouldn't be right.", "My teacher says 'finders keepers' isn't how real explorers work.", "Here, you take them to the professor. I've got mummies to look at!"] }
            ]
        },
        hassan_with_locket_choice: {
            preamble: [
                "Wait... that symbol on your locket...",
                "I have seen it before! My grandmother showed me.",
                "A woman came here many years ago. Madeleine, she was called.",
                "She left something with my family for safekeeping.",
                "What would you like to know?"
            ],
            choices: [
                { text: "What was Madeleine like?", response: ["My grandmother said she was fearless! She arrived alone, speaking perfect Arabic.", "She drank mint tea with us for three days, telling stories of Paris and London.", "She laughed a lot. Grandmother said her laugh could fill the whole souk!", "Here \u2014 this is the journal she left. Inside, there's a drawing of a desert oasis.", "They say a guide named Nadia knows where it is.", "But she lost her grandmother's amulet. Maybe you can help?"] },
                { text: "What did she leave with you?", response: ["A journal! My family has guarded it for nearly 100 years.", "We promised Madeleine we would give it only to someone who carried the locket.", "And here you are! She must have known someone would come.", "Inside, there's a strange drawing of a desert oasis...", "They say a guide named Nadia knows where it is.", "But she lost her grandmother's amulet. Maybe you can help?"] },
                { text: "Why did she come to Marrakech?", response: ["She was following a map \u2014 pieces scattered across the world.", "But I think she also came for the stories. Marrakech is a city of stories.", "Every tile, every spice, every carpet has a tale to tell.", "She left this journal. Inside, there's a drawing of a desert oasis...", "They say a guide named Nadia knows where it is.", "But she lost her grandmother's amulet. Maybe you can help?"] }
            ]
        },
        tanaka_riddle_choice: {
            preamble: [
                "'Patience, Courage, and Wisdom.'",
                "You know the three truths! But here is the final test.",
                "What is the meaning of these three truths together?"
            ],
            choices: [
                { text: "Understanding others is the greatest strength.", response: ["Yes! That is the answer Madeleine herself gave!", "Patience to listen. Courage to reach out. Wisdom to understand.", "The sealed door is now open. You may enter the bamboo forest.", "Be careful \u2014 the forest is enchanted. Follow the fox if you get lost."] },
                { text: "They make you a great warrior.", response: ["Hmm... a warrior needs these, yes. But that is not the deepest meaning.", "Think about what connects patience, courage, and wisdom...", "Come back when you have reflected more deeply."] },
                { text: "They help you find treasure.", response: ["Treasure? Perhaps... but not the kind you might think!", "The real treasure is not gold or jewels. Think about people.", "Come back when you have a different answer."] }
            ]
        },
        tanaka_riddle_hint1: {
            preamble: [
                "You have returned. The three truths still await your answer.",
                "Remember: patience, courage, and wisdom together create something greater.",
                "What is it?"
            ],
            choices: [
                { text: "Understanding others is the greatest strength.", response: ["Yes! Now you see it!", "Patience to listen. Courage to reach out. Wisdom to understand.", "The sealed door is now open. You may enter the bamboo forest.", "Be careful \u2014 the forest is enchanted. Follow the fox if you get lost."] },
                { text: "They make you powerful.", response: ["Power alone is not the answer...", "Think about how patience, courage, and wisdom help you connect with others.", "Return when you are ready."] }
            ]
        },
        tanaka_riddle_hint2: {
            preamble: [
                "Welcome back. Let us try again.",
                "The treasure Madeleine sought was not material.",
                "What do patience, courage, and wisdom truly unlock?"
            ],
            choices: [
                { text: "Understanding others is the greatest strength.", response: ["Yes! That is the answer!", "Patience to listen. Courage to reach out. Wisdom to understand.", "The sealed door is now open. You may enter the bamboo forest.", "Be careful \u2014 the forest is enchanted. Follow the fox if you get lost."] },
                { text: "They unlock ancient secrets.", response: ["Not quite... Think about people, not secrets.", "Madeleine traveled the world not for treasure, but for connection.", "Come back when you understand."] }
            ]
        },
        marco_torch_choice: {
            preamble: [
                "The tunnels split into three paths here.",
                "Each one is marked with different torches.",
                "Which path should I recommend?"
            ],
            choices: [
                { text: "Follow the lit torches on the left.", response: ["The left path! Yes, those torches burn with an ancient flame.", "They've been lit since Roman times \u2014 or so the legend says.", "I followed them once and found an incredible chamber below!", "Go ahead \u2014 the lower catacombs await!"] },
                { text: "Take the dark middle passage.", response: ["The middle passage? I tried that once...", "I walked for ten minutes and ended up right back here!", "The Romans built these tunnels as a maze. The unlit paths loop around.", "Try a path with torches \u2014 the light guides the way."] },
                { text: "Follow the flickering torches on the right.", response: ["The right path... those torches flicker because of a draft.", "It leads to a dead end near the old ventilation shaft.", "The steady flames are the ones the ancients placed as guides.", "Look for torches that burn steadily \u2014 they mark the true path."] }
            ]
        }
    }
};
