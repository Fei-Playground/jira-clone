import { useMemo } from "react";
import cx from "classix";
import { Project } from "@domain/project";
import { CategoryType } from "@domain/category";
import { Issue } from "@domain/issue";
import { Tooltip } from "@app/components/tooltip";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_WIDTH = 24; // pixels per day

export const GanttView = ({ project }: Props): JSX.Element => {
  // Flatten all issues from categories
  const allIssues = useMemo(() => {
    return project.categories.flatMap((cat) =>
      cat.issues.map((issue) => ({ ...issue, categoryType: cat.type }))
    );
  }, [project.categories]);

  // Filter issues that have both start_date and end_date
  const issuesWithDates = useMemo(() => {
    return allIssues.filter((issue) => issue.start_date && issue.end_date);
  }, [allIssues]);

  // Calculate date range
  const dateRange = useMemo(() => {
    if (issuesWithDates.length === 0) {
      return null;
    }

    const startDates = issuesWithDates
      .map((issue) => issue.start_date!)
      .sort((a, b) => a - b);
    const endDates = issuesWithDates
      .map((issue) => issue.end_date!)
      .sort((a, b) => a - b);

    const minDate = startDates[0];
    const maxDate = endDates[endDates.length - 1];

    return { minDate, maxDate };
  }, [issuesWithDates]);

  if (issuesWithDates.length === 0 || !dateRange) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-font-subtlest">
            No issues with scheduled dates yet.
          </p>
          <p className="mt-2 text-sm text-font-subtler">
            Add start_date and end_date to issues to see them in Gantt view.
          </p>
        </div>
      </div>
    );
  }

  // Generate all days in the range
  const dayCount = Math.ceil(
    (dateRange.maxDate - dateRange.minDate) / DAY_MS
  );
  const days = Array.from({ length: dayCount + 1 }, (_, i) => {
    const date = new Date(dateRange.minDate + i * DAY_MS);
    return date;
  });

  // Group days by month
  const monthGroups = useMemo(() => {
    const groups: Record<string, Date[]> = {};
    days.forEach((date) => {
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(date);
    });
    return groups;
  }, [days]);

  const totalWidth = days.length * DAY_WIDTH;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Gantt Chart Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header with sticky positioning */}
        <div className="flex flex-shrink-0 border-b border-border">
          {/* Task column header */}
          <div className="w-[220px] flex-shrink-0 border-r border-border bg-elevation-surface p-2" />

          {/* Timeline header */}
          <div className="flex-1 overflow-auto">
            <div style={{ width: `${totalWidth}px` }}>
              {/* Month headers */}
              <div className="flex border-b border-border">
                {Object.entries(monthGroups).map(([month, monthDays]) => (
                  <div
                    key={month}
                    className="border-r border-border bg-elevation-surface-raised px-1 text-center text-xs font-primary-bold text-font-subtlest"
                    style={{ width: `${monthDays.length * DAY_WIDTH}px` }}
                  >
                    {month}
                  </div>
                ))}
              </div>

              {/* Day headers */}
              <div className="flex border-b border-border bg-elevation-surface">
                {days.map((date, idx) => (
                  <div
                    key={idx}
                    className="border-r border-border px-1 text-center text-xs text-font-subtler"
                    style={{ width: `${DAY_WIDTH}px`, height: "32px" }}
                  >
                    {date.getDate()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Chart Rows */}
        <div className="flex flex-1 overflow-hidden">
          {/* Task names column */}
          <div className="w-[220px] flex-shrink-0 overflow-y-auto border-r border-border bg-elevation-surface">
            {issuesWithDates.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center border-b border-border px-2 py-1 text-sm"
                style={{ height: "40px" }}
              >
                <span className="truncate font-primary-light text-font-subtle">
                  {issue.name}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline grid */}
          <div className="flex-1 overflow-auto">
            <div style={{ width: `${totalWidth}px` }}>
              {issuesWithDates.map((issue) => {
                const barStartDays = Math.floor(
                  (issue.start_date! - dateRange.minDate) / DAY_MS
                );
                const barDays = Math.ceil(
                  (issue.end_date! - issue.start_date!) / DAY_MS
                );
                const barLeft = barStartDays * DAY_WIDTH;
                const barWidth = Math.max(barDays * DAY_WIDTH, DAY_WIDTH); // Minimum 1 day width

                const barColor = getBarColor(issue.categoryType);
                const formattedDateRange = formatDateRange(
                  issue.start_date!,
                  issue.end_date!
                );

                return (
                  <div
                    key={issue.id}
                    className="relative border-b border-border"
                    style={{ height: "40px" }}
                  >
                    {/* Grid lines */}
                    <div className="flex h-full">
                      {days.map((_, idx) => (
                        <div
                          key={idx}
                          className="border-r border-border"
                          style={{ width: `${DAY_WIDTH}px` }}
                        />
                      ))}
                    </div>

                    {/* Gantt bar */}
                    <Tooltip
                      title={`${issue.name} • ${formattedDateRange}`}
                      show={true}
                    >
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded py-1 px-2 text-xs font-primary text-white cursor-default"
                        style={{
                          left: `${barLeft}px`,
                          width: `${barWidth}px`,
                          backgroundColor: barColor,
                        }}
                      />
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 border-t border-border bg-elevation-surface px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{
                backgroundColor: "var(--color-background-accent-grey-bolder)",
              }}
            />
            <span className="text-xs text-font-subtle">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{
                backgroundColor: "var(--color-background-accent-blue-bolder)",
              }}
            />
            <span className="text-xs text-font-subtle">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{
                backgroundColor: "var(--color-background-accent-green-bolder)",
              }}
            />
            <span className="text-xs text-font-subtle">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  project: Project;
}

function getBarColor(categoryType?: string): string {
  switch (categoryType) {
    case "TODO":
      return "var(--color-background-accent-grey-bolder)";
    case "IN_PROGRESS":
      return "var(--color-background-accent-blue-bolder)";
    case "DONE":
      return "var(--color-background-accent-green-bolder)";
    default:
      return "var(--color-background-accent-grey-bolder)";
  }
}

function formatDateRange(startMs: number, endMs: number): string {
  const startDate = new Date(startMs);
  const endDate = new Date(endMs);

  const startStr = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startStr} – ${endStr}`;
}
