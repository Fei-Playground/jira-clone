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

/**
 * Reads a `sortBy` value coming from the URL, ignoring letter case, and
 * returns the matching sort. Anything that is not a known sort is ignored.
 */
export const parseSort = (sort: string | null): Sort | null => {
  const normalizedSort = sort?.toLowerCase() ?? "";

  return isValidSort(normalizedSort) ? normalizedSort : null;
};
