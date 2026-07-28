import { DateRangeId, DATE_GROUPS } from "./activity-timeline.const";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const relativeTime = (timestamp: number, now = Date.now()): string => {
  const diff = Math.max(now - timestamp, 0);

  if (diff < MINUTE) return "just now";
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes}m ago`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours}h ago`;
  }

  const days = Math.floor(diff / DAY);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export const absoluteTime = (timestamp: number): string => {
  const locale = "en-US";
  const date = new Date(timestamp).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(timestamp).toLocaleTimeString(locale, {
    hour12: false,
    timeStyle: "short",
  });

  return `${date} · ${time}`;
};

export const shortDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

export type DateBounds = { from: number; to: number };

export const dateRangeBounds = (
  range: DateRangeId,
  customStartDate: string,
  customEndDate: string,
  now = Date.now()
): DateBounds | null => {
  const todayStart = startOfDay(now);

  switch (range) {
    case "today":
      return { from: todayStart, to: now };
    case "yesterday":
      return { from: todayStart - DAY, to: todayStart };
    case "last-7-days":
      return { from: todayStart - 6 * DAY, to: now };
    case "last-30-days":
      return { from: todayStart - 29 * DAY, to: now };
    case "this-month": {
      const date = new Date(now);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      return { from: monthStart, to: now };
    }
    case "custom": {
      if (!customStartDate && !customEndDate) return null;
      const from = customStartDate ? new Date(`${customStartDate}T00:00:00`).getTime() : 0;
      const to = customEndDate ? new Date(`${customEndDate}T23:59:59`).getTime() : now;
      return { from, to };
    }
    default:
      return null;
  }
};

export const dateGroupLabel = (timestamp: number, now = Date.now()): string => {
  const todayStart = startOfDay(now);

  if (timestamp >= todayStart) return DATE_GROUPS.today;
  if (timestamp >= todayStart - DAY) return DATE_GROUPS.yesterday;
  if (timestamp >= todayStart - 6 * DAY) return DATE_GROUPS.thisWeek;
  if (timestamp >= todayStart - 13 * DAY) return DATE_GROUPS.lastWeek;

  return DATE_GROUPS.older;
};
