// The "event" system: lightweight, no-accept/no-turn-in narrative beats,
// distinct from Quest (which the player explicitly accepts and turns in).
// A StoryEvent fires itself the first time its trigger condition is met
// while the player is in its scene — no NPC interaction required. It's for
// things like "the storm breaks the moment you set foot on the docks" or
// "the lighthouse light flickers out once the engine is stabilized" —
// atmosphere and consequence, not a task to complete.

import { SceneId } from "@domain/scene";
import { StoryId } from "@domain/story";
import { ItemId } from "@domain/item";
import { Condition } from "@domain/condition";
import { TimeOfDay, Weather } from "@domain/environment";

export type StoryEventId = string;

export interface StoryEventEffect {
  // A one-line narration inserted into the scene the moment the event
  // fires — shown as a system-style message in the scene, not tied to any
  // one NPC's chat session.
  narration: string;
  setFlags?: string[];
  items?: { itemId: ItemId; count: number }[];
  setTimeOfDay?: TimeOfDay;
  setWeather?: Weather;
  ambienceDelta?: number; // added to the current ambienceIntensity, clamped 0-100
}

export interface StoryEvent {
  id: StoryEventId;
  storyId: StoryId;
  sceneId: SceneId;
  title: string;
  // Evaluated against progress the moment the player is in `sceneId`
  // (checked on enterScene and after any progress-changing action taken
  // while already in that scene). Fires at most once per event.
  trigger: Condition;
  effect: StoryEventEffect;
  order: number;
  isCustom?: boolean;
}
