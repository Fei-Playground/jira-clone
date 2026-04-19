import { UserId } from "../user";

export type WatcherId = string;

export interface Watcher {
  id: WatcherId;
  issueId: string;
  userId: UserId;
  createdAt: number;
}
