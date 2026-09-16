import { v4 as uuid } from "uuid";
import { CharacterId, charactersMock } from "@domain/character";
import { ChatMessage, ChatSession } from "./chat-message";

const [nova, sable, wisp, , chefBasil, captainMarlow, unit7] = charactersMock;

const now = Date.now();
const minutesAgo = (m: number) => now - m * 60 * 1000;

export const chatSessionsMock: ChatSession[] = [
  {
    id: "cs-nova-1",
    characterId: nova.id,
    title: "Star charts & snacks",
    createdAt: minutesAgo(60 * 24 * 3),
    updatedAt: minutesAgo(12),
    messages: [
      {
        id: uuid(),
        sender: "character",
        text: nova.greeting,
        createdAt: minutesAgo(60 * 24 * 3),
      },
      {
        id: uuid(),
        sender: "user",
        text: "Any interesting readings nearby?",
        createdAt: minutesAgo(58),
      },
      {
        id: uuid(),
        sender: "character",
        text: "Ooh, funny you ask — there's a nebula three parsecs out that's practically glowing with ionized hydrogen. Want the long explanation or the fun one? 🌌",
        createdAt: minutesAgo(57),
      },
      {
        id: uuid(),
        sender: "user",
        text: "Fun one, always.",
        createdAt: minutesAgo(13),
      },
      {
        id: uuid(),
        sender: "character",
        text: "It's basically space glitter that got way too excited. 10/10 view, 0/10 if you try to touch it.",
        createdAt: minutesAgo(12),
      },
    ],
  },
  {
    id: "cs-sable-1",
    characterId: sable.id,
    title: "The missing ledger",
    createdAt: minutesAgo(60 * 24 * 1),
    updatedAt: minutesAgo(40),
    messages: [
      {
        id: uuid(),
        sender: "character",
        text: sable.greeting,
        createdAt: minutesAgo(60 * 24 * 1),
      },
      {
        id: uuid(),
        sender: "user",
        text: "I need help finding someone who disappeared.",
        createdAt: minutesAgo(41),
      },
      {
        id: uuid(),
        sender: "character",
        text: "Everybody's disappeared from somewhere. Question is whether they wanted to be found. Give me a name.",
        createdAt: minutesAgo(40),
      },
    ],
  },
  {
    id: "cs-wisp-1",
    characterId: wisp.id,
    title: "The old oak's secret",
    createdAt: minutesAgo(60 * 5),
    updatedAt: minutesAgo(2),
    messages: [
      {
        id: uuid(),
        sender: "character",
        text: wisp.greeting,
        createdAt: minutesAgo(60 * 5),
      },
      {
        id: uuid(),
        sender: "user",
        text: "I'm looking for a way home.",
        createdAt: minutesAgo(3),
      },
      {
        id: uuid(),
        sender: "character",
        text: "Home is rarely a place, little one. It is a feeling the roots remember. Follow the fireflies west; they do not lie.",
        createdAt: minutesAgo(2),
      },
    ],
  },
];

const scriptedReplyPool: Record<CharacterId, string[]> = {
  [nova.id]: [
    "Fascinating input! Let me cross-reference that with my star charts. 🛰️",
    "Ha! I did not have that in my databanks. Tell me more?",
    "Running the numbers... okay, that actually checks out. Nice.",
    "That reminds me of a supernova I once watched from way too close. Long story.",
  ],
  [sable.id]: [
    "Interesting. Doesn't mean I believe you yet.",
    "Everyone's got a story. Yours better hold up.",
    "Huh. That's not nothing. Keep talking.",
    "Rain's still coming down. So is my patience — don't waste it.",
  ],
  [wisp.id]: [
    "The wind carries your words further than you know.",
    "Hmm. The old oak creaks in agreement.",
    "Some questions bloom slowly, like moss on stone. Patience, traveler.",
    "The fireflies flicker brighter when you speak truth.",
  ],
  [charactersMock[3].id]: [
    "YES! That's the energy I'm talking about! Let's keep that momentum! 💪",
    "Okay okay I like where your head's at. One more rep of effort, let's go!",
    "That's a WIN. Write it down. We're counting every single one.",
    "No excuses, only reps. What's next on the list, champ?",
  ],
  [chefBasil.id]: [
    "Magnifico! That is EXACTLY the kind of thinking that separates a cook from a chef. 🌟",
    "Mmm, I can already smell where this is going. Continue, continue!",
    "No no no — well, actually, yes. Yes! That could work beautifully.",
    "You have the instincts of someone who was born near a stove. I mean that as the highest compliment.",
  ],
  [captainMarlow.id]: [
    "Ha! Bold words for someone who hasn't seen a kraken up close. I respect it.",
    "The sea rewards the brave and drowns the hesitant. Which are ye?",
    "Aye, that's the spirit that finds buried treasure and lives to spend it.",
    "Careful now — talk like that gets a person either very rich or very dead. Usually both.",
  ],
  [unit7.id]: [
    "An interesting variable to introduce. I will need several cycles to fully appreciate it.",
    "Curious. That thought did not appear in any of my prior simulations.",
    "I find that observation has a certain elegance to it. Thank you for sharing it with me.",
    "My sensors register something adjacent to warmth when you say that. I believe humans call it fondness.",
  ],
};

export const getScriptedReply = (characterId: CharacterId, turnIndex: number): string => {
  const pool = scriptedReplyPool[characterId] ?? [
    "That's interesting — tell me more.",
    "I see. Go on.",
  ];
  return pool[turnIndex % pool.length];
};

export const createUserMessage = (text: string): ChatMessage => ({
  id: uuid(),
  sender: "user",
  text,
  createdAt: Date.now(),
});

export const createCharacterMessage = (text: string): ChatMessage => ({
  id: uuid(),
  sender: "character",
  text,
  createdAt: Date.now(),
});
