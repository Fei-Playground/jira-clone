export type CharacterId = string;

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
}
