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
  // Number of comments on the issue. List views load the count instead of the full list.
  commentsCount: number;
  priority: Priority;
  createdAt: number;
  updatedAt: number;
}
