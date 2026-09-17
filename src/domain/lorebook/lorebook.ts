export type LorebookId = string;
export type LorebookEntryId = string;

export interface LorebookEntry {
  id: LorebookEntryId;
  name: string;
  keywords: string[];
  content: string;
  enabled: boolean;
  priority: number;
  constant: boolean;
  caseSensitive?: boolean;
}

export interface Lorebook {
  id: LorebookId;
  name: string;
  description: string;
  entries: LorebookEntry[];
  createdAt: number;
}
