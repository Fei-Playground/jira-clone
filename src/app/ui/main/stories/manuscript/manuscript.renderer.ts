// renderManuscript: the ONE place NarrativeBlock[] (source material) turns
// into actual prose lines. Switching novel <-> screenplay, or person/tense,
// is just calling this again with different options — never a replay of
// the story. Author-written text (Scene.description, StoryEvent.narration,
// dialogue lines) is always quoted verbatim; only the composed connective
// tissue is affected by person/tense.

import { Locale } from "@app/locales";
import { NarrativeBlock, NarrativeBlockId } from "@domain/narrative";
import {
  SPEECH_VERB,
  BEAT_TEMPLATE,
  CLOSING_TEMPLATE,
  CHAPTER_LABEL,
  SCREENPLAY_SCENE_HEADING,
  SCREENPLAY_TRANSITION,
  SCREENPLAY_CLOSING,
} from "@domain/narrative";

export type ManuscriptMode = "novel" | "screenplay";
export type NarrativePov = "first" | "third";
export type NarrativeTense = "past" | "present";

export interface ManuscriptOptions {
  mode: ManuscriptMode;
  pov: NarrativePov;
  tense: NarrativeTense;
  includeMinorBeats: boolean;
  protagonistName: string;
}

export const DEFAULT_MANUSCRIPT_OPTIONS: ManuscriptOptions = {
  mode: "novel",
  pov: "third",
  tense: "past",
  includeMinorBeats: false,
  protagonistName: "",
};

export type RenderedLineType =
  | "chapterHeading"
  | "sceneHeading"
  | "prose"
  | "action"
  | "dialogueSpeaker"
  | "dialogueLine"
  | "parenthetical"
  | "separator"
  | "ghost";

export interface RenderedLine {
  blockId: NarrativeBlockId;
  type: RenderedLineType;
  text: string;
}

export interface RenderedManuscript {
  lines: RenderedLine[];
  wordCount: number;
  blockCount: number;
}

// The protagonist pronoun for composed sentences (author text/dialogue is
// never touched by this — only sentences built by narrative.templates.ts).
const protagonistSubject = (options: ManuscriptOptions): string => {
  if (options.pov === "first") return options.tense === "present" ? "I" : "I";
  return options.protagonistName || "They";
};

const decidedVerb = (options: ManuscriptOptions): string => {
  if (options.pov === "first") {
    return options.tense === "present" ? "decide" : "decided";
  }
  return options.tense === "present" ? "decides" : "decided";
};

const renderBlockNovel = (
  block: NarrativeBlock,
  options: ManuscriptOptions,
  locale: Locale
): RenderedLine[] => {
  if (block.editedText !== undefined) {
    return [{ blockId: block.id, type: "prose", text: block.editedText }];
  }

  const payload = block.payload;
  switch (payload.kind) {
    case "chapterBreak":
      return [
        {
          blockId: block.id,
          type: "chapterHeading",
          text: CHAPTER_LABEL[locale](payload.index),
        },
      ];
    case "sceneSetting":
      return [{ blockId: block.id, type: "prose", text: payload.description }];
    case "narration":
      return [{ blockId: block.id, type: "prose", text: payload.text }];
    case "dialogue": {
      const verb = SPEECH_VERB[locale][payload.toneHint ?? "neutral"];
      const speaker = block.speakerName ?? "";
      const text =
        locale === Locale.ZH
          ? `「${payload.line}」${speaker}${verb}。`
          : `"${payload.line}" ${speaker} ${verb}.`;
      return [{ blockId: block.id, type: "prose", text }];
    }
    case "innerVoice": {
      const subject = protagonistSubject(options);
      const verb = decidedVerb(options);
      const text =
        locale === Locale.ZH
          ? `${subject === "I" ? "我" : subject}${payload.choiceLabel}`
          : `${subject} ${verb}: ${payload.choiceLabel}.`;
      return [{ blockId: block.id, type: "prose", text }];
    }
    case "beat": {
      const t = BEAT_TEMPLATE[locale];
      let text = "";
      switch (payload.beatKind) {
        case "threadOpened":
          text = t.threadOpened(
            String(payload.params.giver ?? ""),
            String(payload.params.thread ?? "")
          );
          break;
        case "threadAdvanced":
          text = t.threadAdvanced(String(payload.params.thread ?? ""));
          break;
        case "threadClosed":
          text = t.threadClosed(String(payload.params.thread ?? ""));
          break;
        case "propObtained":
          text = t.propObtained(String(payload.params.prop ?? ""));
          break;
        case "relationshipShift":
          text = t.relationshipShift(String(payload.params.name ?? ""));
          break;
      }
      return [{ blockId: block.id, type: "prose", text }];
    }
    case "turningPoint":
      return [{ blockId: block.id, type: "prose", text: payload.text }];
    case "closing":
      return [{ blockId: block.id, type: "prose", text: CLOSING_TEMPLATE[locale] }];
  }
};

// Screenplay mode: real standard-format screenplay elements — a scene
// heading with time-of-day (slugline convention), action lines, and
// character-name/dialogue/parenthetical blocks. Author-written scene
// description and dialogue lines are still quoted verbatim; only the
// slugline and parentheticals are composed from real state.
const renderBlockScreenplay = (block: NarrativeBlock, locale: Locale): RenderedLine[] => {
  if (block.editedText !== undefined) {
    return [{ blockId: block.id, type: "action", text: block.editedText }];
  }
  const payload = block.payload;
  switch (payload.kind) {
    case "chapterBreak": {
      const timeOfDay = block.environment?.timeOfDay;
      const heading = timeOfDay
        ? SCREENPLAY_SCENE_HEADING[locale](block.sceneName ?? "", timeOfDay)
        : (block.sceneName ?? "").toUpperCase();
      return [{ blockId: block.id, type: "sceneHeading", text: heading }];
    }
    case "sceneSetting":
      return [{ blockId: block.id, type: "action", text: payload.description }];
    case "narration":
      // A narration block fired by enterScene-on-revisit is a scene
      // transition in prose terms — render it as the standard screenplay
      // transition slugline followed by the connective action line, so a
      // scene change reads as a real script transition, not a stray line.
      return [
        { blockId: block.id, type: "separator", text: SCREENPLAY_TRANSITION[locale] },
        { blockId: block.id, type: "action", text: payload.text },
      ];
    case "dialogue": {
      const lines: RenderedLine[] = [
        {
          blockId: block.id,
          type: "dialogueSpeaker",
          text: (block.speakerName ?? "").toUpperCase(),
        },
      ];
      if (payload.toneHint && payload.toneHint !== "neutral") {
        lines.push({
          blockId: block.id,
          type: "parenthetical",
          text:
            locale === Locale.ZH
              ? payload.toneHint === "warm"
                ? "（语气松快）"
                : "（冷淡）"
              : payload.toneHint === "warm"
                ? "(warmly)"
                : "(coldly)",
        });
      }
      lines.push({ blockId: block.id, type: "dialogueLine", text: payload.line });
      return lines;
    }
    case "innerVoice":
      // Screenplay convention has no interiority — a choice becomes what
      // the protagonist visibly DOES, an action line.
      return [{ blockId: block.id, type: "action", text: payload.choiceLabel }];
    case "beat": {
      const t = BEAT_TEMPLATE[locale];
      let text = "";
      switch (payload.beatKind) {
        case "threadOpened":
          text = t.threadOpened(
            String(payload.params.giver ?? ""),
            String(payload.params.thread ?? "")
          );
          break;
        case "threadAdvanced":
          text = t.threadAdvanced(String(payload.params.thread ?? ""));
          break;
        case "threadClosed":
          text = t.threadClosed(String(payload.params.thread ?? ""));
          break;
        case "propObtained":
          text = t.propObtained(String(payload.params.prop ?? ""));
          break;
        case "relationshipShift":
          text = t.relationshipShift(String(payload.params.name ?? ""));
          break;
      }
      return [{ blockId: block.id, type: "action", text }];
    }
    case "turningPoint":
      return [{ blockId: block.id, type: "action", text: payload.text }];
    case "closing":
      return [{ blockId: block.id, type: "separator", text: SCREENPLAY_CLOSING[locale] }];
  }
};

export const renderManuscript = (
  blocks: NarrativeBlock[],
  options: ManuscriptOptions,
  locale: Locale
): RenderedManuscript => {
  const visible = blocks.filter((b) => {
    if (b.hidden) return false;
    if (
      !options.includeMinorBeats &&
      b.payload.kind === "beat" &&
      b.payload.beatKind === "threadAdvanced"
    ) {
      return false;
    }
    return true;
  });

  const lines = visible.flatMap((block) =>
    options.mode === "screenplay"
      ? renderBlockScreenplay(block, locale)
      : renderBlockNovel(block, options, locale)
  );

  const wordCount = lines.reduce((sum, l) => sum + l.text.trim().length, 0);

  return { lines, wordCount, blockCount: visible.length };
};
