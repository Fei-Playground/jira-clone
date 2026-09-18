import { QuestId } from "@domain/quest";
import { SceneId } from "@domain/scene";
import { CharacterId } from "@domain/character";
import { TimeOfDay, Weather } from "@domain/environment";

export type ItemId = string;

export type Condition =
  | { type: "always" }
  | { type: "questCompleted"; questId: QuestId }
  | { type: "questActive"; questId: QuestId }
  | { type: "sceneVisited"; sceneId: SceneId }
  | { type: "hasItem"; itemId: ItemId; count?: number }
  | { type: "flagSet"; flag: string }
  | { type: "talkedToNpc"; characterId: CharacterId; times?: number }
  | { type: "timeOfDayIs"; timeOfDay: TimeOfDay }
  | { type: "weatherIs"; weather: Weather }
  // The world's ambienceIntensity (0-100) has reached at least this value —
  // lets a scene/exit/item gate on "how tense does the world currently
  // feel", shifted by story events rather than by a single flag/weather.
  | { type: "ambienceAtLeast"; value: number }
  // The player's long-run affinity (0-100) with this NPC has reached at
  // least this value — lets a quest/scene/dialogue gate on "has this NPC
  // grown to trust you", driven by real interaction history.
  | { type: "npcAffinityAtLeast"; characterId: CharacterId; value: number }
  | { type: "allOf"; conditions: Condition[] }
  | { type: "anyOf"; conditions: Condition[] }
  | { type: "not"; condition: Condition };
