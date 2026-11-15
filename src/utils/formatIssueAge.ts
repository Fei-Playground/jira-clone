const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;

export const formatIssueAge = (
  createdAt: number,
  now: number = Date.now()
): string => {
  const ageInDays = Math.floor((now - createdAt) / MS_PER_DAY);

  if (ageInDays < 1) {
    return "today";
  }

  if (ageInDays < DAYS_PER_WEEK) {
    return `${ageInDays}d`;
  }

  return `${Math.floor(ageInDays / DAYS_PER_WEEK)}w`;
};
