import { Priority } from "./priority";

export const prioritiesMock: Priority[] = [
  {
    id: "low",
    name: "10 pts",
    order: 0,
  },
  {
    id: "medium",
    name: "15 pts",
    order: 1,
  },
  {
    id: "high",
    name: "20 pts",
    order: 2,
  },
];

export const priorityLow = prioritiesMock[0];
export const priorityMedium = prioritiesMock[1];
export const priorityHigh = prioritiesMock[2];
