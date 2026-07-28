import { useMemo } from "react";
import { HiOutlineRefresh, HiOutlineCog } from "react-icons/hi";
import cx from "classix";
import { Activity, activitiesMock } from "@domain/activity";
import { User, usersMock } from "@domain/user";
import { Button } from "@app/components/button";
import { ActivityFilters } from "./components/activity-filters";
import { ActivityTimeline } from "./components/activity-timeline";
import { ActivityDetailModal } from "./components/activity-detail-modal";
import { useActivityTimeline } from "./activity-timeline.hook";

export const ActivityTimelineView = ({
  projectName,
  activities = activitiesMock,
  users = usersMock,
}: ActivityTimelineViewProps): JSX.Element => {
  // Mock activities are anchored to a fixed date, so relative labels ("2h ago")
  // are computed against the newest activity rather than the wall clock.
  const now = useMemo(
    () =>
      activities.reduce(
        (latest, activity) => Math.max(latest, activity.createdAt),
        0
      ) +
      2 * 60 * 60 * 1000,
    [activities]
  );

  const state = useActivityTimeline({ activities, users, now });

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-primary-black text-2xl text-font">
              Project Activity
            </h2>
            <span className="rounded bg-background-brand-subtlest px-2 py-1 font-primary-bold text-xs text-font-brand">
              {projectName}
            </span>
          </div>
          <p className="mt-1 font-primary-light text-sm text-font-subtlest">
            View all project events and team activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            color="neutral"
            variant="subtlest"
            onClick={state.refresh}
            disabled={state.isRefreshing}
            aria-label="Refresh activities"
          >
            <HiOutlineRefresh
              size={16}
              className={cx(state.isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
          <Button color="neutral" variant="text" aria-label="Activity settings">
            <HiOutlineCog size={16} />
            Settings
          </Button>
        </div>
      </header>

      <ActivityFilters state={state} />

      <div className="min-h-0 flex-grow overflow-y-auto pr-1">
        <ActivityTimeline
          state={state}
          now={now}
          hasAnyActivity={activities.length > 0}
        />
      </div>

      {state.selectedActivity && (
        <ActivityDetailModal
          activity={state.selectedActivity}
          relatedActivities={state.relatedActivities}
          now={now}
          onClose={state.closeActivity}
          onSelectRelated={state.openActivity}
        />
      )}
    </div>
  );
};

interface ActivityTimelineViewProps {
  projectName: string;
  activities?: Activity[];
  users?: User[];
}
