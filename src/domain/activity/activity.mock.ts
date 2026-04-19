import { Activity } from "./activity";

const baseTime = new Date("2022-01-18 11:00").valueOf();

export const activityMock1: Activity = {
  id: "activity-001",
  issueId: "23717058-379a-447a-a215-e425a124154f",
  activityType: "STATUS_CHANGED",
  userId: "user-1",
  oldValue: "TODO",
  newValue: "IN_PROGRESS",
  createdAt: baseTime,
};

export const activityMock2: Activity = {
  id: "activity-002",
  issueId: "23717058-379a-447a-a215-e425a124154f",
  activityType: "ASSIGNEE_CHANGED",
  userId: "user-1",
  oldValue: "user-1",
  newValue: "user-2",
  createdAt: baseTime + 3600000,
};

export const activityMock3: Activity = {
  id: "activity-003",
  issueId: "23717058-379a-447a-a215-e425a124154f",
  activityType: "PRIORITY_CHANGED",
  userId: "user-2",
  oldValue: "medium",
  newValue: "high",
  createdAt: baseTime + 7200000,
};

export const activityMock4: Activity = {
  id: "activity-004",
  issueId: "23717058-379a-447a-a215-e425a124154f",
  activityType: "COMMENT_CREATED",
  userId: "user-2",
  createdAt: baseTime + 10800000,
};

export const activitiesMock: Activity[] = [
  activityMock1,
  activityMock2,
  activityMock3,
  activityMock4,
];
