import { User } from "@domain/user";

export type ActivityId = string;

export type ActivityType =
  | "commit"
  | "comment"
  | "task"
  | "settings"
  | "user"
  | "file"
  | "branch"
  | "pr";

export type TaskAction = "created" | "updated" | "completed";
export type TaskStatus = "created" | "in-progress" | "completed";
export type FileOperation = "created" | "deleted" | "renamed";
export type PrStatus = "open" | "merged" | "closed";

export type CommitFileChange = {
  path: string;
  additions: number;
  deletions: number;
};

export type CommitDetail = {
  message: string;
  hash: string;
  branch: string;
  additions: number;
  deletions: number;
  files: CommitFileChange[];
};

export type CommentReply = {
  author: string;
  text: string;
  timestamp: number;
};

export type CommentDetail = {
  target: string;
  text: string;
  line?: number;
  replies: CommentReply[];
};

export type TaskDetail = {
  key: string;
  title: string;
  action: TaskAction;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: number;
};

export type SettingsDetail = {
  name: string;
  before: string;
  after: string;
  scope: string;
};

export type UserEventDetail = {
  action: string;
};

export type FileDetail = {
  operation: FileOperation;
  path: string;
  previousPath?: string;
  size?: string;
};

export type BranchDetail = {
  action: string;
  branch: string;
};

export type PrDetail = {
  action: string;
  number: number;
  title: string;
  status: PrStatus;
  reviewers: string[];
};

type ActivityBase = {
  id: ActivityId;
  user: User;
  timestamp: number;
  description: string;
};

export type CommitActivityItem = ActivityBase & {
  type: "commit";
  commit: CommitDetail;
};
export type CommentActivityItem = ActivityBase & {
  type: "comment";
  comment: CommentDetail;
};
export type TaskActivityItem = ActivityBase & {
  type: "task";
  task: TaskDetail;
};
export type SettingsActivityItem = ActivityBase & {
  type: "settings";
  settings: SettingsDetail;
};
export type UserActivityItem = ActivityBase & {
  type: "user";
  userEvent: UserEventDetail;
};
export type FileActivityItem = ActivityBase & {
  type: "file";
  file: FileDetail;
};
export type BranchActivityItem = ActivityBase & {
  type: "branch";
  branch: BranchDetail;
};
export type PrActivityItem = ActivityBase & {
  type: "pr";
  pr: PrDetail;
};

export type Activity =
  | CommitActivityItem
  | CommentActivityItem
  | TaskActivityItem
  | SettingsActivityItem
  | UserActivityItem
  | FileActivityItem
  | BranchActivityItem
  | PrActivityItem;

/**
 * Text blob used by the search filter so every activity type is searchable
 * through a single, case-insensitive partial match.
 */
export const activitySearchText = (activity: Activity): string => {
  const parts: string[] = [activity.user.name, activity.description];

  switch (activity.type) {
    case "commit":
      parts.push(
        activity.commit.message,
        activity.commit.hash,
        activity.commit.branch,
        ...activity.commit.files.map((file) => file.path)
      );
      break;
    case "comment":
      parts.push(
        activity.comment.target,
        activity.comment.text,
        ...activity.comment.replies.map((reply) => reply.text)
      );
      break;
    case "task":
      parts.push(activity.task.title, activity.task.key, activity.task.assignee || "");
      break;
    case "settings":
      parts.push(
        activity.settings.name,
        activity.settings.before,
        activity.settings.after,
        activity.settings.scope
      );
      break;
    case "user":
      parts.push(activity.userEvent.action);
      break;
    case "file":
      parts.push(activity.file.path, activity.file.previousPath || "");
      break;
    case "branch":
      parts.push(activity.branch.action, activity.branch.branch);
      break;
    case "pr":
      parts.push(activity.pr.title, `PR #${activity.pr.number}`, ...activity.pr.reviewers);
      break;
  }

  return parts.join(" ").toLowerCase();
};
