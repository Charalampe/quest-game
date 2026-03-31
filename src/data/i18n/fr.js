export default {
    ui: {
        title: "Le Médaillon\n  des Mondes",
        subtitle: "Un Mystère à Travers le Monde",
        newGame: "Nouvelle Partie",
        continue: "Continuer",
        version: "v1.0",
        hudHints: "I:Objets Q:Quêtes M:Carte",
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
        fallbackDialog: "..."
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
        tokyo_shrine_sign_5_4: "« La sagesse complète ce que la patience et le courage ont commencé. »"
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
        jade_key: { name: "Clé de jade", description: "Une belle clé de jade qui ouvre la porte du jardin sacré." }
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

        tariq_intro: [
            "Les plus beaux tapis de tout Marrakech !",
            "On dirait que tu cherches quelque chose...",
            "Nadia ? Oui, je la connais. C'est la guide du désert.",
            "Mais elle est triste — elle a perdu l'amulette de sa grand-mère.",
            "Quelqu'un a dit qu'elle est tombée dans la cour du vieux riad tout près."
        ],

        zahra_intro: [
            "Bienvenue dans le riad caché. Peu de visiteurs trouvent cet endroit.",
            "J'entretiens ce vieux bâtiment. Il a une belle fontaine.",
            "J'ai vu quelque chose de brillant près de la fontaine l'autre jour...",
            "Une petite amulette, peut-être ? Regarde près de l'eau."
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
        ]
    }
};
