// The "environment" system: a small set of world-state dials — time of day,
// weather, and an ambience intensity — that a story can start with and that
// gameplay (quest rewards, story events) can shift over time. It's read by
// the condition system (environmentIs) so a scene/exit/event can require a
// particular environment state, and scenes can be authored to change their
// mood as the story environment shifts (e.g. the docks scene reads calmer
// prose once the storm passes).

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";
export type Weather = "clear" | "rain" | "storm" | "fog";

export interface EnvironmentState {
  timeOfDay: TimeOfDay;
  weather: Weather;
  // 0-100, a coarse "how tense/charged does this world feel right now" dial
  // that story events can nudge — not tied to any one scene.
  ambienceIntensity: number;
}

export const TIME_OF_DAY_VALUES: TimeOfDay[] = ["dawn", "day", "dusk", "night"];
export const WEATHER_VALUES: Weather[] = ["clear", "rain", "storm", "fog"];

export const DEFAULT_ENVIRONMENT: EnvironmentState = {
  timeOfDay: "day",
  weather: "clear",
  ambienceIntensity: 20,
};

export const TIME_OF_DAY_EMOJI: Record<TimeOfDay, string> = {
  dawn: "🌅",
  day: "☀️",
  dusk: "🌆",
  night: "🌙",
};

export const WEATHER_EMOJI: Record<Weather, string> = {
  clear: "🌤️",
  rain: "🌧️",
  storm: "⛈️",
  fog: "🌫️",
};
