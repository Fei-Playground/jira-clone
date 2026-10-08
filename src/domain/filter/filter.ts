import { UserId } from "@domain/user";
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

// Radix Select does not accept an empty item value, so "no filter" gets its own sentinel
export const ALL_ASSIGNEES = "all";

export type AssigneeFilter = UserId | typeof ALL_ASSIGNEES;

export const DEFAULT_ASSIGNEE_FILTER: AssigneeFilter = ALL_ASSIGNEES;

export const isValidAssigneeFilter = (value: unknown): value is AssigneeFilter =>
  typeof value === "string" && value.length > 0;

export const ALL_PRIORITIES = "all";

export type PriorityFilter = PriorityId | typeof ALL_PRIORITIES;

export const DEFAULT_PRIORITY_FILTER: PriorityFilter = ALL_PRIORITIES;

export const isValidPriorityFilter = (value: unknown): value is PriorityFilter =>
  value === ALL_PRIORITIES || prioritiesMock.some((priority) => priority.id === value);

/** The filters a user narrows the board's issues down with. */
export interface BoardFilters {
  search: string;
  assignee: AssigneeFilter;
  priority: PriorityFilter;
}

export const DEFAULT_BOARD_FILTERS: BoardFilters = {
  search: "",
  assignee: DEFAULT_ASSIGNEE_FILTER,
  priority: DEFAULT_PRIORITY_FILTER,
};
