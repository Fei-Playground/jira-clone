export type PriorityId = "low" | "medium" | "high";
export type Priority = {
  id: PriorityId;
  name: string;
  order: number;
};

export const PRIORITY_FILTER_ALL = "all";
export type PriorityFilter = PriorityId | typeof PRIORITY_FILTER_ALL;
export type PriorityFilterItem = {
  id: PriorityFilter;
  label: string;
};
