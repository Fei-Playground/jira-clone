import { ActivityType } from "@domain/activity";

export const ACTIVITY_PAGE_SIZE = 12;
export const SEARCH_DEBOUNCE_MS = 250;
export const COMMENT_PREVIEW_LENGTH = 200;
/** Similar activities are folded into a single row from this count upwards. */
export const MIN_AGGREGATION_SIZE = 3;
/** Keeps the skeleton loaders on screen while the next page resolves. */
export const LOAD_MORE_DELAY_MS = 600;
/** How long the refresh button shows its spinning state. */
export const REFRESH_FEEDBACK_MS = 500;

export type ActivityTypeFilter =
  | "all"
  | "commit"
  | "comment"
  | "task"
  | "settings"
  | "user"
  | "file";

export type DateRangeId =
  | "today"
  | "yesterday"
  | "last-7-days"
  | "last-30-days"
  | "this-month"
  | "custom";

export type GroupById = "date" | "user" | "type" | "none";
export type SortOrderId = "newest" | "oldest";

export const DEFAULT_DATE_RANGE: DateRangeId = "last-7-days";
export const DEFAULT_GROUP_BY: GroupById = "date";
export const DEFAULT_SORT_ORDER: SortOrderId = "newest";
export const DEFAULT_TYPE_FILTER: ActivityTypeFilter = "all";
export const ALL_USERS = "all";

export const typeFilters: { id: ActivityTypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commit", label: "Commits" },
  { id: "comment", label: "Comments" },
  { id: "task", label: "Tasks" },
  { id: "settings", label: "Settings" },
  { id: "user", label: "Users" },
  { id: "file", label: "Files" },
];

export const dateRanges: { id: DateRangeId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last-7-days", label: "Last 7 Days" },
  { id: "last-30-days", label: "Last 30 Days" },
  { id: "this-month", label: "This Month" },
  { id: "custom", label: "Custom Range" },
];

export const groupByOptions: { id: GroupById; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "user", label: "User" },
  { id: "type", label: "Activity Type" },
  { id: "none", label: "None" },
];

export const sortOrders: { id: SortOrderId; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
];

/**
 * Branch and PR activities are code events, so they answer to the "Commits"
 * tab and share the commit colour and type group.
 */
export const typeFilterOf = (type: ActivityType): ActivityTypeFilter =>
  type === "branch" || type === "pr" ? "commit" : type;

type ActivityTypeMeta = {
  label: string;
  /** Timeline node + badge colours, all built from semantic design tokens. */
  node: string;
  badge: string;
  groupLabel: string;
};

export const activityTypeMeta: Record<ActivityType, ActivityTypeMeta> = {
  commit: {
    label: "Commit",
    node: "bg-background-info-bold",
    badge: "bg-background-info text-font-info",
    groupLabel: "Code Commits",
  },
  branch: {
    label: "Branch",
    node: "bg-background-info-bold",
    badge: "bg-background-info text-font-info",
    groupLabel: "Code Commits",
  },
  pr: {
    label: "Pull Request",
    node: "bg-background-info-bold",
    badge: "bg-background-info text-font-info",
    groupLabel: "Code Commits",
  },
  task: {
    label: "Task",
    node: "bg-background-success-bold",
    badge: "bg-background-success text-font-success",
    groupLabel: "Tasks",
  },
  comment: {
    label: "Comment",
    node: "bg-background-warning-bold",
    badge: "bg-background-warning text-font-warning",
    groupLabel: "Comments",
  },
  settings: {
    label: "Settings",
    node: "bg-background-brand-bold",
    badge: "bg-background-brand-subtlest text-font-brand",
    groupLabel: "Settings Changes",
  },
  user: {
    label: "User",
    node: "bg-background-neutral-bold",
    badge: "bg-background-neutral text-font-subtle",
    groupLabel: "Team Members",
  },
  file: {
    label: "File",
    node: "bg-background-accent-green-bolder",
    badge: "bg-background-accent-green-subtler text-font-accent-green",
    groupLabel: "File Changes",
  },
};

export const taskStatusBadge: Record<string, string> = {
  created: "bg-background-info text-font-info",
  "in-progress": "bg-background-warning text-font-warning",
  completed: "bg-background-success text-font-success",
};

export const taskStatusLabel: Record<string, string> = {
  created: "Created",
  "in-progress": "In Progress",
  completed: "Completed",
};

export const priorityBadge: Record<string, string> = {
  low: "bg-background-accent-green-subtler text-font-accent-green",
  medium: "bg-background-warning text-font-warning",
  high: "bg-background-danger text-font-danger",
};

export const DATE_GROUPS = {
  today: "Today",
  yesterday: "Yesterday",
  thisWeek: "This Week",
  lastWeek: "Last Week",
  older: "Older",
} as const;
