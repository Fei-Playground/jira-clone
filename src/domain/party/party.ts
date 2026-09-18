// Party: a group of PlayerProfiles sharing one story's progress on the
// same device (hot-seat multiplayer) — see player-progress.ts for how
// progress itself stays a single shared value while only each member's
// scene position is individual.

import { StoryId } from "@domain/story";
import { SceneId } from "@domain/scene";

export type PlayerProfileId = string;
export type PartyId = string;

export interface PlayerProfile {
  id: PlayerProfileId;
  name: string;
  emoji: string;
  color: string;
  // Where THIS member currently stands — independent per member, even
  // though the rest of PlayerProgress (quests/inventory/flags/etc.) is
  // shared across the whole party.
  currentSceneId: SceneId;
  joinedAt: number;
}

export interface Party {
  id: PartyId;
  storyId: StoryId;
  name: string;
  members: PlayerProfile[];
  // Whoever is "at the controls" right now — drives whose name/color shows
  // on sent messages and whose currentSceneId mirrors progress.currentSceneId.
  activeMemberId: PlayerProfileId;
  createdAt: number;
  // The party channel's ChatRoom id, once one has been created (lazily, on
  // first open) — a plain ChatRoom with zero NPC members, so the existing
  // turn-scheduler never schedules anyone to speak in it.
  channelRoomId?: string;
}

export const MIN_PARTY_MEMBERS = 2;
export const MAX_PARTY_MEMBERS = 6;

export type PartyActivityKind =
  | "questAccepted"
  | "questCompleted"
  | "questReadyToTurnIn"
  | "sceneUnlocked"
  | "sceneEntered"
  | "itemObtained"
  | "storyEventFired";

export interface PartyActivityEntry {
  id: string;
  memberId: PlayerProfileId;
  // Snapshotted at write time so removing a member later doesn't blank out
  // the historical log entries that named them.
  memberName: string;
  at: number;
  kind: PartyActivityKind;
  // Pre-resolved display params (quest title, scene name, item name, count)
  // for the i18n template — never raw ids, since those may later be renamed
  // or the entity removed.
  params: Record<string, string | number>;
}

const PARTY_COLORS = ["#0c66e4", "#22a06b", "#e34935", "#946f00", "#1d7f8c", "#94c748"];

export const PARTY_EMOJIS = ["🧭", "🗡️", "📖", "🔮", "🛡️", "🏹"];

export const nextPartyColor = (existingCount: number): string =>
  PARTY_COLORS[existingCount % PARTY_COLORS.length];

export const nextPartyEmoji = (existingCount: number): string =>
  PARTY_EMOJIS[existingCount % PARTY_EMOJIS.length];
