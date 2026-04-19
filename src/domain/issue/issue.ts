import { User, UserId } from "../user";
import { CategoryType } from "@domain/category";
import { Comment } from "../comment";
import { Priority } from "../priority";
import { IssueLink } from "../issue-link";
import { Label } from "../label";
import { Watcher } from "../watcher";
import { Activity } from "../activity";

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
  links?: IssueLink[];
  labels?: Label[];
  watchers?: Watcher[];
  activities?: Activity[];
  dueDate?: number;
}
