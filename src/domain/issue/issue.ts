import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";

export type IssueId = string;
export interface Issue {
  id: UserId;
  name: string;
  description?: string;
  categoryType?: CategoryType;
  reporter: User;
  asignee: User;
  comments: Comment[];
  createdAt: number;
  updatedAt: number;
}
