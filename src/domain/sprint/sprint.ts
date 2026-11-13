import type { Issue } from "@domain/issue";

export type SprintId = string;

export interface Sprint {
  id: SprintId;
  name: string;
  startDate: number;
  endDate: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface SprintWithIssues extends Sprint {
  issues: Issue[];
}

export type SprintStatus = "CURRENT" | "UPCOMING" | "COMPLETED";

export const sprintStatusDict: Record<SprintStatus, string> = {
  CURRENT: "Current",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
};

/** How long a new sprint runs when nobody picks dates for it. */
export const SPRINT_DEFAULT_LENGTH_IN_DAYS = 14;

/** A sprint filter points either at the running sprint or at one specific sprint. */
export const SPRINT_FILTER_CURRENT = "current";
export type SprintFilter = typeof SPRINT_FILTER_CURRENT | SprintId;

/** Local start of the day a sprint begins. */
export const toSprintStart = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.valueOf();
};

/** Local end of the day a sprint finishes, so its last day still counts as current. */
export const toSprintEnd = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.valueOf();
};

export const getSprintStatus = (
  sprint: Sprint,
  now: number = Date.now()
): SprintStatus => {
  if (now < sprint.startDate) return "UPCOMING";
  if (now > sprint.endDate) return "COMPLETED";
  return "CURRENT";
};

export const getCurrentSprint = (
  sprints: Sprint[],
  now: number = Date.now()
): Sprint | undefined =>
  sprints.find((sprint) => getSprintStatus(sprint, now) === "CURRENT");

export const getNextSprint = (
  sprints: Sprint[],
  now: number = Date.now()
): Sprint | undefined =>
  sprints
    .filter((sprint) => getSprintStatus(sprint, now) === "UPCOMING")
    .sort((sprint, nextSprint) => sprint.startDate - nextSprint.startDate)[0];

export const isValidSprintFilter = (
  value: string,
  sprints: Sprint[]
): value is SprintFilter =>
  value === SPRINT_FILTER_CURRENT ||
  sprints.some((sprint) => sprint.id === value);

/** The sprint a filter points at, or `undefined` when it points at no sprint. */
export const sprintFilterToSprintId = (
  filter: SprintFilter,
  sprints: Sprint[]
): SprintId | undefined =>
  filter === SPRINT_FILTER_CURRENT ? getCurrentSprint(sprints)?.id : filter;
