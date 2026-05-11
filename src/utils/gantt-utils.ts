/**
 * Gantt chart utility functions for date calculations and timeline positioning
 */

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Calculate the date range for the timeline based on all issues
 * Adds buffer days before and after the earliest/latest dates
 */
export const calculateTimelineRange = (
  issues: Array<{ createdAt: number; updatedAt: number }>
): DateRange => {
  if (issues.length === 0) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }

  const timestamps = issues.flatMap((issue) => [issue.createdAt, issue.updatedAt]);
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  // Add buffer: 5 days before start, 10 days after end
  const start = new Date(minTime);
  start.setDate(start.getDate() - 5);

  const end = new Date(maxTime);
  end.setDate(end.getDate() + 10);

  return { start, end };
};

/**
 * Calculate the width of the timeline in pixels
 * Based on pixel width per day multiplied by number of days
 */
export const calculateTimelineWidth = (
  range: DateRange,
  pixelsPerDay: number = 30
): number => {
  const days = Math.ceil(
    (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(days * pixelsPerDay, 600); // Minimum width of 600px
};

/**
 * Calculate the left position and width of a bar for an issue
 */
export const calculateBarPosition = (
  createdAt: number,
  updatedAt: number,
  timelineStart: Date,
  pixelsPerDay: number = 30
): { left: number; width: number } => {
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);

  // Calculate days from timeline start
  const daysFromStart =
    (createdDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
  const durationDays =
    (updatedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

  const left = Math.max(0, daysFromStart * pixelsPerDay);
  const width = Math.max(1, durationDays * pixelsPerDay); // Minimum width of 1px

  return { left, width };
};

/**
 * Format date for display in timeline header
 */
export const formatDateForTimeline = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date range for tooltip display
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const startStr = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endStr = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
};

/**
 * Get the color class for a category type
 */
export const getCategoryColorClass = (
  categoryType?: string
): string => {
  switch (categoryType) {
    case "TODO":
      return "bg-background-accent-grey-subtler text-font-accent-grey";
    case "IN_PROGRESS":
      return "bg-background-accent-blue-subtler text-font-accent-blue";
    case "DONE":
      return "bg-background-accent-green-subtler text-font-accent-green";
    default:
      return "bg-background-neutral text-font";
  }
};

/**
 * Get the bar color class for a category type
 */
export const getBarColorClass = (categoryType?: string): string => {
  switch (categoryType) {
    case "TODO":
      return "bg-background-accent-grey-bold";
    case "IN_PROGRESS":
      return "bg-background-accent-blue-bold";
    case "DONE":
      return "bg-background-accent-green-bold";
    default:
      return "bg-background-brand-bold";
  }
};
