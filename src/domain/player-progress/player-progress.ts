import { StoryId } from "@domain/story";
import { SceneId } from "@domain/scene";
import { QuestId, QuestObjectiveId, QuestStatus } from "@domain/quest";
import { ItemId } from "@domain/item";
import { CharacterId } from "@domain/character";
import { ChatSessionId } from "@domain/chat-message";
import { ChatRoomId } from "@domain/chat-room";
import { EnvironmentState } from "@domain/environment";
import { StoryEventId } from "@domain/story-event";
import { PartyId, PartyActivityEntry } from "@domain/party";
import type { NarrativeBlock } from "@domain/narrative";

// A relationship dimension between the player and one NPC. Both values are
// real, computed state (not decoration) — the condition system can gate on
// them and NPCs' quick-action/dialogue availability read them.
export interface NpcRelationship {
  // 0-100, only ever moves up (or holds) from real interactions: talking,
  // completing quests for that NPC, mentioning their interests. Drives
  // "how much this NPC opens up to you" over the long run.
  affinity: number;
  // 0-100, moves up AND down more freely — reacts to recent events (a
  // completed favor, being ignored for a while, current story ambience).
  // Drives the NPC's immediate tone independent of the long-run affinity.
  mood: number;
  // Timestamp of the last real interaction (talk / sendMessage / quest
  // turn-in) — used to let mood decay toward neutral when the player has
  // been away, and to gate "the NPC reaches out because it's been a while".
  lastInteractionAt: number;
}

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
  // NPC affinity/mood, keyed by character id. Optional — absent entries
  // read as the neutral default (see progress.reducer.ts's DEFAULT_RELATIONSHIP).
  npcRelationships?: Record<CharacterId, NpcRelationship>;
  // Has a party (multiplayer) — when unset, everything below is unused and
  // single-player behavior is exactly as before.
  partyId?: PartyId;
  activityLog?: PartyActivityEntry[];
  // The live manuscript: every real thing that happened, in the order it
  // happened, as narrative source material (not finished prose — see
  // @domain/narrative). Optional so v1/v2 saves read in with an empty
  // manuscript rather than being rejected.
  manuscript?: NarrativeBlock[];
  // Dedup keys (`groupLine:${roomId}:${messageId}`) for group-chat messages
  // already synced into the manuscript — authoritative de-dup so a
  // component remount / scene revisit / save restore never writes the same
  // group-chat line into the manuscript twice. Optional so older saves
  // read in as "nothing synced yet" rather than being rejected.
  syncedGroupLineKeys?: string[];
  updatedAt: number;
}
