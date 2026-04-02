// Dialog choices — branching conversations where the player picks a response.
// Each choice dialog is triggered by NPC dialog routes (replacing or augmenting existing dialogs).
// Format: lines[] are shown first, then choices[] presented, each leading to different response lines
// and optionally setting different flags.

export const DIALOG_CHOICES = {
    // Paris: Pierre asks how you found his paintbrush
    pierre_has_brush_choice: {
        preamble: [
            "My paintbrush! You found it! Merci beaucoup!",
            "But tell me — how did you find it?"
        ],
        choices: [
            {
                text: "Colette at the flower stall had it!",
                response: [
                    "Ah, Colette! She's always looking out for me.",
                    "You know, she once found my entire paint set in her tulips!",
                    "As promised, here's a Fast Pass for the Eiffel Tower.",
                    "And a little secret — tell the photographer Marie I sent you. She knows the best views!"
                ],
                setsFlag: 'pierre_grateful'
            },
            {
                text: "I just stumbled on it by accident.",
                response: [
                    "Ha! Sometimes the best discoveries are accidents!",
                    "That's what Madeleine always said too, you know.",
                    "As promised, here's a Fast Pass for the Eiffel Tower.",
                    "Show it to the attendant at the tower entrance."
                ]
            },
            {
                text: "A little bird told me where to look!",
                response: [
                    "Ha ha! A little bird? In Paris, even the pigeons are helpful!",
                    "You remind me of someone... an explorer who came here long ago.",
                    "As promised, here's a Fast Pass for the Eiffel Tower.",
                    "Good luck up there — I have a feeling you'll find something special!"
                ],
                setsFlag: 'pierre_nostalgic'
            }
        ],
        // These are applied regardless of which choice is made
        givesItem: { id: 'fastpass', name: 'Fast Pass', icon: 'item_letter', description: 'An express ticket to skip the Eiffel Tower queue.' },
        setsFlag: 'paris_has_fastpass',
        completesObjective: 'paris_return_paintbrush'
    },

    // London: Thomas is nervous about returning the glasses
    thomas_intro_choice: {
        preamble: [
            "Hey! I'm on a school trip. This museum is HUGE!",
            "I found these funny glasses on a bench. They look old.",
            "I think they belong to that professor... but I'm nervous to return them.",
            "What should I do?"
        ],
        choices: [
            {
                text: "Don't worry, you did the right thing!",
                response: [
                    "You think so? Thanks! That makes me feel better.",
                    "Here, you can return them for me. Tell the professor Thomas found them!",
                    "I want to be an archaeologist when I grow up.",
                    "Finding things is what we do, right?"
                ],
                setsFlag: 'thomas_encouraged'
            },
            {
                text: "Professor Higgins really needs them back.",
                response: [
                    "Yeah, you're right. He's been squinting at everything all day!",
                    "Here, take them. I don't want to get in trouble.",
                    "Good luck with your adventure — I can tell you're looking for something!"
                ]
            },
            {
                text: "You could keep them as a souvenir...",
                response: [
                    "Ha! Tempting, but... no, that wouldn't be right.",
                    "My teacher says 'finders keepers' isn't how real explorers work.",
                    "Here, you take them to the professor. I've got mummies to look at!"
                ]
            }
        ],
        givesItem: { id: 'reading_glasses', name: 'Reading Glasses', icon: 'item_key', description: "Professor Higgins' lost spectacles." },
        setsFlag: 'london_has_glasses',
        completesObjective: 'london_find_glasses'
    },

    // Marrakech: Hassan tells you about Madeleine — you choose what to ask
    hassan_with_locket_choice: {
        preamble: [
            "Wait... that symbol on your locket...",
            "I have seen it before! My grandmother showed me.",
            "A woman came here many years ago. Madeleine, she was called.",
            "She left something with my family for safekeeping.",
            "What would you like to know?"
        ],
        choices: [
            {
                text: "What was Madeleine like?",
                response: [
                    "My grandmother said she was fearless! She arrived alone, speaking perfect Arabic.",
                    "She drank mint tea with us for three days, telling stories of Paris and London.",
                    "She laughed a lot. Grandmother said her laugh could fill the whole souk!",
                    "Here — this is the journal she left. Inside, there's a drawing of a desert oasis.",
                    "They say a guide named Nadia knows where it is.",
                    "But she lost her grandmother's amulet. Maybe you can help?"
                ],
                setsFlag: 'hassan_told_story'
            },
            {
                text: "What did she leave with you?",
                response: [
                    "A journal! My family has guarded it for nearly 100 years.",
                    "We promised Madeleine we would give it only to someone who carried the locket.",
                    "And here you are! She must have known someone would come.",
                    "Inside, there's a strange drawing of a desert oasis...",
                    "They say a guide named Nadia knows where it is.",
                    "But she lost her grandmother's amulet. Maybe you can help?"
                ]
            },
            {
                text: "Why did she come to Marrakech?",
                response: [
                    "She was following a map — pieces scattered across the world.",
                    "But I think she also came for the stories. Marrakech is a city of stories.",
                    "Every tile, every spice, every carpet has a tale to tell.",
                    "She left this journal. Inside, there's a drawing of a desert oasis...",
                    "They say a guide named Nadia knows where it is.",
                    "But she lost her grandmother's amulet. Maybe you can help?"
                ],
                setsFlag: 'hassan_told_purpose'
            }
        ],
        givesItem: { id: 'journal', name: "Explorer's Journal", icon: 'item_journal', description: "Madeleine's journal with the final clue." },
        setsFlag: 'marrakech_has_journal',
        completesObjective: 'marrakech_find_journal'
    },

    // Tokyo: The shrine riddle becomes a REAL choice
    tanaka_riddle_choice: {
        preamble: [
            "'Patience, Courage, and Wisdom.'",
            "You know the three truths! But here is the final test.",
            "What is the meaning of these three truths together?"
        ],
        choices: [
            {
                text: "Understanding others is the greatest strength.",
                response: [
                    "Yes! That is the answer Madeleine herself gave!",
                    "Patience to listen. Courage to reach out. Wisdom to understand.",
                    "The sealed door is now open. You may enter the bamboo forest.",
                    "Be careful — the forest is enchanted. Follow the fox if you get lost."
                ],
                setsFlag: 'tanaka_impressed'
            },
            {
                text: "They make you a great warrior.",
                response: [
                    "Hmm... a warrior needs these, yes. But that is not the deepest meaning.",
                    "Think again — what connects patience, courage, and wisdom?",
                    "...Actually, I see the truth in your eyes. You already understand.",
                    "The sealed door is now open. You may enter the bamboo forest.",
                    "Be careful — the forest is enchanted. Follow the fox if you get lost."
                ]
            },
            {
                text: "They help you find treasure.",
                response: [
                    "Treasure? Perhaps... but not the kind you might think!",
                    "The real treasure is understanding between people.",
                    "Patience, Courage, Wisdom — together they open hearts, not just doors.",
                    "The sealed door is now open. You may enter the bamboo forest.",
                    "Be careful — the forest is enchanted. Follow the fox if you get lost."
                ]
            }
        ],
        setsFlag: 'tokyo_riddle_solved',
        completesObjective: 'tokyo_solve_riddle'
    }
};
