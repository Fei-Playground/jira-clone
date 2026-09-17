// Quick actions: contextual "say this" buttons under a chat window, derived
// from real state — not decorative canned phrases. See
// quick-action.builder.ts for how they're assembled.

import { CharacterId } from "@domain/character";
import { QuestId, QuestObjectiveId } from "@domain/quest";
import { Condition } from "@domain/condition";

export type QuickActionSource = "questKeyword" | "authored" | "loreKeyword" | "generic";

export interface QuickAction {
  // Stable key for React lists.
  id: string;
  // Short text shown on the button itself.
  label: string;
  // The full sentence actually sent when clicked.
  text: string;
  source: QuickActionSource;
  // Only set for source "questKeyword" — which quest/objective this button
  // advances, used for the 🎯 badge and its tooltip.
  questId?: QuestId;
  objectiveId?: QuestObjectiveId;
  // The keyword this button's text is guaranteed to contain (questKeyword
  // and loreKeyword sources).
  keyword?: string;
  // When true, clicking ALWAYS fills the composer instead of sending —
  // regardless of Shift — both as a visible chip and from the overflow
  // menu. Used by "@member" mention chips, which insert at the cursor
  // rather than sending a finished sentence.
  alwaysFill?: boolean;
}

// A creator-authored quick phrase, attachable to a Scene or a SceneNpc.
// Optional on both — existing mock/custom content needs no migration.
export interface QuickPhrase {
  id: string;
  label: string;
  text: string;
  condition?: Condition;
}

export interface QuickActionAuthoredSource {
  characterId?: CharacterId;
  phrases: QuickPhrase[];
}
