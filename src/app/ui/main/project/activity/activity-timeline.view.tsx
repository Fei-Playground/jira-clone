import { useCallback, useMemo, useState } from "react";
import cx from "classix";
import { FiRefreshCw, FiSettings } from "react-icons/fi";
import { Activity, activitiesMock, activityUsersMock } from "@domain/activity";
import { User } from "@domain/user";
import { Button } from "@app/components/button";
import { ScrollArea } from "@app/components/scroll-area";
import {
  ActivityDetailModal,
  ActivityFilters,
  ActivityTimeline,
} from "./components";
import { useActivityTimeline } from "./activity-timeline.hook";
import { REFRESH_FEEDBACK_MS } from "./activity-timeline.const";

export const ActivityTimelineView = ({
  projectName,
  activities = activitiesMock,
  users = activityUsersMock,
}: Props): JSX.Element => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const timeline = useActivityTimeline(activities);

  const teamMembers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );

  const { resetPagination } = timeline;
  const refresh = useCallback(() => {
    setIsRefreshing(true);
    resetPagination();
    setTimeout(() => setIsRefreshing(false), REFRESH_FEEDBACK_MS);
  }, [resetPagination]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-primary-black text-2xl text-font">
              Project Activity
            </h2>
            <span className="rounded bg-background-brand-subtlest px-2 py-0.5 font-primary-bold text-2xs text-font-brand">
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
            onClick={refresh}
            disabled={isRefreshing}
            aria-label="Refresh activity timeline"
          >
            <FiRefreshCw
              size={16}
              className={cx(isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
          <Button color="neutral" variant="text" aria-label="Activity settings">
            <FiSettings size={16} />
            Settings
          </Button>
        </div>
      </header>

      <span aria-live="polite" className="sr-only">
        {isRefreshing ? "Refreshing activity timeline" : ""}
      </span>

      <ActivityFilters
        searchQuery={timeline.filters.searchQuery}
        onSearchChange={timeline.setSearchQuery}
        activityType={timeline.filters.activityType}
        onActivityTypeChange={timeline.setActivityType}
        typeCounts={timeline.typeCounts}
        users={teamMembers}
        userId={timeline.filters.userId}
        onUserChange={timeline.setUserId}
        dateRange={timeline.filters.dateRange}
        onDateRangeChange={timeline.setDateRange}
        customStartDate={timeline.filters.customStartDate}
        customEndDate={timeline.filters.customEndDate}
        onCustomStartDateChange={timeline.setCustomStartDate}
        onCustomEndDateChange={timeline.setCustomEndDate}
        groupBy={timeline.groupBy}
        onGroupByChange={timeline.setGroupBy}
        sortOrder={timeline.sortOrder}
        onSortOrderChange={timeline.setSortOrder}
      />

      <div className="min-h-0 flex-grow">
        <ScrollArea className="pr-2">
          <ActivityTimeline
            groups={timeline.groups}
            totalCount={timeline.filteredActivities.length}
            hasActivities={activities.length > 0}
            isFiltered={timeline.isFiltered}
            hasMore={timeline.hasMore}
            isLoading={timeline.isLoading}
            onLoadMore={timeline.loadMore}
            onOpenActivity={timeline.openActivity}
            onClearFilters={timeline.clearFilters}
            isExpanded={timeline.isExpanded}
            onToggleExpanded={timeline.toggleExpanded}
            showGroupHeaders={timeline.groupBy !== "none"}
          />
        </ScrollArea>
      </div>

      <ActivityDetailModal
        activity={timeline.selectedActivity}
        relatedActivities={timeline.relatedActivities}
        onClose={timeline.closeActivity}
      />
    </div>
  );
};

interface Props {
  projectName: string;
  activities?: Activity[];
  users?: User[];
}
