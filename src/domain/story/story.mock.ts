import { BLACKTIDE_WORLD_ID } from "@domain/world";
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
} from "./blacktide-story.ids";
import { Story } from "./story";
import { starshipStoryMock } from "./starship-story.mock";

export const storiesMock: Story[] = [
  {
    id: BLACKTIDE_STORY_ID,
    title: "The Last Ship Out of Blacktide Harbor",
    synopsis:
      "A storm is coming, and so is the last ship out. Talk your way across the docks, the tavern, and the warehouses — trust the wrong person and you'll be stuck here when the tide turns.",
    worldId: BLACKTIDE_WORLD_ID,
    sceneIds: [
      SCENE_DOCKS_ID,
      SCENE_TAVERN_ID,
      SCENE_WAREHOUSE_ID,
      SCENE_LIGHTHOUSE_ID,
      SCENE_LAST_SHIP_ID,
    ],
    startSceneId: SCENE_DOCKS_ID,
    questIds: [QUEST_ASK_AROUND_ID, QUEST_BRASS_KEY_ID, QUEST_DELIVER_LETTER_ID],
    authorNote: {
      text: "Tone: rain-soaked noir. Keep dialogue terse and a little wary — nobody in this harbor trusts easily.",
      depth: 2,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
    coverEmoji: "🌊",
    coverColor: "#0c66e4",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  starshipStoryMock,
];
