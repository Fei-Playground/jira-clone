import { Button } from "@app/components/button";
import { GroupHeader } from "./group-header";
import { ActivityItem } from "./activity-item";
import { AggregatedActivity } from "./aggregated-activity";
import { ActivitySkeleton, NoActivities, NoResults } from "./activity-states";
import type { ActivityTimelineState } from "../activity-timeline.hook";

export const ActivityTimeline = ({
  state,
  now,
  hasAnyActivity,
}: ActivityTimelineProps): JSX.Element => {
  const {
    groups,
    groupBy,
    totalCount,
    visibleCount,
    hasMore,
    isLoading,
    isRefreshing,
    clearFilters,
    openActivity,
  } = state;

  if (!hasAnyActivity) return <NoActivities />;

  if (totalCount === 0 && !isRefreshing) {
    return <NoResults onClearFilters={clearFilters} />;
  }

  return (
    <div className="flex flex-col">
      <p aria-live="polite" className="sr-only">
        {isLoading || isRefreshing
          ? "Loading activities"
          : `Showing ${visibleCount} of ${totalCount} activities`}
      </p>

      {isRefreshing ? (
        <ActivitySkeleton count={4} />
      ) : (
        groups.map((group) => (
          <section key={group.id} aria-label={group.label}>
            {groupBy !== "none" && (
              <GroupHeader
                label={group.label}
                count={group.count}
                user={group.user}
                activityType={group.activityType}
              />
            )}
            <ul className="flex flex-col">
              {group.entries.map((entry) =>
                entry.kind === "aggregate" ? (
                  <AggregatedActivity
                    key={entry.id}
                    entry={entry}
                    now={now}
                    onOpen={openActivity}
                  />
                ) : (
                  <ActivityItem
                    key={entry.activity.id}
                    activity={entry.activity}
                    now={now}
                    onOpen={openActivity}
                  />
                )
              )}
            </ul>
          </section>
        ))
      )}

      {isLoading && <ActivitySkeleton count={3} />}

      <div className="flex justify-center py-6">
        {hasMore ? (
          <Button
            color="neutral"
            variant="subtlest"
            onClick={state.loadMore}
            disabled={isLoading}
            aria-label="Load more activities"
          >
            {isLoading ? "Loading…" : "Load More Activities"}
          </Button>
        ) : (
          <p className="font-primary-light text-xs text-font-subtlest">
            No more activities
          </p>
        )}
      </div>
    </div>
  );
};

interface ActivityTimelineProps {
  state: ActivityTimelineState;
  now: number;
  hasAnyActivity: boolean;
}
