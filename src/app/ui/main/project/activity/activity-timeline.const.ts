import { ActivityType } from "@domain/activity";

export type ActivityTypeFilter = ActivityType | "all";
export type GroupBy = "date" | "user" | "type" | "none";
export type SortOrder = "newest" | "oldest";
export type DateRangeId =
  | "today"
  | "yesterday"
  | "last-7-days"
  | "last-30-days"
  | "this-month"
  | "custom";

export const DEFAULT_ACTIVITY_TYPE: ActivityTypeFilter = "all";
export const DEFAULT_DATE_RANGE: DateRangeId = "last-7-days";
export const DEFAULT_GROUP_BY: GroupBy = "date";
export const DEFAULT_SORT_ORDER: SortOrder = "newest";
export const ALL_USERS = "all";

export const PAGE_SIZE = 12;
export const SEARCH_DEBOUNCE_MS = 250;
/** Simulated latency so the skeleton loaders are visible while paginating. */
export const LOAD_MORE_DELAY_MS = 450;
/** Minimum number of same-kind activities before they collapse into one row. */
export const AGGREGATION_THRESHOLD = 3;

type ActivityTypeConfig = {
  /** Label used in the type badge on each activity card. */
  badgeLabel: string;
  /** Label used by the "Filter by type" tabs. */
  tabLabel: string;
  /** Label used by the "Group by type" headers. */
  groupLabel: string;
  /** Timeline node colour. */
  nodeClass: string;
  /** Badge colours (background + font). */
  badgeClass: string;
};

/**
 * Colour coding for the timeline nodes and type badges:
 * Blue = Commits, Green = Tasks, Yellow = Comments, Purple = Settings,
 * Gray = Users, Orange = Files. Branch/PR activities are code events, so they
 * follow the commit blue.
 */
export const ACTIVITY_TYPE_CONFIG: Record<ActivityType, ActivityTypeConfig> = {
  commit: {
    badgeLabel: "Commit",
    tabLabel: "Commits",
    groupLabel: "Code Commits",
    nodeClass: "bg-[var(--Blue600)]",
    badgeClass: "bg-background-info text-font-info",
  },
  comment: {
    badgeLabel: "Comment",
    tabLabel: "Comments",
    groupLabel: "Comments",
    nodeClass: "bg-[var(--Yellow400)]",
    badgeClass: "bg-background-warning text-font-warning",
  },
  task: {
    badgeLabel: "Task",
    tabLabel: "Tasks",
    groupLabel: "Tasks",
    nodeClass: "bg-[var(--Green600)]",
    badgeClass: "bg-background-success text-font-success",
  },
  settings: {
    badgeLabel: "Settings",
    tabLabel: "Settings",
    groupLabel: "Settings Changes",
    nodeClass: "bg-[var(--Magenta600)]",
    badgeClass: "bg-[var(--Magenta100)] text-[var(--Magenta800)]",
  },
  user: {
    badgeLabel: "User",
    tabLabel: "Users",
    groupLabel: "Team Members",
    nodeClass: "bg-[var(--Neutral600)]",
    badgeClass: "bg-background-accent-grey-subtler text-font-accent-grey",
  },
  file: {
    badgeLabel: "File",
    tabLabel: "Files",
    groupLabel: "File Operations",
    nodeClass: "bg-[var(--Orange500)]",
    badgeClass: "bg-[var(--Orange100)] text-[var(--Orange800)]",
  },
  branch: {
    badgeLabel: "Branch",
    tabLabel: "Commits",
    groupLabel: "Branches",
    nodeClass: "bg-[var(--Blue600)]",
    badgeClass: "bg-background-info text-font-info",
  },
  pr: {
    badgeLabel: "Pull request",
    tabLabel: "Commits",
    groupLabel: "Pull Requests",
    nodeClass: "bg-[var(--Blue600)]",
    badgeClass: "bg-background-info text-font-info",
  },
};

export const ACTIVITY_TYPE_TABS: { id: ActivityTypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commit", label: "Commits" },
  { id: "comment", label: "Comments" },
  { id: "task", label: "Tasks" },
  { id: "settings", label: "Settings" },
  { id: "user", label: "Users" },
  { id: "file", label: "Files" },
];

export const DATE_RANGE_OPTIONS: { id: DateRangeId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last-7-days", label: "Last 7 Days" },
  { id: "last-30-days", label: "Last 30 Days" },
  { id: "this-month", label: "This Month" },
  { id: "custom", label: "Custom Range" },
];

export const GROUP_BY_OPTIONS: { id: GroupBy; label: string }[] = [
  { id: "date", label: "Date" },
  { id: "user", label: "User" },
  { id: "type", label: "Activity Type" },
  { id: "none", label: "None" },
];

export const SORT_ORDER_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
];

export const TASK_STATUS_CONFIG = {
  created: { label: "Created", className: "bg-background-info text-font-info" },
  "in-progress": {
    label: "In Progress",
    className: "bg-background-warning text-font-warning",
  },
  completed: {
    label: "Completed",
    className: "bg-background-success text-font-success",
  },
} as const;

export const PRIORITY_LABEL = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export const PR_STATUS_CONFIG = {
  open: { label: "Open", className: "bg-background-info text-font-info" },
  merged: {
    label: "Merged",
    className: "bg-[var(--Magenta100)] text-[var(--Magenta800)]",
  },
  closed: {
    label: "Closed",
    className: "bg-background-accent-grey-subtler text-font-accent-grey",
  },
} as const;

/** Group keys used when grouping by date, in display order. */
export const DATE_GROUPS = ["Today", "Yesterday", "This Week", "Last Week", "Older"] as const;
export type DateGroup = (typeof DATE_GROUPS)[number];

export const COMMENT_PREVIEW_LENGTH = 200;
