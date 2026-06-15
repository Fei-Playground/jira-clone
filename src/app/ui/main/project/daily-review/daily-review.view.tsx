import cx from "classix";
import { Project } from "@domain/project";

// Maps priority levels to point values (matches the "★ 10/15/20 pts" labels)
const getPointsForPriority = (priorityId: string): number => {
  const map: Record<string, number> = { low: 10, medium: 15, high: 20 };
  return map[priorityId] || 0;
};

export const DailyReviewView = ({ project }: Props): JSX.Element => {
  // Get issues by category type
  const doneCategory = project.categories.find((c) => c.type === "DONE");
  const inProgressCategory = project.categories.find(
    (c) => c.type === "IN_PROGRESS"
  );
  const todoCategory = project.categories.find((c) => c.type === "TODO");

  const doneIssues = doneCategory?.issues || [];
  const inProgressIssues = inProgressCategory?.issues || [];
  const todoIssues = todoCategory?.issues || [];

  const allIssues = project.categories.flatMap((c) => c.issues);
  const pointsEarned = doneIssues.reduce(
    (sum, issue) => sum + getPointsForPriority(issue.priority.id),
    0
  );

  return (
    <div className="max-w-3xl p-6">
      {/* Header */}
      <h1 className="mb-2 font-primary-black text-2xl text-font">
        📋 Daily Review
      </h1>
      <p className="mb-8 font-primary-light text-font-subtle">
        Check off Izzy's missions and leave a note!
      </p>

      {/* Completed Missions Section */}
      {doneIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-primary-bold text-lg text-font">
            ✅ Completed Missions
          </h2>
          <div className="space-y-3">
            {doneIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between rounded-lg bg-elevation-surface-raised p-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-background-success px-3 py-1 font-primary-bold text-xs text-font-inverse">
                    Completed
                  </span>
                  <span className="font-primary text-font">{issue.name}</span>
                </div>
                <div className="flex items-center gap-2 font-primary-bold text-font-brand">
                  <span>⭐</span>
                  <span>{getPointsForPriority(issue.priority.id)} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Missions Section */}
      {inProgressIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-primary-bold text-lg text-font">
            🔧 Needs a Fix
          </h2>
          <div className="space-y-3">
            {inProgressIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between rounded-lg bg-elevation-surface-raised p-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-background-warning px-3 py-1 font-primary-bold text-xs text-font-inverse">
                    In Progress
                  </span>
                  <span className="font-primary text-font">{issue.name}</span>
                </div>
                <div className="flex items-center gap-2 font-primary-bold text-font-subtle">
                  <span>⭐</span>
                  <span>{getPointsForPriority(issue.priority.id)} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Started Missions Section */}
      {todoIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-primary-bold text-lg text-font">
            ⬜ Still To Do
          </h2>
          <div className="space-y-3">
            {todoIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between rounded-lg bg-elevation-surface-raised p-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-background-neutral px-3 py-1 font-primary-bold text-xs text-font-subtle">
                    Not Started
                  </span>
                  <span className="font-primary text-font">{issue.name}</span>
                </div>
                <div className="flex items-center gap-2 font-primary-bold text-font-subtlest">
                  <span>⭐</span>
                  <span>{getPointsForPriority(issue.priority.id)} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-8 rounded-xl bg-background-brand-subtlest p-6 shadow-xs">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-primary-black text-2xl text-font-brand">
              {allIssues.length}
            </div>
            <div className="mt-1 font-primary-light text-xs text-font-subtle">
              Total Missions
            </div>
          </div>
          <div>
            <div className="font-primary-black text-2xl text-font-brand">
              {doneIssues.length}
            </div>
            <div className="mt-1 font-primary-light text-xs text-font-subtle">
              Done Today
            </div>
          </div>
          <div>
            <div className="font-primary-black text-2xl text-font-brand">
              {pointsEarned}
            </div>
            <div className="mt-1 font-primary-light text-xs text-font-subtle">
              Points Earned
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {allIssues.length === 0 && (
        <div className="py-16 text-center text-font-subtlest">
          <div className="mb-4 text-5xl">📋</div>
          <p className="font-primary-light">No missions yet for today!</p>
        </div>
      )}
    </div>
  );
};

interface Props {
  project: Project;
}
