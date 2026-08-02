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

// Date filter (created-at window presets)
export const dateFilters = ["any", "today", "7d", "30d", "90d"] as const;
export const DEFAULT_DATE_FILTER: DateFilter = "any";

export type DateFilter = (typeof dateFilters)[number];
type DateFilterDict = Record<DateFilter, string>;
type DateFilterItem = {
  id: DateFilter;
  label: string;
};
export type DateFilterList = DateFilterItem[];

export const dateFilterDict: DateFilterDict = {
  any: "Any time",
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export const dateFilterList: DateFilterList = (
  Object.entries(dateFilterDict) as [DateFilter, string][]
).map(([key, value]) => ({
  id: key,
  label: value,
}));

export const isValidDateFilter = (value: string): value is DateFilter =>
  dateFilters.includes(value as DateFilter);

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/** Returns true when `createdAt` falls inside the selected date window. */
export const issueMatchesDateFilter = (
  createdAt: number,
  filter: DateFilter,
  now: number = Date.now()
): boolean => {
  if (filter === "any") {
    return true;
  }

  if (filter === "today") {
    return createdAt >= startOfDay(now);
  }

  const days =
    filter === "7d" ? 7 : filter === "30d" ? 30 : filter === "90d" ? 90 : 0;

  return createdAt >= now - days * DAY_MS;
};
