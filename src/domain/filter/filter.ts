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

export const dateFilters = [
  "all",
  "today",
  "last_7_days",
  "last_30_days",
  "last_90_days",
] as const;
export const DEFAULT_DATE_FILTER: DateFilter = "all";

export type DateFilter = (typeof dateFilters)[number];
type DateFilterDict = Record<DateFilter, string>;
type DateFilterItem = {
  id: DateFilter;
  label: string;
};
export type DateFilterList = DateFilterItem[];

export const dateFilterDict: DateFilterDict = {
  all: "Any time",
  today: "Today",
  last_7_days: "Last 7 days",
  last_30_days: "Last 30 days",
  last_90_days: "Last 90 days",
};

export const dateFilterList: DateFilterList = (
  Object.entries(dateFilterDict) as [DateFilter, string][]
).map(([key, value]) => ({
  id: key,
  label: value,
}));

export const isValidDateFilter = (filter: string): filter is DateFilter =>
  dateFilters.includes(filter as DateFilter);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): number => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
};

/** Returns the inclusive lower bound timestamp for a date filter, or null for "all". */
export const getDateFilterStart = (
  filter: DateFilter,
  now: number = Date.now()
): number | null => {
  if (filter === "all") return null;

  const todayStart = startOfDay(new Date(now));

  switch (filter) {
    case "today":
      return todayStart;
    case "last_7_days":
      return todayStart - 6 * MS_PER_DAY;
    case "last_30_days":
      return todayStart - 29 * MS_PER_DAY;
    case "last_90_days":
      return todayStart - 89 * MS_PER_DAY;
    default:
      return null;
  }
};

export const matchesDateFilter = (
  timestamp: number,
  filter: DateFilter,
  now: number = Date.now()
): boolean => {
  const start = getDateFilterStart(filter, now);
  if (start === null) return true;
  return timestamp >= start && timestamp <= now;
};
