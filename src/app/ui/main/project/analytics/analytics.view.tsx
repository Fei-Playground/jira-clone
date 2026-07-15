import { useLoaderData, useParams, Link } from "react-router";
import cx from "classix";
import { MdBarChart } from "react-icons/md";
import { TbCircleDashed, TbProgress, TbCircleCheck } from "react-icons/tb";
import { HiFlag } from "react-icons/hi";
import { Project } from "@domain/project";
import {
  CategoryType,
  categoryTypes,
  categoryTypeDict,
} from "@domain/category";
import {
  EventTypeId,
  eventTypeIds,
  eventTypeDict,
  eventTypeColors,
  eventTypeBarBg,
} from "@domain/event-type";
import { PriorityId, prioritiesMock } from "@domain/priority";
import { EventTypeIcon } from "@app/ui/main/project/board/issue-panel/event-type-icon";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventTypeCount {
  id: EventTypeId;
  count: number;
}

interface StatusCount {
  type: CategoryType;
  name: string;
  count: number;
}

interface PriorityCount {
  id: PriorityId;
  name: string;
  count: number;
}

interface LoaderData {
  project: Project;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeEventTypeBreakdown(project: Project): EventTypeCount[] {
  const allIssues = project.categories.flatMap((c) => c.issues);
  const counts: Partial<Record<EventTypeId, number>> = {};

  for (const issue of allIssues) {
    if (issue.eventType) {
      counts[issue.eventType] = (counts[issue.eventType] ?? 0) + 1;
    }
  }

  return eventTypeIds
    .map((id) => ({ id, count: counts[id] ?? 0 }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count);
}

function computePriorityBreakdown(project: Project): PriorityCount[] {
  const allIssues = project.categories.flatMap((c) => c.issues);
  const countById: Partial<Record<PriorityId, number>> = {};

  for (const issue of allIssues) {
    const id = issue.priority.id as PriorityId;
    countById[id] = (countById[id] ?? 0) + 1;
  }

  return prioritiesMock
    .slice()
    .reverse() // high → medium → low
    .map((p) => ({
      id: p.id as PriorityId,
      name: p.name,
      count: countById[p.id as PriorityId] ?? 0,
    }));
}

function computeStatusBreakdown(project: Project): StatusCount[] {
  const countByType: Record<CategoryType, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };

  for (const category of project.categories) {
    const type = category.type as CategoryType;
    if (type in countByType) {
      countByType[type] += category.issues.length;
    }
  }

  return categoryTypes.map((type) => ({
    type,
    name: categoryTypeDict[type],
    count: countByType[type],
  }));
}

// ─── Priority styling ────────────────────────────────────────────────────────

const priorityStyles: Record<
  PriorityId,
  { barBg: string; badgeBg: string; badgeText: string; iconClass: string }
> = {
  high: {
    barBg: "bg-background-danger-bold",
    badgeBg: "bg-background-danger",
    badgeText: "text-font-danger",
    iconClass: "text-icon-accent-red",
  },
  medium: {
    barBg: "bg-background-warning-bold",
    badgeBg: "bg-background-warning",
    badgeText: "text-font-warning",
    iconClass: "text-icon-accent-yellow",
  },
  low: {
    barBg: "bg-background-success-bold",
    badgeBg: "bg-background-success",
    badgeText: "text-font-success",
    iconClass: "text-icon-accent-green",
  },
};

// ─── Status styling ──────────────────────────────────────────────────────────

const statusStyles: Record<
  CategoryType,
  {
    barBg: string;
    badgeBg: string;
    badgeText: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  TODO: {
    barBg: "!bg-background-accent-grey-bolder",
    badgeBg: "bg-background-accent-grey-subtler",
    badgeText: "text-font-accent-grey",
    Icon: TbCircleDashed,
  },
  IN_PROGRESS: {
    barBg: "!bg-background-accent-blue-bolder",
    badgeBg: "bg-background-accent-blue-subtler",
    badgeText: "text-font-accent-blue",
    Icon: TbProgress,
  },
  DONE: {
    barBg: "!bg-background-accent-green-bolder",
    badgeBg: "bg-background-accent-green-subtler",
    badgeText: "text-font-accent-green",
    Icon: TbCircleCheck,
  },
};

// ─── Shared components ───────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }): JSX.Element => (
  <div className="mb-5 flex items-center gap-2">
    <MdBarChart size={20} className="text-font-brand" />
    <h2 className="font-primary-black text-base text-font">{title}</h2>
  </div>
);

const EmptyState = (): JSX.Element => (
  <div className="flex flex-col items-center justify-center py-12 text-font-subtlest">
    <MdBarChart size={48} className="mb-3 opacity-30" />
    <p className="font-primary-light text-sm">
      No issues with event types found.
    </p>
    <p className="font-primary-light text-xs">
      Set an event type on issues to see a breakdown here.
    </p>
  </div>
);

// ─── Event type bar row ───────────────────────────────────────────────────────

interface BarRowProps {
  id: EventTypeId;
  count: number;
  maxCount: number;
  totalCount: number;
  href?: string;
}

const BarRow = ({
  id,
  count,
  maxCount,
  totalCount,
  href,
}: BarRowProps): JSX.Element => {
  const barWidthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const sharePct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  const colors = eventTypeColors[id];
  const barBg = eventTypeBarBg[id];

  const inner = (
    <>
      {/* Label */}
      <div className="flex w-32 shrink-0 items-center gap-1.5">
        <EventTypeIcon eventType={id} size={14} />
        <span className="font-primary-bold text-xs text-font">
          {eventTypeDict[id]}
        </span>
      </div>

      {/* Bar track */}
      <div className="relative flex h-5 flex-1 overflow-hidden rounded-md bg-elevation-surface-sunken">
        <div
          className="h-full origin-left animate-grow-x rounded-md"
          style={{
            width: `${barWidthPct}%`,
            minWidth: count > 0 ? "4px" : 0,
            backgroundColor: barBg,
          }}
        />
      </div>

      {/* Count + percent */}
      <div className="flex w-16 shrink-0 items-center justify-end gap-1">
        <span className="font-primary-bold text-xs text-font">{count}</span>
        <span
          className={cx("rounded px-1 py-0.5 text-2xs", colors.bg, colors.text)}
        >
          {sharePct}%
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="group -mx-1 flex items-center gap-3 rounded p-1 transition-colors duration-150 hover:bg-background-neutral"
        title={`Filter board by: ${eventTypeDict[id]}`}
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex items-center gap-3">{inner}</div>;
};

// ─── Priority bar row ────────────────────────────────────────────────────────

interface PriorityBarRowProps {
  priority: PriorityCount;
  maxCount: number;
  totalCount: number;
}

const PriorityBarRow = ({
  priority,
  maxCount,
  totalCount,
}: PriorityBarRowProps): JSX.Element => {
  const { id, name, count } = priority;
  const styles = priorityStyles[id];
  const barWidthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const sharePct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  const { barBg, badgeBg, badgeText, iconClass } = styles;

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div className="flex w-32 shrink-0 items-center gap-1.5">
        <span className={cx("flex items-center", iconClass)}>
          <HiFlag size={13} />
        </span>
        <span className="font-primary-bold text-xs text-font">{name}</span>
      </div>

      {/* Bar track */}
      <div className="relative flex h-5 flex-1 overflow-hidden rounded-md bg-elevation-surface-sunken">
        <div
          className={cx("h-full origin-left animate-grow-x rounded-md", barBg)}
          style={{ width: `${barWidthPct}%`, minWidth: count > 0 ? "4px" : 0 }}
        />
      </div>

      {/* Count + percent */}
      <div className="flex w-16 shrink-0 items-center justify-end gap-1">
        <span className="font-primary-bold text-xs text-font">{count}</span>
        <span
          className={cx("rounded px-1 py-0.5 text-2xs", badgeBg, badgeText)}
        >
          {sharePct}%
        </span>
      </div>
    </div>
  );
};

// ─── Status bar row ───────────────────────────────────────────────────────────

interface StatusBarRowProps {
  status: StatusCount;
  maxCount: number;
  totalCount: number;
}

const StatusBarRow = ({
  status,
  maxCount,
  totalCount,
}: StatusBarRowProps): JSX.Element => {
  const { type, name, count } = status;
  const styles = statusStyles[type];
  const barWidthPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const sharePct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  const { Icon, barBg, badgeBg, badgeText } = styles;

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div className="flex w-32 shrink-0 items-center gap-1.5">
        <span className={cx("flex items-center", badgeText)}>
          <Icon size={14} />
        </span>
        <span className="font-primary-bold text-xs text-font">{name}</span>
      </div>

      {/* Bar track */}
      <div className="relative flex h-5 flex-1 overflow-hidden rounded-md bg-elevation-surface-sunken">
        <div
          className={cx("h-full origin-left animate-grow-x rounded-md", barBg)}
          style={{ width: `${barWidthPct}%`, minWidth: count > 0 ? "4px" : 0 }}
        />
      </div>

      {/* Count + percent */}
      <div className="flex w-16 shrink-0 items-center justify-end gap-1">
        <span className="font-primary-bold text-xs text-font">{count}</span>
        <span
          className={cx("rounded px-1 py-0.5 text-2xs", badgeBg, badgeText)}
        >
          {sharePct}%
        </span>
      </div>
    </div>
  );
};

// ─── Summary cards ────────────────────────────────────────────────────────────

interface SummaryCardsProps {
  project: Project;
  categorizedCount: number;
  uncategorizedCount: number;
}

const SummaryCards = ({
  project,
  categorizedCount,
  uncategorizedCount,
}: SummaryCardsProps): JSX.Element => {
  const completedIssues =
    project.categories.find((c) => c.type === "DONE")?.issues.length ?? 0;

  const stats = [
    { label: "Completed Issues", value: completedIssues },
    { label: "With Event Type", value: categorizedCount },
    { label: "Uncategorized", value: uncategorizedCount },
    { label: "Avg per Column", value: "5.2" },
  ];

  return (
    <div className="mb-8 grid grid-cols-4 gap-4">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-md bg-elevation-surface-raised p-5 shadow-xs"
        >
          <span className="font-primary-black text-2xl text-font">{value}</span>
          <span className="mt-1 font-primary-light text-xs text-font-subtlest">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Main view ───────────────────────────────────────────────────────────────

export const AnalyticsView = (): JSX.Element => {
  const loaderData = useLoaderData() as LoaderData | undefined;
  const project = loaderData?.project;
  const params = useParams();

  if (!project) {
    return (
      <div className="py-12 text-center font-primary-light text-sm text-font-subtlest">
        No project data available.
      </div>
    );
  }

  // Event type breakdown
  const breakdown = computeEventTypeBreakdown(project);
  const categorizedCount = breakdown.reduce((sum, r) => sum + r.count, 0);
  const totalIssues = project.categories.reduce(
    (sum, c) => sum + c.issues.length,
    0
  );
  const uncategorizedCount = totalIssues - categorizedCount;
  const maxEventTypeCount = breakdown.length > 0 ? breakdown[0].count : 0;

  // Status breakdown
  const statusBreakdown = computeStatusBreakdown(project);
  const maxStatusCount = Math.max(...statusBreakdown.map((s) => s.count), 0);

  // Priority breakdown
  const priorityBreakdown = computePriorityBreakdown(project);
  const maxPriorityCount = Math.max(
    ...priorityBreakdown.map((p) => p.count),
    0
  );

  return (
    <div className="max-w-2xl">
      {/* Stats row */}
      <SummaryCards
        project={project}
        categorizedCount={categorizedCount}
        uncategorizedCount={uncategorizedCount}
      />

      {/* Event type chart */}
      <div className="mb-6 rounded-md bg-elevation-surface-raised p-6 shadow-xs">
        <SectionHeader title="Issues by Event Type" />
        {breakdown.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {breakdown.map((row) => (
              <BarRow
                key={row.id}
                id={row.id}
                count={row.count}
                maxCount={maxEventTypeCount}
                totalCount={categorizedCount}
                href={
                  params.projectId
                    ? `/projects/${params.projectId}/board?eventType=${row.id}`
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Status chart */}
      <div className="mb-6 rounded-md bg-elevation-surface-raised p-6 shadow-xs">
        <SectionHeader title="Issues by Status" />
        <div className="flex flex-col gap-3">
          {statusBreakdown.map((status) => (
            <StatusBarRow
              key={status.type}
              status={status}
              maxCount={maxStatusCount}
              totalCount={totalIssues}
            />
          ))}
        </div>
      </div>

      {/* Priority chart */}
      <div className="rounded-md bg-elevation-surface-raised p-6 shadow-xs">
        <SectionHeader title="Issues by Priority" />
        <div className="flex flex-col gap-3">
          {priorityBreakdown.map((priority) => (
            <PriorityBarRow
              key={priority.id}
              priority={priority}
              maxCount={maxPriorityCount}
              totalCount={totalIssues}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
