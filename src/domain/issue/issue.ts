import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";
import { Priority } from "../priority";
import { EventTypeId } from "@domain/event-type";

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
  eventType?: EventTypeId;
  createdAt: number;
  updatedAt: number;
}
