import { Link } from "react-router";
import cx from "classix";
import { Category, CategoryType, categoryTypeDict } from "@domain/category";
import { Issue } from "@domain/issue";
import { UserAvatar } from "@app/components/user-avatar";
import { PriorityIcon } from "@app/components/priority-icon";
import { Tooltip } from "@app/components/tooltip";
import { ScrollArea } from "@app/components/scroll-area";
import { useSortBy } from "@app/hooks/useSortBy";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_WIDTH = 36;
const LEFT_COLUMN_WIDTH = 260;
const ROW_HEIGHT = 44;

type GanttRow = {
  issue: Issue;
  categoryType: CategoryType;
};

export const GanttView = ({ categories }: Props): JSX.Element => {
  const rows: GanttRow[] = categories.flatMap((category) =>
    category.issues.map((issue) => ({
      issue,
      categoryType: category.type,
    }))
  );

  if (rows.length === 0) {
    return <EmptyGantt />;
  }

  const { minDate, dayCount } = getDateRange(rows);
  const days = Array.from(
    { length: dayCount },
    (_, index) => minDate + index * DAY_MS
  );

  return (
    <section className="mt-6 flex h-full flex-col">
      <ScrollArea>
        <div
          className="relative"
          style={{ width: `${LEFT_COLUMN_WIDTH + dayCount * DAY_WIDTH}px` }}
        >
          {/* Header row: sticky issue label column + date ticks */}
          <div className="sticky top-0 z-20 flex bg-elevation-surface-sunken">
            <div
              className="sticky left-0 z-30 flex items-center bg-elevation-surface-sunken px-3 py-2 font-primary-light text-xs uppercase text-font-subtlest"
              style={{
                width: `${LEFT_COLUMN_WIDTH}px`,
                minWidth: `${LEFT_COLUMN_WIDTH}px`,
              }}
            >
              Task
            </div>
            {days.map((day, index) => (
              <div
                key={day}
                className={cx(
                  "flex flex-shrink-0 flex-col items-center justify-center border-l border-border py-2 text-2xs text-font-subtlest",
                  isFirstOfMonth(day, index) && "font-primary-bold"
                )}
                style={{ width: `${DAY_WIDTH}px` }}
              >
                <span className="text-center leading-tight">
                  {formatDay(day)}
                </span>
              </div>
            ))}
          </div>
          {/* Rows, grouped by status */}
          <div>
            {categories.map((category) =>
              category.issues.length === 0 ? null : (
                <div key={category.id}>
                  <div
                    className="sticky left-0 z-10 flex items-center bg-elevation-surface-sunken px-3 py-1 font-primary-bold text-2xs uppercase text-font-subtlest"
                    style={{
                      width: `${LEFT_COLUMN_WIDTH + dayCount * DAY_WIDTH}px`,
                    }}
                  >
                    {categoryTypeDict[category.type]}
                  </div>
                  {category.issues.map((issue) => (
                    <GanttRowItem
                      key={issue.id}
                      issue={issue}
                      categoryType={category.type}
                      minDate={minDate}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};

interface Props {
  categories: Category[];
}

const GanttRowItem = ({
  issue,
  categoryType,
  minDate,
}: GanttRowItemProps): JSX.Element => {
  const sortBy = useSortBy();
  const issueLink = sortBy
    ? `issue/${issue.id}?sortBy=${sortBy}`
    : `issue/${issue.id}`;

  const startDate = issue.startDate ?? issue.createdAt;
  const endDate = issue.endDate ?? issue.createdAt;

  const offsetDays = Math.floor((startDate - minDate) / DAY_MS);
  const durationDays = Math.max(
    1,
    Math.ceil((endDate - startDate) / DAY_MS) + 1
  );

  const tooltipTitle = `${issue.name} · ${formatRange(startDate, endDate)}`;

  return (
    <div
      className="flex items-center border-b border-border"
      style={{ height: `${ROW_HEIGHT}px` }}
    >
      <div
        className="sticky left-0 z-10 flex h-full items-center gap-2 border-r border-border bg-elevation-surface px-3"
        style={{
          width: `${LEFT_COLUMN_WIDTH}px`,
          minWidth: `${LEFT_COLUMN_WIDTH}px`,
        }}
      >
        <UserAvatar {...issue.asignee} size={24} tooltip />
        <p className="line-clamp-1 flex-grow text-xs text-font">{issue.name}</p>
        <PriorityIcon priority={issue.priority.id} size={14} />
      </div>
      <div className="relative flex h-full flex-grow items-center">
        <Tooltip title={tooltipTitle} className="whitespace-normal">
          <Link
            to={issueLink}
            aria-label={`Open issue ${issue.name}`}
            className={cx(
              "absolute top-1/2 flex h-6 -translate-y-1/2 items-center rounded px-2 text-2xs text-font-inverse shadow-xs duration-200 ease-in-out hover:opacity-80",
              categoryType === "TODO" && "bg-background-accent-grey-bolder",
              categoryType === "IN_PROGRESS" &&
                "bg-background-accent-blue-bolder",
              categoryType === "DONE" && "bg-background-accent-green-bolder"
            )}
            style={{
              left: `${offsetDays * DAY_WIDTH}px`,
              width: `${durationDays * DAY_WIDTH - 4}px`,
            }}
          >
            <span className="truncate">{issue.name}</span>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
};

interface GanttRowItemProps {
  issue: Issue;
  categoryType: CategoryType;
  minDate: number;
}

const EmptyGantt = (): JSX.Element => (
  <div className="mt-12 flex flex-col items-center text-font-subtlest">
    <p className="font-primary-light text-xs uppercase">No issues found</p>
  </div>
);

const getDateRange = (
  rows: GanttRow[]
): { minDate: number; dayCount: number } => {
  const starts = rows.map(({ issue }) => issue.startDate ?? issue.createdAt);
  const ends = rows.map(({ issue }) => issue.endDate ?? issue.createdAt);

  const rawMin = Math.min(...starts);
  const rawMax = Math.max(...ends);

  const minDate = startOfDay(rawMin);
  const maxDate = startOfDay(rawMax);

  // Pad the timeline with a day of breathing room on each side
  const paddedMin = minDate - DAY_MS;
  const dayCount = Math.max(1, Math.round((maxDate - paddedMin) / DAY_MS) + 2);

  return { minDate: paddedMin, dayCount };
};

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.valueOf();
};

const isFirstOfMonth = (day: number, index: number): boolean =>
  index === 0 || new Date(day).getDate() === 1;

const formatDay = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

const formatRange = (start: number, end: number): string =>
  `${new Date(start).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  })} - ${new Date(end).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  })}`;
