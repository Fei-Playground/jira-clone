// The manuscript: a live, ever-growing record of narrative blocks. Every
// real thing that happens in a story (entering a scene, a line of dialogue,
// a branch taken, a quest completed) appends one of these AT THE MOMENT IT
// HAPPENS — not batched after the fact. See narrative.composer.ts for how
// blocks get created and manuscript.renderer.ts (app layer) for how they
// get turned into novel/screenplay prose.
//
// Deliberate design: a block stores SOURCE MATERIAL, never a finished
// sentence. The finished sentence is generated at render time from the
// block + the current render options (mode/person/tense). This is what
// lets a reader switch novel <-> screenplay, or change person/tense,
// without replaying the story — only re-rendering it.

import { CharacterId } from "@domain/character";
import { SceneId } from "@domain/scene";
import { PlayerProfileId } from "@domain/party";
import { EnvironmentState } from "@domain/environment";

export type NarrativeBlockId = string;

export type NarrativeBlockKind =
  | "chapterBreak"
  | "sceneSetting"
  | "narration"
  | "dialogue"
  | "innerVoice"
  | "beat"
  | "turningPoint"
  | "closing";

// Where this block's text actually came from — the honesty backbone of the
// whole feature. "composed" is the only kind that needs a "template
// generated this" disclosure; "authored" and "dialogue" are verbatim quotes
// of real human-written or real player/NPC text.
export type NarrativeOrigin = "authored" | "dialogue" | "composed";

export interface NarrativeProvenance {
  origin: NarrativeOrigin;
  // Present only for origin "composed" — which template produced this, and
  // which real state values were plugged into it. Shown in a "where did
  // this come from" popover so a composed line is never mistaken for an
  // authored one.
  templateId?: string;
  inputs?: Record<string, string | number>;
}

export type NarrativeToneHint = "warm" | "neutral" | "cold";

export type NarrativePayload =
  | { kind: "chapterBreak"; index: number }
  | { kind: "sceneSetting"; description: string; ambience: string }
  | { kind: "narration"; text: string }
  | {
      kind: "dialogue";
      line: string;
      toneHint?: NarrativeToneHint;
    }
  | { kind: "innerVoice"; choiceLabel: string }
  | {
      kind: "beat";
      beatKind:
        | "threadOpened"
        | "threadAdvanced"
        | "threadClosed"
        | "propObtained"
        | "relationshipShift";
      params: Record<string, string | number>;
    }
  | {
      kind: "turningPoint";
      tpKind: "branchTaken" | "branchClosed" | "eventFired";
      text: string;
      params?: Record<string, string | number>;
    }
  | { kind: "closing"; params: Record<string, string | number> };

export interface NarrativeBlock {
  id: NarrativeBlockId;
  at: number;
  kind: NarrativeBlockKind;
  payload: NarrativePayload;
  provenance: NarrativeProvenance;
  sceneId?: SceneId;
  // Snapshotted at write time — renaming a scene later must not rewrite
  // text that already described what was real at the time it happened.
  sceneName?: string;
  speakerId?: CharacterId;
  speakerName?: string;
  memberId?: PlayerProfileId;
  memberName?: string;
  environment?: EnvironmentState;
  // Creator control: a block can be hidden from the rendered manuscript
  // (kept in the record, never shown/exported) or have its rendered text
  // manually overridden.
  hidden?: boolean;
  editedText?: string;
  // Structured revision audit trail (see narrative.revision.ts) — set only
  // when this block has been through reviseManuscriptBlock. Absent means
  // untouched, or only cosmetically re-worded via editedText above.
  revision?: import("./narrative.revision").NarrativeRevision;
}

// Hard cap so an extremely long-running story can't grow the manuscript
// without bound. When exceeded, the OLDEST chapter's blocks are collapsed
// into a single summary block (never silently dropped) — see
// narrative.composer.ts's foldOldestChapter.
export const MANUSCRIPT_BLOCK_LIMIT = 800;
