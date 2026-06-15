import { Issue } from "@domain/issue";

export type CategoryId = string;
export type CategoryType = (typeof categoryTypes)[number];
export const categoryTypes = ["TODO", "IN_PROGRESS", "DONE"] as const;

export const categoryTypeDict: Record<CategoryType, string> = {
  TODO: "New Mission",
  IN_PROGRESS: "In Progress",
  DONE: "Done ✓",
};

export interface Category {
  id: CategoryId;
  type: CategoryType;
  name: string;
  issues: Issue[];
  order: number;
  createdAt?: number;
  updatedAt?: number;
}
