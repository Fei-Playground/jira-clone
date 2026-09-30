import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";
import { Priority } from "../priority";

export type IssueId = string;
export interface Issue {
  id: UserId;
  name: string;
  description?: string;
  categoryType?: CategoryType;
  reporter: User;
  asignee: User;
  comments: Comment[];
  priority: Priority;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}

// An issue is delayed when it has a due date in the past and hasn't been
// moved to the "DONE" category yet.
export const isIssueDelayed = (issue: Pick<Issue, "dueDate" | "categoryType">): boolean => {
  if (!issue.dueDate || issue.categoryType === "DONE") return false;

  return issue.dueDate < Date.now();
};
