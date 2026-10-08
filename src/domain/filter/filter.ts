import { UserId } from "@domain/user";

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

// Radix Select does not accept an empty item value, so "everyone" gets its own sentinel
export const ALL_ASSIGNEES = "all";

export type AssigneeFilter = UserId | typeof ALL_ASSIGNEES;

export const DEFAULT_ASSIGNEE_FILTER: AssigneeFilter = ALL_ASSIGNEES;

export const isValidAssigneeFilter = (value: unknown): value is AssigneeFilter =>
  typeof value === "string" && value.length > 0;
