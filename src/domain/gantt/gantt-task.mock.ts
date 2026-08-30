import { GanttTask } from "./gantt-task";

export const ganttTasksMock: GanttTask[] = [
  {
    id: "gt-1",
    name: "Set up project scaffolding",
    startDate: new Date("2022-01-10T00:00:00").valueOf(),
    endDate: new Date("2022-01-18T00:00:00").valueOf(),
    status: "DONE",
  },
  {
    id: "gt-2",
    name: "Design system tokens",
    startDate: new Date("2022-01-14T00:00:00").valueOf(),
    endDate: new Date("2022-01-28T00:00:00").valueOf(),
    status: "DONE",
  },
  {
    id: "gt-3",
    name: "Board drag-and-drop",
    startDate: new Date("2022-01-20T00:00:00").valueOf(),
    endDate: new Date("2022-02-04T00:00:00").valueOf(),
    status: "IN_PROGRESS",
  },
  {
    id: "gt-4",
    name: "Issue detail panel",
    startDate: new Date("2022-01-24T00:00:00").valueOf(),
    endDate: new Date("2022-02-08T00:00:00").valueOf(),
    status: "IN_PROGRESS",
  },
  {
    id: "gt-5",
    name: "Real-time board sync",
    startDate: new Date("2022-01-31T00:00:00").valueOf(),
    endDate: new Date("2022-02-14T00:00:00").valueOf(),
    status: "TODO",
  },
  {
    id: "gt-6",
    name: "Analytics dashboard",
    startDate: new Date("2022-02-07T00:00:00").valueOf(),
    endDate: new Date("2022-02-21T00:00:00").valueOf(),
    status: "TODO",
  },
];
