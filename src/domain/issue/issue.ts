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
  labels: string[];
  priority: Priority;
  createdAt: number;
  updatedAt: number;
}

/**
 * Trims a label typed by a user and returns `null` when there is nothing left,
 * so an empty or spaces-only label is never added.
 */
export const normalizeLabel = (label: string): string | null => {
  const trimmed = label.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Reads a JSON array of label names - the `labels` field of the issue form, or
 * the column the labels are stored in. A missing or malformed value reads as
 * no labels.
 */
export const parseLabels = (value: unknown): string[] => {
  if (typeof value !== "string" || value.length === 0) return [];

  try {
    return normalizeLabels(JSON.parse(value));
  } catch {
    return [];
  }
};

/** Trims every label, drops the empty ones and removes duplicates. */
export const normalizeLabels = (labels: unknown): string[] => {
  if (!Array.isArray(labels)) return [];

  const normalized = labels
    .filter((label): label is string => typeof label === "string")
    .map(normalizeLabel)
    .filter((label): label is string => label !== null);

  return [...new Set(normalized)];
};
