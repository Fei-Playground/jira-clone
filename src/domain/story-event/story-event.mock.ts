import {
  BLACKTIDE_STORY_ID,
  SCENE_DOCKS_ID,
  SCENE_LIGHTHOUSE_ID,
  SCENE_WAREHOUSE_ID,
  QUEST_ASK_AROUND_ID,
  FLAG_HARBOR_MASTER_TRUSTS_YOU,
  STARSHIP_STORY_ID,
  SCENE_ENGINE_ROOM_ID,
  QUEST_SENSOR_GHOST_ID,
} from "@domain/story";
import { BRASS_KEY_ITEM_ID } from "@domain/item";
import { StoryEvent } from "./story-event";

export const EVENT_STORM_BREAKS_ID = "0k8g9h0i-event-0001-0000-000000000001";
export const EVENT_LIGHT_STEADIES_ID = "0k8g9h0i-event-0002-0000-000000000002";
export const EVENT_LONG_NIGHT_SHIFT_ID = "0k8g9h0i-event-0003-0000-000000000003";
export const EVENT_KEY_WHISPERS_ID = "0k8g9h0i-event-0004-0000-000000000004";

export const storyEventsMock: StoryEvent[] = [
  {
    id: EVENT_STORM_BREAKS_ID,
    storyId: BLACKTIDE_STORY_ID,
    sceneId: SCENE_DOCKS_ID,
    title: "The Storm Breaks",
    // Fires the moment the player has quest ① active — the "moving story
    // along" beat, not tied to any one NPC's dialogue.
    trigger: { type: "questActive", questId: QUEST_ASK_AROUND_ID },
    effect: {
      narration:
        "A gust off the water knocks a lantern loose — it shatters on the boards. The rain picks up without warning.",
      setWeather: "storm",
      ambienceDelta: 25,
    },
    order: 0,
  },
  {
    id: EVENT_LIGHT_STEADIES_ID,
    storyId: BLACKTIDE_STORY_ID,
    sceneId: SCENE_LIGHTHOUSE_ID,
    title: "The Light Steadies",
    trigger: { type: "flagSet", flag: FLAG_HARBOR_MASTER_TRUSTS_YOU },
    effect: {
      narration:
        "The lighthouse beam settles into a slow, steady sweep — for the first time tonight, it feels like the storm might actually pass.",
      setWeather: "clear",
      ambienceDelta: -20,
    },
    order: 0,
  },
  {
    id: EVENT_LONG_NIGHT_SHIFT_ID,
    storyId: STARSHIP_STORY_ID,
    sceneId: SCENE_ENGINE_ROOM_ID,
    title: "A Long Night Shift",
    // Fires once the sensor-ghost investigation is underway — chasing it
    // down eats the whole shift, and the ship's cycle rolls over to night
    // while the player is still in the engine room.
    trigger: { type: "questActive", questId: QUEST_SENSOR_GHOST_ID },
    effect: {
      narration:
        "Hours slip by chasing the blip through the logs. By the time you look up, the corridor lights have dimmed to their night-cycle amber — ship's night, for whatever that's worth out here.",
      setTimeOfDay: "night",
      ambienceDelta: 10,
    },
    order: 0,
  },
  {
    id: EVENT_KEY_WHISPERS_ID,
    storyId: BLACKTIDE_STORY_ID,
    sceneId: SCENE_WAREHOUSE_ID,
    title: "The Key Whispers",
    // Fires the moment the player is standing in the warehouse WHILE holding
    // the brass key — a possession-driven trigger, distinct from the
    // quest/flag-driven ones above. Demonstrates that an event can react to
    // what's in the player's pocket, not just to story progress markers.
    trigger: { type: "hasItem", itemId: BRASS_KEY_ITEM_ID },
    effect: {
      narration:
        "The brass key grows warm in your pocket the moment you step among the crates — as if it already knows which lock it's meant for.",
      ambienceDelta: 10,
    },
    order: 1,
  },
];
