const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

/**
 * Human readable "time ago" label, e.g. "2h ago", "3 days ago".
 * Falls back to a month based label for anything older than 4 weeks.
 */
export const formatRelativeTime = (timestamp: number, now: number = Date.now()): string => {
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

  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return days === 1 ? "yesterday" : `${days} days ago`;
  }

  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  const months = Math.floor(diff / MONTH);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
};

/** Short date label, e.g. "18 Jan 2024". */
export const formatShortDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
