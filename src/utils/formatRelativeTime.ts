const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const relativeTimeFormat = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

export const formatRelativeTime = (
  timestamp: number,
  now: number = Date.now()
): string => {
  const elapsed = timestamp - now;
  const distance = Math.abs(elapsed);

  if (distance < MINUTE) return relativeTimeFormat.format(0, "second");
  if (distance < HOUR) {
    return relativeTimeFormat.format(Math.round(elapsed / MINUTE), "minute");
  }
  if (distance < DAY) {
    return relativeTimeFormat.format(Math.round(elapsed / HOUR), "hour");
  }
  if (distance < WEEK) {
    return relativeTimeFormat.format(Math.round(elapsed / DAY), "day");
  }
  if (distance < MONTH) {
    return relativeTimeFormat.format(Math.round(elapsed / WEEK), "week");
  }
  if (distance < YEAR) {
    return relativeTimeFormat.format(Math.round(elapsed / MONTH), "month");
  }

  return relativeTimeFormat.format(Math.round(elapsed / YEAR), "year");
};
