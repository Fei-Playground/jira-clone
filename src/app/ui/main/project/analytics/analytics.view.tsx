import { useProjectStore } from "@app/ui/main/project/project.store";
import {
  CheckCircleIcon,
  DocumentIcon,
  ExclamationIcon,
  ClockIcon,
} from "@app/components/icons";
import { StatCard } from "./stat-card";
import { WorkflowChart } from "./workflow-chart";
import { PriorityChart } from "./priority-chart";
import { WorkloadChart } from "./workload-chart";

/**
 * Calculates the color indicator for completion rate based on percentage.
 * Green for strong progress (≥50%), yellow for moderate progress (≥25%), red for low progress.
 */
const getCompletionRateColor = (rate: number): "red" | "green" | "yellow" => {
  if (rate >= 50) return "green";
  if (rate >= 25) return "yellow";
  return "red";
};

export const AnalyticsView = (): JSX.Element => {
  const { project } = useProjectStore();

  // Flatten all issues from all categories
  const allIssues = project.categories.flatMap((cat) => cat.issues);

  // Calculate metrics
  const totalIssues = allIssues.length;
  const doneIssues = allIssues.filter((i) => i.categoryType === "DONE");
  const inProgressIssues = allIssues.filter(
    (i) => i.categoryType === "IN_PROGRESS"
  );
  const highPriorityIssues = allIssues.filter((i) => i.priority.id === "high");

  // Calculate completion rate as percentage (0-100)
  const completionRate =
    totalIssues === 0 ? 0 : Math.round((doneIssues.length / totalIssues) * 100);

  const completionRateColor = getCompletionRateColor(completionRate);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-elevation-surface-base">
      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-primary-bold text-font">Analytics</h1>
          <p className="text-sm text-font-subtle">
            Team&apos;s project progress at a glance
          </p>
        </div>

        {/* Empty state */}
        {totalIssues === 0 ? (
          <div className="rounded-lg border border-border bg-elevation-surface-raised p-8 text-center">
            <p className="text-font-subtle">
              No issues yet &mdash; add some to see analytics
            </p>
          </div>
        ) : (
          <>
            {/* KPI Cards Row */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Issues"
                value={totalIssues}
                icon={<DocumentIcon />}
                color="blue"
              />
              <StatCard
                label="Completion Rate"
                value={`${completionRate}%`}
                icon={<CheckCircleIcon />}
                color={completionRateColor}
              />
              <StatCard
                label="In Progress"
                value={inProgressIssues.length}
                icon={<ClockIcon />}
                color="yellow"
              />
              <StatCard
                label="High Priority"
                value={highPriorityIssues.length}
                icon={<ExclamationIcon />}
                color="red"
              />
            </div>

            {/* Charts Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-elevation-surface-raised p-6">
                <h2 className="mb-4 text-lg font-primary-bold text-font">
                  Workflow Progress
                </h2>
                <WorkflowChart issues={allIssues} />
              </div>
              <div className="rounded-lg border border-border bg-elevation-surface-raised p-6">
                <h2 className="mb-4 text-lg font-primary-bold text-font">
                  Issue Priority Distribution
                </h2>
                <PriorityChart issues={allIssues} />
              </div>
            </div>

            {/* Workload Section */}
            <div className="rounded-lg border border-border bg-elevation-surface-raised p-6">
              <h2 className="mb-4 text-lg font-primary-bold text-font">
                Workload by Team Member
              </h2>
              <WorkloadChart issues={allIssues} users={project.users} />
            </div>
          </>
        )}
      </section>
    </div>
  );
};
