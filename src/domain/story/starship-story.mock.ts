import { STARSHIP_WORLD_ID } from "@domain/world";
import {
  STARSHIP_STORY_ID,
  SCENE_BRIDGE_ID,
  SCENE_ENGINE_ROOM_ID,
  SCENE_MED_BAY_ID,
  SCENE_OBSERVATION_DECK_ID,
  QUEST_SENSOR_GHOST_ID,
  QUEST_COOLANT_LEAK_ID,
  QUEST_THE_SIGNAL_ID,
} from "./starship-story.ids";
import { Story } from "./story";

export const starshipStoryMock: Story = {
  id: STARSHIP_STORY_ID,
  title: "The Silent Run of the Wayfinder",
  synopsis:
    "A blip on the sensors, a coolant leak, and a signal nobody can quite explain — a quiet shift on the Wayfinder is about to get a lot less quiet.",
  worldId: STARSHIP_WORLD_ID,
  sceneIds: [SCENE_BRIDGE_ID, SCENE_ENGINE_ROOM_ID, SCENE_MED_BAY_ID, SCENE_OBSERVATION_DECK_ID],
  startSceneId: SCENE_BRIDGE_ID,
  questIds: [QUEST_SENSOR_GHOST_ID, QUEST_COOLANT_LEAK_ID, QUEST_THE_SIGNAL_ID],
  authorNote: {
    text: "Tone: quiet hard sci-fi. Curiosity over dread — the ship feels safe, even when something's off.",
    depth: 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  coverEmoji: "🛰️",
  coverColor: "#3b2f7a",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
};
