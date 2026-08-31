import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";
import { Priority } from "../priority";
import { IssueActivity } from "./activity";

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
  dueDate?: number | null;
  estimate?: string | null;
  timeLogged?: string | null;
  watchers: User[];
  activities: IssueActivity[];
}
