import { Sprint, toSprintEnd, toSprintStart } from "./sprint";

const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;

// Sprints are seeded around the day the data is created, so one of them is
// always the running sprint and the board filter has something to show.
const today = new Date().setHours(0, 0, 0, 0);

export const currentSprintMock1Id = "0f3d6c0e-6f5a-4d2c-9b0a-6a1e1e0a4c11";
export const nextSprintMock1Id = "1a4e7d1f-7a6b-4e3d-8c1b-7b2f2f1b5d22";
export const currentSprintMock2Id = "2b5f8e20-8b7c-4f4e-9d2c-8c3a3a2c6e33";

export const sprintsMock1: Sprint[] = [
  {
    id: currentSprintMock1Id,
    name: "Sprint 1 - Board basics",
    startDate: toSprintStart(today - 6 * DAY_IN_MILISECONDS),
    endDate: toSprintEnd(today + 3 * DAY_IN_MILISECONDS),
  },
  {
    id: nextSprintMock1Id,
    name: "Sprint 2 - Filters and polish",
    startDate: toSprintStart(today + 7 * DAY_IN_MILISECONDS),
    endDate: toSprintEnd(today + 20 * DAY_IN_MILISECONDS),
  },
];

export const sprintsMock2: Sprint[] = [
  {
    id: currentSprintMock2Id,
    name: "Sprint 1 - Themes",
    startDate: toSprintStart(today - 2 * DAY_IN_MILISECONDS),
    endDate: toSprintEnd(today + 11 * DAY_IN_MILISECONDS),
  },
];
