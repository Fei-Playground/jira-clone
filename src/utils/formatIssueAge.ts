const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;
const WEEKS_BEFORE_MONTHS = 8;
const DAYS_PER_YEAR = 365;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_MONTH = DAYS_PER_YEAR / MONTHS_PER_YEAR;
const MONTHS_BEFORE_STALE = 6;

const getAgeInDays = (createdAt: number, now: number): number =>
  Math.floor((now - createdAt) / MS_PER_DAY);

const getAgeInMonths = (ageInDays: number): number =>
  Math.floor(ageInDays / DAYS_PER_MONTH);

export const formatIssueAge = (
  createdAt: number,
  now: number = Date.now()
): string => {
  const ageInDays = getAgeInDays(createdAt, now);

  if (ageInDays < 1) {
    return "today";
  }

  if (ageInDays < DAYS_PER_WEEK) {
    return `${ageInDays}d`;
  }

  if (ageInDays < WEEKS_BEFORE_MONTHS * DAYS_PER_WEEK) {
    return `${Math.floor(ageInDays / DAYS_PER_WEEK)}w`;
  }

  if (ageInDays < DAYS_PER_YEAR) {
    return `${getAgeInMonths(ageInDays)}mo`;
  }

  return `${Math.floor(ageInDays / DAYS_PER_YEAR)}y`;
};

export const isIssueStale = (
  createdAt: number,
  now: number = Date.now()
): boolean => getAgeInMonths(getAgeInDays(createdAt, now)) >= MONTHS_BEFORE_STALE;
