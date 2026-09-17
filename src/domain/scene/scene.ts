import { CharacterId } from "@domain/character";
import { LorebookId } from "@domain/lorebook";
import { ItemId } from "@domain/item";
import { StoryId } from "@domain/story";
import { Condition } from "@domain/condition";

export type SceneId = string;

export interface SceneNpc {
  characterId: CharacterId;
  roleInScene: string;
  presenceCondition?: Condition;
}

export interface SceneExit {
  toSceneId: SceneId;
  label: string;
  condition?: Condition;
}

export interface SceneItem {
  itemId: ItemId;
  label: string;
  takeCondition?: Condition;
  oneTime: boolean;
}

export interface Scene {
  id: SceneId;
  storyId: StoryId;
  name: string;
  description: string;
  ambience: string;
  npcs: SceneNpc[];
  exits: SceneExit[];
  items: SceneItem[];
  lorebookIds: LorebookId[];
  unlock: Condition;
  coverEmoji: string;
  coverColor: string;
  order: number;
  // Author-created scenes are not re-localized when the language switches
  // (the same rule used for custom characters and stories).
  isCustom?: boolean;
}
