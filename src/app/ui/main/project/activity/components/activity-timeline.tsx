import { Activity } from "@domain/activity";
import { Button } from "@app/components/button";
import {
  ActivityItem,
  ActivitySkeleton,
  AggregatedActivityItem,
} from "./activity-item";
import { GroupHeader, NoActivitiesState, NoResultsState } from "./group-header";
import { ActivityGroup } from "../activity-timeline.hook";

export const ActivityTimeline = ({
  groups,
  totalCount,
  hasActivities,
  isFiltered,
  hasMore,
  isLoading,
  onLoadMore,
  onOpenActivity,
  onClearFilters,
  isExpanded,
  onToggleExpanded,
  showGroupHeaders,
}: Props): JSX.Element => {
  if (!hasActivities) return <NoActivitiesState />;
  if (totalCount === 0) {
    return isFiltered ? (
      <NoResultsState onClearFilters={onClearFilters} />
    ) : (
      <NoActivitiesState />
    );
  }

  return (
    <div>
      <span aria-live="polite" className="sr-only">
        {isLoading
          ? "Loading more activities"
          : `${totalCount} activities shown`}
      </span>
      {groups.map((group) => (
        <section key={group.key} aria-label={group.label || "Activities"}>
          {showGroupHeaders && (
            <GroupHeader
              label={group.label}
              count={group.entries.length}
              user={group.user}
            />
          )}
          {/* Vertical timeline line connecting every activity in the group */}
          <ul className="relative ml-2 flex flex-col gap-3 border-l-2 border-l-border pb-4 pl-2">
            {group.entries.map((entry) =>
              entry.kind === "single" ? (
                <ActivityItem
                  key={entry.id}
                  activity={entry.activity}
                  onOpen={onOpenActivity}
                />
              ) : (
                <AggregatedActivityItem
                  key={entry.id}
                  entry={entry}
                  isExpanded={isExpanded(entry.id)}
                  onToggle={() => onToggleExpanded(entry.id)}
                  onOpen={onOpenActivity}
                />
              )
            )}
          </ul>
        </section>
      ))}

      {isLoading && (
        <div className="ml-2 border-l-2 border-l-border pl-2">
          <ActivitySkeleton />
        </div>
      )}

      <div className="flex justify-center py-6">
        {hasMore ? (
          <Button
            color="primary"
            variant="subtlest"
            onClick={onLoadMore}
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

interface Props {
  groups: ActivityGroup[];
  totalCount: number;
  hasActivities: boolean;
  isFiltered: boolean;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onOpenActivity: (activity: Activity) => void;
  onClearFilters: () => void;
  isExpanded: (id: string) => boolean;
  onToggleExpanded: (id: string) => void;
  showGroupHeaders: boolean;
}
