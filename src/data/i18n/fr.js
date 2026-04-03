export default {
    ui: {
        title: "Le Médaillon\n  des Mondes",
        subtitle: "Un Mystère à Travers le Monde",
        newGame: "Nouvelle Partie",
        continue: "Continuer",
        version: "v1.0",
        hudHints: "I:Objets Q:Quêtes J:Journal M:Carte",
        inventory: "INVENTAIRE",
        inventoryEmpty: "Aucun objet pour l'instant.\n\nExplore et parle aux\ngens pour trouver des indices !",
        inventoryClose: "Appuie sur I pour fermer",
        questLog: "JOURNAL DE QUÊTE",
        questLogEmpty: "Aucune quête en cours.\n\nParle aux gens pour\ndécouvrir des aventures !",
        questLogClose: "Appuie sur Q pour fermer",
        worldMap: "CARTE DU MONDE",
        selectDestination: "Choisis une destination",
        worldMapHint: "Clique sur une ville ou appuie sur ÉCHAP pour revenir",
        travelTo: "Voyager à {city}",
        youMarker: "TOI",
        routeLocked: "Route verrouillée",
        routeLockedHint: "Tu dois d'abord débloquer ce moyen de transport",
        noDirectRoute: "Pas de route directe vers {city}",
        noDirectRouteHint: "Essaie de passer par une autre ville",
        travelingBy: "Voyage en {route}...",
        noTravelRoutes: "Tu n'as pas encore débloqué de routes de voyage.",
        cancel: "Annuler",
        chestEmpty: "Le coffre est vide.",
        chestLocked: "Le coffre est verrouillé.",
        chestFound: "Trouvé : {name} !",
        portalActive: "Le portail scintille d'énergie magique. Où veux-tu aller ?",
        portalInactive: "Un étrange scintillement flotte dans l'air, mais rien ne se passe...",
        signDefault: "Un panneau usé par le temps.",
        objectiveComplete: "Objectif terminé !",
        newDestination: "Nouvelle destination : {city} !",
        congratulations: "Félicitations ! Tu as trouvé le trésor !",
        gotItem: "Obtenu : {name}",
        doorLocked: "La porte est verrouillée.",
        doorEnter: "Tu entres dans le bâtiment...",
        fallbackDialog: "...",
        journal: "JOURNAL DE LÉA",
        journalEmpty: "Aucune entrée pour l'instant.\n\nTon journal se remplira\nen explorant !",
        journalClose: "Appuie sur J pour fermer",
        journalPageFound: "Trouvé : une page du journal de Madeleine !",
        journalPageAlready: "Tu as déjà lu cette page.",
        journalPagesCount: "Pages du journal : {found}/{total}",
        journalBonusUnlocked: "Toutes les pages trouvées à {city} ! Parle à {npc} pour une surprise !",
        tapToClose: "Appuie sur X pour fermer",
        back: "Retour",
        sideQuestLabel: "\u2726 Qu\u00EAte secondaire",
        bellRingGold: "*DONG* La cloche d'or r\u00E9sonne d'un ton profond et chaud.",
        bellRingSilver: "*DING* La cloche d'argent tinte d'une note claire et brillante.",
        bellRingBronze: "*BONG* La cloche de bronze r\u00E9sonne d'un son riche et doux.",
        bellsCorrect: "Les trois cloches sonnent en parfaite harmonie !",
        bellsWrong: "Les notes s'entrechoquent... Essaie un autre ordre.",
        paintingSelect: "Tu examines le tableau. S\u00E9lectionne un autre pour \u00E9changer.",
        paintingsCorrect: "Les tableaux sont dans le bon ordre !",
        paintingsWrong: "Les tableaux ont \u00E9t\u00E9 \u00E9chang\u00E9s, mais l'ordre ne semble pas encore correct.",
        hiddenItemCollected: "Trouv\u00E9 : {name} !"
    },
    travel: {
        eurostar: "Eurostar",
        nightTrain: "Train de nuit",
        trainViaParis: "Train via Paris",
        boatMediterranean: "Bateau à travers la Méditerranée",
        boatItaly: "Bateau vers l'Italie",
        magicPortal: "Portail magique"
    },
    signs: {
        paris_sign_4_12: "Librairie du Pont - Livres et Cartes",
        paris_sign_27_12: "Maison de Grand-mère",
        paris_eiffel_top_sign_6_1: "Madeleine Beaumont a visité cette tour en 1923",
        paris_eiffel_ground_sign_10_1: "Tour Eiffel - File express",
        london_sign_14_5: "The British Museum - Fondé en 1753",
        london_museum_hall_sign_11_1: "British Museum - Fondé en 1753",
        london_museum_gallery_sign_10_1: "Galerie des Civilisations Anciennes",
        london_museum_basement_sign_8_1: "Collection Beaumont - Don de 1935",
        rome_sign_14_9: "Fontana di Trevi - Fais un vœu",
        rome_colosseum_sign_11_1: "Le Colisée - Construit en 70-80 ap. J.-C.",
        rome_catacombs_upper_sign_9_1: "Passages anciens — avancez avec prudence",
        rome_catacombs_lower_sign_7_1: "Seuls les dignes trouveront ce qui a été perdu — M.B.",
        marrakech_sign_23_7: "Marchand de Merveilles",
        tokyo_sign_14_5: "Jardin Secret - Entrez avec précaution",
        tokyo_shrine_sign_5_4: "« La sagesse complète ce que la patience et le courage ont commencé. »",
        paris_sign_4_20: "Les Trois Cloches : Dans le parc au sud de la librairie, sonne Or, puis Argent, puis Bronze.",
        london_museum_gallery_sign_5_1: "Catalogue de la galerie : Vase grec, Masque égyptien, Pièce romaine, Bouclier celte."
    },
    cities: {
        paris: "La Ville Lumière",
        london: "La Ville du Brouillard",
        rome: "La Ville Éternelle",
        marrakech: "La Ville Rouge",
        tokyo: "La Ville de l'Harmonie"
    },
    items: {
        locket: { name: "Médaillon mystérieux", description: "Un médaillon doré orné avec un message codé à l'intérieur." },
        letter: { name: "Lettre de Madeleine", description: "Une lettre d'introduction écrite par Madeleine Beaumont." },
        map_fragment: { name: "Fragment de carte", description: "Un morceau d'une carte ancienne pointant vers Rome." },
        key: { name: "Clé ancienne", description: "Une petite clé ornée gravée d'une rose des vents." },
        journal: { name: "Journal de l'exploratrice", description: "Le journal de Madeleine avec le dernier indice." },
        coin: { name: "Vieille pièce", description: "Une vieille pièce française gravée d'une rose des vents." },
        book: { name: "Livre caché", description: "Un livre caché derrière la fontaine avec des notes sur Marrakech." },
        gem: { name: "Gemme de Compréhension", description: "Une gemme magique qui permet de comprendre toutes les langues. Le plus grand trésor !" },
        paintbrush: { name: "Pinceau", description: "Le pinceau perdu de Pierre." },
        fastpass: { name: "Coupe-file", description: "Un billet express pour la Tour Eiffel." },
        eiffel_letter: { name: "Lettre de Madeleine", description: "Une lettre trouvée au sommet de la Tour Eiffel, écrite par Madeleine Beaumont." },
        reading_glasses: { name: "Lunettes de lecture", description: "Les lunettes perdues du Professeur Higgins." },
        research_pass: { name: "Laissez-passer", description: "Donne accès aux archives du sous-sol du musée." },
        amulet: { name: "Amulette de Nadia", description: "Un bijou de famille perdu dans la cour du riad." },
        portal_stone: { name: "Pierre de portail", description: "Une pierre magique qui active le voyage par portail." },
        jade_key: { name: "Clé de jade", description: "Une belle clé de jade qui ouvre la porte du jardin sacré." },
        whistle: { name: "Sifflet", description: "Un sifflet de police en laiton." },
        music_sheet_1: { name: "Partition (1/3)", description: "Une page de musique pour violon." },
        music_sheet_2: { name: "Partition (2/3)", description: "Une page de musique pour violon." },
        music_sheet_3: { name: "Partition (3/3)", description: "Une page de musique pour violon." },
        spice_bundle: { name: "Lot d'épices", description: "Un lot parfumé d'épices marocaines." },
        fine_carpet: { name: "Beau tapis", description: "Un tapis magnifiquement tissé de Marrakech." },
        story_scroll: { name: "Parchemin d'histoire", description: "Un ancien parchemin avec un conte de la Route de la Soie." },
        rare_spice: { name: "Étoile de l'Atlas", description: "Une épice extrêmement rare des montagnes de l'Atlas." },
        flower_bouquet: { name: "Bouquets de fleurs", description: "Trois bouquets pour Sophie, Marie et le Libraire." },
        cat_mochi: { name: "Mochi le chat", description: "Le chat orange et pelucheux d'Aiko." }
    },
    quests: {
        main_quest: {
            name: "Le Médaillon des Mondes",
            description: "Suis la piste du trésor caché de Madeleine Beaumont à travers le monde.",
            objectives: {
                paris_find_locket: { text: "Trouver le médaillon mystérieux à Paris", hint: "Rends visite à Grand-mère Élise dans l'est de Paris." },
                paris_find_paintbrush: { text: "Trouver le pinceau perdu de Pierre", hint: "Parle à Madame Colette sur la place du marché." },
                paris_return_paintbrush: { text: "Rapporter le pinceau à Pierre", hint: "Pierre est près de l'esplanade de la Tour Eiffel." },
                paris_find_letter: { text: "Monter en haut de la Tour Eiffel et trouver la lettre", hint: "Montre le coupe-file à l'employée, puis monte au sommet." },
                paris_visit_librarian: { text: "Montrer la lettre au libraire", hint: "Rends visite à Monsieur Dupont à la librairie près de la Seine." },
                london_talk_curator: { text: "Rendre visite au Dr. Wellington au British Museum", hint: "Entre dans le musée par l'entrée principale." },
                london_find_glasses: { text: "Trouver les lunettes de lecture du professeur", hint: "Parle à Thomas dans la galerie du musée." },
                london_return_glasses: { text: "Rapporter les lunettes au Professeur Higgins", hint: "Le Professeur Higgins est dans la galerie." },
                london_find_map: { text: "Trouver le fragment de carte au sous-sol", hint: "Ouvre le coffre dans les archives du sous-sol." },
                rome_talk_historian: { text: "Parler à la Professoressa Rossi au Colisée", hint: "Entre dans le Colisée depuis la rue principale." },
                rome_open_chest: { text: "Trouver le livre caché dans les catacombes", hint: "Utilise la Clé ancienne pour entrer dans les catacombes, puis descends au niveau le plus bas." },
                marrakech_find_journal: { text: "Trouver le journal de Madeleine dans le Souk", hint: "Entre dans le Grand Souk et parle à Hassan." },
                marrakech_find_amulet: { text: "Trouver l'amulette de Nadia dans le Riad", hint: "Cherche dans la cour cachée du riad, accessible depuis le souk." },
                marrakech_return_amulet: { text: "Rapporter l'amulette à Nadia", hint: "Nadia est à l'oasis dans le désert." },
                marrakech_get_portal: { text: "Obtenir la Pierre de portail", hint: "Ouvre le coffre dans l'oasis." },
                tokyo_solve_riddle: { text: "Résoudre l'énigme du sanctuaire", hint: "Apprends les proverbes de Hiro et Aiko, puis lis le panneau du sanctuaire." },
                tokyo_talk_gardener: { text: "Trouver Yuki-san dans la forêt de bambous", hint: "Traverse le labyrinthe de bambous. Suis le renard spirituel." },
                tokyo_find_treasure: { text: "Découvrir le trésor dans le jardin sacré", hint: "Utilise la Clé de jade pour entrer dans le jardin sacré." }
            }
        },
        paris_flowers: {
            name: "Livraison de fleurs",
            description: "Aide Colette à livrer des fleurs à ses amis à Paris."
        },
        london_whistle: {
            name: "Le sifflet de Bobby",
            description: "Bobby a perdu son sifflet dans le sous-sol du musée."
        },
        rome_music: {
            name: "Les partitions d'Enzo",
            description: "Aide Enzo à retrouver ses partitions perdues à Rome."
        },
        marrakech_stories: {
            name: "Les histoires de Fatima",
            description: "Aide Fatima à collecter des histoires des gens de Marrakech."
        },
        tokyo_cat: {
            name: "Le chat perdu d'Aiko",
            description: "Aide Aiko à retrouver son chat Mochi qui s'est aventuré dans la forêt de bambous."
        }
    },
    dialogues: {
        // === PARIS ===
        grandma_intro: [
            "Oh, Léa ! Viens ici, ma chérie.",
            "Je nettoyais le grenier et j'ai trouvé quelque chose d'extraordinaire...",
            "Ce médaillon appartenait à ton arrière-arrière-grand-mère, Madeleine Beaumont.",
            "C'était une exploratrice célèbre ! Mais sa plus grande découverte n'a jamais été trouvée...",
            "Il y a un message codé à l'intérieur. Tu peux le lire ?",
            "« Là où le savoir coule comme la rivière, cherche le gardien des histoires. »",
            "On dirait la vieille librairie près de la Seine ! Va parler à Monsieur Dupont.",
            "Mais aussi... On dit que le secret de Madeleine est caché au sommet de la Tour Eiffel !"
        ],
        grandma_after_locket: [
            "Fais attention, Léa !",
            "Le journal de Madeleine dit que le trésor est quelque chose de vraiment spécial.",
            "Essaie de visiter la Tour Eiffel — Pierre, l'artiste près de l'esplanade, pourrait t'aider.",
            "Je sais que tu peux le trouver. Tu as son esprit d'aventure !"
        ],
        librarian_intro: [
            "Bonjour ! Bienvenue à la Librairie du Pont.",
            "Nous avons des livres du monde entier. N'hésite pas à regarder !"
        ],
        librarian_with_locket: [
            "Oh ! Tu dois \u00EAtre la petite-fille d'\u00C9lise \u2014 L\u00E9a, c'est bien \u00E7a ?",
            "Je connaissais bien ton arri\u00E8re-arri\u00E8re-grand-m\u00E8re Madeleine... \u00E0 travers ses livres, bien s\u00FBr !",
            "Les Beaumont \u00E9taient une famille d'explorateurs. Vraiment remarquable.",
            "Il y a une vieille l\u00E9gende parmi nous libraires... On dit que Madeleine a cach\u00E9 quelque chose tout en haut de la Tour Eiffel.",
            "Personne ne l'a jamais trouv\u00E9. Mais avec son m\u00E9daillon... qui sait ?",
            "Si jamais tu trouves quelque chose l\u00E0-haut, apporte-le-moi. Les vieilles lettres, c'est ma sp\u00E9cialit\u00E9 !"
        ],
        librarian_progress: [
            "D\u00E9j\u00E0 de retour ? Tu es mont\u00E9e au sommet de la tour ?",
            "Je n'arr\u00EAte pas de penser \u00E0 cette vieille l\u00E9gende... la lettre cach\u00E9e de Madeleine.",
            "Si elle existe, j'adorerais la voir. Je sais lire les \u00E9critures anciennes que la plupart des gens ne comprennent pas !"
        ],
        librarian_with_letter: [
            "Mon Dieu ! Est-ce que c'est... la Lettre de Madeleine de la Tour Eiffel ?!",
            "J'ai lu des choses à ce sujet dans les vieilles archives !",
            "Madeleine Beaumont a voyagé à travers le monde pour rassembler les morceaux d'une carte.",
            "Chaque morceau mène à l'endroit suivant...",
            "Laisse-moi voir... Ah oui !",
            "« Le gardien de l'histoire détient le premier fragment, de l'autre côté de la Manche. »",
            "Ça doit être le British Museum à Londres !",
            "Montre cette lettre au conservateur là-bas. Ça devrait t'aider à entrer."
        ],
        librarian_after_quest: [
            "Bon voyage, Léa ! Londres t'attend.",
            "N'oublie pas, le British Museum est ta destination.",
            "Appuie sur M pour ouvrir la carte du monde quand tu es prête."
        ],
        sophie_intro: [
            "Salut ! Je suis Sophie. J'adore explorer Paris !",
            "Tu as visité la Tour Eiffel ? C'est juste au nord d'ici.",
            "Il y a aussi un magnifique parc au nord-ouest.",
            "Astuce : utilise ZQSD ou les flèches pour te déplacer, et ESPACE pour interagir !"
        ],
        sophie_after_quest: [
            "J'ai entendu dire que tu partais à l'aventure ! Trop cool !",
            "J'aimerais tellement venir avec toi. Raconte-moi tout à ton retour !",
            "Appuie sur I pour vérifier ton inventaire, et Q pour ton journal de quête."
        ],

        // New Paris NPCs
        pierre_intro: [
            "Bonjour ! Je suis Pierre, artiste de rue.",
            "J'adore peindre la Tour Eiffel, mais j'ai perdu mon pinceau !",
            "Je crois que je l'ai fait tomber près de la place du marché...",
            "Si tu le retrouves, je pourrais t'aider en échange.",
            "J'ai des contacts à la tour — je pourrais te trouver un coupe-file !"
        ],
        pierre_has_brush: [
            "Mon pinceau ! Tu l'as retrouvé ! Merci beaucoup !",
            "Comme promis, voici un coupe-file pour la Tour Eiffel.",
            "Tu pourras passer devant tout le monde et monter directement au sommet !",
            "Montre-le à l'employée à l'entrée de la tour."
        ],
        pierre_after_fastpass: [
            "La vue depuis le sommet est magnifique !",
            "J'espère que tu trouveras ce que tu cherches là-haut."
        ],

        colette_intro: [
            "Bienvenue à mon étal de fleurs ! Les plus belles fleurs de Paris !",
            "Oh, qu'est-ce que c'est par terre ? Un pinceau !",
            "Il doit appartenir à cet artiste, Pierre. Il perd toujours ses affaires.",
            "Tiens, prends-le. Je suis sûre qu'il sera reconnaissant !"
        ],
        colette_after: [
            "De si belles fleurs aujourd'hui ! Pierre devrait les peindre.",
            "Il est souvent près de l'esplanade de la Tour Eiffel."
        ],

        tourist_claude_intro: [
            "Cette file d'attente est dingue ! Ça fait des heures que j'attends !",
            "Il paraît qu'il faut un coupe-file pour passer devant.",
            "Peut-être que cet artiste sur la grande place connaît quelqu'un..."
        ],
        queue_grumble_1: [
            "Pfff, je fais la queue depuis ce matin !",
            "À ce rythme, je verrai la tour au coucher du soleil..."
        ],
        queue_grumble_2: [
            "J'ai mal aux pieds...",
            "Elle avance, cette file, ou pas ?!"
        ],
        queue_grumble_3: [
            "Il paraît que quelqu'un a eu un coupe-file et a sauté toute la queue !",
            "Trop injuste... ou trop malin ?"
        ],
        queue_grumble_4: [
            "*soupir* On aurait dû venir plus tôt.",
            "C'est la plus longue file d'attente que j'aie jamais vue."
        ],
        queue_grumble_5: [
            "On est arrivés ? On est arrivés ?",
            "Mamaaan, je m'ennuie !"
        ],
        queue_grumble_6: [
            "J'aurais pu escalader la tour à mains nues depuis le temps !",
            "La patience est une vertu... que je n'ai pas."
        ],
        iqueue_grumble_1: [
            "On y est presque... plus que quelques personnes devant !",
            "Je vois presque le guichet d'ici."
        ],
        iqueue_grumble_2: [
            "Papa a dit qu'on serait rapides. C'était il y a deux heures.",
            "J'ai compté chaque carreau de ce sol. Deux fois."
        ],
        iqueue_grumble_3: [
            "Je vends des souvenirs dehors, mais même moi j'ai dû faire la queue !",
            "La vue a intérêt à valoir le coup."
        ],
        iqueue_grumble_4: [
            "Hé, on ne double pas ! Je suis là depuis midi.",
            "Sauf si tu as un coupe-file, bien sûr..."
        ],
        iqueue_grumble_5: [
            "Ma copine a eu un coupe-file et elle est déjà en haut !",
            "J'aurais dû mieux m'organiser..."
        ],
        attendant_intro: [
            "Bienvenue à la Tour Eiffel !",
            "La file d'attente normale est très longue aujourd'hui, malheureusement.",
            "Si tu as un coupe-file, tu peux passer directement !"
        ],
        attendant_with_pass: [
            "Un coupe-file ! Parfait, tu peux y aller !",
            "L'escalier vers le premier étage est juste par ici.",
            "Bonne visite !"
        ],

        marie_intro: [
            "Oh, la vue d'ici est incroyable !",
            "Je suis photographe. Je viens ici chaque semaine.",
            "J'ai entendu dire qu'il y a quelque chose de spécial tout en haut...",
            "Un vieux panneau datant de plusieurs dizaines d'années. Une sorte de mémorial."
        ],

        // === LONDON ===
        curator_intro: [
            "Bienvenue au British Museum. Ne touchez pas aux objets exposés, s'il vous plaît.",
            "Nous avons des artefacts des quatre coins du monde."
        ],
        curator_with_letter: [
            "Qu'est-ce que c'est ? Une lettre de... Madeleine Beaumont ?!",
            "Extraordinaire ! Je pensais que ce n'étaient que des légendes.",
            "Oui, nous avons un fragment de carte dans nos archives.",
            "Il est au sous-sol, mais les archives sont réservées aux chercheurs.",
            "Tu auras besoin d'un laissez-passer pour y accéder.",
            "Le Professeur Higgins dans la galerie pourrait t'aider.",
            "C'est le seul habilité à délivrer des laissez-passer."
        ],
        curator_after_quest: [
            "La carte pointe vers Rome. Le Colisée précisément.",
            "Madeleine était brillante pour cacher ses indices en pleine vue.",
            "Bonne chance, jeune exploratrice !"
        ],
        guard_intro: [
            "On ne court pas dans le musée, s'il vous plaît.",
            "L'accès aux archives du sous-sol est interdit sans laissez-passer."
        ],
        guard_with_pass: [
            "Un laissez-passer ? Laissez-moi voir... Oui, il est valide.",
            "Tu peux descendre aux archives du sous-sol. Fais attention là-dessous !"
        ],
        emma_intro: [
            "Bonjour ! Tu visites Londres ?",
            "Le musée est incroyable. Dr. Wellington sait tout sur les anciens explorateurs.",
            "Si tu as quelque chose d'intéressant, montre-le-lui absolument !",
            "L'entrée du musée est juste au nord d'ici."
        ],

        bobby_intro: [
            "Bonjour ! Bienvenue à Londres !",
            "Le British Museum est juste au bout de la rue. Très impressionnant, je dois dire.",
            "Si tu as besoin de directions, n'hésite pas à demander !"
        ],

        pemberton_intro: [
            "Oh, tu voudrais une tasse de thé ?",
            "Ce professeur au musée perd toujours ses lunettes de lecture.",
            "J'ai vu un jeune garçon les ramasser dans la galerie tout à l'heure."
        ],

        olivia_intro: [
            "Bienvenue à la boutique du musée !",
            "Nous avons des répliques de tous les artefacts célèbres.",
            "Le Professeur Higgins plisse les yeux sur ses livres toute la journée. Le pauvre, il a besoin de ses lunettes !"
        ],

        higgins_intro: [
            "Hmm... Je n'arrive pas à lire quoi que ce soit sans mes lunettes !",
            "Je les ai perdues quelque part dans cette galerie.",
            "Si tu pouvais les retrouver, je t'en serais très reconnaissant.",
            "Je pourrais même te faire un laissez-passer pour les archives."
        ],
        higgins_with_glasses: [
            "Mes lunettes ! Oh, merveilleux ! Je vois de nouveau !",
            "Comme promis, voici un laissez-passer pour les archives du sous-sol.",
            "La Collection Beaumont est dans le coin du fond. Bonne chance !"
        ],
        higgins_after: [
            "La Collection Beaumont au sous-sol est fascinante.",
            "Donnée anonymement en 1935. Personne ne sait qui l'a apportée."
        ],

        thomas_intro: [
            "Hé ! Je suis en voyage scolaire. Ce musée est ÉNORME !",
            "J'ai trouvé ces drôles de lunettes sur un banc. Elles ont l'air vieilles.",
            "Elles sont à toi ? Non ? Bon, tiens — prends-les !",
            "Je ne veux pas avoir d'ennuis pour les avoir gardées."
        ],
        thomas_after: [
            "La section égyptienne est trop cool !",
            "Je veux devenir archéologue quand je serai grand !"
        ],

        // === ROME ===
        rossi_intro: [
            "Buongiorno ! Bienvenue au Colisée !",
            "Cette arène a vu des milliers d'années d'histoire."
        ],
        rossi_with_map: [
            "Un fragment de carte ? De la collection Beaumont ?!",
            "Je suis historienne spécialisée dans les femmes exploratrices. C'est incroyable !",
            "La carte mentionne un passage secret sous le Colisée.",
            "Je le cherche depuis des années !",
            "Tiens, prends cette clé ancienne. Je l'ai trouvée près de l'arène.",
            "Elle pourrait ouvrir le passage vers les catacombes en dessous.",
            "Bianca et ses chats semblent savoir où se trouve la porte..."
        ],
        rossi_after_key: [
            "Utilise la clé sur la porte verrouillée dans le Colisée !",
            "Les catacombes en dessous devraient contenir le secret de Madeleine."
        ],
        rossi_after_quest: [
            "Marrakech ! Quelle aventure !",
            "Les anciennes routes commerciales reliaient Rome à l'Afrique du Nord.",
            "Madeleine a dû prendre un bateau à travers la Méditerranée."
        ],
        marco_intro: [
            "Ciao ! Je suis étudiant en archéologie, j'explore ces tunnels.",
            "Les catacombes inférieures sont juste devant — suis les torches.",
            "Fais attention, les passages sont étroits et sombres.",
            "J'ai vu un coffre dans la salle la plus profonde. Il a l'air très ancien !"
        ],
        giulia_intro: [
            "Bienvenue à Rome ! La Ville Éternelle !",
            "Chaque pierre ici raconte une histoire vieille de milliers d'années.",
            "Si tu cherches des secrets, le Colisée est l'endroit idéal !",
            "Il y a une porte sur la rue principale qui mène à l'intérieur."
        ],

        lorenzo_intro: [
            "Ciao ! La meilleure glace de Rome, c'est ici !",
            "Tu sais, j'ai entendu une musique étrange venant de sous le Colisée.",
            "Les vieilles légendes racontent qu'il y a des tunnels en dessous.",
            "Parle à la Professoressa Rossi au Colisée — elle sait tout là-dessus."
        ],

        enzo_intro: [
            "♪ La la la... Oh ! Tu m'as fait sursauter !",
            "Je suis Enzo. Je joue du violon près des ruines antiques.",
            "J'ai entendu parler d'une porte secrète dans le Colisée.",
            "Il paraît qu'elle a un trou de serrure en forme de fleur — une rose des vents !"
        ],

        alessandra_intro: [
            "Bienvenue au Colisée ! Je suis votre guide.",
            "Cette arène pouvait accueillir 50 000 spectateurs !",
            "Les catacombes en dessous servaient aux gladiateurs pour se préparer au combat.",
            "Certains disent qu'il reste encore des passages à découvrir..."
        ],

        bianca_intro: [
            "Chut... n'effraie pas les chats !",
            "Je les nourris ici chaque jour. Ils connaissent tous les secrets de cet endroit.",
            "Mon chat Nero va toujours vers ce mur sur la droite...",
            "C'est comme s'il y avait quelque chose derrière. Une porte, peut-être ?"
        ],

        // === MARRAKECH ===
        hassan_intro: [
            "Bienvenue, bienvenue ! Les plus beaux trésors du Sahara !",
            "Épices, tissus, bijoux — tout ce que ton cœur désire !"
        ],
        hassan_with_locket: [
            "Attends... ce symbole sur ton médaillon...",
            "Je l'ai déjà vu ! Ma grand-mère me l'a montré.",
            "Une femme est venue ici il y a de nombreuses années. Madeleine, elle s'appelait.",
            "Elle a laissé quelque chose à ma famille pour le garder en sécurité.",
            "Un journal ! Le voici.",
            "À l'intérieur, il y a un étrange dessin d'une oasis dans le désert...",
            "On dit qu'une guide nommée Nadia sait où elle se trouve.",
            "Mais elle a perdu l'amulette de sa grand-mère. Peut-être que tu peux l'aider ?"
        ],
        hassan_after_quest: [
            "Le journal parle d'une oasis dans le désert et d'une pierre de portail.",
            "Trouve l'amulette de Nadia, et elle te guidera là-bas.",
            "Que ton voyage soit béni, jeune exploratrice."
        ],
        fatima_intro: [
            "Ah, une jeune voyageuse ! Assieds-toi, assieds-toi.",
            "Laisse-moi te raconter l'histoire de la Ville Rouge...",
            "Marrakech est un lieu de rencontre des cultures depuis des siècles.",
            "Si tu cherches quelque chose, entre dans le Grand Souk au sud. Hassan connaît tout le monde."
        ],
        fatima_after_amulet: [
            "Je vois que tu portes l'amulette de Nadia ! Elle la cherchait partout.",
            "L'oasis du d\u00E9sert est \u00E0 l'est \u2014 suis le chemin le long du mur de la ville.",
            "Nadia est gentille. Elle t'aidera dans ton voyage."
        ],
        amina_intro: [
            "Salut ! Je suis Amina. La médina, c'est un vrai labyrinthe, non ?",
            "T'inquiète pas, tu ne peux pas vraiment te perdre. Les chemins ramènent toujours à la place !",
            "L'entrée du Grand Souk est juste au sud de la zone du marché."
        ],

        karim_intro: [
            "Bienvenue ! Les meilleures épices de tout le Maroc !",
            "Cannelle, safran, curcuma — tu n'as qu'à demander !",
            "Tu cherches Hassan ? Il est au fond du Grand Souk.",
            "Entre par la porte au sud du marché."
        ],

        youssef_intro: [
            "Approchez, approchez ! Laissez-moi vous raconter une histoire...",
            "Celle d'une oasis magique cachée dans le désert !",
            "On dit qu'une guide nommée Nadia connaît le chemin.",
            "Mais elle a perdu l'amulette de sa grand-mère dans le vieux riad.",
            "Retrouve-la, et peut-être qu'elle te fera confiance."
        ],
        youssef_after_amulet: [
            "Tu as trouv\u00E9 l'amulette ! Quelle histoire \u00E0 raconter !",
            "Nadia t'attend \u00E0 l'oasis. Va vers l'est en traversant la place principale !",
            "Le chemin vers le d\u00E9sert est tout \u00E0 l'est de la ville."
        ],

        tariq_intro: [
            "Les plus beaux tapis de tout Marrakech !",
            "On dirait que tu cherches quelque chose...",
            "Nadia ? Oui, je la connais. C'est la guide du désert.",
            "Mais elle est triste — elle a perdu l'amulette de sa grand-mère.",
            "Quelqu'un a dit qu'elle est tombée dans la cour du vieux riad tout près."
        ],
        tariq_after_amulet: [
            "C'est l'amulette ? Nadia va \u00EAtre folle de joie !",
            "D\u00E9p\u00EAche-toi d'aller \u00E0 l'oasis \u2014 va vers l'est depuis la place principale.",
            "Tu ne peux pas manquer le chemin le long du bord est de la ville."
        ],

        zahra_intro: [
            "Bienvenue dans le riad caché. Peu de visiteurs trouvent cet endroit.",
            "J'entretiens ce vieux bâtiment. Il a une belle fontaine.",
            "J'ai vu quelque chose de brillant près de la fontaine l'autre jour...",
            "Une petite amulette, peut-être ? Regarde près de l'eau."
        ],
        zahra_after_amulet: [
            "Tu as trouv\u00E9 l'amulette ! Nadia va \u00EAtre tellement contente.",
            "Elle attend \u00E0 l'oasis du d\u00E9sert, \u00E0 l'est de la place principale.",
            "Retourne par le souk, puis cherche le chemin tout \u00E0 l'est de la ville."
        ],

        nadia_intro: [
            "Bienvenue à l'oasis. Le désert est beau, n'est-ce pas ?",
            "Mais j'ai bien peur de ne pas pouvoir t'aider pour l'instant.",
            "J'ai perdu l'amulette de ma grand-mère... elle représente tout pour moi."
        ],
        nadia_with_amulet: [
            "L'amulette de ma grand-mère ! Tu l'as retrouvée !",
            "Merci infiniment ! Je pensais qu'elle était perdue pour toujours.",
            "Tu voulais trouver la pierre de portail ? Laisse-moi te montrer.",
            "Elle est juste ici, dans l'oasis. Madeleine l'a cachée il y a longtemps.",
            "Ouvre le coffre — la pierre de portail est à l'intérieur.",
            "Elle activera le portail magique. Utilise-la bien !"
        ],
        nadia_after: [
            "La pierre de portail est puissante. Elle relie des endroits éloignés.",
            "Madeleine l'utilisait pour voyager à travers le monde en un clin d'œil.",
            "Sois courageuse, jeune exploratrice. Tokyo t'attend !"
        ],

        // === TOKYO ===
        yuki_intro: [
            "Bienvenue dans la forêt de bambous. Peu de visiteurs trouvent cet endroit.",
            "Le jardin au-delà est sacré. Il renferme d'anciens secrets."
        ],
        yuki_with_journal: [
            "Tu portes le journal de Madeleine ? Alors tu es celle qu'on attendait.",
            "Elle a planté les cerisiers du jardin sacré elle-même.",
            "Pour y entrer, tu auras besoin de la Clé de jade.",
            "Tiens — je la gardais en sécurité pour la bonne personne.",
            "Le portail vers le jardin sacré est juste devant."
        ],
        yuki_after_quest: [
            "Tu l'as trouvé ! Le trésor de Madeleine Beaumont !",
            "Une gemme qui permet de comprendre toutes les langues du monde.",
            "Elle disait toujours que le plus grand trésor est la compréhension entre les peuples.",
            "Ton aventure ne fait que commencer, Léa. Le monde est plein de merveilles !"
        ],
        takeshi_intro: [
            "Que la paix soit avec toi, voyageuse.",
            "Ce sanctuaire est debout depuis mille ans.",
            "Le sanctuaire au sud renferme une énigme que tu dois résoudre.",
            "Cherche la sagesse auprès de Hiro et Aiko avant d'y entrer."
        ],
        sakura_intro: [
            "Konnichiwa ! Bienvenue à Tokyo !",
            "L'entrée du sanctuaire est sur le chemin principal au sud.",
            "On dit qu'une exploratrice française a laissé quelque chose de spécial ici il y a longtemps.",
            "Parle aux habitants — ils connaissent peut-être des parties de l'énigme !"
        ],

        hiro_intro: [
            "Bienvenue dans mon restaurant de ramen ! Les meilleures nouilles de Tokyo !",
            "Tu veux entrer dans le sanctuaire ? Il te faut la réponse à l'énigme.",
            "Voici un proverbe que mon grand-père m'a appris :",
            "« La patience est la clé qui ouvre toutes les portes. »",
            "C'est la première partie. Aiko connaît la deuxième !"
        ],

        aiko_intro: [
            "Oh ! Tu veux résoudre l'énigme du sanctuaire ?",
            "Je l'ai dessinée dans mon manga une fois ! Tiens, regarde cette page.",
            "« Le courage éclaire le chemin à travers les ténèbres. »",
            "C'est la deuxième partie ! La troisième est écrite sur un panneau dans le sanctuaire.",
            "Tanaka, le gardien du sanctuaire, te demandera les trois parties."
        ],

        tanaka_intro: [
            "Bienvenue au sanctuaire sacré.",
            "Pour franchir la porte scellée, tu dois répondre à l'énigme.",
            "Trois proverbes, trois vérités. Les connais-tu toutes ?"
        ],
        tanaka_riddle_complete: [
            "« Patience, Courage et Sagesse. »",
            "Oui ! Ce sont les trois vérités !",
            "La porte scellée est maintenant ouverte. Tu peux entrer dans la forêt de bambous.",
            "Fais attention — la forêt est enchantée. Suis le renard si tu te perds."
        ],
        tanaka_waiting: [
            "Tu n'as pas encore les trois parties de l'énigme.",
            "Cherche la sagesse auprès des habitants de Tokyo.",
            "Et aussi, lis le panneau ici dans le sanctuaire pour la troisième partie."
        ],

        fox_intro: [
            "...",
            "Le renard spirituel t'observe avec des yeux anciens.",
            "Il fait un geste vers la clairière devant.",
            "Suis les lanternes... Yuki-san t'attend là-bas."
        ],

        madeleine_intro: [
            "Léa... ma chère arrière-arrière-petite-fille.",
            "Tu m'as trouvée. Après toutes ces années...",
            "J'ai planté ces cerisiers quand j'étais jeune, pleine d'émerveillement.",
            "Le trésor que j'ai laissé n'est ni de l'or ni des bijoux.",
            "C'est la Gemme de Compréhension — le pouvoir de communiquer avec tous les peuples.",
            "Le monde est vaste et magnifique, Léa.",
            "Ne cesse jamais d'explorer. Ne cesse jamais d'être curieuse.",
            "Je suis tellement fière de toi."
        ],

        // === JOURNAL PAGE BONUS DIALOGS ===
        grandma_journal_bonus: [
            "Tu as trouvé les pages du journal de Madeleine ! Les trois de Paris !",
            "Je ne savais pas qu'elle tenait un journal... c'est extraordinaire.",
            "Elle écrit sur la Tour Eiffel, la librairie, même les fleuristes.",
            "Tu sais, elle a dit un jour à ma mère : 'Paris est là où toute aventure commence.'",
            "Je crois qu'elle t'aurait adorée, Léa."
        ],
        curator_journal_bonus: [
            "Trois pages du journal de Londres ? C'est une découverte historique majeure !",
            "On savait que Madeleine avait fait don de la Collection Beaumont, mais on ne savait pas pourquoi.",
            "Ces pages révèlent qu'elle voulait partager ses découvertes avec le monde.",
            "Je les ajouterai à nos archives — avec votre permission, bien sûr !",
            "Vous avez fait un travail remarquable, jeune exploratrice."
        ],
        rossi_journal_bonus: [
            "Les pages du journal de Madeleine sur Rome ! Incroyable !",
            "Elle écrit que les chats l'ont menée aux catacombes !",
            "Et un musicien nommé Giovanni — serait-ce le grand-père d'Enzo ?",
            "L'histoire est pleine de ces belles connexions.",
            "Merci de les avoir mises en lumière, Léa."
        ],
        hassan_journal_bonus: [
            "Tu as trouvé toutes ses pages de Marrakech ? Mashallah !",
            "Elle écrit sur les couleurs, les épices, les histoires...",
            "Et la pierre portail ! Ma grand-mère disait toujours que c'était magique, mais je croyais qu'elle racontait des histoires.",
            "Madeleine aimait vraiment cette ville. Elle était des nôtres.",
            "Que sa mémoire soit une bénédiction."
        ],
        yuki_journal_bonus: [
            "Les trois pages du journal de Tokyo... je sens son esprit dans ces mots.",
            "Elle écrit avoir planté les cerisiers avec moi... enfin, avec ma grand-mère.",
            "Les femmes Yuki ont entretenu ce jardin pendant trois générations.",
            "La dernière entrée de Madeleine est la plus belle.",
            "'Le plus grand trésor n'est pas ce que l'on trouve — c'est ce que l'on apprend en chemin.'",
            "Des mots sages. Des mots pour vivre."
        ],

        // === PUZZLE FEEDBACK ===
        bell_ring_gold: ["*DONG* La cloche d'or résonne d'un ton profond et chaud."],
        bell_ring_silver: ["*DING* La cloche d'argent tinte d'une note claire et brillante."],
        bell_ring_bronze: ["*BONG* La cloche de bronze résonne d'un son riche et doux."],
        bells_correct: [
            "Les trois cloches sonnent en parfaite harmonie !",
            "Un compartiment caché s'ouvre dans le mur...",
            "À l'intérieur, tu trouves un mot plié de Madeleine !"
        ],
        bells_wrong: [
            "Les notes s'entrechoquent...",
            "Ce n'était pas le bon ordre. Il y a peut-être un indice à proximité ?"
        ],
        painting_select: ["Tu examines le tableau attentivement. Sélectionne un autre tableau pour échanger."],
        paintings_correct: [
            "Les tableaux sont dans le bon ordre !",
            "Un petit tiroir glisse sous la vitrine...",
            "Tu trouves un mot : « L'ordre révèle la vérité — M.B. »"
        ],
        paintings_wrong: ["Les tableaux ont été échangés, mais l'ordre ne semble pas encore correct."],

        // === SIDE QUEST DIALOGS ===
        colette_side_start: [
            "Oh, Léa ! Tu pourrais me rendre un service ?",
            "J'ai trois bouquets de fleurs à livrer aujourd'hui, mais je ne peux pas quitter mon étal.",
            "Sophie, Marie et Monsieur Dupont en ont chacun commandé un.",
            "Tu pourrais les livrer pour moi ? Ce serait vraiment gentil !"
        ],
        sophie_side_flower: [
            "Des fleurs de Colette ? Comme c'est joli !",
            "Des tournesols, mes préférés — elle s'en souvient !",
            "Dis à Colette que je la remercie beaucoup !"
        ],
        marie_side_flower: [
            "Oh ! Des roses de Colette ! Parfaites pour mes photos.",
            "Je vais les photographier avec la Tour Eiffel en arrière-plan.",
            "Merci pour la livraison !"
        ],
        librarian_side_flower: [
            "De la lavande ! Ma préférée. Colette me connaît bien.",
            "Tu savais que Madeleine adorait la lavande aussi ?",
            "Elle pressait un brin dans chaque livre qu'elle lisait.",
            "Merci, Léa. Dis à Colette que les fleurs sont magnifiques."
        ],
        colette_side_complete: [
            "Tu as livré les trois ? Merveilleux !",
            "Tu es une vraie petite livreuse, Léa.",
            "Tu sais, Madeleine achetait des fleurs chez ma grand-mère.",
            "Elle disait toujours que les fleurs sont le langage universel.",
            "Tiens — garde un bouquet pour toi. Tu l'as bien mérité !"
        ],

        bobby_side_start: [
            "Oh mon Dieu... j'ai perdu mon sifflet !",
            "Ce n'est pas n'importe quel sifflet — c'était celui de mon grand-père.",
            "Il était aussi bobby, tu sais. Cinquante ans de service !",
            "Je crois que je l'ai fait tomber au sous-sol du musée.",
            "Tu pourrais le chercher ? Je n'ai pas de laissez-passer pour y aller."
        ],
        bobby_side_return: [
            "Le sifflet de mon grand-père ! Tu l'as trouvé !",
            "Oh, merci infiniment ! J'étais mort d'inquiétude.",
            "Tu sais, ton arrière-arrière-grand-mère Madeleine a aidé mon grand-père aussi.",
            "Il m'a raconté l'histoire quand j'étais petit...",
            "Elle lui a rendu un badge perdu en 1924. Le monde est petit, n'est-ce pas ?",
            "Merci, Léa. Tu es comme elle."
        ],
        bobby_madeleine_story: [
            "Je t'ai déjà parlé de Madeleine et mon grand-père ?",
            "Il gardait le musée quand une jeune Française est venue le voir.",
            "Elle avait trouvé son badge dans la rue et avait marché trois kilomètres pour le rendre !",
            "Il disait qu'elle avait « le cœur d'un lion et le sourire d'un jour d'été ».",
            "C'était ta Madeleine. Toute une dame."
        ],

        enzo_side_start: [
            "Oh non, oh non, oh non !",
            "J'ai perdu trois pages de ma meilleure composition !",
            "Le vent les a dispersées quand je jouais près du Colisée.",
            "Une s'est envolée dans l'arène, une dans les catacombes...",
            "Et je crois que Giulia en a ramassé une. Tu pourrais les retrouver ?",
            "Ce morceau est spécial — il est basé sur une mélodie de mon grand-père Giovanni !"
        ],
        giulia_side_sheet: [
            "Cette partition ? Je l'ai trouvée emportée par le vent !",
            "Elle avait l'air trop belle pour la laisser par terre.",
            "La mélodie est magnifique — dis à Enzo que j'adorerais l'entendre la jouer !"
        ],
        enzo_side_return: [
            "Les trois partitions ! Tu les as toutes retrouvées !",
            "Laisse-moi te la jouer...",
            "♪ ♫ ♪ ... Une belle mélodie emplit l'air...",
            "Mon grand-père Giovanni a écrit ça quand il a rencontré une exploratrice française.",
            "Elle lui a dit que la musique était le langage qui n'a besoin d'aucune traduction.",
            "Cette exploratrice, c'était Madeleine Beaumont — ton arrière-arrière-grand-mère !",
            "Merci, Léa. Cette musique nous relie à travers le temps."
        ],
        enzo_plays_song: [
            "♪ ♫ ♪ ... La mélodie de Madeleine et Giovanni...",
            "Chaque note raconte l'histoire de deux personnes qui parlaient des langues différentes,",
            "mais qui se comprenaient parfaitement grâce à la musique.",
            "Madeleine serait fière de savoir que la chanson vit encore."
        ],

        fatima_side_start: [
            "Ah, Léa ! J'écris un livre d'histoires de Marrakech.",
            "Mais mes vieilles jambes ne me portent plus dans la médina comme avant.",
            "Tu pourrais collecter des histoires pour moi ?",
            "Parle à Amina, Karim et Zahra — chacun a une histoire qui vaut la peine.",
            "Puis reviens me les raconter !"
        ],
        amina_side_story: [
            "Une histoire pour Fatima ? J'en connais une bonne !",
            "Ma grand-mère disait que les nuits de pleine lune,",
            "les fontaines de Marrakech murmurent les noms de tous ceux qui y ont bu.",
            "Elle disait que si on écoute bien, on peut entendre le nom de Madeleine.",
            "Raconte ça à Fatima — elle va adorer !"
        ],
        karim_side_story: [
            "Une histoire ? Hmm... En voici une sur mes épices.",
            "Il y a longtemps, un marchand a parcouru la Route de la Soie avec une précieuse fleur de safran.",
            "Il l'a plantée ici à Marrakech, et de cette seule fleur,",
            "est né tout le commerce du safran au Maroc !",
            "Ma famille cultive ces champs depuis des générations. Dis-le à Fatima !"
        ],
        zahra_side_story: [
            "Une histoire sur le riad ? Bien sûr !",
            "Ce bâtiment était autrefois un lieu de rencontre pour les explorateurs du monde entier.",
            "Ils partageaient des cartes, des histoires et des rêves sous ces étoiles.",
            "Ton arrière-arrière-grand-mère Madeleine s'est assise dans cette même cour.",
            "Elle disait : « Les meilleures histoires sont celles qui rassemblent les gens. »",
            "Dis-le à Fatima — elle connaissait Madeleine aussi."
        ],
        fatima_side_complete: [
            "Trois histoires merveilleuses ! Amina, Karim, Zahra — toutes magnifiques !",
            "Tu sais, j'ai connu une conteuse encore meilleure que moi.",
            "Madeleine Beaumont est venue chez ma mère quand j'étais petite fille.",
            "Elle nous racontait Paris, Londres, Rome... des endroits que je n'avais jamais vus.",
            "Elle faisait paraître le monde entier tout proche, comme s'il était juste à côté.",
            "Ses histoires ont changé ma vie. C'est pour ça que je suis devenue conteuse.",
            "Merci, Léa. Tu portes son don."
        ],
        fatima_madeleine_tale: [
            "Laisse-moi te raconter une dernière histoire sur Madeleine...",
            "Quand elle est venue à Marrakech, elle ne parlait pas un mot d'arabe.",
            "Mais elle s'est assise sur la place du marché et a dessiné dans la poussière.",
            "Les enfants se sont rassemblés, puis les adultes. Bientôt toute la place regardait !",
            "Elle a dessiné la Tour Eiffel, Big Ben, le Colisée...",
            "Et tout le monde l'a comprise parfaitement. C'est ça le pouvoir des histoires."
        ],

        aiko_side_start: [
            "Oh non ! Mon chat Mochi s'est encore échappé !",
            "Elle adore poursuivre les papillons dans la forêt de bambous.",
            "Mais c'est dangereux là-bas — les chemins tournent et se tordent !",
            "Tu pourrais la ramener si tu la trouves ?",
            "Elle est orange et toute douce. Tu ne peux pas la rater !"
        ],
        aiko_side_return: [
            "Mochi ! Tu l'as trouvée ! Oh, merci, merci !",
            "On dirait qu'elle a vécu toute une aventure.",
            "Pour te remercier, laisse-moi t'apprendre quelque chose...",
            "En japonais, on dit « Arigatou gozaimasu » — ça veut dire « merci beaucoup ».",
            "Et « Tomodachi » veut dire « ami ». Tu es ma tomodachi, Léa !",
            "Madeleine-san connaissait ces mots aussi. Yuki-san me l'a dit."
        ],

        // === TRADING CHAIN ===
        karim_wants_scroll: [
            "Hmm, tu veux une épice rare ? J'ai peut-être quelque chose...",
            "Mais d'abord, il me faut un ancien parchemin d'histoire pour ma collection.",
            "Youssef le conteur en a peut-être un. Il collectionne les vieux manuscrits."
        ],
        karim_trade: [
            "Un parchemin d'histoire ! C'est exactement ce que je cherchais !",
            "La calligraphie est exquise... du 14e siècle, je dirais.",
            "Comme promis, voici mon épice la plus rare — l'Étoile de l'Atlas.",
            "Elle vaut plus que de l'or dans certains endroits !"
        ],
        karim_gives_spice: [
            "Tu veux commencer le grand commerce ? Très bien !",
            "Voici un lot de mes meilleures épices pour commencer.",
            "Porte-les à Tariq le marchand de tapis — il cherche des épices.",
            "Il te donnera quelque chose de bien en retour, et le commerce tourne !"
        ],
        tariq_wants_spice: [
            "Un beau tapis, tu dis ? J'ai les plus beaux !",
            "Mais pour mon meilleur tapis, il me faut un lot d'épices rares.",
            "Karim le marchand d'épices a ce qu'il me faut.",
            "Apporte-moi un lot d'épices et le tapis est à toi !"
        ],
        tariq_trade: [
            "Ah, un lot d'épices ! Excellente qualité !",
            "Voici mon plus beau tapis — tissé avec des motifs des montagnes de l'Atlas.",
            "On dit que Madeleine s'est assise sur ce même tapis pour lire ses cartes !"
        ],
        youssef_wants_carpet: [
            "Un parchemin d'histoire ? J'en ai un magnifique !",
            "Mais il me faut un beau tapis pour m'asseoir quand je raconte mes histoires.",
            "Tariq le marchand de tapis a les meilleurs. Apporte-moi un de ses tapis !"
        ],
        youssef_trade: [
            "Quel magnifique tapis ! Je serai superbe en racontant des histoires dessus !",
            "Comme promis, voici un ancien parchemin d'histoire.",
            "Il raconte l'histoire d'une princesse marchande qui a parcouru la Route de la Soie.",
            "Porte-le à Karim — il en cherchait un comme celui-ci."
        ],

        // === CHOICE DIALOG LOCALIZATIONS ===
        pierre_has_brush_choice: {
            preamble: [
                "Mon pinceau ! Tu l'as retrouv\u00E9 ! Merci beaucoup !",
                "Mais dis-moi \u2014 comment tu l'as trouv\u00E9 ?"
            ],
            choices: [
                { text: "Colette au stand de fleurs l'avait !", response: ["Ah, Colette ! Elle veille toujours sur moi.", "Tu sais, une fois elle a retrouv\u00E9 tout mon set de peinture dans ses tulipes !", "Comme promis, voici un coupe-file pour la Tour Eiffel.", "Et un petit secret \u2014 dis \u00E0 la photographe Marie que c'est moi qui t'envoie. Elle conna\u00EEt les meilleures vues !"] },
                { text: "Je suis tomb\u00E9e dessus par hasard.", response: ["Ha ! Parfois les meilleures d\u00E9couvertes sont des accidents !", "C'est ce que Madeleine disait toujours, tu sais.", "Comme promis, voici un coupe-file pour la Tour Eiffel.", "Montre-le \u00E0 l'employ\u00E9e \u00E0 l'entr\u00E9e de la tour."] },
                { text: "Un petit oiseau m'a dit o\u00F9 chercher !", response: ["Ha ha ! Un petit oiseau ? \u00C0 Paris, m\u00EAme les pigeons sont serviables !", "Tu me rappelles quelqu'un... une exploratrice venue ici il y a longtemps.", "Comme promis, voici un coupe-file pour la Tour Eiffel.", "Bonne chance l\u00E0-haut \u2014 j'ai le sentiment que tu vas trouver quelque chose de sp\u00E9cial !"] }
            ]
        },
        thomas_intro_choice: {
            preamble: [
                "H\u00E9 ! Je suis en voyage scolaire. Ce mus\u00E9e est \u00C9NORME !",
                "J'ai trouv\u00E9 ces dr\u00F4les de lunettes sur un banc. Elles ont l'air vieilles.",
                "Je crois qu'elles appartiennent \u00E0 ce professeur... mais j'ai peur de les rendre.",
                "Qu'est-ce que je devrais faire ?"
            ],
            choices: [
                { text: "T'inqui\u00E8te pas, tu as bien fait !", response: ["Tu crois ? Merci ! \u00C7a me rassure.", "Tiens, tu peux les rendre pour moi. Dis au professeur que c'est Thomas qui les a trouv\u00E9es !", "Je veux devenir arch\u00E9ologue quand je serai grand.", "Trouver des trucs, c'est notre m\u00E9tier, non ?"] },
                { text: "Le Professeur Higgins en a vraiment besoin.", response: ["Ouais, t'as raison. Il plisse les yeux sur tout depuis ce matin !", "Tiens, prends-les. Je ne veux pas avoir d'ennuis.", "Bonne chance pour ton aventure \u2014 je vois bien que tu cherches quelque chose !"] },
                { text: "Tu pourrais les garder en souvenir...", response: ["Ha ! Tentant, mais... non, ce ne serait pas bien.", "Ma ma\u00EEtresse dit que \u00AB qui trouve garde \u00BB, c'est pas comme \u00E7a que font les vrais explorateurs.", "Tiens, apporte-les au professeur. Moi, j'ai des momies \u00E0 regarder !"] }
            ]
        },
        hassan_with_locket_choice: {
            preamble: [
                "Attends... ce symbole sur ton m\u00E9daillon...",
                "Je l'ai d\u00E9j\u00E0 vu ! Ma grand-m\u00E8re me l'a montr\u00E9.",
                "Une femme est venue ici il y a de nombreuses ann\u00E9es. Madeleine, elle s'appelait.",
                "Elle a laiss\u00E9 quelque chose \u00E0 ma famille pour le garder en s\u00E9curit\u00E9.",
                "Que voudrais-tu savoir ?"
            ],
            choices: [
                { text: "Comment \u00E9tait Madeleine ?", response: ["Ma grand-m\u00E8re disait qu'elle \u00E9tait intrépide ! Elle est arriv\u00E9e seule, parlant un arabe parfait.", "Elle a bu du th\u00E9 \u00E0 la menthe avec nous pendant trois jours, racontant des histoires de Paris et Londres.", "Elle riait beaucoup. Grand-m\u00E8re disait que son rire pouvait remplir tout le souk !", "Tiens \u2014 c'est le journal qu'elle a laiss\u00E9. \u00C0 l'int\u00E9rieur, il y a un dessin d'une oasis dans le d\u00E9sert.", "On dit qu'une guide nomm\u00E9e Nadia sait o\u00F9 elle se trouve.", "Mais elle a perdu l'amulette de sa grand-m\u00E8re. Peut-\u00EAtre que tu peux l'aider ?"] },
                { text: "Qu'est-ce qu'elle vous a laiss\u00E9 ?", response: ["Un journal ! Ma famille le garde depuis pr\u00E8s de 100 ans.", "Nous avions promis \u00E0 Madeleine de ne le donner qu'\u00E0 quelqu'un portant le m\u00E9daillon.", "Et te voil\u00E0 ! Elle devait savoir que quelqu'un viendrait.", "\u00C0 l'int\u00E9rieur, il y a un \u00E9trange dessin d'une oasis dans le d\u00E9sert...", "On dit qu'une guide nomm\u00E9e Nadia sait o\u00F9 elle se trouve.", "Mais elle a perdu l'amulette de sa grand-m\u00E8re. Peut-\u00EAtre que tu peux l'aider ?"] },
                { text: "Pourquoi est-elle venue \u00E0 Marrakech ?", response: ["Elle suivait une carte \u2014 des morceaux \u00E9parpill\u00E9s \u00E0 travers le monde.", "Mais je crois qu'elle est aussi venue pour les histoires. Marrakech est une ville d'histoires.", "Chaque carreau, chaque \u00E9pice, chaque tapis a une histoire \u00E0 raconter.", "Elle a laiss\u00E9 ce journal. \u00C0 l'int\u00E9rieur, il y a un dessin d'une oasis dans le d\u00E9sert...", "On dit qu'une guide nomm\u00E9e Nadia sait o\u00F9 elle se trouve.", "Mais elle a perdu l'amulette de sa grand-m\u00E8re. Peut-\u00EAtre que tu peux l'aider ?"] }
            ]
        },
        tanaka_riddle_choice: {
            preamble: [
                "\u00AB Patience, Courage et Sagesse. \u00BB",
                "Tu connais les trois v\u00E9rit\u00E9s ! Mais voici l'\u00E9preuve finale.",
                "Quel est le sens de ces trois v\u00E9rit\u00E9s r\u00E9unies ?"
            ],
            choices: [
                { text: "Comprendre les autres est la plus grande force.", response: ["Oui ! C'est la r\u00E9ponse que Madeleine elle-m\u00EAme a donn\u00E9e !", "La patience pour \u00E9couter. Le courage pour tendre la main. La sagesse pour comprendre.", "La porte scell\u00E9e est maintenant ouverte. Tu peux entrer dans la for\u00EAt de bambous.", "Fais attention \u2014 la for\u00EAt est enchant\u00E9e. Suis le renard si tu te perds."] },
                { text: "Elles font de toi un grand guerrier.", response: ["Hmm... un guerrier en a besoin, oui. Mais ce n'est pas le sens le plus profond.", "R\u00E9fl\u00E9chis \u00E0 ce qui relie la patience, le courage et la sagesse...", "Reviens quand tu auras m\u00E9dit\u00E9 plus profond\u00E9ment."] },
                { text: "Elles aident \u00E0 trouver un tr\u00E9sor.", response: ["Un tr\u00E9sor ? Peut-\u00EAtre... mais pas celui auquel tu penses !", "Le vrai tr\u00E9sor, ce n'est ni l'or ni les bijoux. Pense aux gens.", "Reviens quand tu auras une autre r\u00E9ponse."] }
            ]
        },
        tanaka_riddle_hint1: {
            preamble: [
                "Tu es revenue. Les trois v\u00E9rit\u00E9s attendent toujours ta r\u00E9ponse.",
                "Souviens-toi : patience, courage et sagesse cr\u00E9ent ensemble quelque chose de plus grand.",
                "Qu'est-ce que c'est ?"
            ],
            choices: [
                { text: "Comprendre les autres est la plus grande force.", response: ["Oui ! Maintenant tu vois !", "La patience pour \u00E9couter. Le courage pour tendre la main. La sagesse pour comprendre.", "La porte scell\u00E9e est maintenant ouverte. Tu peux entrer dans la for\u00EAt de bambous.", "Fais attention \u2014 la for\u00EAt est enchant\u00E9e. Suis le renard si tu te perds."] },
                { text: "Elles te rendent puissant.", response: ["La puissance seule n'est pas la r\u00E9ponse...", "Pense \u00E0 comment la patience, le courage et la sagesse t'aident \u00E0 te connecter aux autres.", "Reviens quand tu seras pr\u00EAte."] }
            ]
        },
        tanaka_riddle_hint2: {
            preamble: [
                "Bon retour. Essayons encore.",
                "Le tr\u00E9sor que Madeleine cherchait n'\u00E9tait pas mat\u00E9riel.",
                "Que d\u00E9verrouillent vraiment la patience, le courage et la sagesse ?"
            ],
            choices: [
                { text: "Comprendre les autres est la plus grande force.", response: ["Oui ! C'est la r\u00E9ponse !", "La patience pour \u00E9couter. Le courage pour tendre la main. La sagesse pour comprendre.", "La porte scell\u00E9e est maintenant ouverte. Tu peux entrer dans la for\u00EAt de bambous.", "Fais attention \u2014 la for\u00EAt est enchant\u00E9e. Suis le renard si tu te perds."] },
                { text: "Elles d\u00E9verrouillent d'anciens secrets.", response: ["Pas tout \u00E0 fait... Pense aux gens, pas aux secrets.", "Madeleine a voyag\u00E9 \u00E0 travers le monde non pour un tr\u00E9sor, mais pour les liens.", "Reviens quand tu comprendras."] }
            ]
        },
        marco_torch_choice: {
            preamble: [
                "Les tunnels se s\u00E9parent en trois chemins ici.",
                "Chacun est marqu\u00E9 par des torches diff\u00E9rentes.",
                "Quel chemin devrais-je te recommander ?"
            ],
            choices: [
                { text: "Suivre les torches allum\u00E9es \u00E0 gauche.", response: ["Le chemin de gauche ! Oui, ces torches br\u00FBlent d'une flamme ancienne.", "Elles sont allum\u00E9es depuis l'\u00E9poque romaine \u2014 du moins c'est ce que dit la l\u00E9gende.", "Je les ai suivies une fois et j'ai trouv\u00E9 une salle incroyable en dessous !", "Vas-y \u2014 les catacombes inf\u00E9rieures t'attendent !"] },
                { text: "Prendre le passage sombre du milieu.", response: ["Le passage du milieu ? J'ai essay\u00E9 une fois...", "J'ai march\u00E9 dix minutes et je me suis retrouv\u00E9 ici m\u00EAme !", "Les Romains ont construit ces tunnels comme un labyrinthe. Les chemins non \u00E9clair\u00E9s font des boucles.", "Essaie un chemin avec des torches \u2014 la lumi\u00E8re montre le chemin."] },
                { text: "Suivre les torches vacillantes \u00E0 droite.", response: ["Le chemin de droite... ces torches vacillent \u00E0 cause d'un courant d'air.", "Il m\u00E8ne \u00E0 un cul-de-sac pr\u00E8s du vieux puits de ventilation.", "Les flammes stables sont celles que les anciens ont plac\u00E9es comme guides.", "Cherche les torches qui br\u00FBlent r\u00E9guli\u00E8rement \u2014 elles marquent le vrai chemin."] }
            ]
        }
    }
};
