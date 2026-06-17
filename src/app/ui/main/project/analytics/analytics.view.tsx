import { useState, useMemo } from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { AiOutlineCheckSquare, AiOutlineCheckCircle } from "react-icons/ai";
import { BsCircle } from "react-icons/bs";
import { MdHourglassEmpty } from "react-icons/md";
import { Project } from "@domain/project";
import { Issue } from "@domain/issue";
import { categoryTypeDict, CategoryType } from "@domain/category";
import { ScrollArea } from "@app/components/scroll-area";
import { TaskIcon } from "@app/components/icons";
import { PriorityIcon } from "@app/components/priority-icon";
import { UserAvatar } from "@app/components/user-avatar";

/**
 * Calculates percentage safely, handling division by zero
 * @returns percentage value between 0 and 100
 */
const calculatePercentage = (count: number, total: number): number => {
  return total > 0 ? (count / total) * 100 : 0;
};

export const AnalyticsView = ({ project }: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CategoryType | "all">("all");

  // Flatten all issues from all categories into a single array for analytics processing
  const allIssues = useMemo(
    () => project.categories.flatMap((cat) => cat.issues),
    [project.categories]
  );

  // Calculate counts by status for the overview progress bar and stat cards
  const statusCounts = useMemo(() => {
    const counts = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };
    allIssues.forEach((issue) => {
      if (issue.categoryType) {
        counts[issue.categoryType]++;
      }
    });
    return counts;
  }, [allIssues]);

  const totalTasks = allIssues.length;

  // Calculate counts by priority level for the priority breakdown bars
  const priorityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    allIssues.forEach((issue) => {
      counts[issue.priority.id]++;
    });
    return counts;
  }, [allIssues]);

  // Calculate team workload sorted by task count (descending) to highlight busiest team members
  const teamWorkload = useMemo(() => {
    const workload = project.users.map((user) => {
      const assignedCount = allIssues.filter(
        (issue) => issue.asignee.id === user.id
      ).length;
      return { user, assignedCount };
    });
    return workload.sort((a, b) => b.assignedCount - a.assignedCount);
  }, [project.users, allIssues]);

  // Filter tasks based on search query and status filter for the All Tasks list
  const filteredTasks = useMemo(() => {
    return allIssues.filter((issue) => {
      const matchesSearch = issue.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || issue.categoryType === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allIssues, searchQuery, statusFilter]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea>
        <div className="flex flex-col gap-6 pb-10">
          {/* Overview Section */}
          <section>
            <h2 className="mb-4 font-primary-black text-lg">Overview</h2>
            {/* Progress Bar - visual representation of task distribution across statuses */}
            <div className="mb-5 flex h-2 overflow-hidden rounded">
              <div
                className="bg-background-accent-grey-bolder"
                style={{
                  width: `${calculatePercentage(statusCounts.TODO, totalTasks)}%`,
                }}
              />
              <div
                className="bg-background-accent-blue-bolder"
                style={{
                  width: `${calculatePercentage(statusCounts.IN_PROGRESS, totalTasks)}%`,
                }}
              />
              <div
                className="bg-background-accent-green-bolder"
                style={{
                  width: `${calculatePercentage(statusCounts.DONE, totalTasks)}%`,
                }}
              />
            </div>
            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                icon={<AiOutlineCheckSquare size={24} />}
                label="Total Tasks"
                value={totalTasks}
                colorClass="text-font"
              />
              <StatCard
                icon={<BsCircle size={20} />}
                label={categoryTypeDict.TODO}
                value={statusCounts.TODO}
                colorClass="text-icon-accent-grey"
              />
              <StatCard
                icon={<MdHourglassEmpty size={24} />}
                label={categoryTypeDict.IN_PROGRESS}
                value={statusCounts.IN_PROGRESS}
                colorClass="text-icon-accent-blue"
              />
              <StatCard
                icon={<AiOutlineCheckCircle size={24} />}
                label={categoryTypeDict.DONE}
                value={statusCounts.DONE}
                colorClass="text-icon-accent-green"
              />
            </div>
          </section>

          {/* Priority Breakdown Section */}
          <section>
            <h2 className="mb-4 font-primary-black text-lg">
              Priority Breakdown
            </h2>
            <div className="flex flex-col gap-3">
              <PriorityRow
                label="High"
                count={priorityCounts.high}
                total={totalTasks}
                colorClass="bg-background-danger-bold"
              />
              <PriorityRow
                label="Medium"
                count={priorityCounts.medium}
                total={totalTasks}
                colorClass="bg-background-warning-bold"
              />
              <PriorityRow
                label="Low"
                count={priorityCounts.low}
                total={totalTasks}
                colorClass="bg-background-success-bold"
              />
            </div>
          </section>

          {/* Team Workload Section */}
          <section>
            <h2 className="mb-4 font-primary-black text-lg">Team Workload</h2>
            <div className="flex flex-col gap-2">
              {teamWorkload.map(({ user, assignedCount }) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded border border-border bg-elevation-surface-raised px-3 py-2"
                >
                  <UserAvatar {...user} size={32} />
                  <span className="flex-1 font-primary text-sm text-font">
                    {user.name}
                  </span>
                  <span className="font-primary-bold text-sm text-font">
                    {assignedCount}
                  </span>
                  <div className="flex h-2 w-24 overflow-hidden rounded bg-elevation-surface-sunken">
                    <div
                      className="bg-background-brand-subtlest"
                      style={{
                        width: `${calculatePercentage(assignedCount, totalTasks)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All Tasks Section */}
          <section>
            <h2 className="mb-4 font-primary-black text-lg">All Tasks</h2>
            <div className="mb-3 flex items-center gap-3">
              {/* Search Input */}
              <div className="relative flex flex-1 items-center">
                <BiSearch
                  className="absolute left-2 text-font-subtlest"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-border bg-background-input px-8 py-1.5 text-sm text-font placeholder:text-font-subtlest focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand"
                />
              </div>
              {/* Status Filter */}
              <div className="flex gap-2">
                {(["all", "TODO", "IN_PROGRESS", "DONE"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cx(
                        "rounded border px-3 py-1.5 font-primary text-xs transition-colors duration-150",
                        statusFilter === status
                          ? "border-border-brand bg-background-brand-subtlest text-font-brand"
                          : "border-border bg-elevation-surface-raised text-font hover:bg-background-neutral"
                      )}
                    >
                      {status === "all" ? "All" : categoryTypeDict[status]}
                    </button>
                  )
                )}
              </div>
            </div>
            {/* Task List */}
            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BsCircle size={32} className="mb-2 text-font-subtlest" />
                  <p className="text-sm text-font-subtlest">No tasks found</p>
                </div>
              ) : (
                filteredTasks.map((issue) => (
                  <TaskRow key={issue.id} issue={issue} />
                ))
              )}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

interface Props {
  project: Project;
}

/**
 * StatCard - Displays a single metric with icon, value, and label
 * Used in the Overview section to show task counts by status
 */
const StatCard = ({ icon, label, value, colorClass }: StatCardProps) => (
  <div className="flex flex-col items-center justify-center rounded border border-border bg-elevation-surface-raised p-4 shadow-xs">
    <div className={cx("mb-2", colorClass)}>{icon}</div>
    <div className="mb-1 font-primary-black text-2xl text-font">{value}</div>
    <div className="font-primary-light text-xs text-font-subtlest">{label}</div>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
}

/**
 * PriorityRow - Displays a priority level with a progress bar showing its proportion
 * Used in the Priority Breakdown section
 */
const PriorityRow = ({ label, count, total, colorClass }: PriorityRowProps) => {
  const percentage = calculatePercentage(count, total);

  return (
    <div className="flex items-center gap-3 rounded border border-border bg-elevation-surface-raised px-3 py-2">
      <span className="w-16 font-primary-bold text-sm text-font">{label}</span>
      <div className="flex h-2 flex-1 overflow-hidden rounded bg-elevation-surface-sunken">
        <div className={colorClass} style={{ width: `${percentage}%` }} />
      </div>
      <span className="font-primary text-sm text-font-subtlest">{count}</span>
    </div>
  );
};

interface PriorityRowProps {
  label: string;
  count: number;
  total: number;
  colorClass: string;
}

/**
 * TaskRow - Displays a single task with status, priority, and assignee information
 * Used in the All Tasks section list
 */
const TaskRow = ({ issue }: TaskRowProps) => {
  // Map category type to appropriate badge styling
  const statusBadgeClass = issue.categoryType
    ? {
        TODO: "bg-background-accent-grey-subtler text-font",
        IN_PROGRESS: "bg-background-accent-blue-subtler text-font",
        DONE: "bg-background-accent-green-subtler text-font",
      }[issue.categoryType]
    : "bg-background-neutral text-font-subtlest";

  const statusLabel = issue.categoryType
    ? categoryTypeDict[issue.categoryType]
    : "Unknown";

  return (
    <div className="flex items-center gap-3 rounded border border-border bg-elevation-surface-raised px-3 py-2 shadow-xs">
      <TaskIcon size={18} />
      <span className="flex-1 truncate font-primary text-sm text-font">
        {issue.name}
      </span>
      <span
        className={cx(
          "rounded px-2 py-0.5 font-primary text-2xs uppercase",
          statusBadgeClass
        )}
      >
        {statusLabel}
      </span>
      <PriorityIcon priority={issue.priority.id} size={16} />
      <UserAvatar {...issue.asignee} size={24} />
    </div>
  );
};

interface TaskRowProps {
  issue: Issue;
}
