import { useMemo } from "react";
import cx from "classix";
import { Issue } from "@domain/issue";
import { Category } from "@domain/category";
import { UserAvatar } from "@app/components/user-avatar";
import { PriorityIcon } from "@app/components/priority-icon";
import { useProjectStore } from "../project.store";

// Date calculation constants
const DEFAULT_TIMELINE_DAYS = 30;
const TIMELINE_PADDING_RATIO = 0.1;
const MIN_TIMELINE_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Layout constants
const MIN_GANTT_WIDTH = 800;
const ISSUE_COLUMN_WIDTH = 300;
const MIN_BAR_WIDTH_PERCENT = 0.5;

interface GanttViewProps {
  categories: Category[];
}

interface MonthHeader {
  month: string;
  year: number;
  width: number;
}

interface BarPosition {
  left: string;
  width: string;
}

/**
 * Flatten all issues from categories into a single array
 */
const flattenIssues = (categories: Category[]): Issue[] => {
  return categories.flatMap((category) => category.issues);
};

/**
 * Filter issues by search term (case-insensitive partial match)
 */
const filterIssuesBySearch = (issues: Issue[], search: string): Issue[] => {
  if (!search) return issues;
  const searchLower = search.toLowerCase();
  return issues.filter((issue) => issue.name.toLowerCase().includes(searchLower));
};

/**
 * Format a timestamp as a short date string (e.g., "Jan 18")
 */
const formatShortDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Get background color class based on issue category type
 */
const getCategoryColorClass = (issue: Issue): string => {
  switch (issue.categoryType) {
    case "TODO":
      return "bg-background-accent-grey-subtle";
    case "IN_PROGRESS":
      return "bg-background-accent-blue-subtle";
    case "DONE":
      return "bg-background-accent-green-subtle";
    default:
      return "bg-background-accent-grey-subtle";
  }
};

export const GanttView = ({ categories }: GanttViewProps): JSX.Element => {
  const { search } = useProjectStore();

  const allIssues = useMemo(() => flattenIssues(categories), [categories]);

  const filteredIssues = useMemo(
    () => filterIssuesBySearch(allIssues, search),
    [allIssues, search]
  );

  // Calculate the timeline bounds (start date, end date, total days)
  // Empty state defaults to 30-day window from now
  // With issues, calculate min/max dates and add 10% padding on each side
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (filteredIssues.length === 0) {
      const now = Date.now();
      return {
        startDate: now,
        endDate: now + DEFAULT_TIMELINE_DAYS * MS_PER_DAY,
        totalDays: DEFAULT_TIMELINE_DAYS,
      };
    }

    const dates = filteredIssues.flatMap((issue) => [
      issue.createdAt,
      issue.updatedAt,
    ]);
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const padding = (max - min) * TIMELINE_PADDING_RATIO;
    const start = min - padding;
    const end = max + padding;
    const days = Math.ceil((end - start) / MS_PER_DAY);

    return {
      startDate: start,
      endDate: end,
      totalDays: Math.max(days, MIN_TIMELINE_DAYS),
    };
  }, [filteredIssues]);

  // Generate month headers for the timeline
  // Each month shows its proportional width based on visible days in the timeline range
  const monthHeaders = useMemo(() => {
    const headers: MonthHeader[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const month = current.toLocaleDateString("en-US", { month: "short" });
      const year = current.getFullYear();
      const monthStart = new Date(
        current.getFullYear(),
        current.getMonth(),
        1
      );
      const monthEnd = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      );

      const visibleStart = Math.max(monthStart.getTime(), startDate);
      const visibleEnd = Math.min(monthEnd.getTime(), endDate);
      const daysInRange = (visibleEnd - visibleStart) / MS_PER_DAY + 1;
      const width = (daysInRange / totalDays) * 100;

      headers.push({ month, year, width });
      current.setMonth(current.getMonth() + 1);
    }

    return headers;
  }, [startDate, endDate, totalDays]);

  /**
   * Calculate the position and width of a Gantt bar for an issue
   * Uses createdAt as start, updatedAt as end
   * Clamps values to ensure bars stay within visible bounds
   */
  const getBarPosition = (issue: Issue): BarPosition => {
    const issueStart = issue.createdAt;
    const issueEnd = issue.updatedAt;
    const timelineRange = endDate - startDate;
    const left = ((issueStart - startDate) / timelineRange) * 100;
    const width = ((issueEnd - issueStart) / timelineRange) * 100;

    return {
      left: `${Math.max(0, Math.min(100, left))}%`,
      width: `${Math.max(MIN_BAR_WIDTH_PERCENT, Math.min(100 - left, width))}%`,
    };
  };

  if (filteredIssues.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-primary-light text-sm text-font-subtlest">
          No issues to display
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div style={{ minWidth: `${MIN_GANTT_WIDTH}px` }}>
          {/* Timeline header */}
          <div className="sticky top-0 z-10 bg-elevation-surface">
            <div className="flex border-b border-border">
              <div
                className="flex-shrink-0 border-r border-border bg-elevation-surface px-3 py-2"
                style={{ width: `${ISSUE_COLUMN_WIDTH}px` }}
              >
                <span className="font-primary-bold text-xs text-font-subtle">
                  Issue
                </span>
              </div>
              <div className="flex flex-1">
                {monthHeaders.map((header, index) => (
                  <div
                    key={`${header.month}-${header.year}-${index}`}
                    className="border-r border-border px-2 py-2"
                    style={{ width: `${header.width}%` }}
                  >
                    <span className="font-primary-bold text-xs text-font-subtle">
                      {header.month} {header.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Issue rows */}
          <div className="divide-y divide-border">
            {filteredIssues.map((issue) => {
              const barPosition = getBarPosition(issue);
              const categoryColor = getCategoryColorClass(issue);

              return (
                <div key={issue.id} className="flex hover:bg-background-neutral-subtle">
                  {/* Issue info column */}
                  <div
                    className="flex-shrink-0 border-r border-border px-3 py-3"
                    style={{ width: `${ISSUE_COLUMN_WIDTH}px` }}
                  >
                    <div className="flex items-start gap-2">
                      <PriorityIcon priorityId={issue.priority.id} size={16} />
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-primary text-xs text-font">
                          {issue.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <UserAvatar {...issue.asignee} size={20} />
                          <span className="font-primary-light text-2xs text-font-subtlest">
                            {issue.asignee.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline column */}
                  <div className="relative flex-1 py-3">
                    <div className="relative h-8">
                      <div
                        className={cx(
                          "absolute top-1/2 h-6 -translate-y-1/2 rounded border border-border px-2",
                          categoryColor
                        )}
                        style={{
                          left: barPosition.left,
                          width: barPosition.width,
                        }}
                      >
                        <div className="flex h-full items-center justify-between gap-2">
                          <span className="truncate font-primary-light text-2xs text-font-subtle">
                            {formatShortDate(issue.createdAt)}
                          </span>
                          <span className="truncate font-primary-light text-2xs text-font-subtle">
                            {formatShortDate(issue.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
