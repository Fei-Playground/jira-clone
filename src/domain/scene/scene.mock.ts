import { charactersMock } from "@domain/character";
import { BLACKTIDE_LOREBOOK_ID } from "@domain/lorebook";
import { BRASS_KEY_ITEM_ID, SEALED_LETTER_ITEM_ID, STORM_TALISMAN_ITEM_ID } from "@domain/item";
import {
  BLACKTIDE_STORY_ID,
  SCENE_DOCKS_ID,
  SCENE_TAVERN_ID,
  SCENE_WAREHOUSE_ID,
  SCENE_LIGHTHOUSE_ID,
  SCENE_LAST_SHIP_ID,
  QUEST_ASK_AROUND_ID,
  QUEST_BRASS_KEY_ID,
  QUEST_DELIVER_LETTER_ID,
  FLAG_HARBOR_MASTER_TRUSTS_YOU,
} from "./../story/blacktide-story.ids";
import { Scene } from "./scene";
import { starshipScenesMock } from "./starship-scene.mock";

const [, sable, wisp, , , captainMarlow, unit7] = charactersMock;

export const scenesMock: Scene[] = [
  {
    id: SCENE_DOCKS_ID,
    storyId: BLACKTIDE_STORY_ID,
    name: "The Docks",
    description:
      "Rain hammers the boards. Ships creak against their moorings, and lantern light smears across the wet planks.",
    ambience: "Salt air, distant foghorn, the slap of water on pilings.",
    npcs: [{ characterId: captainMarlow.id, roleInScene: "Harbor Captain" }],
    exits: [{ toSceneId: SCENE_TAVERN_ID, label: "Duck into the tavern out of the rain" }],
    items: [],
    lorebookIds: [BLACKTIDE_LOREBOOK_ID],
    unlock: { type: "always" },
    coverEmoji: "⚓",
    coverColor: "#1f3a4a",
    order: 0,
  },
  {
    id: SCENE_TAVERN_ID,
    storyId: BLACKTIDE_STORY_ID,
    name: "The Rainy Night Tavern",
    description:
      "A low-ceilinged room thick with pipe smoke. Sable holds court at the end of the bar, nursing something dark.",
    ambience: "Creaking floorboards, a card game gone quiet in the corner.",
    npcs: [
      {
        characterId: sable.id,
        roleInScene: "Ledger of Secrets",
        quickPhrases: [
          {
            id: "qp-sable-brass-key",
            label: "Who has the brass key?",
            text: "Who has the brass key?",
          },
        ],
      },
    ],
    exits: [
      { toSceneId: SCENE_DOCKS_ID, label: "Back out to the docks" },
      {
        toSceneId: SCENE_WAREHOUSE_ID,
        label: "Slip through the back door",
        condition: {
          type: "allOf",
          conditions: [
            { type: "questCompleted", questId: QUEST_BRASS_KEY_ID },
            { type: "hasItem", itemId: BRASS_KEY_ITEM_ID },
          ],
        },
      },
    ],
    items: [],
    lorebookIds: [BLACKTIDE_LOREBOOK_ID],
    unlock: { type: "questActive", questId: QUEST_ASK_AROUND_ID },
    coverEmoji: "🍺",
    coverColor: "#4a3728",
    order: 1,
    quickPhrases: [
      {
        id: "qp-tavern-buy-drink",
        label: "Buy you a drink?",
        text: "Can I buy you a drink?",
      },
      {
        id: "qp-tavern-ship-out",
        label: "Looking for a way out",
        text: "I'm looking for a ship out of the harbor.",
      },
    ],
  },
  {
    id: SCENE_WAREHOUSE_ID,
    storyId: BLACKTIDE_STORY_ID,
    name: "Warehouse Back Alley",
    description:
      "Crates stacked higher than a person, most gone soft with damp. Something — someone — shifts behind the nearest stack.",
    ambience: "Rats in the rafters, the tang of tar and old rope.",
    npcs: [{ characterId: wisp.id, roleInScene: "Stowaway" }],
    exits: [
      { toSceneId: SCENE_TAVERN_ID, label: "Back through the tavern's rear door" },
      {
        toSceneId: SCENE_LIGHTHOUSE_ID,
        label: "Climb the service ladder toward the lighthouse",
        condition: {
          type: "anyOf",
          conditions: [
            { type: "flagSet", flag: FLAG_HARBOR_MASTER_TRUSTS_YOU },
            { type: "hasItem", itemId: SEALED_LETTER_ITEM_ID },
          ],
        },
      },
    ],
    items: [
      {
        itemId: SEALED_LETTER_ITEM_ID,
        label: "A sealed letter tucked behind a crate",
        oneTime: true,
      },
    ],
    lorebookIds: [BLACKTIDE_LOREBOOK_ID],
    unlock: {
      type: "allOf",
      conditions: [
        { type: "questCompleted", questId: QUEST_BRASS_KEY_ID },
        { type: "hasItem", itemId: BRASS_KEY_ITEM_ID },
      ],
    },
    coverEmoji: "📦",
    coverColor: "#3a3a3a",
    order: 2,
  },
  {
    id: SCENE_LIGHTHOUSE_ID,
    storyId: BLACKTIDE_STORY_ID,
    name: "Lighthouse Top",
    description:
      "Wind screams around the gallery. Unit 7 stands motionless at the lamp, its single optical sensor tracking the horizon.",
    ambience: "Wind, the mechanical click of the lamp's rotating gears.",
    npcs: [{ characterId: unit7.id, roleInScene: "Lighthouse Keeper" }],
    exits: [
      { toSceneId: SCENE_WAREHOUSE_ID, label: "Back down the ladder" },
      {
        toSceneId: SCENE_LAST_SHIP_ID,
        label: "Signal the last ship out",
        condition: { type: "questCompleted", questId: QUEST_DELIVER_LETTER_ID },
      },
      {
        toSceneId: SCENE_LAST_SHIP_ID,
        label: "Slip down the storm-lashed cliff path under cover of dark",
        // A shortcut that only opens up in the right weather/time — the
        // climb is too exposed to risk except at night or in a storm,
        // when nobody on deck would spot you.
        condition: {
          type: "anyOf",
          conditions: [
            { type: "weatherIs", weather: "storm" },
            { type: "timeOfDayIs", timeOfDay: "night" },
          ],
        },
      },
    ],
    items: [
      {
        itemId: STORM_TALISMAN_ITEM_ID,
        label:
          "A talisman wedged into a crack in the railing, only visible once the storm is really howling",
        // Only shows up while the world feels tense enough — the storm
        // event (see story-event.mock.ts) pushes ambienceIntensity past 40,
        // which is what makes this reachable without being always-on.
        takeCondition: { type: "ambienceAtLeast", value: 40 },
        oneTime: true,
      },
    ],
    lorebookIds: [BLACKTIDE_LOREBOOK_ID],
    unlock: {
      type: "anyOf",
      conditions: [
        { type: "flagSet", flag: FLAG_HARBOR_MASTER_TRUSTS_YOU },
        { type: "hasItem", itemId: SEALED_LETTER_ITEM_ID },
      ],
    },
    coverEmoji: "🗼",
    coverColor: "#2f4a7a",
    order: 3,
  },
  {
    id: SCENE_LAST_SHIP_ID,
    storyId: BLACKTIDE_STORY_ID,
    name: "The Last Ship Out",
    description:
      "The gangplank is still down. Marlow and Sable stand at the rail, waiting to see if you'd actually make it.",
    ambience: "Creaking rope, the low groan of a ship ready to leave port.",
    npcs: [
      { characterId: captainMarlow.id, roleInScene: "Captain" },
      { characterId: sable.id, roleInScene: "Fellow Passenger" },
    ],
    exits: [],
    items: [],
    lorebookIds: [BLACKTIDE_LOREBOOK_ID],
    unlock: { type: "questCompleted", questId: QUEST_DELIVER_LETTER_ID },
    coverEmoji: "🚢",
    coverColor: "#092957",
    order: 4,
  },
  ...starshipScenesMock,
];
