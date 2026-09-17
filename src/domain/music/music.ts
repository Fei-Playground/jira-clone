// The music system: a small, real "what mood should this scene's ambient
// soundtrack be in" derivation, plus the synthesis parameters that mood
// maps to. Nothing here is a licensed music track — this sandbox has no
// network access to fetch or embed real audio files — but the mood
// derivation and the resulting soundtrack ARE real: a genuine function of
// the world's tone tags, the current environment, and the scene's own
// ambience, driving actual generated audio (see use-ambient-soundtrack.ts).
// Changing the environment (a storm event firing, night falling) really
// changes which mood plays, exactly the same way it really changes the
// scene's background gradient.

import { EnvironmentState } from "@domain/environment";
import { World } from "@domain/world";
import { Scene } from "@domain/scene";

export type MusicMood = "calm" | "tense" | "melancholy" | "mysterious" | "triumphant";

export const MUSIC_MOOD_VALUES: MusicMood[] = [
  "calm",
  "tense",
  "melancholy",
  "mysterious",
  "triumphant",
];

export const MUSIC_MOOD_EMOJI: Record<MusicMood, string> = {
  calm: "🎐",
  tense: "🥁",
  melancholy: "🎻",
  mysterious: "🔮",
  triumphant: "🎺",
};

// A subset of the Web Audio API's OscillatorType values this system
// actually uses. Defined as our own literal union (rather than referencing
// the DOM lib's `OscillatorType` directly) so this file has no dependency
// on ambient DOM globals being resolvable outside a browser-typed context
// — the values are identical and assignable to `OscillatorType` wherever
// the Web Audio API expects one.
export type AudioWaveform = "sine" | "triangle" | "sawtooth" | "square";

// Synthesis parameters for a mood: a base oscillator frequency (Hz), a
// waveform shape, and a harmonic ratio for a second, quieter oscillator
// that gives the drone its character (a fifth above for calm/triumphant,
// a minor second for tense/mysterious dissonance, etc.). Also a slow LFO
// rate (Hz) that gives the pad its "breathing" movement.
export interface MoodSynthParams {
  baseFrequency: number;
  waveform: AudioWaveform;
  harmonicRatio: number;
  harmonicWaveform: AudioWaveform;
  lfoRate: number;
  lfoDepth: number;
}

export const MOOD_SYNTH_PARAMS: Record<MusicMood, MoodSynthParams> = {
  calm: {
    baseFrequency: 174,
    waveform: "sine",
    harmonicRatio: 1.5, // a perfect fifth above
    harmonicWaveform: "sine",
    lfoRate: 0.08,
    lfoDepth: 6,
  },
  triumphant: {
    baseFrequency: 220,
    waveform: "triangle",
    harmonicRatio: 1.25, // a major third above
    harmonicWaveform: "triangle",
    lfoRate: 0.12,
    lfoDepth: 10,
  },
  melancholy: {
    baseFrequency: 164,
    waveform: "sine",
    harmonicRatio: 1.2, // a minor third above
    harmonicWaveform: "sine",
    lfoRate: 0.05,
    lfoDepth: 4,
  },
  mysterious: {
    baseFrequency: 146,
    waveform: "sawtooth",
    harmonicRatio: 1.0595, // a minor second above — dissonant, unsettled
    harmonicWaveform: "sine",
    lfoRate: 0.15,
    lfoDepth: 8,
  },
  tense: {
    baseFrequency: 130,
    waveform: "sawtooth",
    harmonicRatio: 1.0595,
    harmonicWaveform: "sawtooth",
    lfoRate: 0.3,
    lfoDepth: 14,
  },
};

// Real, deterministic derivation — no randomness. Priority order:
// 1. The environment's weather/ambience can override everything (a storm
//    or high tension always reads as tense, regardless of setting).
// 2. Otherwise, the world's own toneTags pick a mood family (a noir world
//    defaults moodier than a bright one).
// 3. Night always shifts a calm/triumphant read toward mysterious.
export const deriveSceneMood = (
  environment: EnvironmentState,
  world: Pick<World, "toneTags"> | undefined
): MusicMood => {
  if (environment.weather === "storm" || environment.ambienceIntensity >= 70) {
    return "tense";
  }
  if (environment.ambienceIntensity >= 45) {
    return "mysterious";
  }

  const tags = (world?.toneTags ?? []).map((t) => t.toLowerCase());
  const has = (...keys: string[]) => keys.some((k) => tags.includes(k));

  if (has("noir", "mystery", "quiet-tension", "谜团", "静默的紧张感", "黑色悬疑")) {
    return environment.timeOfDay === "night" ? "mysterious" : "melancholy";
  }
  if (has("bittersweet", "苦涩余味")) {
    return "melancholy";
  }
  if (has("curiosity", "sci-fi", "好奇心", "科幻")) {
    return environment.timeOfDay === "night" ? "mysterious" : "calm";
  }

  if (environment.timeOfDay === "night") return "mysterious";
  return "calm";
};

// Exported for callers that want a mood tied to a specific scene rather
// than only the ambient environment — e.g. showing what a scene WOULD
// sound like in the story editor preview. Currently scenes don't carry
// their own tone override, so this is equivalent to deriveSceneMood, but
// kept as its own entry point so a per-scene override can be added later
// without changing every call site.
export const deriveMoodForScene = (
  _scene: Pick<Scene, "id">,
  environment: EnvironmentState,
  world: Pick<World, "toneTags"> | undefined
): MusicMood => deriveSceneMood(environment, world);
