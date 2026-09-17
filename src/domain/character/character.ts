export type CharacterId = string;

export interface CharacterImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface Character {
  id: CharacterId;
  name: string;
  tagline: string;
  personality: string;
  scenario: string;
  greeting: string;
  avatarColor: string;
  avatarEmoji: string;
  tags: string[];
  createdAt: number;
  isCustom?: boolean;
  // Character-card fields (SillyTavern-style depth). All optional so the
  // existing 7 default personas and any hand-authored mock keep working
  // without providing them.
  appearance?: string;
  speechStyle?: string;
  initialRelationship?: string;
  exampleDialogue?: string;
  images?: CharacterImage[];
  lorebookIds?: string[];
  defaultAuthorNote?: string;
  creatorNotes?: string;
  cardVersion?: number;
}
