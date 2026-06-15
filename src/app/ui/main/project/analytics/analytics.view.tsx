import cx from "classix";
import { Project } from "@domain/project";

/**
 * Converts priority IDs to point values.
 * Priority point values match the "★ 10/15/20 pts" labels shown throughout the UI.
 */
const getPointsForPriority = (priorityId: string): number => {
  const pointsMap: Record<string, number> = { low: 10, medium: 15, high: 20 };
  return pointsMap[priorityId] || 0;
};

export const AnalyticsView = ({ project }: { project: Project }) => {
  const doneCategory = project.categories.find((c) => c.type === "DONE");
  const doneIssues = doneCategory?.issues || [];
  const allIssues = project.categories.flatMap((c) => c.issues);

  const pointsToday = doneIssues.reduce(
    (sum, issue) => sum + getPointsForPriority(issue.priority.id),
    0
  );
  const tabletMinutes = doneIssues.length * 5;
  const totalMissions = allIssues.length;
  const completedMissions = doneIssues.length;

  return (
    <div className="max-w-2xl p-6">
      <h1 className="mb-2 font-primary-black text-2xl text-font">
        ✨ Here&apos;s how you&apos;re doing today, Izzy!
      </h1>
      <p className="mb-8 font-primary-light text-font-subtle">
        Keep going! Every mission brings you more freedom.
      </p>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard
          emoji="⭐"
          label="Points Today"
          value={`${pointsToday} pts`}
          color="teal"
        />
        <StatCard
          emoji="📱"
          label="Tablet Time Earned"
          value={`${tabletMinutes} min`}
          color="lavender"
        />
        <StatCard
          emoji="🏆"
          label="Missions Done"
          value={`${completedMissions} / ${totalMissions}`}
          color="coral"
        />
      </div>

      {/* Completed missions */}
      {doneIssues.length === 0 ? (
        <div className="py-12 text-center text-font-subtlest">
          <div className="mb-4 text-5xl">🎯</div>
          <p className="font-primary-light">
            Complete your first mission to start earning points!
          </p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 font-primary-bold text-lg">🌟 Completed Today</h2>
          <ul className="space-y-3">
            {doneIssues.map((issue) => (
              <li
                key={issue.id}
                className="flex items-center justify-between rounded-lg bg-elevation-surface-raised p-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <span className="font-primary">{issue.name}</span>
                </div>
                <span className="font-primary-bold text-font-brand">
                  +{getPointsForPriority(issue.priority.id)} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Stat card component for displaying metrics.
 * Used for Points, Tablet Time, and Missions Done statistics.
 */
const StatCard = ({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: string;
  color: string;
}) => (
  <div
    className={cx(
      "rounded-xl p-4 text-center shadow-xs",
      color === "teal" && "bg-background-brand-subtlest",
      color === "lavender" && "bg-background-info",
      color === "coral" && "bg-background-danger"
    )}
  >
    <div className="mb-2 text-3xl">{emoji}</div>
    <div className="font-primary-bold text-xl text-font">{value}</div>
    <div className="mt-1 font-primary-light text-xs text-font-subtle">
      {label}
    </div>
  </div>
);
