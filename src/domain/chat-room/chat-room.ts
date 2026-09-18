import { CharacterId } from "@domain/character";
import { LorebookId } from "@domain/lorebook";
import { AuthorNote, ChatMessage } from "@domain/chat-message";

export type ChatRoomId = string;
export type TurnMode = "round-robin" | "natural" | "manual";
export const turnModes: TurnMode[] = ["round-robin", "natural", "manual"];

export const MIN_ROOM_MEMBERS = 2;
export const MAX_ROOM_MEMBERS = 6;

export interface ChatRoomMember {
  characterId: CharacterId;
  muted: boolean;
  order: number;
}

export interface ChatRoom {
  id: ChatRoomId;
  name: string;
  members: ChatRoomMember[];
  turnMode: TurnMode;
  lorebookIds: LorebookId[];
  authorNote?: AuthorNote;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  // Round-robin cursor: the `order` of the last speaker, used to compute who
  // speaks next.
  lastSpeakerOrder?: number;
  // Set when this room was spawned by a scene's group-conversation action,
  // rather than being a free-standing group chat.
  sceneId?: string;
}

export const isValidMemberCount = (n: number): boolean =>
  n >= MIN_ROOM_MEMBERS && n <= MAX_ROOM_MEMBERS;
