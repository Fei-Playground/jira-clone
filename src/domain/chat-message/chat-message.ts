import { CharacterId } from "@domain/character";
import { LorebookId } from "@domain/lorebook";

export type ChatMessageId = string;
export type ChatSessionId = string;
export type MessageSender = "user" | "character" | "system";

// A snapshot of a lorebook entry that was injected for a given message, kept
// alongside the message so scrolling back through history still shows what
// was injected at the time (not recomputed against the current lorebooks).
export interface LoreInjectionSnapshot {
  entryId: string;
  entryName: string;
  content: string;
  matchedKeyword: string | null;
}

export interface GeneratedImageRecord {
  id: string;
  prompt: string;
  createdAt: number;
}

export interface ChatMessage {
  id: ChatMessageId;
  sender: MessageSender;
  text: string;
  createdAt: number;
  // Group-chat only: which character spoke this message (undefined in a
  // one-on-one session, where `sender: "character"` already identifies the
  // single companion).
  senderCharacterId?: CharacterId;
  loreInjections?: LoreInjectionSnapshot[];
  generatedImages?: GeneratedImageRecord[];
}

export interface AuthorNote {
  text: string;
  depth: number;
  updatedAt: number;
}

export interface ChatSession {
  id: ChatSessionId;
  characterId: CharacterId;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  authorNote?: AuthorNote;
  lorebookIds?: LorebookId[];
  // Set when this session is a scene conversation within a story, rather
  // than a free-standing companion chat. Both optional so existing/free
  // sessions are entirely unaffected.
  storyId?: string;
  sceneId?: string;
}
