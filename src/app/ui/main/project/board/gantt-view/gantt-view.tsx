import { useState } from "react";
import { Link } from "react-router";
import cx from "classix";
import { Category, CategoryType } from "@domain/category";
import { Issue } from "@domain/issue";
import { UserAvatar } from "@app/components/user-avatar";
import { PriorityIcon } from "@app/components/priority-icon";
import { ScrollArea } from "@app/components/scroll-area";
import { Tooltip } from "@app/components/tooltip";
import { useProjectStore } from "@app/ui/main/project";
import { useSortBy } from "@app/hooks/useSortBy";

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_DAY_WIDTH = 36;
const TASK_COLUMN_WIDTH = 380;

export const GanttView = ({ categories }: Props): JSX.Element => {
  const { search } = useProjectStore();

  const rows = categories
    .flatMap((category) =>
      category.issues.map((issue) => ({ issue, category }))
    )
    .filter(({ issue }) => issue.name.toLowerCase().includes(search));

  if (rows.length === 0) {
    return <EmptyGantt />;
  }

  const { rangeStart, days } = getTimelineRange(rows.map((row) => row.issue));

  return (
    <div className="h-full overflow-hidden rounded-md bg-elevation-surface-sunken">
      <ScrollArea>
        <div
          style={{
            minWidth: `${days.length * MIN_DAY_WIDTH + TASK_COLUMN_WIDTH}px`,
          }}
        >
          <TimelineHeader days={days} />
          <ul>
            {rows.map(({ issue, category }, index) => (
              <li
                key={issue.id}
                className={cx(
                  "flex items-stretch border-b border-border",
                  index % 2 === 0
                    ? "bg-elevation-surface"
                    : "bg-elevation-surface-sunken"
                )}
              >
                <IssueRowLabel issue={issue} />
                <div className="relative flex-grow">
                  <TimelineGridLines dayCount={days.length} />
                  <GanttBar
                    issue={issue}
                    categoryType={category.type}
                    rangeStart={rangeStart}
                    totalDays={days.length}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  );
};

interface Props {
  categories: Category[];
}

const getTimelineRange = (
  issues: Issue[]
): { rangeStart: number; days: Date[] } => {
  const starts = issues.map((issue) => issue.startDate ?? issue.createdAt);
  const ends = issues.map(
    (issue) => issue.dueDate ?? issue.startDate ?? issue.createdAt
  );

  const earliest = startOfDay(Math.min(...starts));
  const latest = startOfDay(Math.max(...ends));
  // Pad a couple of days on each side so bars don't touch the edges
  const rangeStart = earliest - 2 * DAY_MS;
  const rangeEnd = latest + 2 * DAY_MS;

  const dayCount = Math.max(1, Math.round((rangeEnd - rangeStart) / DAY_MS));
  const days = Array.from(
    { length: dayCount },
    (_, index) => new Date(rangeStart + index * DAY_MS)
  );

  return { rangeStart, days };
};

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.valueOf();
};

const TimelineHeader = ({ days }: { days: Date[] }): JSX.Element => {
  const [today] = useState(() => startOfDay(Date.now()));

  return (
    <div className="sticky top-0 z-10 flex bg-elevation-surface-raised">
      <div
        style={{
          width: `${TASK_COLUMN_WIDTH}px`,
          minWidth: `${TASK_COLUMN_WIDTH}px`,
        }}
        className="border-b border-r border-border px-3 py-2 font-primary-light text-xs uppercase text-font-subtlest"
      >
        Task
      </div>
      <div className="flex flex-grow border-b border-border">
        {days.map((day, index) => (
          <div
            key={index}
            style={{ minWidth: `${MIN_DAY_WIDTH}px` }}
            className={cx(
              "flex flex-1 flex-col items-center justify-center border-r border-border py-1 text-2xs text-font-subtlest",
              startOfDay(day.valueOf()) === today &&
                "bg-background-brand-subtlest text-font-brand"
            )}
          >
            <span className="font-primary-bold">{day.getDate()}</span>
            <span className="font-primary-light uppercase">
              {day.toLocaleDateString("en-US", { month: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineGridLines = ({ dayCount }: { dayCount: number }): JSX.Element => (
  <div className="absolute inset-0 flex">
    {Array.from({ length: dayCount }, (_, index) => (
      <div
        key={index}
        style={{ minWidth: `${MIN_DAY_WIDTH}px` }}
        className="flex-1 border-r border-border"
      />
    ))}
  </div>
);

const IssueRowLabel = ({ issue }: { issue: Issue }): JSX.Element => {
  const sortBy = useSortBy();
  const issueLink = sortBy
    ? `issue/${issue.id}?sortBy=${sortBy}`
    : `issue/${issue.id}`;

  return (
    <Link
      to={issueLink}
      style={{
        width: `${TASK_COLUMN_WIDTH}px`,
        minWidth: `${TASK_COLUMN_WIDTH}px`,
      }}
      className="flex items-center gap-2 border-r border-border px-3 py-3 text-sm text-font hover:bg-background-neutral-hovered"
    >
      <UserAvatar {...issue.asignee} size={24} tooltip />
      <span className="line-clamp-2 leading-5">{issue.name}</span>
    </Link>
  );
};

const GanttBar = ({
  issue,
  categoryType,
  rangeStart,
  totalDays,
}: GanttBarProps): JSX.Element => {
  const sortBy = useSortBy();
  const issueLink = sortBy
    ? `issue/${issue.id}?sortBy=${sortBy}`
    : `issue/${issue.id}`;

  const start = startOfDay(issue.startDate ?? issue.createdAt);
  const end = startOfDay(issue.dueDate ?? issue.startDate ?? issue.createdAt);
  const startOffsetDays = Math.round((start - rangeStart) / DAY_MS);
  const durationDays = Math.max(1, Math.round((end - start) / DAY_MS) + 1);

  const leftPercent = (startOffsetDays / totalDays) * 100;
  const widthPercent = (durationDays / totalDays) * 100;

  const startLabel = new Date(start).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
  const endLabel = new Date(end).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div
      className="absolute inset-y-0 flex items-center py-1.5"
      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
    >
      <Tooltip title={`${issue.name} · ${startLabel} - ${endLabel}`}>
        <Link
          to={issueLink}
          className={cx(
            "flex h-full w-full items-center gap-1.5 rounded px-2 shadow-xs duration-200 ease-in-out hover:opacity-90",
            categoryType === "TODO" &&
              "bg-background-accent-grey-bolder text-font-inverse",
            categoryType === "IN_PROGRESS" &&
              "bg-background-accent-blue-bolder text-font-inverse",
            categoryType === "DONE" &&
              "bg-background-accent-green-bolder text-font-inverse"
          )}
        >
          <UserAvatar {...issue.asignee} size={18} />
          <span className="line-clamp-1 text-xs">{issue.name}</span>
          <PriorityIcon priority={issue.priority.id} size={16} />
        </Link>
      </Tooltip>
    </div>
  );
};

interface GanttBarProps {
  issue: Issue;
  categoryType: CategoryType;
  rangeStart: number;
  totalDays: number;
}

const EmptyGantt = (): JSX.Element => (
  <div className="mt-16 flex flex-col items-center text-font-subtlest">
    <p className="font-primary-light text-xs uppercase">No issues found</p>
  </div>
);
