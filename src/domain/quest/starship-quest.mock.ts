import { charactersMock } from "@domain/character";
import {
  COOLANT_CANISTER_ITEM_ID,
  SIGNAL_LOG_ITEM_ID,
  CAPTAINS_COMMENDATION_ITEM_ID,
  GALLEY_FAVOR_TOKEN_ITEM_ID,
} from "@domain/item";
import {
  STARSHIP_STORY_ID,
  SCENE_ENGINE_ROOM_ID,
  SCENE_OBSERVATION_DECK_ID,
  QUEST_SENSOR_GHOST_ID,
  QUEST_COOLANT_LEAK_ID,
  QUEST_THE_SIGNAL_ID,
  QUEST_REPORT_GALLEY_TRADE_ID,
  QUEST_JOIN_GALLEY_TRADE_ID,
  FLAG_ENGINE_STABILIZED,
  FLAG_NOVA_TRUSTS_YOU,
  FLAG_REPORTED_GALLEY_TRADE,
  FLAG_JOINED_GALLEY_TRADE,
} from "../story/starship-story.ids";
import { Quest } from "./quest";

const [nova, , , , chefBasil, captainMarlow, unit7] = charactersMock;

export const starshipQuestsMock: Quest[] = [
  {
    id: QUEST_SENSOR_GHOST_ID,
    storyId: STARSHIP_STORY_ID,
    title: "The Sensor Ghost",
    description:
      "Nova's sensors keep flagging a blip that vanishes every time anyone looks straight at it. She wants a second pair of eyes — Marlow's, specifically.",
    giverCharacterId: nova.id,
    giverSceneId: undefined,
    available: { type: "always" },
    objectives: [
      {
        id: "obj-sensor-ghost-talk-marlow",
        kind: "talkToNpc",
        characterId: captainMarlow.id,
        times: 1,
        label: "Ask Captain Marlow about the sensor readings",
      },
    ],
    turnInCharacterId: captainMarlow.id,
    reward: { unlockQuestIds: [QUEST_COOLANT_LEAK_ID] },
    isMainline: true,
    order: 0,
  },
  {
    id: QUEST_COOLANT_LEAK_ID,
    storyId: STARSHIP_STORY_ID,
    title: "Coolant Leak",
    description:
      "Turns out the blip was a red herring — but Marlow found a real problem while looking: a slow coolant leak. Find a spare canister before the drive overheats.",
    giverCharacterId: captainMarlow.id,
    giverSceneId: SCENE_ENGINE_ROOM_ID,
    // Needs both the sensor-ghost lead closed AND the ship's mood to have
    // shifted — the "A Long Night Shift" event (triggered by quest ① being
    // active) nudges ambienceIntensity from the default 20 up to 30, so by
    // the time quest ① is actually completed the threshold is already met.
    available: {
      type: "allOf",
      conditions: [
        { type: "questCompleted", questId: QUEST_SENSOR_GHOST_ID },
        { type: "ambienceAtLeast", value: 25 },
      ],
    },
    objectives: [
      {
        id: "obj-coolant-leak-obtain",
        kind: "obtainItem",
        itemId: COOLANT_CANISTER_ITEM_ID,
        count: 1,
        label: "Find a spare coolant canister",
      },
    ],
    turnInCharacterId: captainMarlow.id,
    reward: {
      items: [{ itemId: COOLANT_CANISTER_ITEM_ID, count: 1 }],
      setFlags: [FLAG_ENGINE_STABILIZED],
    },
    isMainline: true,
    order: 1,
  },
  {
    id: QUEST_THE_SIGNAL_ID,
    storyId: STARSHIP_STORY_ID,
    title: "The Signal",
    description:
      'Unit 7 has been quietly logging an anomalous signal for days. Bring the log to Nova and mention it directly — she\'ll want to hear the word "signal."',
    giverCharacterId: unit7.id,
    giverSceneId: undefined,
    available: { type: "hasItem", itemId: SIGNAL_LOG_ITEM_ID },
    objectives: [
      {
        id: "obj-the-signal-say-keyword",
        kind: "sayKeyword",
        characterId: nova.id,
        keywords: ["signal", "信号"],
        label: "Tell Nova about the signal",
      },
      {
        id: "obj-the-signal-visit-deck",
        kind: "visitScene",
        sceneId: SCENE_OBSERVATION_DECK_ID,
        label: "Reach the observation deck",
      },
    ],
    reward: { setFlags: [FLAG_NOVA_TRUSTS_YOU] },
    isMainline: true,
    order: 2,
  },
  // A REAL mutually-exclusive pair, same mechanism as Blacktide's
  // smuggling/fencing pair: both become available the instant the engine is
  // stabilized, and completing EITHER one retracts the other via excludedBy.
  {
    id: QUEST_REPORT_GALLEY_TRADE_ID,
    storyId: STARSHIP_STORY_ID,
    title: "Report the Galley Trade",
    description:
      "Someone's running an off-the-books trade out of the galley. Marlow would want to know about it.",
    giverCharacterId: captainMarlow.id,
    giverSceneId: SCENE_ENGINE_ROOM_ID,
    available: { type: "flagSet", flag: FLAG_ENGINE_STABILIZED },
    excludedBy: { type: "flagSet", flag: FLAG_JOINED_GALLEY_TRADE },
    objectives: [
      {
        id: "obj-report-galley-trade-talk",
        kind: "talkToNpc",
        characterId: captainMarlow.id,
        times: 1,
        label: "Tell Captain Marlow about the galley trade",
      },
    ],
    turnInCharacterId: captainMarlow.id,
    reward: {
      items: [{ itemId: CAPTAINS_COMMENDATION_ITEM_ID, count: 1 }],
      setFlags: [FLAG_REPORTED_GALLEY_TRADE],
    },
    isMainline: false,
    order: 3,
  },
  {
    id: QUEST_JOIN_GALLEY_TRADE_ID,
    storyId: STARSHIP_STORY_ID,
    title: "Join the Galley Trade",
    description:
      "Chef Basil could use a reliable second pair of hands for his little side business. It pays, if you don't ask too many questions.",
    giverCharacterId: chefBasil.id,
    giverSceneId: SCENE_ENGINE_ROOM_ID,
    available: { type: "flagSet", flag: FLAG_ENGINE_STABILIZED },
    excludedBy: { type: "flagSet", flag: FLAG_REPORTED_GALLEY_TRADE },
    objectives: [
      {
        id: "obj-join-galley-trade-talk",
        kind: "talkToNpc",
        characterId: chefBasil.id,
        times: 1,
        label: "Tell Chef Basil you're in",
      },
    ],
    turnInCharacterId: chefBasil.id,
    reward: {
      items: [{ itemId: GALLEY_FAVOR_TOKEN_ITEM_ID, count: 1 }],
      setFlags: [FLAG_JOINED_GALLEY_TRADE],
    },
    isMainline: false,
    order: 3,
  },
];
