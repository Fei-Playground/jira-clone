const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * DAY_IN_MS;

export const formatIssueAge = (createdAt: number, now: number): string => {
  const elapsed = now - createdAt;

  if (elapsed < DAY_IN_MS) {
    return "today";
  }

  if (elapsed < WEEK_IN_MS) {
    return `${Math.floor(elapsed / DAY_IN_MS)}d`;
  }

  return `${Math.floor(elapsed / WEEK_IN_MS)}w`;
};
