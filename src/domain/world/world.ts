import { LorebookId } from "@domain/lorebook";

export type WorldId = string;

export interface World {
  id: WorldId;
  name: string;
  description: string;
  tier: string;
  lorebookIds: LorebookId[];
  toneTags: string[];
  coverEmoji: string;
  coverColor: string;
  createdAt: number;
}
