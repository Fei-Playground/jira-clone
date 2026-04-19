import { UserId } from "../user";

export type ActivityId = string;

export type ActivityType =
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNEE_CHANGED"
  | "TITLE_CHANGED"
  | "DESCRIPTION_CHANGED"
  | "LABEL_ADDED"
  | "LABEL_REMOVED"
  | "COMMENT_CREATED"
  | "COMMENT_DELETED"
  | "LINK_CREATED"
  | "LINK_DELETED";

export interface Activity {
  id: ActivityId;
  issueId: string;
  activityType: ActivityType;
  userId: UserId;
  oldValue?: string;
  newValue?: string;
  createdAt: number;
}

export const activityTypeLabels: Record<ActivityType, string> = {
  STATUS_CHANGED: "Status changed",
  PRIORITY_CHANGED: "Priority changed",
  ASSIGNEE_CHANGED: "Assignee changed",
  TITLE_CHANGED: "Title changed",
  DESCRIPTION_CHANGED: "Description changed",
  LABEL_ADDED: "Label added",
  LABEL_REMOVED: "Label removed",
  COMMENT_CREATED: "Comment created",
  COMMENT_DELETED: "Comment deleted",
  LINK_CREATED: "Link created",
  LINK_DELETED: "Link deleted",
};
