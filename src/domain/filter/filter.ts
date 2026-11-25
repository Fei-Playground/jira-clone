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

/**
 * The canonical sort for a raw `sortBy` value coming from the URL. The value is
 * matched case-insensitively ("Priority" and "PRIORITY" both mean "priority"),
 * so links and hand-typed URLs sort the same. Anything that is not a known sort
 * is ignored, returning null.
 */
export const parseSort = (sort: string | null): Sort | null => {
  if (!sort) return null;

  const normalizedSort = sort.toLowerCase();

  return sorts.find((knownSort) => knownSort === normalizedSort) ?? null;
};
