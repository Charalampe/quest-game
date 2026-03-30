export default {
    ui: {
        title: "Le M\u00E9daillon\n  des Mondes",
        subtitle: "Un Myst\u00E8re \u00E0 Travers le Monde",
        newGame: "Nouvelle Partie",
        continue: "Continuer",
        version: "v1.0",
        hudHints: "I:Objets Q:Qu\u00EAtes M:Carte",
        inventory: "INVENTAIRE",
        inventoryEmpty: "Aucun objet pour l'instant.\n\nExplore et parle aux\ngens pour trouver des indices !",
        inventoryClose: "Appuie sur I pour fermer",
        questLog: "JOURNAL DE QU\u00CATE",
        questLogEmpty: "Aucune qu\u00EAte en cours.\n\nParle aux gens pour\nd\u00E9couvrir des aventures !",
        questLogClose: "Appuie sur Q pour fermer",
        worldMap: "CARTE DU MONDE",
        selectDestination: "Choisis une destination",
        worldMapHint: "Clique sur une ville ou appuie sur \u00C9CHAP pour revenir",
        travelTo: "Voyager \u00E0 {city}",
        youMarker: "TOI",
        routeLocked: "Route verrouill\u00E9e",
        routeLockedHint: "Tu dois d'abord d\u00E9bloquer ce moyen de transport",
        noDirectRoute: "Pas de route directe vers {city}",
        noDirectRouteHint: "Essaie de passer par une autre ville",
        travelingBy: "Voyage en {route}...",
        noTravelRoutes: "Tu n'as pas encore d\u00E9bloqu\u00E9 de routes de voyage.",
        cancel: "Annuler",
        chestEmpty: "Le coffre est vide.",
        chestLocked: "Le coffre est verrouill\u00E9.",
        chestFound: "Trouv\u00E9 : {name} !",
        portalActive: "Le portail scintille d'\u00E9nergie magique. O\u00F9 veux-tu aller ?",
        portalInactive: "Un \u00E9trange scintillement flotte dans l'air, mais rien ne se passe...",
        signDefault: "Un panneau us\u00E9 par le temps.",
        objectiveComplete: "Objectif termin\u00E9 !",
        newDestination: "Nouvelle destination : {city} !",
        congratulations: "F\u00E9licitations ! Tu as trouv\u00E9 le tr\u00E9sor !",
        gotItem: "Obtenu : {name}",
        fallbackDialog: "..."
    },
    travel: {
        eurostar: "Eurostar",
        nightTrain: "Train de nuit",
        trainViaParis: "Train via Paris",
        boatMediterranean: "Bateau \u00E0 travers la M\u00E9diterran\u00E9e",
        boatItaly: "Bateau vers l'Italie",
        magicPortal: "Portail magique"
    },
    signs: {
        paris_sign_4_12: "Librairie du Pont - Livres et Cartes",
        paris_sign_27_12: "Maison de Grand-m\u00E8re",
        london_sign_14_5: "The British Museum - Fond\u00E9 en 1753",
        rome_sign_14_9: "Fontana di Trevi - Fais un v\u0153u",
        marrakech_sign_23_7: "Marchand de Merveilles",
        tokyo_sign_14_5: "Jardin Secret - Entrez avec pr\u00E9caution"
    },
    cities: {
        paris: "La Ville Lumi\u00E8re",
        london: "La Ville du Brouillard",
        rome: "La Ville \u00C9ternelle",
        marrakech: "La Ville Rouge",
        tokyo: "La Ville de l'Harmonie"
    },
    items: {
        locket: { name: "M\u00E9daillon myst\u00E9rieux", description: "Un m\u00E9daillon dor\u00E9 orn\u00E9 avec un message cod\u00E9 \u00E0 l'int\u00E9rieur." },
        letter: { name: "Lettre de Madeleine", description: "Une lettre d'introduction \u00E9crite par Madeleine Beaumont." },
        map_fragment: { name: "Fragment de carte", description: "Un morceau d'une carte ancienne pointant vers Rome." },
        key: { name: "Cl\u00E9 ancienne", description: "Une petite cl\u00E9 orn\u00E9e grav\u00E9e d'une rose des vents." },
        journal: { name: "Journal de l'exploratrice", description: "Le journal de Madeleine avec le dernier indice." },
        coin: { name: "Vieille pi\u00E8ce", description: "Une vieille pi\u00E8ce fran\u00E7aise grav\u00E9e d'une rose des vents." },
        book: { name: "Livre cach\u00E9", description: "Un livre cach\u00E9 derri\u00E8re la fontaine avec des notes sur Marrakech." },
        gem: { name: "Gemme de Compr\u00E9hension", description: "Une gemme magique qui permet de comprendre toutes les langues. Le plus grand tr\u00E9sor !" }
    },
    quests: {
        main_quest: {
            name: "Le M\u00E9daillon des Mondes",
            description: "Suis la piste du tr\u00E9sor cach\u00E9 de Madeleine Beaumont \u00E0 travers le monde.",
            objectives: {
                paris_find_locket: { text: "Trouver le m\u00E9daillon myst\u00E9rieux \u00E0 Paris", hint: "Rends visite \u00E0 Grand-m\u00E8re \u00C9lise dans l'est de Paris." },
                paris_visit_librarian: { text: "Montrer le m\u00E9daillon au libraire", hint: "Rends visite \u00E0 Monsieur Dupont \u00E0 la librairie pr\u00E8s de la Seine." },
                london_find_map: { text: "Trouver le fragment de carte \u00E0 Londres", hint: "Montre la lettre au Dr. Wellington au British Museum." },
                rome_talk_historian: { text: "Enqu\u00EAter sur la fontaine de Tr\u00E9vi \u00E0 Rome", hint: "Parle \u00E0 la Professoressa Rossi pr\u00E8s de la fontaine." },
                rome_open_chest: { text: "Utiliser la cl\u00E9 pour ouvrir le secret de la fontaine", hint: "Ouvre le coffre pr\u00E8s de la fontaine." },
                marrakech_find_journal: { text: "Trouver le journal de Madeleine \u00E0 Marrakech", hint: "Montre le m\u00E9daillon \u00E0 Hassan le marchand." },
                tokyo_talk_gardener: { text: "Trouver le gardien du jardin secret \u00E0 Tokyo", hint: "Montre le journal \u00E0 Yuki-san dans le jardin." },
                tokyo_find_treasure: { text: "D\u00E9couvrir le tr\u00E9sor", hint: "Ouvre le coffre dans le jardin secret." }
            }
        }
    },
    dialogues: {
        // === PARIS ===
        grandma_intro: [
            "Oh, L\u00E9a ! Viens ici, ma ch\u00E9rie.",
            "Je nettoyais le grenier et j'ai trouv\u00E9 quelque chose d'extraordinaire...",
            "Ce m\u00E9daillon appartenait \u00E0 ton arri\u00E8re-arri\u00E8re-grand-m\u00E8re, Madeleine Beaumont.",
            "C'\u00E9tait une exploratrice c\u00E9l\u00E8bre ! Mais sa plus grande d\u00E9couverte n'a jamais \u00E9t\u00E9 trouv\u00E9e...",
            "Il y a un message cod\u00E9 \u00E0 l'int\u00E9rieur. Tu peux le lire ?",
            "\u00AB L\u00E0 o\u00F9 le savoir coule comme la rivi\u00E8re, cherche le gardien des histoires. \u00BB",
            "On dirait la vieille librairie pr\u00E8s de la Seine ! Va parler \u00E0 Monsieur Dupont."
        ],
        grandma_after_locket: [
            "Fais attention, L\u00E9a !",
            "Le journal de Madeleine dit que le tr\u00E9sor est quelque chose de vraiment sp\u00E9cial.",
            "Je sais que tu peux le trouver. Tu as son esprit d'aventure !"
        ],
        librarian_intro: [
            "Bonjour ! Bienvenue \u00E0 la Librairie du Pont.",
            "Nous avons des livres du monde entier. N'h\u00E9site pas \u00E0 regarder !"
        ],
        librarian_with_locket: [
            "Mon Dieu ! Est-ce que c'est... le M\u00E9daillon Beaumont ?!",
            "J'ai lu des choses \u00E0 ce sujet dans les vieilles archives !",
            "Madeleine Beaumont a voyag\u00E9 \u00E0 travers le monde pour rassembler les morceaux d'une carte.",
            "Chaque morceau m\u00E8ne \u00E0 l'endroit suivant...",
            "Laisse-moi voir le message cod\u00E9... Ah oui !",
            "\u00AB Le gardien de l'histoire d\u00E9tient le premier fragment, de l'autre c\u00F4t\u00E9 de la Manche. \u00BB",
            "\u00C7a doit \u00EAtre le British Museum \u00E0 Londres !",
            "Tiens, prends cette vieille lettre. C'est une r\u00E9f\u00E9rence de Madeleine elle-m\u00EAme.",
            "Montre-la au conservateur l\u00E0-bas. \u00C7a devrait t'aider \u00E0 entrer."
        ],
        librarian_after_quest: [
            "Bon voyage, L\u00E9a ! Londres t'attend.",
            "N'oublie pas, le British Museum est ta destination.",
            "Appuie sur M pour ouvrir la carte du monde quand tu es pr\u00EAte."
        ],
        sophie_intro: [
            "Salut ! Je suis Sophie. J'adore explorer Paris !",
            "Tu as visit\u00E9 la Tour Eiffel ? C'est juste au nord d'ici.",
            "Il y a aussi un magnifique parc au nord-ouest.",
            "Astuce : utilise ZQSD ou les fl\u00E8ches pour te d\u00E9placer, et ESPACE pour interagir !"
        ],
        sophie_after_quest: [
            "J'ai entendu dire que tu partais \u00E0 l'aventure ! Trop cool !",
            "J'aimerais tellement venir avec toi. Raconte-moi tout \u00E0 ton retour !",
            "Appuie sur I pour v\u00E9rifier ton inventaire, et Q pour ton journal de qu\u00EAte."
        ],

        // === LONDON ===
        curator_intro: [
            "Bienvenue au British Museum. Ne touchez pas aux objets expos\u00E9s, s'il vous pla\u00EEt.",
            "Nous avons des artefacts des quatre coins du monde."
        ],
        curator_with_letter: [
            "Qu'est-ce que c'est ? Une lettre de... Madeleine Beaumont ?!",
            "Extraordinaire ! Je pensais que ce n'\u00E9taient que des l\u00E9gendes.",
            "Oui, nous avons un fragment de carte dans nos archives.",
            "Il a \u00E9t\u00E9 donn\u00E9 anonymement il y a des d\u00E9cennies.",
            "Laissez-moi aller le chercher... Voil\u00E0.",
            "Il montre un chemin menant \u00E0 Rome, \u00E0 la fontaine de Tr\u00E9vi.",
            "Il y a une inscription : \u00AB L\u00E0 o\u00F9 les pi\u00E8ces rencontrent les v\u0153ux, la pierre r\u00E9v\u00E8le. \u00BB",
            "Tu dois aller \u00E0 Rome et enqu\u00EAter sur la fontaine !"
        ],
        curator_after_quest: [
            "La carte pointe vers Rome. La fontaine de Tr\u00E9vi pr\u00E9cis\u00E9ment.",
            "Madeleine \u00E9tait brillante pour cacher ses indices en pleine vue.",
            "Bonne chance, jeune exploratrice !"
        ],
        guard_intro: [
            "On ne court pas dans le mus\u00E9e, s'il vous pla\u00EEt.",
            "L'aile des artefacts antiques est au nord."
        ],
        emma_intro: [
            "Bonjour ! Tu visites Londres ?",
            "Le mus\u00E9e est incroyable. Dr. Wellington sait tout sur les anciens explorateurs.",
            "Si tu as quelque chose d'int\u00E9ressant, montre-le-lui absolument !"
        ],

        // === ROME ===
        rossi_intro: [
            "Buongiorno ! La fontaine est magnifique, n'est-ce pas ?",
            "On dit que si tu lances une pi\u00E8ce, tu reviendras \u00E0 Rome un jour."
        ],
        rossi_with_map: [
            "Un fragment de carte ? De la collection Beaumont ?!",
            "Je suis historienne sp\u00E9cialis\u00E9e dans les femmes exploratrices. C'est incroyable !",
            "L'inscription mentionne \u00AB la pierre r\u00E9v\u00E8le \u00BB...",
            "Je pense que tu dois examiner la fontaine de plus pr\u00E8s.",
            "Il devrait y avoir un compartiment cach\u00E9 pr\u00E8s de la base.",
            "Cherche une pierre avec le symbole de Madeleine \u2014 une rose des vents.",
            "Tiens, prends cette cl\u00E9 sp\u00E9ciale. Je l'ai trouv\u00E9e il y a des ann\u00E9es pr\u00E8s de la fontaine.",
            "Je me suis toujours demand\u00E9 \u00E0 quoi elle servait. Maintenant je crois que je sais !"
        ],
        rossi_after_key: [
            "Utilise la cl\u00E9 pr\u00E8s de la fontaine !",
            "Il doit y avoir un compartiment cach\u00E9 quelque part.",
            "V\u00E9rifie le coffre pr\u00E8s du bord de la fontaine."
        ],
        rossi_after_quest: [
            "Marrakech ! Quelle aventure !",
            "Les anciennes routes commerciales reliaient Rome \u00E0 l'Afrique du Nord.",
            "Madeleine a d\u00FB prendre un bateau \u00E0 travers la M\u00E9diterran\u00E9e."
        ],
        marco_intro: [
            "Ciao ! Je peins la fontaine aujourd'hui.",
            "La lumi\u00E8re \u00E0 Rome est parfaite pour l'art.",
            "Tu as remarqu\u00E9 les \u00E9tranges symboles grav\u00E9s dans les pierres ?"
        ],
        giulia_intro: [
            "Bienvenue \u00E0 Rome ! La Ville \u00C9ternelle !",
            "Chaque pierre ici raconte une histoire vieille de milliers d'ann\u00E9es.",
            "Si tu cherches des secrets, parle \u00E0 la Professoressa Rossi pr\u00E8s de la fontaine."
        ],

        // === MARRAKECH ===
        hassan_intro: [
            "Bienvenue, bienvenue ! Les plus beaux tr\u00E9sors du Sahara !",
            "\u00C9pices, tissus, bijoux \u2014 tout ce que ton c\u0153ur d\u00E9sire !"
        ],
        hassan_with_locket: [
            "Attends... ce symbole sur ton m\u00E9daillon...",
            "Je l'ai d\u00E9j\u00E0 vu ! Ma grand-m\u00E8re me l'a montr\u00E9.",
            "Une femme est venue ici il y a de nombreuses ann\u00E9es. Madeleine, elle s'appelait.",
            "Elle a laiss\u00E9 quelque chose \u00E0 ma famille pour le garder en s\u00E9curit\u00E9.",
            "Un livre... non, pas n'importe quel livre. Un journal !",
            "Mais elle a dit que seule une personne avec le m\u00E9daillon pouvait le r\u00E9clamer.",
            "Le voici. Et \u00E0 l'int\u00E9rieur, il y a un \u00E9trange dessin...",
            "Il montre un jardin \u00E0 l'est, avec des cerisiers en fleurs.",
            "Et il y a un symbole qui brille \u2014 une pierre de portail !",
            "Ma grand-m\u00E8re disait que c'\u00E9tait de la magie. Je ne l'ai jamais crue... jusqu'\u00E0 maintenant."
        ],
        hassan_after_quest: [
            "Le journal parle d'un jardin secret \u00E0 Tokyo.",
            "Madeleine a \u00E9crit que les pierres de portail relient des endroits \u00E9loign\u00E9s.",
            "Utilise le portail \u2014 il devrait t'emmener \u00E0 Tokyo maintenant !",
            "Que ton voyage soit b\u00E9ni, jeune exploratrice."
        ],
        fatima_intro: [
            "Ah, une jeune voyageuse ! Assieds-toi, assieds-toi.",
            "Laisse-moi te raconter l'histoire de la Ville Rouge...",
            "Marrakech est un lieu de rencontre des cultures depuis des si\u00E8cles.",
            "Si tu cherches quelque chose, le marchand Hassan conna\u00EEt tout le monde."
        ],
        amina_intro: [
            "Salut ! Je suis Amina. La m\u00E9dina, c'est un vrai labyrinthe, non ?",
            "T'inqui\u00E8te pas, tu ne peux pas vraiment te perdre. Les chemins ram\u00E8nent toujours \u00E0 la place !",
            "La boutique d'Hassan est \u00E0 l'est. C'est le marchand le plus c\u00E9l\u00E8bre ici."
        ],

        // === TOKYO ===
        yuki_intro: [
            "Bienvenue dans le jardin secret. Peu de visiteurs trouvent cet endroit.",
            "Les cerisiers sont en fleurs depuis des si\u00E8cles."
        ],
        yuki_with_journal: [
            "Tu portes le journal de Madeleine ? Alors tu es celle qu'on attendait.",
            "Elle a plant\u00E9 ces cerisiers elle-m\u00EAme, il y a de nombreuses ann\u00E9es.",
            "Et elle a laiss\u00E9 son plus grand tr\u00E9sor ici, au c\u0153ur du jardin.",
            "Le coffre sous l'arbre le plus vieux...",
            "Il contient ce qu'elle appelait \u00AB Le Don de Compr\u00E9hension \u00BB.",
            "Va, ouvre-le. Tu l'as m\u00E9rit\u00E9 gr\u00E2ce \u00E0 ton voyage \u00E0 travers le monde.",
            "Madeleine serait tellement fi\u00E8re."
        ],
        yuki_after_quest: [
            "Tu l'as trouv\u00E9 ! Le tr\u00E9sor de Madeleine Beaumont !",
            "Une gemme qui permet de comprendre toutes les langues du monde.",
            "Elle disait toujours que le plus grand tr\u00E9sor est la compr\u00E9hension entre les peuples.",
            "Ton aventure ne fait que commencer, L\u00E9a. Le monde est plein de merveilles !"
        ],
        takeshi_intro: [
            "Que la paix soit avec toi, voyageuse.",
            "Ce sanctuaire est debout depuis mille ans.",
            "Le jardin au-del\u00E0 du portail torii est tr\u00E8s sp\u00E9cial.",
            "Seuls ceux qui ont le c\u0153ur pur peuvent trouver ce qu'ils cherchent ici."
        ],
        sakura_intro: [
            "Konnichiwa ! Bienvenue \u00E0 Tokyo !",
            "Le jardin secret est \u00E0 travers les portails torii au nord.",
            "On dit qu'une exploratrice fran\u00E7aise a plant\u00E9 des cerisiers l\u00E0-bas il y a longtemps.",
            "Si tu as quelque chose qui lui appartient, Yuki-san pourra t'aider !"
        ]
    }
};
