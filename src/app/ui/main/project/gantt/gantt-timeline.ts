export const DAY_MS = 24 * 60 * 60 * 1000;
export const DAY_WIDTH = 28;
export const LABEL_WIDTH = 200;
export const ROW_HEIGHT = 44;
export const MILESTONE_LANE_HEIGHT = 56;
export const HEADER_HEIGHT = 52;

/** Normalize to local midnight. */
export const startOfDay = (ms: number): number => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.valueOf();
};

export const addDays = (ms: number, days: number): number => startOfDay(ms) + days * DAY_MS;

export const daysBetween = (from: number, to: number): number =>
  Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);

export const dateToOffset = (date: number, rangeStart: number): number =>
  daysBetween(rangeStart, date) * DAY_WIDTH;

export const offsetToDate = (offsetX: number, rangeStart: number): number => {
  const dayIndex = Math.max(0, Math.floor(offsetX / DAY_WIDTH));
  return addDays(rangeStart, dayIndex);
};

export const formatDayLabel = (ms: number): string => {
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const formatWeekday = (ms: number): string => {
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, { weekday: "short" });
};

export const buildDayTicks = (rangeStart: number, dayCount: number): number[] => {
  return Array.from({ length: dayCount }, (_, i) => addDays(rangeStart, i));
};

export const statusBarClass: Record<string, string> = {
  TODO: "bg-background-neutral-bold text-font-inverse",
  IN_PROGRESS: "bg-background-brand-bold text-font-inverse",
  DONE: "bg-background-success-bold text-font-inverse",
};
