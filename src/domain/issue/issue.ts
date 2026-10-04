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

// Aging indicates how long an issue has been sitting without being completed.
export type AgingLevel = "fresh" | "aging" | "stale";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const AGING_THRESHOLD_DAYS = 7;
const STALE_THRESHOLD_DAYS = 14;

export const getIssueAgeInDays = (createdAt: number, now: number = Date.now()): number =>
  Math.max(0, Math.floor((now - createdAt) / MILLISECONDS_PER_DAY));

// Finished work is never considered aging, no matter how long ago it was created.
export const getIssueAgingLevel = (issue: Issue, now: number = Date.now()): AgingLevel => {
  if (issue.categoryType === "DONE") return "fresh";

  const ageInDays = getIssueAgeInDays(issue.createdAt, now);
  if (ageInDays >= STALE_THRESHOLD_DAYS) return "stale";
  if (ageInDays >= AGING_THRESHOLD_DAYS) return "aging";
  return "fresh";
};
