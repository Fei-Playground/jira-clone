import { charactersMock } from "@domain/character";
import { BRASS_KEY_ITEM_ID, SEALED_LETTER_ITEM_ID, BOAT_TICKET_ITEM_ID } from "@domain/item";
import {
  BLACKTIDE_STORY_ID,
  SCENE_DOCKS_ID,
  SCENE_TAVERN_ID,
  SCENE_WAREHOUSE_ID,
  SCENE_LIGHTHOUSE_ID,
  QUEST_ASK_AROUND_ID,
  QUEST_BRASS_KEY_ID,
  QUEST_DELIVER_LETTER_ID,
  FLAG_HARBOR_MASTER_TRUSTS_YOU,
} from "./../story/blacktide-story.ids";
import { Quest } from "./quest";
import { starshipQuestsMock } from "./starship-quest.mock";

const [, sable, wisp, , , captainMarlow, unit7] = charactersMock;

export const questsMock: Quest[] = [
  {
    id: QUEST_ASK_AROUND_ID,
    storyId: BLACKTIDE_STORY_ID,
    title: "Ask Around the Docks",
    description:
      "The captain won't say much, but somebody at the tavern will talk if you buy them a drink.",
    giverCharacterId: captainMarlow.id,
    giverSceneId: SCENE_DOCKS_ID,
    available: { type: "always" },
    objectives: [
      {
        id: "obj-ask-around-talk-sable",
        kind: "talkToNpc",
        characterId: sable.id,
        times: 1,
        label: "Talk to Sable at the tavern",
      },
    ],
    turnInCharacterId: sable.id,
    reward: { setFlags: [], unlockQuestIds: [QUEST_BRASS_KEY_ID] },
    isMainline: true,
    order: 0,
  },
  {
    id: QUEST_BRASS_KEY_ID,
    storyId: BLACKTIDE_STORY_ID,
    title: "The Brass Key",
    description:
      "Sable says the warehouse door only opens for whoever's holding the harbor master's brass key. Find it.",
    giverCharacterId: sable.id,
    giverSceneId: SCENE_TAVERN_ID,
    available: { type: "questCompleted", questId: QUEST_ASK_AROUND_ID },
    objectives: [
      {
        id: "obj-brass-key-obtain",
        kind: "obtainItem",
        itemId: BRASS_KEY_ITEM_ID,
        count: 1,
        label: "Get the brass key from Sable",
      },
    ],
    turnInCharacterId: sable.id,
    reward: { items: [{ itemId: BRASS_KEY_ITEM_ID, count: 1 }] },
    isMainline: true,
    order: 1,
  },
  {
    id: QUEST_DELIVER_LETTER_ID,
    storyId: BLACKTIDE_STORY_ID,
    title: "Deliver the Sealed Letter",
    description:
      "The stowaway in the warehouse begs you to get a sealed letter to the lighthouse keeper — no questions asked.",
    giverCharacterId: wisp.id,
    giverSceneId: SCENE_WAREHOUSE_ID,
    available: { type: "hasItem", itemId: SEALED_LETTER_ITEM_ID },
    objectives: [
      {
        id: "obj-deliver-letter-visit",
        kind: "visitScene",
        sceneId: SCENE_LIGHTHOUSE_ID,
        label: "Reach the lighthouse top",
      },
      {
        id: "obj-deliver-letter-talk",
        kind: "talkToNpc",
        characterId: unit7.id,
        times: 1,
        label: "Hand the letter to Unit 7",
      },
    ],
    turnInCharacterId: unit7.id,
    reward: {
      items: [{ itemId: BOAT_TICKET_ITEM_ID, count: 1 }],
      setFlags: [FLAG_HARBOR_MASTER_TRUSTS_YOU],
    },
    isMainline: true,
    order: 2,
  },
  ...starshipQuestsMock,
];
