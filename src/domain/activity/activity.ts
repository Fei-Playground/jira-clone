import { User } from "@domain/user";
import { PriorityId } from "@domain/priority";

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
export type FileOperation = "created" | "deleted" | "renamed";

export type CommitFileChange = {
  path: string;
  additions: number;
  deletions: number;
};

export type CommitDetail = {
  message: string;
  hash: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  files: CommitFileChange[];
  diff?: string;
};

export type CommentReply = {
  user: User;
  message: string;
  createdAt: number;
};

export type CommentDetail = {
  fileName: string;
  line: number;
  message: string;
  replies: CommentReply[];
};

export type TaskDetail = {
  action: TaskAction;
  title: string;
  taskId: string;
  status: "created" | "in-progress" | "completed";
  priority: PriorityId;
  asignee?: User;
  dueDate?: number;
  description?: string;
};

export type SettingsDetail = {
  settingName: string;
  before: string;
  after: string;
  scope: string;
};

export type UserEventDetail = {
  action: string;
  targetUser?: User;
};

export type FileDetail = {
  operation: FileOperation;
  path: string;
  fileName: string;
  size?: string;
  previousName?: string;
};

export type BranchDetail = {
  action: string;
  branch: string;
  baseBranch?: string;
};

export type PullRequestDetail = {
  action: string;
  number: number;
  title: string;
  status: "open" | "merged" | "closed";
  reviewers: User[];
  branch: string;
};

export type ActivityDetail =
  | { type: "commit"; commit: CommitDetail }
  | { type: "comment"; comment: CommentDetail }
  | { type: "task"; task: TaskDetail }
  | { type: "settings"; settings: SettingsDetail }
  | { type: "user"; userEvent: UserEventDetail }
  | { type: "file"; file: FileDetail }
  | { type: "branch"; branch: BranchDetail }
  | { type: "pr"; pullRequest: PullRequestDetail };

export type Activity = {
  id: ActivityId;
  user: User;
  createdAt: number;
  /** Short, human readable summary used by search and by screen readers. */
  description: string;
  detail: ActivityDetail;
};

/**
 * Text of an activity used by the search filter. Includes every searchable
 * surface: description, user name, commit message, file names, comment text
 * and task titles.
 */
export const getActivitySearchText = (activity: Activity): string => {
  const { detail } = activity;
  const common = `${activity.description} ${activity.user.name}`;

  switch (detail.type) {
    case "commit":
      return [
        common,
        detail.commit.message,
        detail.commit.hash,
        detail.commit.branch,
        ...detail.commit.files.map((file) => file.path),
      ].join(" ");
    case "comment":
      return [
        common,
        detail.comment.fileName,
        detail.comment.message,
        ...detail.comment.replies.map((reply) => reply.message),
      ].join(" ");
    case "task":
      return [common, detail.task.title, detail.task.taskId].join(" ");
    case "settings":
      return [
        common,
        detail.settings.settingName,
        detail.settings.before,
        detail.settings.after,
        detail.settings.scope,
      ].join(" ");
    case "user":
      return [common, detail.userEvent.action].join(" ");
    case "file":
      return [common, detail.file.fileName, detail.file.path].join(" ");
    case "branch":
      return [common, detail.branch.action, detail.branch.branch].join(" ");
    case "pr":
      return [
        common,
        detail.pullRequest.title,
        `PR #${detail.pullRequest.number}`,
        detail.pullRequest.branch,
        ...detail.pullRequest.reviewers.map((reviewer) => reviewer.name),
      ].join(" ");
  }
};
