import { CharacterId } from "@domain/character";
import { LorebookId } from "@domain/lorebook";
import { ItemId } from "@domain/item";
import { StoryId } from "@domain/story";
import { Condition } from "@domain/condition";
import { QuickPhrase } from "@domain/quick-action";

export type SceneId = string;

// A dialogue choice: a decision point offered while talking to an NPC,
// distinct from a quick phrase (which just sends a line). Picking one sends
// its `line` as the player's message AND sets flags directly — no quest
// involved. Real branching: whichever flag ends up set is read elsewhere
// (another NPC's dialogue reply, a quest's `available`/`excludedBy`) to
// change what happens next. `visibleWhen` is what keeps a set of choices
// mutually exclusive in the UI — once one is picked and its flag is set,
// the other choice's `visibleWhen` (typically "the flag isn't set yet")
// stops matching and it disappears.
export interface DialogueChoice {
  id: string;
  label: string;
  line: string;
  setFlags: string[];
  visibleWhen?: Condition;
}

export interface SceneNpc {
  characterId: CharacterId;
  roleInScene: string;
  presenceCondition?: Condition;
  // Creator-authored quick phrases that only appear while talking to THIS
  // NPC (e.g. asking Sable specifically "who has the brass key?"). Optional
  // so existing mock/custom NPCs need no migration.
  quickPhrases?: QuickPhrase[];
  // Decision points offered while talking to THIS NPC — see DialogueChoice.
  dialogueChoices?: DialogueChoice[];
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
  // Creator-authored quick phrases that appear in ANY conversation held
  // inside this scene, regardless of which NPC it's with.
  quickPhrases?: QuickPhrase[];
}
