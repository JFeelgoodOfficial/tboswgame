// ============================================================
// THE BOOK OF SHADOW WORK — DIALOGUE TREES (FIXED)
// All dialogue sourced directly from TBOSW by J. Feelgood
// ============================================================

// ============================================================
// GAME STATE MANIFEST
// Defines traversal order, scene entry conditions, and flags.
// The engine reads this to know which scene loads next and
// whether prerequisites have been met.
// ============================================================

export const PLAYER_CHARACTER = "BOY"; // BOY lines render as player speech

export const FLAGS = {
  crossedRiver:       false,
  heardNPCStory:      false,
  leftTheLine:        false,
  embracedWarrior:    false,
  sawShadowSelf:      false,
  metStranger:        false,
  pickedUpMask:       null, // null = not yet decided; true/false after mask scene
  waitedOnce:         false,
  waitedTwice:        false,
};

export const SCENE_MANIFEST = [
  {
    id: "field_lady",
    requires: [],
    setsFlag: "crossedRiver",
    next: "field_cloaked",
  },
  {
    id: "field_cloaked",
    requires: ["crossedRiver"],
    next: "line_crowd",
  },
  {
    id: "line_crowd",
    requires: [],
    setsFlag: "leftTheLine",
    next: "desert_warrior",
  },
  {
    id: "desert_warrior",
    requires: [],
    setsFlag: "embracedWarrior",
    next: "darkness_event",
  },
  {
    id: "darkness_event",
    requires: ["embracedWarrior"],
    next: "pillow_scene",
  },
  {
    id: "pillow_scene",
    requires: ["embracedWarrior"],
    next: "round_room",
  },
  {
    id: "round_room",
    requires: [],
    setsFlag: "sawShadowSelf",
    next: "garden_stranger",
  },
  {
    id: "garden_stranger",
    requires: ["sawShadowSelf"],
    setsFlag: "metStranger",
    next: "garden_mask",
  },
  {
    id: "garden_mask",
    requires: ["metStranger"],
    // pickedUpMask flag set here; drives ENDING_A vs ENDING_B
    next: "ending",
  },
  {
    id: "ending",
    requires: [],
    next: null,
  },
];


// ============================================================
// SCENE 1 — THE ENDLESS FIELD: LADY IN WHITE
// ============================================================
// FIX: SHOW_RIVER_CHOICE trigger moved from the silent "..."
// beat to a dedicated NARRATOR node that follows it.
// FIX: BOY established here with a single line at the crossing
// so the speaker label is not introduced cold in Scene 3.
// ============================================================

export const fieldScene_LadyInWhite = {
  id: "field_lady",
  scene: "FieldScene",
  startId: "lady_01",
  lines: {

    lady_01: {
      id: "lady_01", speaker: "NARRATOR",
      text: "She feels your presence but does not look. A single flower rests in her hand.",
      emotion: "quiet", next: "lady_02"
    },
    lady_02: {
      id: "lady_02", speaker: "LADY_IN_WHITE",
      text: "...",
      emotion: "warm", next: "lady_03"
    },
    lady_03: {
      id: "lady_03", speaker: "NARRATOR",
      text: "She places the flower behind your ear. A moment passes. She smiles at you.",
      emotion: "warm", next: "lady_04"
    },
    lady_04: {
      id: "lady_04", speaker: "NARRATOR",
      text: "Across the river — a hooded figure stands. The smile fades from your face.",
      emotion: "hesitant", next: "lady_05"
    },
    lady_05: {
      id: "lady_05", speaker: "NARRATOR",
      text: "You take the flower from behind your ear and hand it back to her.",
      emotion: "neutral", next: "lady_06"
    },
    lady_06: {
      id: "lady_06", speaker: "LADY_IN_WHITE",
      text: "...",
      emotion: "warm", next: "lady_choice"
    },
    // FIX: trigger now fires on narration, not silence
    lady_choice: {
      id: "lady_choice", speaker: "NARRATOR",
      text: "She does not speak. The question hangs in the air like smoke.",
      emotion: "warm",
      trigger: "SHOW_RIVER_CHOICE",
      choices: [
        { label: "Cross the river", next: "lady_cross" },
        { label: "Stay a little longer", next: "lady_stay" }
      ]
    },
    lady_stay: {
      id: "lady_stay", speaker: "NARRATOR",
      text: "She smiles still. She does not push. She does not pull. She simply is.",
      emotion: "warm", next: "lady_cross_prompt"
    },
    lady_cross_prompt: {
      id: "lady_cross_prompt", speaker: "NARRATOR",
      text: "The figure across the river does not move. But something in you does.",
      emotion: "hesitant",
      choices: [{ label: "Cross the river", next: "lady_cross" }]
    },
    lady_cross: {
      id: "lady_cross", speaker: "NARRATOR",
      text: "The water is cold. The current tugs at your ankles. Your breath catches — but you do not stop.",
      emotion: "determined", next: "lady_cross_boy"
    },
    // FIX: BOY introduced here, first spoken line in the game
    lady_cross_boy: {
      id: "lady_cross_boy", speaker: "BOY",
      text: "...",
      emotion: "determined",
      trigger: "TRANSITION_TO_CLOAKED_FIGURE",
      setsFlag: "crossedRiver"
    }
  }
};


// ============================================================
// SCENE 1B — THE ENDLESS FIELD: CLOAKED FIGURE
// ============================================================

export const fieldScene_CloakedFigure = {
  id: "field_cloaked",
  scene: "FieldScene",
  startId: "cloak_01",
  lines: {

    cloak_01: {
      id: "cloak_01", speaker: "NARRATOR",
      text: "You extend your hand in welcome. The cloaked figure does not move.",
      emotion: "neutral", next: "cloak_02"
    },
    cloak_02: {
      id: "cloak_02", speaker: "NARRATOR",
      text: "After a moment, he bows slightly — but does not return the handshake. Your hand falls to your side.",
      emotion: "hesitant", next: "cloak_03"
    },
    cloak_03: {
      id: "cloak_03", speaker: "NARRATOR",
      text: "You begin to walk together. A slow, measured pace.",
      emotion: "neutral", next: "cloak_04"
    },
    cloak_04: {
      id: "cloak_04", speaker: "NARRATOR",
      text: "At first, his face is nothing. A void. But then — a mask. Ornate and intricate. Neither kind nor cruel. Neither alive nor lifeless.",
      emotion: "quiet", next: "cloak_05"
    },
    cloak_05: {
      id: "cloak_05", speaker: "NARRATOR",
      text: "A suggestion of neutrality. A suggestion of confidence. You stare at the mask. He stops walking.",
      emotion: "hesitant",
      choices: [
        { label: "Nod — you are okay with this", next: "cloak_accept" },
        { label: "Look away", next: "cloak_away" }
      ]
    },
    cloak_away: {
      id: "cloak_away", speaker: "NARRATOR",
      text: "You look away. But when you look back — he is still there. Patient. Waiting.",
      emotion: "hesitant", next: "cloak_accept"
    },
    cloak_accept: {
      id: "cloak_accept", speaker: "NARRATOR",
      text: "You nod to yourself. You are okay with this. You continue onward — together.",
      emotion: "determined",
      trigger: "TRANSITION_TO_LINE_SCENE",
      next: "cloak_crowd"
    },
    cloak_crowd: {
      id: "cloak_crowd", speaker: "NARRATOR",
      text: "Ahead, a crowd has gathered in a loose circle. A man stands at the center, speaking with his hands. The others lean in — listening. You and the cloaked figure draw closer, slipping quietly to the edge.",
      emotion: "quiet", next: "cloak_peterhivets_01"
    },
    cloak_peterhivets_01: {
      id: "cloak_peterhivets_01", speaker: "NPC",
      text: "I had finished the script. Tony Laverson suggested I go to Peter Hivets. He said he'd read it — and if he read it, he would stamp it. And if he stamped it, it was a good script.",
      emotion: "neutral", next: "cloak_peterhivets_02",
      setsFlag: "heardNPCStory"
    },
    cloak_peterhivets_02: {
      id: "cloak_peterhivets_02", speaker: "NPC",
      text: "I only had one thousand dollars. But I really needed it stamped. So I gave him my script. And every last dollar.",
      emotion: "hesitant", next: "cloak_peterhivets_03"
    },
    cloak_peterhivets_03: {
      id: "cloak_peterhivets_03", speaker: "NPC",
      text: "There was no stamp. I said — 'There's no stamp.' He said: 'You paid me to READ it. Not to STAMP it. I didn't care for your script. Next time — make sure it's a good story first.'",
      emotion: "broken", next: "cloak_peterhivets_04"
    },
    cloak_peterhivets_04: {
      id: "cloak_peterhivets_04", speaker: "NARRATOR",
      text: "A tear forms on the surface of the cloaked figure's mask. It rolls slowly down. Then — it disappears.",
      emotion: "sad"
    }
  }
};


// ============================================================
// SCENE 2 — THE LINE
// ============================================================

export const lineScene_Crowd = {
  id: "line_crowd",
  scene: "LineScene",
  startId: "line_01",
  lines: {

    line_01: {
      id: "line_01", speaker: "NARRATOR",
      text: "The line stretches forward into the unknown. Time bends — slowing, grueling, stagnant.",
      emotion: "quiet", next: "line_02"
    },
    line_02: {
      id: "line_02", speaker: "NPC",
      text: "Oh, waiting is such a bore.",
      emotion: "neutral", next: "line_03"
    },
    line_03: {
      id: "line_03", speaker: "NPC",
      text: "It is times like these why we practice patience.",
      emotion: "quiet", next: "line_04"
    },
    line_04: {
      id: "line_04", speaker: "NARRATOR",
      text: "Somewhere beyond the haze of waiting, something shimmers. Like mica in clear water. A reminder that wonder still exists.",
      emotion: "neutral", next: "line_choice"
    },
    line_choice: {
      id: "line_choice", speaker: "NARRATOR",
      text: "Something stirs in you — a sensation that rolls beneath your skin like the shift of sand before a windstorm.",
      emotion: "hesitant",
      choices: [
        { label: "Wait", next: "line_wait", condition: (flags) => !flags.waitedTwice },
        { label: "Leave the line", next: "line_leave" }
      ]
    },
    line_wait: {
      id: "line_wait", speaker: "NARRATOR",
      text: "The line does not move. The passage of seasons could be minutes or hours or years.",
      emotion: "quiet",
      setsFlag: "waitedOnce",
      next: (flags) => flags.waitedOnce ? "line_wait_03" : "line_wait_02",
    },
    line_wait_02: {
      id: "line_wait_02", speaker: "BOY",
      text: "...",
      emotion: "quiet", next: "line_choice"
    },
    line_wait_03: {
      id: "line_wait_03", speaker: "NARRATOR",
      text: "The line has not moved. It will not move. You have known this for some time now.",
      emotion: "broken",
      setsFlag: "waitedTwice",
      next: "line_choice"
    },
    line_leave: {
      id: "line_leave", speaker: "NARRATOR",
      text: "Footsteps. A runner. A girl — no older than you — moving with purpose. She arrives in a storm of dust and fire.",
      emotion: "determined",
      trigger: "SPAWN_THE_GIRL",
      next: "line_girl_01",
      setsFlag: "leftTheLine"
    },
    line_girl_01: {
      id: "line_girl_01", speaker: "NARRATOR",
      text: "Impact. She crashes into you. The line moves forward. No one looks. No one cares.",
      emotion: "neutral",
      trigger: "SCREEN_SHAKE",
      next: "line_girl_02"
    },
    line_girl_02: {
      id: "line_girl_02", speaker: "GIRL",
      text: "It's you.",
      emotion: "determined", next: "line_girl_03"
    },
    line_girl_03: {
      id: "line_girl_03", speaker: "GIRL",
      text: "Come. We must go. Now.",
      emotion: "determined",
      trigger: "TRANSITION_TO_DESERT"
    }
  }
};


// ============================================================
// SCENE 3 — THE DESERT OF THE WARRIOR
// ============================================================

export const desertScene_Warrior = {
  id: "desert_warrior",
  scene: "DesertScene",
  startId: "warrior_01",
  lines: {

    warrior_01: {
      id: "warrior_01", speaker: "BOY",
      text: "What's a thinking stone?",
      emotion: "neutral", next: "warrior_02"
    },
    warrior_02: {
      id: "warrior_02", speaker: "GIRL",
      text: "It's where thoughts are made.",
      emotion: "neutral", next: "warrior_03"
    },
    warrior_03: {
      id: "warrior_03", speaker: "GIRL",
      text: "Are you waiting for someone?",
      emotion: "neutral", next: "warrior_04"
    },
    warrior_04: {
      id: "warrior_04", speaker: "WARRIOR",
      text: "I am waiting for nothing. Nothing comes, and nothing goes. I only sit.",
      emotion: "quiet", next: "warrior_choice_01"
    },
    warrior_choice_01: {
      id: "warrior_choice_01", speaker: "BOY",
      text: "...",
      emotion: "hesitant",
      choices: [
        { label: "But why here?", next: "warrior_why" },
        { label: "Are you happy?", next: "warrior_happy" },
        { label: "Sit with him in silence", next: "warrior_sit" }
      ]
    },
    warrior_why: {
      id: "warrior_why", speaker: "BOY",
      text: "But why here?",
      emotion: "neutral", next: "warrior_why_02"
    },
    warrior_why_02: {
      id: "warrior_why_02", speaker: "WARRIOR",
      text: "This stone has been smoothed by a thousand contemplations. Each time I sit, I carve away a little more of myself. One day, there will be nothing left of me — only the stone.",
      emotion: "quiet", next: "warrior_what_then"
    },
    warrior_what_then: {
      id: "warrior_what_then", speaker: "BOY",
      text: "And what will you be then?",
      emotion: "hesitant", next: "warrior_wind"
    },
    warrior_wind: {
      id: "warrior_wind", speaker: "WARRIOR",
      text: "Perhaps I will be the wind. Or perhaps I will be silence. It is the same thing.",
      emotion: "quiet", next: "warrior_happy"
    },
    warrior_happy: {
      id: "warrior_happy", speaker: "GIRL",
      text: "And are you happy?",
      emotion: "neutral", next: "warrior_happy_02"
    },
    warrior_happy_02: {
      id: "warrior_happy_02", speaker: "WARRIOR",
      text: "For me, my greatest joy has been to combat my friends. It is there — and with them — that I share my passion, strengthening their character through its discipline.",
      emotion: "resolved", next: "warrior_happy_03"
    },
    warrior_happy_03: {
      id: "warrior_happy_03", speaker: "WARRIOR",
      text: "And when I defeat my enemies in combat — if I do not kill them — then they too are my friends.",
      emotion: "quiet", next: "warrior_kill"
    },
    warrior_kill: {
      id: "warrior_kill", speaker: "BOY",
      text: "And if they kill you?",
      emotion: "hesitant", next: "warrior_kill_02"
    },
    warrior_kill_02: {
      id: "warrior_kill_02", speaker: "WARRIOR",
      text: "Then I shall have met my best friend.",
      emotion: "resolved", next: "warrior_peace"
    },
    warrior_peace: {
      id: "warrior_peace", speaker: "GIRL",
      text: "I want you to know peace.",
      emotion: "warm", next: "warrior_gold_story"
    },
    warrior_gold_story: {
      id: "warrior_gold_story", speaker: "WARRIOR",
      text: "There was a poor man who spent his life searching for gold. He walked across deserts, climbed mountains, crossed endless rivers. Everywhere he went, he asked — 'Where is the gold?'",
      emotion: "quiet", next: "warrior_gold_02"
    },
    warrior_gold_02: {
      id: "warrior_gold_02", speaker: "WARRIOR",
      text: "He asked so much, and spoke so much, that no one ever asked him to stop. No one ever told him to be still.",
      emotion: "quiet", next: "warrior_gold_03"
    },
    warrior_gold_03: {
      id: "warrior_gold_03", speaker: "WARRIOR",
      text: "One day, when he was very old, he finally sat down. And when he looked around him — the ground beneath his feet was glittering. The gold had always been there. He had simply never stopped long enough to see it.",
      emotion: "resolved", next: "warrior_sit"
    },
    warrior_sit: {
      id: "warrior_sit", speaker: "NARRATOR",
      text: "You lower yourself to the ground across from him. You mimic his posture — hands on knees, breath steady.",
      emotion: "quiet", next: "warrior_sit_02"
    },
    warrior_sit_02: {
      id: "warrior_sit_02", speaker: "BOY",
      text: "And if he had never stopped?",
      emotion: "hesitant", next: "warrior_died"
    },
    warrior_died: {
      id: "warrior_died", speaker: "WARRIOR",
      text: "Then he would have died searching.",
      emotion: "quiet", next: "warrior_artist"
    },
    warrior_artist: {
      id: "warrior_artist", speaker: "WARRIOR",
      text: "I only know my craft. And so, I am an artist. Artists are never happy. They are only high sometimes.",
      emotion: "resolved", next: "warrior_embrace"
    },
    warrior_embrace: {
      id: "warrior_embrace", speaker: "NARRATOR",
      text: "As if compelled by something deeper than reason — you and the girl step forward and embrace the warrior.",
      emotion: "warm",
      trigger: "EMBRACE_ANIMATION",
      next: "warrior_thank",
      setsFlag: "embracedWarrior"
    },
    warrior_thank: {
      id: "warrior_thank", speaker: "WARRIOR",
      text: "Thank you.",
      emotion: "broken",
      trigger: "ASH_DISSOLVE",
      next: "warrior_ash"
    },
    warrior_ash: {
      id: "warrior_ash", speaker: "NARRATOR",
      text: "His body — then his face — become ashes. Dancing like dying ember sprites in the wind. Only the stone remains. Smoother than before.",
      emotion: "sad",
      trigger: "FADE_TO_DARKNESS"
    }
  }
};


// ============================================================
// SCENE 3B — THE DARKNESS EVENT
// ============================================================

export const darknessEvent = {
  id: "darkness_event",
  scene: "DarknessTransition",
  startId: "dark_01",
  lines: {

    dark_01: {
      id: "dark_01", speaker: "GIRL",
      text: "What is it?",
      emotion: "fearful", next: "dark_02"
    },
    dark_02: {
      id: "dark_02", speaker: "BOY",
      text: "The darkness.",
      emotion: "fearful", next: "dark_03"
    },
    dark_03: {
      id: "dark_03", speaker: "GIRL",
      text: "What happens now?",
      emotion: "fearful", next: "dark_04"
    },
    dark_04: {
      id: "dark_04", speaker: "BOY",
      text: "There is nothing we can do but wait.",
      emotion: "quiet", next: "dark_05"
    },
    dark_05: {
      id: "dark_05", speaker: "CLOAKED_FIGURE",
      text: "Some moments come to a close, and I know they'll disappear as if they never happened. Moments like this — I won't mind that.",
      emotion: "warm", next: "dark_06"
    },
    dark_06: {
      id: "dark_06", speaker: "CLOAKED_FIGURE",
      text: "Hello, sweet dreams. I'll see you soon.",
      emotion: "warm", next: "dark_07"
    },
    dark_07: {
      id: "dark_07", speaker: "CLOAKED_FIGURE",
      text: "Let us first play amongst the stars — and have words with the moon.",
      emotion: "warm",
      trigger: "FADE_TO_ROUND_ROOM"
    }
  }
};


// ============================================================
// SCENE 4 — THE ROUND ROOM
// ============================================================

export const roundRoom_Monster = {
  id: "round_room",
  scene: "RoundRoomScene",
  startId: "room_01",
  lines: {

    room_01: {
      id: "room_01", speaker: "GIRL",
      text: "Where are we?",
      emotion: "fearful", next: "room_02"
    },
    room_02: {
      id: "room_02", speaker: "NARRATOR",
      text: "You already know. The round room stretches outward in every direction. Scotch tape spirals the floor. The edges are shadow — not darkness, not the absence of light — but something alive.",
      emotion: "fearful", next: "room_03"
    },
    room_03: {
      id: "room_03", speaker: "CLOAKED_FIGURE",
      text: "No. Not like this.",
      emotion: "quiet", next: "room_04"
    },
    room_04: {
      id: "room_04", speaker: "GIRL",
      text: "What does it want?",
      emotion: "fearful", next: "room_05"
    },
    room_05: {
      id: "room_05", speaker: "BOY",
      text: "I don't know.",
      emotion: "hesitant", next: "room_06"
    },
    room_06: {
      id: "room_06", speaker: "CLOAKED_FIGURE",
      text: "It is waiting.",
      emotion: "quiet", next: "room_07"
    },
    room_07: {
      id: "room_07", speaker: "GIRL",
      text: "For what?",
      emotion: "fearful", next: "room_08"
    },
    room_08: {
      id: "room_08", speaker: "BOY",
      text: "It's waiting for me to see it.",
      emotion: "hesitant",
      trigger: "MONSTER_PULSE",
      next: "room_breathe"
    },
    room_breathe: {
      id: "room_breathe", speaker: "NARRATOR",
      text: "The shadows press inward. [ Hold SPACE to breathe ]",
      emotion: "fearful",
      trigger: "ENABLE_STILLNESS_MECHANIC",
      next: "room_09"
    },
    room_09: {
      id: "room_09", speaker: "NARRATOR",
      text: "The shape in the shadows is shifting. Another boy — standing where the darkness should be. Blurred. Indistinct. As if he hasn't quite decided whether to exist or not.",
      emotion: "hesitant",
      trigger: "REVEAL_SHADOW_BOY",
      next: "room_10"
    },
    room_10: {
      id: "room_10", speaker: "NARRATOR",
      text: "You step closer. The figure mirrors you. You share a likeness. Your breath catches — it is not fear. It is recognition.",
      emotion: "resolved", next: "room_11"
    },
    room_11: {
      id: "room_11", speaker: "CLOAKED_FIGURE",
      text: "Do you see?",
      emotion: "quiet", next: "room_12"
    },
    room_12: {
      id: "room_12", speaker: "GIRL",
      text: "It's you!",
      emotion: "determined", next: "room_13"
    },
    room_13: {
      id: "room_13", speaker: "BOY",
      text: "Yes.",
      emotion: "resolved",
      trigger: "ROOM_FRACTURE",
      next: "room_14",
      setsFlag: "sawShadowSelf"
    },
    room_14: {
      id: "room_14", speaker: "NARRATOR",
      text: "The round room fractures. Not violently. Not loudly. Like something loosening its grip.",
      emotion: "quiet",
      trigger: "TRANSITION_TO_GARDEN"
    }
  }
};


// ============================================================
// SCENE 5 — THE GARDEN: THE STRANGER
// ============================================================
// FIX: stranger_future no longer skips to monster_reveal.
// It redirects through stranger_plants so the sobriety/self-love
// arc plays out before the reveal regardless of entry path.
// ============================================================

export const gardenScene_Stranger = {
  id: "garden_stranger",
  scene: "GardenScene",
  startId: "stranger_01",
  lines: {

    stranger_01: {
      id: "stranger_01", speaker: "STRANGER",
      text: "There is always a reflection, however faint, when looking through a windowpane. You can't look outward without first looking at yourself.",
      emotion: "quiet", next: "stranger_02"
    },
    stranger_02: {
      id: "stranger_02", speaker: "STRANGER",
      text: "Every moment is a gift, and I'll take it.",
      emotion: "resolved", next: "stranger_03"
    },
    stranger_03: {
      id: "stranger_03", speaker: "BOY",
      text: "That's something I like to say.",
      emotion: "hesitant", next: "stranger_04"
    },
    stranger_04: {
      id: "stranger_04", speaker: "STRANGER",
      text: "We're a lot alike, you and I.",
      emotion: "warm", next: "stranger_choice_01"
    },
    stranger_choice_01: {
      id: "stranger_choice_01", speaker: "BOY",
      text: "...",
      choices: [
        { label: "Who are you?", next: "stranger_who" },
        { label: "Are you from the future?", next: "stranger_future" },
        { label: "Why the plants?", next: "stranger_plants" }
      ]
    },
    stranger_who: {
      id: "stranger_who", speaker: "BOY",
      text: "Who are you?",
      emotion: "hesitant", next: "stranger_radio"
    },
    stranger_radio: {
      id: "stranger_radio", speaker: "STRANGER",
      text: "Like an incessant radio of pedantic drivel, these apparitions leave me without solace. I've heard of people who live without an internal monologue. I wonder what sort of liberation that is.",
      emotion: "quiet", next: "stranger_plants"
    },
    // FIX: future path rejoins plant arc rather than jumping to reveal
    stranger_future: {
      id: "stranger_future", speaker: "BOY",
      text: "You're weird. Are you from the future?",
      emotion: "hesitant", next: "stranger_future_response"
    },
    stranger_future_response: {
      id: "stranger_future_response", speaker: "STRANGER",
      text: "The future is just the past with better lighting.",
      emotion: "quiet", next: "stranger_plants"
    },
    stranger_plants: {
      id: "stranger_plants", speaker: "STRANGER",
      text: "My return home permitted me the joy of checking on my plants. I don't even eat vegetables. But there is a delight I have in growing them that few activities have offered.",
      emotion: "warm", next: "stranger_why"
    },
    stranger_why: {
      id: "stranger_why", speaker: "GIRL",
      text: "Have you ever asked yourself why?",
      emotion: "neutral", next: "stranger_sober"
    },
    stranger_sober: {
      id: "stranger_sober", speaker: "STRANGER",
      text: "I took it up when I decided to be sober last year. I never asked myself why.",
      emotion: "broken", next: "stranger_left"
    },
    stranger_left: {
      id: "stranger_left", speaker: "GIRL",
      text: "You left a big part of yourself then.",
      emotion: "sad", next: "stranger_left_02"
    },
    stranger_left_02: {
      id: "stranger_left_02", speaker: "STRANGER",
      text: "I left a lot behind then.",
      emotion: "broken", next: "stranger_potato"
    },
    stranger_potato: {
      id: "stranger_potato", speaker: "STRANGER",
      text: "Look at my potato. Their first little blooms. It's funny — you spend time, effort, money. You don't know if anything will come of it.",
      emotion: "warm", next: "stranger_love"
    },
    stranger_love: {
      id: "stranger_love", speaker: "STRANGER",
      text: "Even if my plants could speak, they would never say how they try to grow even in the absence of my love and affection. Real love is both philanthropic and selfish. We never know how who — or what — we love is experiencing that love.",
      emotion: "resolved", next: "stranger_selfish"
    },
    stranger_selfish: {
      id: "stranger_selfish", speaker: "STRANGER",
      text: "Is self-love selfish?",
      emotion: "quiet", next: "stranger_monster_reveal"
    },
    stranger_monster_reveal: {
      id: "stranger_monster_reveal", speaker: "STRANGER",
      text: "I am all the things you fear the most.",
      emotion: "fearful", next: "stranger_monster_02"
    },
    stranger_monster_02: {
      id: "stranger_monster_02", speaker: "STRANGER",
      text: "I am the monster.",
      emotion: "fearful", next: "stranger_monster_03"
    },
    stranger_monster_03: {
      id: "stranger_monster_03", speaker: "STRANGER",
      text: "More importantly — I am you.",
      emotion: "resolved", next: "stranger_leave",
      setsFlag: "metStranger"
    },
    stranger_leave: {
      id: "stranger_leave", speaker: "STRANGER",
      text: "I have to go.",
      emotion: "quiet", next: "stranger_where"
    },
    stranger_where: {
      id: "stranger_where", speaker: "BOY",
      text: "Where?",
      emotion: "hesitant", next: "stranger_why_go"
    },
    stranger_why_go: {
      id: "stranger_why_go", speaker: "STRANGER",
      text: "To find out why.",
      emotion: "resolved", next: "stranger_love_self"
    },
    stranger_love_self: {
      id: "stranger_love_self", speaker: "STRANGER",
      text: "And to learn how to love myself.",
      emotion: "resolved",
      trigger: "STRANGER_WALKS_OFFSCREEN"
    }
  }
};


// ============================================================
// SCENE 5B — THE MASK FAREWELL
// ============================================================

export const gardenScene_MaskFarewell = {
  id: "garden_mask",
  scene: "GardenScene",
  startId: "mask_01",
  lines: {

    mask_01: {
      id: "mask_01", speaker: "NARRATOR",
      text: "The stranger is gone — but his absence is not empty. Something lingers.",
      emotion: "quiet", next: "mask_02"
    },
    mask_02: {
      id: "mask_02", speaker: "NARRATOR",
      text: "Without a word, she wraps her arms around you both. The warmth presses in — not demanding, not forcing. Just there.",
      emotion: "warm",
      trigger: "HUG_ANIMATION",
      next: "mask_03"
    },
    mask_03: {
      id: "mask_03", speaker: "GIRL",
      text: "I think he needed a hug too.",
      emotion: "warm", next: "mask_04"
    },
    mask_04: {
      id: "mask_04", speaker: "CLOAKED_FIGURE",
      text: "I'm just a tree longing for his sunlight — that great beyond bright.",
      emotion: "quiet", next: "mask_05"
    },
    mask_05: {
      id: "mask_05", speaker: "CLOAKED_FIGURE",
      text: "It will come. But for now — I am done.",
      emotion: "resolved", next: "mask_06"
    },
    mask_06: {
      id: "mask_06", speaker: "NARRATOR",
      text: "With great care, he removes his mask and places it gently on the ground. He does not look back.",
      emotion: "sad",
      trigger: "MASK_DROP_ANIMATION",
      next: "mask_07"
    },
    mask_07: {
      id: "mask_07", speaker: "NARRATOR",
      text: "He steps forward — and begins to dissolve. Like a memory slipping through fingers, unraveling at the edges. The air does not stir. There is no sound.",
      emotion: "sad",
      trigger: "CLOAKED_DISSOLVE",
      next: "mask_08"
    },
    mask_08: {
      id: "mask_08", speaker: "NARRATOR",
      text: "The mask remains. A single artifact of what once was.",
      emotion: "quiet",
      trigger: "MASK_CHOICE_ENABLE",
      choices: [
        { label: "Pick up the mask", next: "mask_pickup" },
        { label: "Leave it behind", next: "mask_leave" }
      ]
    },
    // FIX: ENDING_A and ENDING_B now have distinct narration and
    // set pickedUpMask flag so the ending scene can branch.
    mask_pickup: {
      id: "mask_pickup", speaker: "NARRATOR",
      text: "You pick it up. It is lighter than you expected. You hold it for a long moment — then set it back down. You don't need it. But you wanted to know its weight.",
      emotion: "resolved",
      setsFlag: { pickedUpMask: true },
      trigger: "ENDING_A"
    },
    mask_leave: {
      id: "mask_leave", speaker: "NARRATOR",
      text: "You do not touch it. Some things are not meant to be carried forward. You turn away — and the world does not wait.",
      emotion: "resolved",
      setsFlag: { pickedUpMask: false },
      trigger: "ENDING_B"
    }
  }
};


// ============================================================
// ENDING — BRANCHES ON pickedUpMask FLAG
// ============================================================
// FIX: ENDING_A and ENDING_B now produce distinct final narration.
// The engine checks FLAGS.pickedUpMask to select the correct
// end_02 variant before rolling credits.
// ============================================================

export const ending_A = {
  id: "ending_a",
  scene: "EndingScene",
  startId: "end_01",
  lines: {

    end_01: {
      id: "end_01", speaker: "NARRATOR",
      text: "The wind presses forward, urging you toward the unseen horizon.",
      emotion: "resolved", next: "end_02"
    },
    end_02: {
      id: "end_02", speaker: "NARRATOR",
      text: "You carried its weight. You set it down. The difference is everything.",
      emotion: "warm", next: "end_03"
    },
    end_03: {
      id: "end_03", speaker: "NARRATOR",
      text: "You are loved.",
      emotion: "warm",
      trigger: "CREDITS_ROLL"
    }
  }
};

export const ending_B = {
  id: "ending_b",
  scene: "EndingScene",
  startId: "end_01",
  lines: {

    end_01: {
      id: "end_01", speaker: "NARRATOR",
      text: "The wind presses forward, urging you toward the unseen horizon.",
      emotion: "resolved", next: "end_02"
    },
    end_02: {
      id: "end_02", speaker: "NARRATOR",
      text: "Not everything left behind is lost. Some things simply belong to the ground.",
      emotion: "warm", next: "end_03"
    },
    end_03: {
      id: "end_03", speaker: "NARRATOR",
      text: "You are loved.",
      emotion: "warm",
      trigger: "CREDITS_ROLL"
    }
  }
};


export const pillowScene = {
  id: "pillow_scene",
  scene: "PillowScene",
  startId: "pillow_01",
  lines: {
    pillow_01: {
      id: "pillow_01", speaker: "NARRATOR",
      text: "The boy and his father stand outside the cottage, both clutching towering stacks of throw pillows. The street hums with approaching footsteps.",
      emotion: "neutral", next: "pillow_02"
    },
    pillow_02: {
      id: "pillow_02", speaker: "YOUNGER_WOMAN",
      text: "Please — someone is in danger. We need your help.",
      emotion: "fearful", next: "pillow_03"
    },
    pillow_03: {
      id: "pillow_03", speaker: "NARRATOR",
      text: "The boy's hands tighten around the pillows. His father goes rigid beside him. Neither moves.",
      emotion: "hesitant", next: "pillow_04"
    },
    pillow_04: {
      id: "pillow_04", speaker: "OLDER_WOMAN",
      text: "Please.",
      emotion: "broken", next: "pillow_05"
    },
    pillow_05: {
      id: "pillow_05", speaker: "NARRATOR",
      text: "He wants to move. He wants to help. But to step forward means to drop what he is carrying. He cannot bear the thought.",
      emotion: "hesitant", next: "pillow_06"
    },
    pillow_06: {
      id: "pillow_06", speaker: "NARRATOR",
      text: "A blur. The girl arrives — barreling into them in a storm of dust, crashing into them with full force, sending them all sprawling. Pillows scatter everywhere.",
      emotion: "determined",
      trigger: "PILLOW_CRASH",
      next: "pillow_07"
    },
    pillow_07: {
      id: "pillow_07", speaker: "NARRATOR",
      text: "Something in her urgency unlocks his feet. He moves. He reaches back for the cloaked figure. Together, the three run.",
      emotion: "determined",
      trigger: "TRANSITION_TO_ROUND_ROOM"
    }
  }
};

// ============================================================
// EXPORT ALL
// ============================================================

export const ALL_DIALOGUE_TREES = [
  fieldScene_LadyInWhite,
  fieldScene_CloakedFigure,
  lineScene_Crowd,
  desertScene_Warrior,
  darknessEvent,
  pillowScene,
  roundRoom_Monster,
  gardenScene_Stranger,
  gardenScene_MaskFarewell,
  ending_A,
  ending_B,
];
