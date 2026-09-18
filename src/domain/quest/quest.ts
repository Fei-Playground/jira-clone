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
  // Evaluated every time progress changes, but ONLY while this quest is
  // still "available" (offered, not yet accepted). When it becomes true,
  // the quest is recalled to "locked" — real retraction, not decoration:
  // an offer the player hasn't taken yet can genuinely be withdrawn because
  // they chose the opposing branch. Once a quest is "active" or beyond,
  // this is never checked again — accepting it commits the player.
  excludedBy?: Condition;
}
