const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * DAY_IN_MS;
const MONTH_IN_MS = 30 * DAY_IN_MS;
const YEAR_IN_MS = 365 * DAY_IN_MS;
const MONTHS_TIER_START_IN_MS = 8 * WEEK_IN_MS;

export const formatIssueAge = (createdAt: number, now: number): string => {
  const elapsed = now - createdAt;

  if (elapsed < DAY_IN_MS) {
    return "today";
  }

  if (elapsed < WEEK_IN_MS) {
    return `${Math.floor(elapsed / DAY_IN_MS)}d`;
  }

  if (elapsed < MONTHS_TIER_START_IN_MS) {
    return `${Math.floor(elapsed / WEEK_IN_MS)}w`;
  }

  if (elapsed < YEAR_IN_MS) {
    return `${Math.floor(elapsed / MONTH_IN_MS)}mo`;
  }

  return `${Math.floor(elapsed / YEAR_IN_MS)}y`;
};
