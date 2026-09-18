import { WorldId } from "@domain/world";
import { SceneId } from "@domain/scene";
import { QuestId } from "@domain/quest";
import { AuthorNote } from "@domain/chat-message";
import { TimeOfDay, Weather } from "@domain/environment";

export type StoryId = string;

// The time-of-day/weather a fresh playthrough of this story starts with.
// Optional so existing mock stories fall back to the domain default
// (DEFAULT_ENVIRONMENT) without needing a migration.
export interface StoryInitialEnvironment {
  timeOfDay: TimeOfDay;
  weather: Weather;
}

export interface Story {
  id: StoryId;
  title: string;
  synopsis: string;
  worldId: WorldId;
  sceneIds: SceneId[];
  startSceneId: SceneId;
  questIds: QuestId[];
  authorNote?: AuthorNote;
  initialEnvironment?: StoryInitialEnvironment;
  coverEmoji: string;
  coverColor: string;
  isCustom?: boolean;
  createdAt: number;
}
