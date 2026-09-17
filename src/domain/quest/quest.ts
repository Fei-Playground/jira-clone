import { CharacterId } from "@domain/character";
import { SceneId } from "@domain/scene";
import { ItemId } from "@domain/item";
import { StoryId } from "@domain/story";
import { Condition } from "@domain/condition";

export type QuestId = string;
export type QuestObjectiveId = string;
export type QuestStatus =
  | "locked"
  | "available"
  | "active"
  | "readyToTurnIn"
  | "completed"
  | "failed";

export type QuestObjective =
  | {
      id: QuestObjectiveId;
      kind: "talkToNpc";
      characterId: CharacterId;
      times: number;
      label: string;
    }
  | { id: QuestObjectiveId; kind: "visitScene"; sceneId: SceneId; label: string }
  | { id: QuestObjectiveId; kind: "obtainItem"; itemId: ItemId; count: number; label: string }
  | {
      id: QuestObjectiveId;
      kind: "sayKeyword";
      characterId?: CharacterId;
      keywords: string[];
      label: string;
    };

export interface QuestReward {
  items?: { itemId: ItemId; count: number }[];
  unlockSceneIds?: SceneId[];
  setFlags?: string[];
  unlockQuestIds?: QuestId[];
}

export interface Quest {
  id: QuestId;
  storyId: StoryId;
  title: string;
  description: string;
  giverCharacterId?: CharacterId;
  giverSceneId?: SceneId;
  available: Condition;
  objectives: QuestObjective[];
  turnInCharacterId?: CharacterId;
  reward: QuestReward;
  isMainline: boolean;
  order: number;
  isCustom?: boolean;
}
