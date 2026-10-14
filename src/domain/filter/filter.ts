import { PriorityId, prioritiesMock } from "@domain/priority";

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
export const DEFAULT_PRIORITY_FILTER: PriorityFilter = ALL_PRIORITIES;

export type PriorityFilter = PriorityId | typeof ALL_PRIORITIES;
type PriorityFilterItem = {
  id: PriorityFilter;
  label: string;
};
export type PriorityFilterList = PriorityFilterItem[];

export const priorityFilterList: PriorityFilterList = [
  { id: ALL_PRIORITIES, label: "All priorities" },
  // Highest priority first, the same order the issues are sorted in
  ...[...prioritiesMock].reverse().map((priority) => ({
    id: priority.id,
    label: priority.name,
  })),
];
