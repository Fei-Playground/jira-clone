// Real, not decorative: the tone a line of NPC dialogue gets transcribed
// with is a function of that NPC's ACTUAL relationship values (the same
// affinity/mood the condition system and quick-actions already read) — not
// a random pick. Push an NPC's mood down, then talk to them again, and the
// transcription verb genuinely changes register.

import { NpcRelationship } from "@domain/player-progress";
import { NarrativeToneHint } from "./narrative";

// Exported so the reverse mapping (retone — "set this NPC's tone TO warm")
// uses the exact same numbers as this forward derivation. Two copies of
// these thresholds drifting apart would produce the bug the plan warns
// about: "set to warm but still renders as neutral".
export const WARM_AFFINITY_THRESHOLD = 40;
export const WARM_MOOD_THRESHOLD = 60;
export const COLD_MOOD_THRESHOLD = 35;

export const deriveToneHint = (relationship: NpcRelationship | undefined): NarrativeToneHint => {
  if (!relationship) return "neutral";
  if (relationship.mood <= COLD_MOOD_THRESHOLD) return "cold";
  if (
    relationship.affinity >= WARM_AFFINITY_THRESHOLD &&
    relationship.mood >= WARM_MOOD_THRESHOLD
  ) {
    return "warm";
  }
  return "neutral";
};
