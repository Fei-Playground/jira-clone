import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import type { SprintId } from "@domain/sprint";
import { Comment } from "../comment";
import { Priority } from "../priority";

export type IssueId = string;
export interface Issue {
  id: UserId;
  name: string;
  description?: string;
  categoryType?: CategoryType;
  /** The sprint the issue is planned in. Without one it sits in the backlog. */
  sprintId?: SprintId;
  reporter: User;
  asignee: User;
  comments: Comment[];
  priority: Priority;
  createdAt: number;
  updatedAt: number;
}
