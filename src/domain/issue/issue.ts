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
  // Used by the board's Gantt mode to position and size each issue's bar.
  // Optional because issues loaded from the database don't have them yet.
  startDate?: number;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}
