/* eslint-disable @typescript-eslint/no-non-null-assertion -- Issues are pre-filtered to have both start_date and end_date */
import { useMemo } from "react";
import { Project } from "@domain/project";
import { Tooltip } from "@app/components/tooltip";
import { useProjectStore } from "@app/ui/main/project";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_WIDTH = 24; // pixels per day

// Color mapping for category status
const CATEGORY_COLORS = {
  TODO: "var(--color-background-accent-grey-bolder)",
  IN_PROGRESS: "var(--color-background-accent-blue-bolder)",
  DONE: "var(--color-background-accent-green-bolder)",
} as const;

export const GanttView = ({ project }: Props): JSX.Element => {
  // Flatten all issues from all categories to get a single list with category context
  const allIssues = useMemo(() => {
    return project.categories.flatMap((cat) =>
      cat.issues.map((issue) => ({ ...issue, categoryType: cat.type }))
    );
  }, [project.categories]);

  // Filter issues that have both start_date and end_date — only these can be displayed on the Gantt chart
  const issuesWithDates = useMemo(() => {
    return allIssues.filter((issue) => issue.start_date && issue.end_date);
  }, [allIssues]);

  // Apply priority filter from the project store — respects user selections from PriorityFilter component
  const { priorityFilter } = useProjectStore();
  const visibleIssues = useMemo(() => {
    if (priorityFilter.length === 0) return issuesWithDates;
    return issuesWithDates.filter((issue) =>
      priorityFilter.includes(issue.priority.id)
    );
  }, [issuesWithDates, priorityFilter]);

  // Calculate the overall date range across all issues with dates
  // This defines the horizontal span of the Gantt chart
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

  // Generate all days in the date range and group them by month
  // Used for rendering the calendar header and calculating bar positions
  const { days, monthGroups } = useMemo(() => {
    if (visibleIssues.length === 0 || !dateRange) {
      return { days: [], monthGroups: {} };
    }

    const dayCount = Math.ceil(
      (dateRange.maxDate - dateRange.minDate) / DAY_MS
    );
    const generatedDays = Array.from({ length: dayCount + 1 }, (_, i) => {
      const date = new Date(dateRange.minDate + i * DAY_MS);
      return date;
    });

    const groups: Record<string, Date[]> = {};
    generatedDays.forEach((date) => {
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(date);
    });

    return { days: generatedDays, monthGroups: groups };
  }, [visibleIssues.length, dateRange]);

  if (visibleIssues.length === 0 || !dateRange) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-font-subtlest">
            No issues with scheduled dates yet.
          </p>
          <p className="text-font-subtler mt-2 text-sm">
            Add start_date and end_date to issues to see them in Gantt view.
          </p>
        </div>
      </div>
    );
  }

  const totalWidth = days.length * DAY_WIDTH;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Gantt Chart Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
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
                    className="border-r border-border bg-elevation-surface-raised px-1 text-center font-primary-bold text-xs text-font-subtlest"
                    style={{
                      width: `${monthDays.length * DAY_WIDTH}px`,
                    }}
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
                    className="text-font-subtler border-r border-border px-1 text-center text-xs"
                    style={{
                      width: `${DAY_WIDTH}px`,
                      height: "32px",
                    }}
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
            {visibleIssues.map((issue) => (
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
              {visibleIssues.map((issue) => {
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
                        className="absolute top-1/2 -translate-y-1/2 cursor-default rounded px-2 py-1 font-primary text-xs text-white"
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
  return (
    CATEGORY_COLORS[categoryType as keyof typeof CATEGORY_COLORS] ||
    CATEGORY_COLORS.TODO
  );
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
