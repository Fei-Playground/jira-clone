import { User, UserId } from "../user/user";
import { CategoryType } from "@domain/category/category";
import { Comment } from "../comment/comment";
import { Priority } from "../priority/priority";

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
  createdAt: number;
  updatedAt: number;
}
