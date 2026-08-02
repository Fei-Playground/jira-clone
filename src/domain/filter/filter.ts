export const sorts = ["date", "priority"] as const;
export const DEFAULT_SORT: Sort = "date";

export type Sort = (typeof sorts)[number];
type SortDict = Record<Sort, string>;
type SortItem = {
  id: Sort;
  label: string;
};
export type SortList = SortItem[];

export const sortDict: SortDict = {
  date: "Date",
  priority: "Priority",
};

export const sortList: SortList = (Object.entries(sortDict) as [Sort, string][]).map(
  ([key, value]) => ({
    id: key,
    label: value,
  })
);

export const isValidSort = (sort: string): sort is Sort => sorts.includes(sort as Sort);

// ── Date filter ──────────────────────────────────────────────────────────────

export const dateFilterFields = ["createdAt", "updatedAt"] as const;
export type DateFilterField = (typeof dateFilterFields)[number];

export const dateFilterFieldDict: Record<DateFilterField, string> = {
  createdAt: "Created",
  updatedAt: "Updated",
};

export const dateFilterPresets = [
  "any",
  "today",
  "yesterday",
  "last7",
  "last30",
  "last90",
  "custom",
] as const;
export type DateFilterPreset = (typeof dateFilterPresets)[number];

export const dateFilterPresetDict: Record<DateFilterPreset, string> = {
  any: "Any time",
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
  last90: "Last 90 days",
  custom: "Custom range",
};

export type DateFilter = {
  field: DateFilterField;
  preset: DateFilterPreset;
  /** Inclusive start date as YYYY-MM-DD (custom preset only) */
  from?: string;
  /** Inclusive end date as YYYY-MM-DD (custom preset only) */
  to?: string;
};

export const DEFAULT_DATE_FILTER: DateFilter = {
  field: "createdAt",
  preset: "any",
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const endOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

/** Parse YYYY-MM-DD as a local calendar date. */
const parseLocalDate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

export type DateFilterRange = {
  start: number;
  end: number;
};

/**
 * Resolve a date filter to an inclusive [start, end] timestamp range.
 * Returns null when the filter matches everything (Any time / incomplete custom).
 */
export const getDateFilterRange = (
  filter: DateFilter,
  now: Date = new Date()
): DateFilterRange | null => {
  const todayStart = startOfDay(now);

  switch (filter.preset) {
    case "any":
      return null;
    case "today":
      return { start: todayStart, end: endOfDay(now) };
    case "yesterday": {
      const yesterday = new Date(todayStart - MS_PER_DAY);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }
    case "last7":
      return { start: todayStart - 6 * MS_PER_DAY, end: endOfDay(now) };
    case "last30":
      return { start: todayStart - 29 * MS_PER_DAY, end: endOfDay(now) };
    case "last90":
      return { start: todayStart - 89 * MS_PER_DAY, end: endOfDay(now) };
    case "custom": {
      const fromDate = filter.from ? parseLocalDate(filter.from) : null;
      const toDate = filter.to ? parseLocalDate(filter.to) : null;
      if (!fromDate && !toDate) return null;
      const start = fromDate ? startOfDay(fromDate) : Number.NEGATIVE_INFINITY;
      const end = toDate ? endOfDay(toDate) : Number.POSITIVE_INFINITY;
      if (start > end) return { start: end, end: start };
      return { start, end };
    }
    default:
      return null;
  }
};

export const isDateFilterActive = (filter: DateFilter): boolean =>
  getDateFilterRange(filter) !== null;

export const getDateFilterLabel = (filter: DateFilter): string => {
  if (filter.preset === "any") return "Dates";
  const fieldLabel = dateFilterFieldDict[filter.field];
  if (filter.preset === "custom") {
    if (filter.from && filter.to) {
      return `${fieldLabel}: ${filter.from} → ${filter.to}`;
    }
    if (filter.from) return `${fieldLabel}: from ${filter.from}`;
    if (filter.to) return `${fieldLabel}: until ${filter.to}`;
    return `${fieldLabel}: Custom`;
  }
  return `${fieldLabel}: ${dateFilterPresetDict[filter.preset]}`;
};

export const issueMatchesDateFilter = (
  issue: { createdAt: number; updatedAt: number },
  filter: DateFilter,
  now: Date = new Date()
): boolean => {
  const range = getDateFilterRange(filter, now);
  if (!range) return true;
  const timestamp = issue[filter.field];
  return timestamp >= range.start && timestamp <= range.end;
};
