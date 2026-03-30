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
        london_sign_14_5: "The British Museum - Est. 1753",
        rome_sign_14_9: "Fontana di Trevi - Make a Wish",
        marrakech_sign_23_7: "Merchant of Wonders",
        tokyo_sign_14_5: "Secret Garden - Enter with Care"
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
        gem: { name: "Gem of Understanding", description: "A magical gem that lets you understand any language. The greatest treasure!" }
    },
    quests: {
        main_quest: {
            name: "The Locket of Worlds",
            description: "Follow the trail of Madeleine Beaumont's hidden treasure across the world.",
            objectives: {
                paris_find_locket: { text: "Find the mysterious locket in Paris", hint: "Visit Grand-m\u00E8re Elise in eastern Paris." },
                paris_visit_librarian: { text: "Show the locket to the librarian", hint: "Visit Monsieur Dupont at the bookshop near the Seine." },
                london_find_map: { text: "Find the map fragment in London", hint: "Show the letter to Dr. Wellington at the British Museum." },
                rome_talk_historian: { text: "Investigate the Trevi Fountain in Rome", hint: "Talk to Professoressa Rossi near the fountain." },
                rome_open_chest: { text: "Use the key to unlock the fountain secret", hint: "Open the chest near the fountain." },
                marrakech_find_journal: { text: "Find Madeleine's journal in Marrakech", hint: "Show the locket to Hassan the merchant." },
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
            "That sounds like the old bookshop by the Seine! Go speak with Monsieur Dupont."
        ],
        grandma_after_locket: [
            "Be careful out there, L\u00E9a!",
            "Madeleine's journal says the treasure is something truly special.",
            "I know you can find it. You have her spirit of adventure!"
        ],
        librarian_intro: [
            "Bonjour! Welcome to Librairie du Pont.",
            "We have books from all over the world. Feel free to browse!"
        ],
        librarian_with_locket: [
            "Mon Dieu! Is that... the Beaumont Locket?!",
            "I've read about this in the old archives!",
            "Madeleine Beaumont traveled the world collecting pieces of a map.",
            "Each piece leads to the next location...",
            "Let me see the coded message... Ah yes!",
            "'The guardian of history holds the first fragment, across the channel.'",
            "That must mean the British Museum in London!",
            "Here, take this old letter. It's a reference from Madeleine herself.",
            "Show it to the curator there. It should help you gain access."
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

        // === LONDON ===
        curator_intro: [
            "Welcome to the British Museum. Please don't touch the exhibits.",
            "We have artifacts from every corner of the world."
        ],
        curator_with_letter: [
            "What's this? A letter from... Madeleine Beaumont?!",
            "Extraordinary! I thought these were just legends.",
            "Yes, we do have a map fragment in our archives.",
            "It was donated anonymously decades ago.",
            "Let me fetch it for you... Here.",
            "It shows a path leading to Rome, to the Trevi Fountain.",
            "There's an inscription: 'Where coins meet wishes, the stone reveals.'",
            "You must go to Rome and investigate the fountain!"
        ],
        curator_after_quest: [
            "The map points to Rome. The Trevi Fountain specifically.",
            "Madeleine was brilliant at hiding her clues in plain sight.",
            "Good luck, young explorer!"
        ],
        guard_intro: [
            "No running in the museum, please.",
            "The ancient artifacts wing is to the north."
        ],
        emma_intro: [
            "Hello! Are you visiting London?",
            "The museum is amazing. Dr. Wellington knows everything about ancient explorers.",
            "If you have something interesting, definitely show it to her!"
        ],

        // === ROME ===
        rossi_intro: [
            "Buongiorno! The fountain is beautiful, isn't it?",
            "They say if you throw a coin, you'll return to Rome someday."
        ],
        rossi_with_map: [
            "A map fragment? From the Beaumont collection?!",
            "I am a historian specializing in women explorers. This is incredible!",
            "The inscription mentions 'the stone reveals'...",
            "I think you need to examine the fountain closely.",
            "There should be a hidden compartment near the base.",
            "Look for a stone with Madeleine's symbol \u2014 a compass rose.",
            "Here, take this special key. I found it years ago near the fountain.",
            "I always wondered what it was for. Now I think I know!"
        ],
        rossi_after_key: [
            "Use the key near the fountain!",
            "There must be a hidden compartment somewhere.",
            "Check the chest near the fountain's edge."
        ],
        rossi_after_quest: [
            "Marrakech! What an adventure!",
            "The ancient trade routes connected Rome to North Africa.",
            "Madeleine must have taken a boat across the Mediterranean."
        ],
        marco_intro: [
            "Ciao! I'm painting the fountain today.",
            "The light in Rome is perfect for art.",
            "Have you noticed the strange symbols carved into the stones?"
        ],
        giulia_intro: [
            "Welcome to Rome! The Eternal City!",
            "Every stone here tells a story thousands of years old.",
            "If you're looking for secrets, talk to Professoressa Rossi by the fountain."
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
            "A book... no, not just any book. A journal!",
            "But she said only someone with the locket could claim it.",
            "Here it is. And inside, there's a strange drawing...",
            "It shows a garden in the east, with cherry blossoms.",
            "And there's a symbol that glows \u2014 a portal stone!",
            "My grandmother said it was magic. I never believed her... until now."
        ],
        hassan_after_quest: [
            "The journal speaks of a secret garden in Tokyo.",
            "Madeleine wrote that the portal stones connect distant places.",
            "Use the portal \u2014 it should take you to Tokyo now!",
            "May your journey be blessed, young explorer."
        ],
        fatima_intro: [
            "Ah, a young traveler! Sit, sit.",
            "Let me tell you the story of the Red City...",
            "Marrakech has been a meeting place of cultures for centuries.",
            "If you seek something, the merchant Hassan knows everyone and everything."
        ],
        amina_intro: [
            "Hi! I'm Amina. The medina is like a maze, isn't it?",
            "Don't worry, you can't really get lost. The paths always lead back to the square!",
            "Hassan's shop is to the east. He's the most famous merchant here."
        ],

        // === TOKYO ===
        yuki_intro: [
            "Welcome to the secret garden. Few visitors find this place.",
            "The cherry blossoms have been blooming for centuries."
        ],
        yuki_with_journal: [
            "You carry Madeleine's journal? Then you are the one.",
            "She planted these cherry trees herself, many years ago.",
            "And she left her greatest treasure here, in the heart of the garden.",
            "The chest beneath the oldest tree...",
            "It contains what she called 'The Gift of Understanding.'",
            "Go, open it. You've earned this through your journey across the world.",
            "Madeleine would be so proud."
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
            "The garden beyond the torii gate is very special.",
            "Only those with a pure heart can find what they seek there."
        ],
        sakura_intro: [
            "Konnichiwa! Welcome to Tokyo!",
            "The secret garden is through the torii gates to the north.",
            "They say a French explorer planted cherry trees there long ago.",
            "If you have something that belongs to her, Yuki-san will help you!"
        ]
    }
};
