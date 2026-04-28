import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";
import { Priority } from "../priority";

export type IssueId = string;
export type LabelId = string;
export type RelationType = "blocks" | "blocked_by" | "relates_to" | "duplicates";

export interface Label {
  id: LabelId;
  name: string;
  color: string;
}

export interface LinkedIssue {
  issueId: IssueId;
  issueName: string;
  relationType: RelationType;
}

export interface ActivityEntry {
  id: string;
  userId: UserId;
  userName: string;
  userImage?: string;
  action: string; // e.g., "changed status from TODO to IN_PROGRESS"
  timestamp: number;
  changeDetails?: {
    field: string;
    oldValue?: string;
    newValue?: string;
  };
}

export interface Issue {
  id: UserId;
  name: string;
  description?: string;
  categoryType?: CategoryType;
  reporter: User;
  asignee: User;
  comments: Comment[];
  priority: Priority;
  dueDate?: number; // timestamp for due date
  labels: Label[];
  linkedIssues: LinkedIssue[];
  watchers: User[];
  activityHistory: ActivityEntry[];
  createdAt: number;
  updatedAt: number;
}
