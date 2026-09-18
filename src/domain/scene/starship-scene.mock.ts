import { charactersMock } from "@domain/character";
import { STARSHIP_LOREBOOK_ID } from "@domain/lorebook";
import { COOLANT_CANISTER_ITEM_ID, SIGNAL_LOG_ITEM_ID } from "@domain/item";
import {
  STARSHIP_STORY_ID,
  SCENE_BRIDGE_ID,
  SCENE_ENGINE_ROOM_ID,
  SCENE_MED_BAY_ID,
  SCENE_OBSERVATION_DECK_ID,
  QUEST_SENSOR_GHOST_ID,
  QUEST_COOLANT_LEAK_ID,
  QUEST_THE_SIGNAL_ID,
  FLAG_ENGINE_STABILIZED,
  FLAG_TOLD_BASIL_ABOUT_NOVA,
  FLAG_WARNED_NOVA_ABOUT_BASIL,
} from "../story/starship-story.ids";
import { Scene } from "./scene";

const [nova, , , , chefBasil, captainMarlow, unit7] = charactersMock;

export const starshipScenesMock: Scene[] = [
  {
    id: SCENE_BRIDGE_ID,
    storyId: STARSHIP_STORY_ID,
    name: "The Bridge",
    description:
      "Soft blue light from the nav console washes over the empty command chairs. Nova's projection flickers near the main viewport, watching a blip that shouldn't be there.",
    ambience: "The low hum of the ion drive, a console chime every few seconds.",
    npcs: [{ characterId: nova.id, roleInScene: "Onboard AI" }],
    exits: [
      { toSceneId: SCENE_ENGINE_ROOM_ID, label: "Head down to the engine room" },
      {
        toSceneId: SCENE_OBSERVATION_DECK_ID,
        label: "Take the side corridor to the observation deck",
        condition: { type: "questCompleted", questId: QUEST_SENSOR_GHOST_ID },
      },
    ],
    items: [],
    lorebookIds: [STARSHIP_LOREBOOK_ID],
    unlock: { type: "always" },
    coverEmoji: "🧭",
    coverColor: "#3b2f7a",
    order: 0,
  },
  {
    id: SCENE_ENGINE_ROOM_ID,
    storyId: STARSHIP_STORY_ID,
    name: "Engine Room",
    description:
      "Captain Marlow is elbow-deep in an access panel, muttering about superstitions and coolant pressure in the same breath.",
    ambience: "The rhythmic thud of the ion drive, a faint hiss of escaping gas.",
    npcs: [{ characterId: captainMarlow.id, roleInScene: "Chief Engineer" }],
    exits: [
      { toSceneId: SCENE_BRIDGE_ID, label: "Back up to the bridge" },
      {
        toSceneId: SCENE_MED_BAY_ID,
        label: "Cut through to the med bay",
        condition: { type: "questCompleted", questId: QUEST_COOLANT_LEAK_ID },
      },
    ],
    items: [
      {
        itemId: COOLANT_CANISTER_ITEM_ID,
        label: "A spare coolant canister, wedged behind a conduit",
        oneTime: true,
      },
    ],
    lorebookIds: [STARSHIP_LOREBOOK_ID],
    unlock: { type: "questActive", questId: QUEST_SENSOR_GHOST_ID },
    coverEmoji: "⚙️",
    coverColor: "#4a3728",
    order: 1,
  },
  {
    id: SCENE_MED_BAY_ID,
    storyId: STARSHIP_STORY_ID,
    name: "Med Bay",
    description:
      "Unit 7 stands vigil beside a diagnostic bed nobody's using, quietly cataloguing dust motes in the recycled air.",
    ambience: "The faint beep of an idle monitor, sterile and still.",
    npcs: [
      { characterId: unit7.id, roleInScene: "Medical Assistant Unit" },
      {
        characterId: chefBasil.id,
        roleInScene: "Galley Trader",
        presenceCondition: { type: "npcAffinityAtLeast", characterId: unit7.id, value: 20 },
        dialogueChoices: [
          {
            id: "choice-tell-basil-about-nova",
            label: "Trade him Nova's private logs for galley favors",
            line: "Nova's been logging things she probably shouldn't. What would that be worth to you?",
            setFlags: [FLAG_TOLD_BASIL_ABOUT_NOVA],
            visibleWhen: {
              type: "allOf",
              conditions: [
                { type: "not", condition: { type: "flagSet", flag: FLAG_TOLD_BASIL_ABOUT_NOVA } },
                { type: "not", condition: { type: "flagSet", flag: FLAG_WARNED_NOVA_ABOUT_BASIL } },
              ],
            },
          },
          {
            id: "choice-warn-nova-about-basil",
            label: "Refuse, and warn Nova about him",
            line: "Whatever you're trading in, it's not going to be Nova's logs. And I'd watch what you say around her from now on.",
            setFlags: [FLAG_WARNED_NOVA_ABOUT_BASIL],
            visibleWhen: {
              type: "allOf",
              conditions: [
                { type: "not", condition: { type: "flagSet", flag: FLAG_TOLD_BASIL_ABOUT_NOVA } },
                { type: "not", condition: { type: "flagSet", flag: FLAG_WARNED_NOVA_ABOUT_BASIL } },
              ],
            },
          },
        ],
      },
    ],
    exits: [
      { toSceneId: SCENE_ENGINE_ROOM_ID, label: "Back to the engine room" },
      {
        toSceneId: SCENE_OBSERVATION_DECK_ID,
        label: "Up to the observation deck",
        condition: { type: "flagSet", flag: FLAG_ENGINE_STABILIZED },
      },
      {
        toSceneId: SCENE_OBSERVATION_DECK_ID,
        label:
          "Slip up during the night shift, when the deck is quiet enough to watch the signal alone",
        // Only opens up late in the ship's cycle — the observation deck is
        // too crowded during the day to get a clear, uninterrupted look.
        condition: { type: "timeOfDayIs", timeOfDay: "night" },
      },
    ],
    items: [
      {
        itemId: SIGNAL_LOG_ITEM_ID,
        label: "A signal log Unit 7 has been quietly compiling",
        oneTime: true,
      },
    ],
    lorebookIds: [STARSHIP_LOREBOOK_ID],
    unlock: { type: "questCompleted", questId: QUEST_COOLANT_LEAK_ID },
    coverEmoji: "🩺",
    coverColor: "#206b74",
    order: 2,
  },
  {
    id: SCENE_OBSERVATION_DECK_ID,
    storyId: STARSHIP_STORY_ID,
    name: "Observation Deck",
    description:
      "The whole crew has gathered at the viewport. Whatever that signal is, it's close now — close enough to see with the naked eye.",
    ambience: "Hushed voices, the vast quiet of open space pressing against the glass.",
    npcs: [
      { characterId: nova.id, roleInScene: "Onboard AI" },
      { characterId: captainMarlow.id, roleInScene: "Chief Engineer" },
      { characterId: unit7.id, roleInScene: "Medical Assistant Unit" },
    ],
    exits: [],
    items: [],
    lorebookIds: [STARSHIP_LOREBOOK_ID],
    unlock: { type: "questCompleted", questId: QUEST_THE_SIGNAL_ID },
    coverEmoji: "🌌",
    coverColor: "#092957",
    order: 3,
  },
];
