// Scene backgrounds: real, state-driven visuals — not a static picture per
// scene. Each scene carries its own base color (coverColor, matching the
// story's setting — a rusty warehouse vs. a cold lighthouse), and that base
// is blended with the CURRENT environment (time of day, weather, ambience
// intensity) to produce the actual gradient shown. Because environment is
// real state that story events shift (a storm event sets weather: "storm",
// a quest reward can push ambienceIntensity up), the background changes
// exactly when — and because — the world actually changes. Nothing here is
// randomized or hardcoded per scene name.

import { EnvironmentState, TimeOfDay, Weather } from "@domain/environment";
import { Scene } from "./scene";

export interface SceneBackground {
  // A ready-to-use CSS `background` value (a layered gradient).
  gradient: string;
  // How dark the overlay reads (0-1) — driving whether light text should be
  // used on top, and available for tests/snapshots to assert against.
  darkness: number;
}

// Parses a "#rrggbb" hex string into 0-255 channel values. Scene/world
// cover colors are always authored this way (see scene.mock.ts), so this
// intentionally doesn't handle shorthand hex or named colors.
const parseHex = (hex: string): { r: number; g: number; b: number } => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return {
    r: Number.isNaN(r) ? 0 : r,
    g: Number.isNaN(g) ? 0 : g,
    b: Number.isNaN(b) ? 0 : b,
  };
};

const toHex = (channel: number): string =>
  Math.max(0, Math.min(255, Math.round(channel)))
    .toString(16)
    .padStart(2, "0");

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

// How much a time of day darkens/lightens the base color. 0 = no change,
// negative = darken toward black, positive = lighten toward white.
const TIME_OF_DAY_SHIFT: Record<TimeOfDay, number> = {
  dawn: -0.05,
  day: 0.1,
  dusk: -0.15,
  night: -0.4,
};

// How much a weather condition desaturates + darkens the base color, and
// what tint (if any) it washes in — storms read cold/blue-grey, fog reads
// flat and pale, rain sits between the two.
const WEATHER_SHIFT: Record<Weather, { darken: number; tint: string | null }> = {
  clear: { darken: 0, tint: null },
  rain: { darken: -0.1, tint: "#3a4a5a" },
  storm: { darken: -0.25, tint: "#20242f" },
  fog: { darken: -0.05, tint: "#8a8f94" },
};

// Real, deterministic function of (scene, environment) — the same inputs
// always produce the same background, and changing either input (a scene
// transition, a story event shifting the environment) changes the output.
export const deriveSceneBackground = (
  scene: Pick<Scene, "coverColor">,
  environment: EnvironmentState
): SceneBackground => {
  const base = parseHex(scene.coverColor);
  const timeShift = TIME_OF_DAY_SHIFT[environment.timeOfDay];
  const weather = WEATHER_SHIFT[environment.weather];

  // Time of day: mix toward black (negative shift) or white (positive).
  const timeTarget = timeShift < 0 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
  const timeT = Math.abs(timeShift);
  let r = mix(base.r, timeTarget.r, timeT);
  let g = mix(base.g, timeTarget.g, timeT);
  let b = mix(base.b, timeTarget.b, timeT);

  // Weather: darken further and wash in the weather's tint color.
  if (weather.darken !== 0) {
    const darkT = Math.abs(weather.darken);
    r = mix(r, 0, darkT);
    g = mix(g, 0, darkT);
    b = mix(b, 0, darkT);
  }
  if (weather.tint) {
    const tint = parseHex(weather.tint);
    r = mix(r, tint.r, 0.25);
    g = mix(g, tint.g, 0.25);
    b = mix(b, tint.b, 0.25);
  }

  // Ambience intensity (0-100): the more tense/charged the world currently
  // feels, the more a warm red undertone bleeds into the gradient's second
  // stop — a real, continuous reflection of the world's current tension
  // dial, not a discrete on/off state.
  const ambienceT = Math.max(0, Math.min(100, environment.ambienceIntensity)) / 100;
  const hotR = mix(r, 200, ambienceT * 0.35);
  const hotG = mix(g, 40, ambienceT * 0.35);
  const hotB = mix(b, 40, ambienceT * 0.35);

  const baseColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const secondColor = `#${toHex(hotR)}${toHex(hotG)}${toHex(hotB)}`;

  // Overall darkness reading (0 = bright, 1 = near-black) — used by callers
  // to decide whether to render light text over the banner.
  const darkness = Math.max(0, Math.min(1, (255 - (r + g + b) / 3) / 255));

  return {
    gradient: `linear-gradient(135deg, ${baseColor} 0%, ${secondColor} 100%)`,
    darkness,
  };
};
