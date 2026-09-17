import { StoryId } from "@domain/story";
import { SceneId } from "@domain/scene";
import { QuestId, QuestObjectiveId, QuestStatus } from "@domain/quest";
import { ItemId } from "@domain/item";
import { CharacterId } from "@domain/character";
import { ChatSessionId } from "@domain/chat-message";
import { ChatRoomId } from "@domain/chat-room";
import { EnvironmentState } from "@domain/environment";
import { StoryEventId } from "@domain/story-event";

export interface QuestState {
  status: QuestStatus;
  objectiveProgress: Record<QuestObjectiveId, number>;
  startedAt?: number;
  completedAt?: number;
}

export interface PlayerProgress {
  storyId: StoryId;
  currentSceneId: SceneId;
  visitedSceneIds: SceneId[];
  questStates: Record<QuestId, QuestState>;
  inventory: Record<ItemId, number>;
  flags: string[];
  npcTalkCounts: Record<CharacterId, number>;
  // Session IDs that have already been counted toward a talkToNpc objective,
  // keyed the same way as sceneSessionIds — guards against re-counting when
  // a player re-opens a conversation they already sent a message in.
  countedTalkSessionIds: string[];
  sceneSessionIds: Record<string, ChatSessionId>;
  sceneRoomIds: Record<SceneId, ChatRoomId>;
  // Scene items already picked up, keyed `${sceneId}:${itemId}` — guards a
  // one-time scene item from being taken twice.
  takenSceneItemKeys: string[];
  environment: EnvironmentState;
  // Story events that have already fired — each event fires at most once.
  firedEventIds: StoryEventId[];
  updatedAt: number;
}
