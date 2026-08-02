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

// --- Date filter (board) ---
export const dateFilters = [
  "all",
  "today",
  "yesterday",
  "last_7_days",
  "last_30_days",
  "this_month",
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
  all: "All dates",
  today: "Today",
  yesterday: "Yesterday",
  last_7_days: "Last 7 days",
  last_30_days: "Last 30 days",
  this_month: "This month",
};

export const dateFilterList: DateFilterList = (
  Object.entries(dateFilterDict) as [DateFilter, string][]
).map(([key, value]) => ({
  id: key,
  label: value,
}));

export const isValidDateFilter = (value: string): value is DateFilter =>
  dateFilters.includes(value as DateFilter);

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** Returns true if `timestamp` falls within the selected date filter window. */
export const issueMatchesDateFilter = (
  timestamp: number,
  filter: DateFilter,
  now: number = Date.now()
): boolean => {
  if (filter === "all") return true;

  const nowDate = new Date(now);
  const ts = timestamp;

  if (filter === "today") {
    return ts >= startOfDay(nowDate).getTime() && ts <= endOfDay(nowDate).getTime();
  }

  if (filter === "yesterday") {
    const yesterday = new Date(nowDate);
    yesterday.setDate(yesterday.getDate() - 1);
    return ts >= startOfDay(yesterday).getTime() && ts <= endOfDay(yesterday).getTime();
  }

  if (filter === "last_7_days") {
    const from = startOfDay(nowDate);
    from.setDate(from.getDate() - 6);
    return ts >= from.getTime() && ts <= endOfDay(nowDate).getTime();
  }

  if (filter === "last_30_days") {
    const from = startOfDay(nowDate);
    from.setDate(from.getDate() - 29);
    return ts >= from.getTime() && ts <= endOfDay(nowDate).getTime();
  }

  // this_month
  const monthStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
  return ts >= startOfDay(monthStart).getTime() && ts <= endOfDay(nowDate).getTime();
};
