import { CharacterId } from "@domain/character";

export type ChatMessageId = string;
export type ChatSessionId = string;
export type MessageSender = "user" | "character";

export interface ChatMessage {
  id: ChatMessageId;
  sender: MessageSender;
  text: string;
  createdAt: number;
}

export interface ChatSession {
  id: ChatSessionId;
  characterId: CharacterId;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
