import { User } from "../user";

export type IssueActivityId = string;

export type IssueActivityType =
  | "created"
  | "updated"
  | "status_changed"
  | "priority_changed"
  | "assignee_changed"
  | "due_date_changed"
  | "estimate_changed"
  | "time_logged_changed"
  | "watcher_added"
  | "watcher_removed"
  | "comment_added";

export interface IssueActivity {
  id: IssueActivityId;
  type: IssueActivityType;
  message: string;
  user: User;
  createdAt: number;
}
