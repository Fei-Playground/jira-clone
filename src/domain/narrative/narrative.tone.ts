// Real, not decorative: the tone a line of NPC dialogue gets transcribed
// with is a function of that NPC's ACTUAL relationship values (the same
// affinity/mood the condition system and quick-actions already read) — not
// a random pick. Push an NPC's mood down, then talk to them again, and the
// transcription verb genuinely changes register.

import { NpcRelationship } from "@domain/player-progress";
import { NarrativeToneHint } from "./narrative";

const WARM_AFFINITY_THRESHOLD = 40;
const WARM_MOOD_THRESHOLD = 60;
const COLD_MOOD_THRESHOLD = 35;

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
