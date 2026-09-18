// Locale-keyed sentence templates for COMPOSED narrative text — kept here
// rather than in en.ts/zh.ts because every one of these is plugged with a
// real value (a scene name, a character name, an item name) and needs to
// stay a plain function, not a translation-file lookup. Mirrors the
// existing pattern in quick-action.builder.ts's GENERIC_TEMPLATES.
//
// Every string produced here is a "composed" narrative origin — i.e. it
// MUST be disclosed as template-generated, never presented as authored
// prose. See narrative.ts's NarrativeProvenance.

import { Locale } from "@app/locales";
import { TimeOfDay, Weather } from "@domain/environment";
import { NarrativeToneHint } from "./narrative";

const TIME_OF_DAY_WORD: Record<Locale, Record<TimeOfDay, string>> = {
  [Locale.EN]: { dawn: "dawn", day: "day", dusk: "dusk", night: "night" },
  [Locale.ZH]: { dawn: "黎明", day: "白天", dusk: "黄昏", night: "夜晚" },
};

const WEATHER_CLAUSE: Record<Locale, Record<Weather, string>> = {
  [Locale.EN]: {
    clear: "the sky is clear",
    rain: "a steady rain is falling",
    storm: "a storm is raging",
    fog: "a thick fog has settled in",
  },
  [Locale.ZH]: {
    clear: "天色晴朗",
    rain: "雨一直下着",
    storm: "风暴正猛烈",
    fog: "浓雾笼罩四周",
  },
};

// The chapter-opening environment clause — e.g. "It is dusk in the Rainy
// Night Tavern, and a steady rain is falling." Pure composition from real
// environment values; never invents a detail.
export const ENVIRONMENT_CLAUSE_TEMPLATE: Record<
  Locale,
  (sceneName: string, timeOfDay: TimeOfDay, weather: Weather, tense: boolean) => string
> = {
  [Locale.EN]: (sceneName, timeOfDay, weather) =>
    `It is ${TIME_OF_DAY_WORD[Locale.EN][timeOfDay]} in ${sceneName}, and ${WEATHER_CLAUSE[Locale.EN][weather]}.`,
  [Locale.ZH]: (sceneName, timeOfDay, weather) =>
    `${TIME_OF_DAY_WORD[Locale.ZH][timeOfDay]}的${sceneName}，${WEATHER_CLAUSE[Locale.ZH][weather]}。`,
};

export const TENSE_CLAUSE: Record<Locale, string> = {
  [Locale.EN]: "the air feels charged",
  [Locale.ZH]: "空气里透着一股紧张",
};

export const SPEECH_VERB: Record<Locale, Record<NarrativeToneHint, string>> = {
  [Locale.EN]: {
    warm: "says, her voice softening",
    neutral: "says",
    cold: "says flatly",
  },
  [Locale.ZH]: {
    warm: "语气松快下来地说",
    neutral: "说",
    cold: "淡淡地说",
  },
};

export const TRANSITION_TEMPLATE: Record<
  Locale,
  { sameChapterLater: string; newChapter: (from: string, to: string) => string }
> = {
  [Locale.EN]: {
    sameChapterLater: "A moment later —",
    newChapter: (from, to) => `Leaving ${from} behind, the way opens toward ${to}.`,
  },
  [Locale.ZH]: {
    sameChapterLater: "不久之后——",
    newChapter: (from, to) => `离开${from}，转向${to}。`,
  },
};

export const BEAT_TEMPLATE: Record<
  Locale,
  {
    threadOpened: (giver: string, thread: string) => string;
    threadAdvanced: (thread: string) => string;
    threadClosed: (thread: string) => string;
    propObtained: (prop: string) => string;
    relationshipShift: (name: string) => string;
  }
> = {
  [Locale.EN]: {
    threadOpened: (giver, thread) => `${giver} entrusts something to the protagonist: ${thread}.`,
    threadAdvanced: (thread) => `Progress is made on ${thread}.`,
    threadClosed: (thread) => `${thread} draws to a close.`,
    propObtained: (prop) => `The protagonist now carries ${prop}.`,
    relationshipShift: (name) => `Something in ${name}'s manner has genuinely changed.`,
  },
  [Locale.ZH]: {
    threadOpened: (giver, thread) => `${giver}把一件事托付给了主角：${thread}。`,
    threadAdvanced: (thread) => `${thread}的进展又往前推了一步。`,
    threadClosed: (thread) => `${thread}这条线，收束了。`,
    propObtained: (prop) => `主角把${prop}收进了行囊。`,
    relationshipShift: (name) => `${name}的态度，真的不一样了。`,
  },
};

export const TURNING_POINT_TEMPLATE: Record<
  Locale,
  {
    branchClosed: (thread: string) => string;
    eventFallback: string;
  }
> = {
  [Locale.EN]: {
    branchClosed: (thread) => `That road — ${thread} — is closed now.`,
    eventFallback: "Something in the world just changed.",
  },
  [Locale.ZH]: {
    branchClosed: (thread) => `${thread}这条线，从此关上了。`,
    eventFallback: "世界悄悄发生了变化。",
  },
};

export const CLOSING_TEMPLATE: Record<Locale, string> = {
  [Locale.EN]: "The story rests here, for now.",
  [Locale.ZH]: "故事，暂且写到这里。",
};

export const CHAPTER_LABEL: Record<Locale, (index: number) => string> = {
  [Locale.EN]: (index) => `Chapter ${index}`,
  [Locale.ZH]: (index) => `第${index}章`,
};

// Standard screenplay scene-heading time-of-day suffix (INT./EXT. is not
// derivable from our data — we don't know if a scene is indoors or
// outdoors — so the heading uses the neutral form without INT./EXT.,
// which is still a real, recognizable slugline in screenplay convention).
const SCREENPLAY_TIME_SUFFIX: Record<Locale, Record<TimeOfDay, string>> = {
  [Locale.EN]: { dawn: "DAWN", day: "DAY", dusk: "DUSK", night: "NIGHT" },
  [Locale.ZH]: { dawn: "黎明", day: "日", dusk: "黄昏", night: "夜" },
};

// e.g. "雨夜酒馆 · 夜" / "RAINY NIGHT TAVERN - NIGHT"
export const SCREENPLAY_SCENE_HEADING: Record<
  Locale,
  (sceneName: string, timeOfDay: TimeOfDay) => string
> = {
  [Locale.EN]: (sceneName, timeOfDay) =>
    `${sceneName.toUpperCase()} - ${SCREENPLAY_TIME_SUFFIX[Locale.EN][timeOfDay]}`,
  [Locale.ZH]: (sceneName, timeOfDay) =>
    `${sceneName} · ${SCREENPLAY_TIME_SUFFIX[Locale.ZH][timeOfDay]}`,
};

// Screenplay-format transition slugline between scenes (distinct from the
// novel-mode TRANSITION_TEMPLATE's prose sentence).
export const SCREENPLAY_TRANSITION: Record<Locale, string> = {
  [Locale.EN]: "CUT TO:",
  [Locale.ZH]: "转场：",
};

export const SCREENPLAY_CLOSING: Record<Locale, string> = {
  [Locale.EN]: "FADE OUT.",
  [Locale.ZH]: "淡出。",
};

// Manuscript-level disclosure line, shown pinned at the top of the view.
export const PROVENANCE_NOTE: Record<Locale, string> = {
  [Locale.EN]:
    "This manuscript is assembled from what actually happened — real scene text, real dialogue, and templated sentences filled in with real state. No line here was written by a language model.",
  [Locale.ZH]:
    "这份手稿由真实发生的事情组装而成——真实的场景描写、真实的对话、以及用真实状态填充的模板句。这里的任何一句都不是大模型写的。",
};
