import { Issue } from "@domain/issue";
import { Priority, PriorityId, prioritiesMock } from "@domain/priority";

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

export const ALL_PRIORITIES = "all" as const;
export type PriorityFilter = PriorityId | typeof ALL_PRIORITIES;

/** The priority levels the given issues actually use, in canonical priority order. */
export const getUsedPriorities = (issues: Issue[]): Priority[] => {
  const used = new Set(issues.map((issue) => issue.priority.id));
  return prioritiesMock.filter((priority) => used.has(priority.id));
};
