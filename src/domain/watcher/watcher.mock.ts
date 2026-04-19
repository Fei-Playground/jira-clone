import { Watcher } from "./watcher";

const createdAt = new Date("2022-01-18 11:00").valueOf();

export const watcherMock1: Watcher = {
  id: "watcher-001",
  issueId: "23717058-379a-447a-a215-e425a124154f",
  userId: "user-1",
  createdAt,
};

export const watcherMock2: Watcher = {
  id: "watcher-002",
  issueId: "23717058-379a-447a-a215-e425a124154f",
  userId: "user-2",
  createdAt: new Date("2022-01-19 14:30").valueOf(),
};

export const watchersMock: Watcher[] = [watcherMock1, watcherMock2];
