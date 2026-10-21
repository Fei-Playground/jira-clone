import { PRIORITY_FILTER_ALL, Priority, PriorityFilterItem } from "./priority";

export const prioritiesMock: Priority[] = [
  {
    id: "low",
    name: "Low",
    order: 0,
  },
  {
    id: "medium",
    name: "Medium",
    order: 1,
  },
  {
    id: "high",
    name: "High",
    order: 2,
  },
];

export const priorityLow = prioritiesMock[0];
export const priorityMedium = prioritiesMock[1];
export const priorityHigh = prioritiesMock[2];

// Options of the board priority filter: "All" first, then the priorities from
// the highest to the lowest, derived from the priority list above.
export const priorityFilterList: PriorityFilterItem[] = [
  { id: PRIORITY_FILTER_ALL, label: "All" },
  ...[...prioritiesMock]
    .sort((a, b) => b.order - a.order)
    .map((priority) => ({ id: priority.id, label: priority.name })),
];
