import { useState } from "react";
import { Link } from "react-router";
import cx from "classix";
import { Category, CategoryType } from "@domain/category";
import { Issue } from "@domain/issue";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";
import { UserAvatar } from "@app/components/user-avatar";
import { ScrollArea } from "@app/components/scroll-area";
import { useSortBy } from "@app/hooks/useSortBy";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_WIDTH = 36;
const ROW_HEIGHT = 44;
const LABEL_WIDTH = 260;

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.valueOf();
};

const addDays = (timestamp: number, days: number): number =>
  startOfDay(timestamp) + days * DAY_MS;

const diffInDays = (from: number, to: number): number =>
  Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);

const formatAxisDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

// Every issue is guaranteed a scheduling window for the timeline: fall back
// to createdAt/updatedAt when startDate/endDate aren't set on the issue.
const getIssueRange = (issue: Issue): { start: number; end: number } => {
  const fallbackStart = issue.createdAt;
  const fallbackEnd = Math.max(issue.updatedAt, fallbackStart + DAY_MS);
  const start = issue.startDate ?? fallbackStart;
  const end = issue.endDate ?? Math.max(fallbackEnd, start + DAY_MS);

  return { start, end: Math.max(end, start + DAY_MS) };
};

const statusBarClass: Record<CategoryType, string> = {
  TODO: "bg-background-accent-grey-bolder",
  IN_PROGRESS: "bg-background-accent-blue-bolder",
  DONE: "bg-background-accent-green-bolder",
};

export const GanttView = ({ categories }: Props): JSX.Element => {
  const sortBy = useSortBy();
  // Lazy initializer: read "now" once on mount rather than on every render.
  const [today] = useState<number>(() => startOfDay(Date.now()));
  const rows: { issue: Issue; categoryType: CategoryType }[] =
    categories.flatMap((category) =>
      category.issues.map((issue) => ({ issue, categoryType: category.type }))
    );

  if (rows.length === 0) {
    return <EmptyGantt />;
  }

  const getIssueLink = (issueId: string): string =>
    sortBy ? `issue/${issueId}?sortBy=${sortBy}` : `issue/${issueId}`;

  const ranges = rows.map(({ issue }) => getIssueRange(issue));
  const timelineStart = startOfDay(
    Math.min(...ranges.map((range) => range.start))
  );
  const timelineEndRaw = Math.max(...ranges.map((range) => range.end));
  const totalDays = Math.max(diffInDays(timelineStart, timelineEndRaw) + 2, 7);
  const timelineWidth = totalDays * DAY_WIDTH;
  const days = Array.from({ length: totalDays }, (_, index) =>
    addDays(timelineStart, index)
  );
  const todayOffsetDays = diffInDays(timelineStart, today);
  const isTodayVisible = todayOffsetDays >= 0 && todayOffsetDays < totalDays;

  return (
    <section className="mt-12 flex h-full flex-col">
      <Legend />
      <div className="flex h-full overflow-hidden rounded-md bg-elevation-surface-sunken">
        <ScrollArea>
          <div
            className="flex"
            style={{ minWidth: `${LABEL_WIDTH + timelineWidth}px` }}
          >
            {/* Sticky task label column */}
            <div
              className="sticky left-0 z-10 flex-shrink-0 bg-elevation-surface-sunken"
              style={{ width: `${LABEL_WIDTH}px` }}
            >
              <div
                className="flex items-center border-b border-border px-3 font-primary-light text-xs uppercase text-font-subtlest"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                Task
              </div>
              {rows.map(({ issue }, index) => (
                <TaskLabel key={issue.id} issue={issue} index={index} />
              ))}
            </div>
            {/* Timeline + bars */}
            <div
              className="relative flex-shrink-0"
              style={{ width: `${timelineWidth}px` }}
            >
              <div
                className="flex border-b border-border"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                {days.map((day) => (
                  <div
                    key={day}
                    className="flex flex-shrink-0 items-center justify-center border-r border-border font-primary-light text-2xs text-font-subtlest"
                    style={{ width: `${DAY_WIDTH}px` }}
                  >
                    {formatAxisDate(day)}
                  </div>
                ))}
              </div>
              {isTodayVisible && (
                <div
                  className="absolute top-0 z-10 flex w-px flex-col items-center bg-border-danger"
                  style={{
                    left: `${todayOffsetDays * DAY_WIDTH + DAY_WIDTH / 2}px`,
                    height: `${ROW_HEIGHT * (rows.length + 1)}px`,
                  }}
                  aria-label="Today"
                >
                  <span className="-mt-1 -translate-y-full whitespace-nowrap rounded bg-background-danger-bold px-1 py-0.5 text-2xs text-font-inverse">
                    Today
                  </span>
                </div>
              )}
              {rows.map(({ issue, categoryType }) => {
                const range = getIssueRange(issue);
                const offsetDays = diffInDays(timelineStart, range.start);
                const spanDays = Math.max(
                  diffInDays(range.start, range.end),
                  1
                );

                return (
                  <div
                    key={issue.id}
                    className="border-border/50 relative border-b"
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    <Link
                      to={getIssueLink(issue.id)}
                      className={cx(
                        "absolute top-1/2 flex h-6 -translate-y-1/2 items-center gap-1.5 rounded px-2 text-2xs text-font-inverse shadow-xs duration-200 ease-in-out hover:opacity-90",
                        statusBarClass[categoryType]
                      )}
                      style={{
                        left: `${offsetDays * DAY_WIDTH}px`,
                        width: `${spanDays * DAY_WIDTH}px`,
                      }}
                      aria-label={`${issue.name} bar`}
                    >
                      <span className="truncate">{issue.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};

const TaskLabel = ({ issue, index }: TaskLabelProps): JSX.Element => {
  const issueIdPrefix = issue.id.split("-")[0];

  return (
    <div
      className={cx(
        "flex items-center gap-2 border-b border-border px-3",
        index % 2 === 0 && "bg-elevation-surface/40"
      )}
      style={{ height: `${ROW_HEIGHT}px` }}
    >
      <TaskIcon size={16} />
      <span className="truncate text-xs text-font" title={issue.name}>
        {issue.name}
      </span>
      <span className="ml-auto flex flex-shrink-0 items-center gap-2">
        <PriorityIcon priority={issue.priority.id} size={14} />
        <UserAvatar {...issue.asignee} size={22} tooltip />
      </span>
      <span className="hidden text-2xs text-font-subtlest">
        {issueIdPrefix}
      </span>
    </div>
  );
};

interface TaskLabelProps {
  issue: Issue;
  index: number;
}

const Legend = (): JSX.Element => (
  <div className="mb-2 flex items-center justify-end gap-4 font-primary-light text-2xs text-font-subtlest">
    <LegendItem className="bg-background-accent-grey-bolder" label="To do" />
    <LegendItem
      className="bg-background-accent-blue-bolder"
      label="In progress"
    />
    <LegendItem className="bg-background-accent-green-bolder" label="Done" />
  </div>
);

const LegendItem = ({
  className,
  label,
}: {
  className: string;
  label: string;
}): JSX.Element => (
  <span className="flex items-center gap-1.5">
    <span className={cx("h-2.5 w-2.5 rounded-full", className)} />
    {label}
  </span>
);

const EmptyGantt = (): JSX.Element => (
  <section className="mt-12 flex h-full flex-col items-center justify-center text-font-subtlest">
    <p className="font-primary-light text-xs uppercase">
      No issues to schedule
    </p>
  </section>
);

interface Props {
  categories: Category[];
}
