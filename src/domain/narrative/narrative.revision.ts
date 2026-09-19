// Structured revisions: the "rewrite the outcome" tier (see plan §10). Unlike
// `editedText` (free-text rewording, purely cosmetic, zero gameplay
// consequence), a NarrativeRevision is picked from a closed set of real
// options and is routed through the SAME ProgressEvent pipeline every other
// gameplay action uses — so it produces real, re-derivable consequences
// (quest availability, scene unlocks, an NPC's future dialogue) rather than
// an untestable guess at what a sentence "means".

import { Locale } from "@app/locales";
import { CharacterId } from "@domain/character";
import { TimeOfDay, Weather } from "@domain/environment";
import { NarrativeBlockId, NarrativePayload, NarrativeToneHint } from "./narrative";
import {
  WARM_AFFINITY_THRESHOLD,
  WARM_MOOD_THRESHOLD,
  COLD_MOOD_THRESHOLD,
} from "./narrative.tone";

export type NarrativeRevisionKind = "cosmetic" | "retone" | "rechoose" | "reenvironment";

// The three structured revision shapes. Each carries exactly what its
// reducer branch needs — no free text anywhere in this union.
export type NarrativeRevisionInput =
  | { kind: "retone"; characterId: CharacterId; tone: NarrativeToneHint }
  | {
      kind: "rechoose";
      characterId: CharacterId;
      revokeFlags: string[];
      setFlags: string[];
      choiceId: string;
      choiceLabel: string;
      choiceLine: string;
    }
  | { kind: "reenvironment"; timeOfDay?: TimeOfDay; weather?: Weather };

// Persisted on the block after a revision is committed — the audit trail
// the plan calls for: who changed it, when, what it was before, and what
// real consequence it had.
export interface NarrativeRevision {
  at: number;
  kind: NarrativeRevisionKind;
  byMemberId?: string;
  byMemberName?: string;
  previousPayload?: NarrativePayload;
  previousEditedText?: string;
  consequenceSummary?: string[];
}

// retone's reverse mapping — set mood/affinity to real values that
// deriveToneHint (narrative.tone.ts) will read back as the target tone.
// Uses the SAME exported constants as the forward derivation so the two
// can never drift apart.
export const toneToRelationshipTarget = (
  tone: NarrativeToneHint
): { affinityAtLeast?: number; mood: number } => {
  switch (tone) {
    case "warm":
      return { affinityAtLeast: WARM_AFFINITY_THRESHOLD, mood: Math.max(WARM_MOOD_THRESHOLD, 75) };
    case "cold":
      return { mood: Math.max(0, COLD_MOOD_THRESHOLD - 10) };
    case "neutral":
      return { mood: 50 };
  }
};

const TONE_LABEL: Record<Locale, Record<NarrativeToneHint, string>> = {
  [Locale.EN]: { warm: "warmer", neutral: "neutral", cold: "colder" },
  [Locale.ZH]: { warm: "更热络", neutral: "中性", cold: "更冷淡" },
};

// Human-readable "this will cause..." lines shown under each structured
// option BEFORE the user commits — and re-used as the persisted
// consequenceSummary after commit, so the badge/hover shows the same text
// the picker promised.
export const buildConsequenceSummary = (
  revision: NarrativeRevisionInput,
  locale: Locale,
  characterName: string
): string[] => {
  switch (revision.kind) {
    case "retone":
      return [
        locale === Locale.ZH
          ? `${characterName}的态度会变得${TONE_LABEL[Locale.ZH][revision.tone]}，后续对白语气与需要 TA 信任的剧情线会真实跟着变。`
          : `${characterName}'s attitude shifts ${TONE_LABEL[Locale.EN][revision.tone]} — their future dialogue tone and any plot thread that needs their trust will genuinely follow.`,
      ];
    case "rechoose":
      return [
        locale === Locale.ZH
          ? `改选「${revision.choiceLabel}」——原选择留下的标记会被撤销，任务可接取性与后续台词会重新计算。`
          : `Switches to "${revision.choiceLabel}" — the original choice's flags are revoked, and quest availability and future dialogue will be recalculated.`,
      ];
    case "reenvironment":
      return [
        locale === Locale.ZH
          ? `场景背景、氛围音乐、以及依赖时段/天气的剧情通道会真实跟着变。`
          : `The scene background, ambient soundtrack, and any plot path gated on time-of-day/weather will genuinely follow.`,
      ];
  }
};

export type { NarrativeBlockId };
