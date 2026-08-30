import { Link } from "react-router";
import cx from "classix";
import { CategoryType } from "@domain/category";
import { Issue } from "@domain/issue";
import { useSortBy } from "@app/hooks/useSortBy";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";

const DAY_MS = 1000 * 60 * 60 * 24;
const DAY_WIDTH_PX = 40;
const LABEL_WIDTH_PX = 240;
const ROW_HEIGHT_PX = 48;

const statusBarClass = (status?: CategoryType): string => {
  if (status === "IN_PROGRESS") {
    return "bg-background-accent-blue-bolder hover:opacity-80";
  }
  if (status === "DONE") {
    return "bg-background-accent-green-bolder hover:opacity-80";
  }
  return "bg-background-accent-grey-bolder hover:opacity-80";
};

const formatTick = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const resolveRange = (
  issues: Issue[]
): { minDate: number; maxDate: number; totalDays: number } => {
  const dated = issues.filter(
    (issue) => issue.startDate != null && issue.endDate != null
  );

  if (dated.length === 0) {
    const today = startOfDay(Date.now());
    return {
      minDate: today,
      maxDate: today + 13 * DAY_MS,
      totalDays: 14,
    };
  }

  const minDate = startOfDay(
    Math.min(...dated.map((issue) => issue.startDate as number))
  );
  const maxDate = startOfDay(
    Math.max(...dated.map((issue) => issue.endDate as number))
  );
  const span = Math.max(1, Math.round((maxDate - minDate) / DAY_MS) + 1);
  // Pad one day on each side for breathing room
  return {
    minDate: minDate - DAY_MS,
    maxDate: maxDate + DAY_MS,
    totalDays: span + 2,
  };
};

const buildTicks = (minDate: number, totalDays: number): number[] => {
  const step = totalDays > 28 ? 7 : totalDays > 14 ? 3 : 1;
  const ticks: number[] = [];
  for (let i = 0; i < totalDays; i += step) {
    ticks.push(minDate + i * DAY_MS);
  }
  return ticks;
};

export const GanttChart = ({ issues }: Props): JSX.Element => {
  const sortBy = useSortBy();
  const { minDate, totalDays } = resolveRange(issues);
  const ticks = buildTicks(minDate, totalDays);
  const timelineWidth = totalDays * DAY_WIDTH_PX;

  if (issues.length === 0) {
    return (
      <div className="mt-8 flex flex-1 items-center justify-center rounded bg-elevation-surface-sunken p-8 text-font-subtlest">
        No issues match the current filters.
      </div>
    );
  }

  return (
    <section className="mt-8 flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-border bg-elevation-surface-raised">
      <div className="h-full overflow-auto">
        <div
          className="relative min-w-full"
          style={{ width: LABEL_WIDTH_PX + timelineWidth }}
        >
          {/* Timeline header */}
          <div className="sticky top-0 z-20 flex border-b border-border bg-elevation-surface-raised">
            <div
              className="sticky left-0 z-30 flex shrink-0 items-center border-r border-border bg-elevation-surface-raised px-3 font-primary-light text-2xs uppercase text-font-subtlest"
              style={{ width: LABEL_WIDTH_PX, minHeight: 40 }}
            >
              Task
            </div>
            <div
              className="relative shrink-0"
              style={{ width: timelineWidth, height: 40 }}
            >
              {ticks.map((tick) => {
                const left = ((tick - minDate) / DAY_MS) * DAY_WIDTH_PX;
                return (
                  <div
                    key={tick}
                    className="border-border/60 absolute top-0 flex h-full flex-col justify-center border-l pl-1.5 font-primary-light text-2xs text-font-subtlest"
                    style={{ left }}
                  >
                    {formatTick(tick)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows */}
          <ul>
            {issues.map((issue) => {
              const idPrefix = issue.id.split("-")[0];
              const issueLink = sortBy
                ? `issue/${issue.id}?sortBy=${sortBy}`
                : `issue/${issue.id}`;
              const hasDates = issue.startDate != null && issue.endDate != null;
              const start = hasDates
                ? startOfDay(issue.startDate as number)
                : minDate;
              const end = hasDates
                ? startOfDay(issue.endDate as number)
                : minDate + DAY_MS;
              const barLeft = ((start - minDate) / DAY_MS) * DAY_WIDTH_PX;
              const barWidth = Math.max(
                DAY_WIDTH_PX / 2,
                ((end - start) / DAY_MS + 1) * DAY_WIDTH_PX
              );

              return (
                <li
                  key={issue.id}
                  className="border-border/50 flex border-b last:border-b-0"
                  style={{ height: ROW_HEIGHT_PX }}
                >
                  <div
                    className="sticky left-0 z-10 flex shrink-0 items-center gap-2 border-r border-border bg-elevation-surface-raised px-3"
                    style={{ width: LABEL_WIDTH_PX }}
                  >
                    <TaskIcon size={16} />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={issueLink}
                        className="block truncate text-xs text-font hover:underline"
                        title={issue.name}
                      >
                        {issue.name}
                      </Link>
                      <span className="text-2xs text-font-subtlest">
                        {idPrefix}
                      </span>
                    </div>
                    <PriorityIcon priority={issue.priority.id} />
                  </div>

                  <div
                    className="bg-elevation-surface-sunken/40 relative shrink-0"
                    style={{ width: timelineWidth, height: ROW_HEIGHT_PX }}
                  >
                    {/* Day grid lines */}
                    {ticks.map((tick) => {
                      const left = ((tick - minDate) / DAY_MS) * DAY_WIDTH_PX;
                      return (
                        <div
                          key={`${issue.id}-${tick}`}
                          className="border-border/40 absolute top-0 h-full border-l"
                          style={{ left }}
                        />
                      );
                    })}

                    {hasDates ? (
                      <Link
                        to={issueLink}
                        title={`${issue.name} · ${formatTick(start)} – ${formatTick(end)}`}
                        className={cx(
                          "absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded px-2 font-primary-light text-2xs text-font-inverse shadow-xs duration-150",
                          statusBarClass(issue.categoryType)
                        )}
                        style={{ left: barLeft, width: barWidth }}
                      >
                        <span className="truncate">{issue.name}</span>
                      </Link>
                    ) : (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xs text-font-subtlest">
                        No dates set
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

interface Props {
  issues: Issue[];
}
