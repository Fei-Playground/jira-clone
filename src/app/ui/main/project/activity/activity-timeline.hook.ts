import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ActivityType, getActivitySearchText } from "@domain/activity";
import { User, UserId } from "@domain/user";
import {
  AGGREGATION_THRESHOLD,
  ActivityTypeFilter,
  ALL_USERS,
  DATE_GROUPS,
  DateGroup,
  DateRangeId,
  DEFAULT_ACTIVITY_TYPE,
  DEFAULT_DATE_RANGE,
  DEFAULT_GROUP_BY,
  DEFAULT_SORT_ORDER,
  GroupBy,
  LOAD_MORE_DELAY_MS,
  PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
  SortOrder,
  ACTIVITY_TYPE_CONFIG,
} from "./activity-timeline.const";

export type ActivityFilters = {
  searchQuery: string;
  activityType: ActivityTypeFilter;
  userId: UserId | typeof ALL_USERS;
  dateRange: DateRangeId;
  customStartDate: string;
  customEndDate: string;
};

/** A single activity, or several same-kind activities collapsed into one row. */
export type TimelineEntry =
  | { kind: "single"; activity: Activity }
  | {
      kind: "aggregate";
      id: string;
      label: string;
      user: User;
      activityType: ActivityType;
      createdAt: number;
      activities: Activity[];
    };

export type TimelineGroup = {
  id: string;
  label: string;
  user?: User;
  activityType?: ActivityType;
  count: number;
  entries: TimelineEntry[];
};

const DAY = 24 * 60 * 60 * 1000;

const INITIAL_FILTERS: ActivityFilters = {
  searchQuery: "",
  activityType: DEFAULT_ACTIVITY_TYPE,
  userId: ALL_USERS,
  dateRange: DEFAULT_DATE_RANGE,
  customStartDate: "",
  customEndDate: "",
};

const startOfDay = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.valueOf();
};

/**
 * Branch and PR activities are code events, so the "Commits" tab surfaces them
 * alongside commits — matching how the tabs are labelled.
 */
const matchesType = (activity: Activity, activityType: ActivityTypeFilter): boolean => {
  if (activityType === "all") return true;
  if (activityType === "commit") {
    return (
      activity.detail.type === "commit" ||
      activity.detail.type === "branch" ||
      activity.detail.type === "pr"
    );
  }
  return activity.detail.type === activityType;
};

const getDateRangeBounds = (
  filters: ActivityFilters,
  now: number
): { from: number; to: number } => {
  const today = startOfDay(now);

  switch (filters.dateRange) {
    case "today":
      return { from: today, to: now };
    case "yesterday":
      return { from: today - DAY, to: today };
    case "last-7-days":
      return { from: today - 6 * DAY, to: now };
    case "last-30-days":
      return { from: today - 29 * DAY, to: now };
    case "this-month": {
      const date = new Date(now);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).valueOf();
      return { from: monthStart, to: now };
    }
    case "custom": {
      const from = filters.customStartDate
        ? startOfDay(new Date(filters.customStartDate).valueOf())
        : 0;
      const to = filters.customEndDate
        ? startOfDay(new Date(filters.customEndDate).valueOf()) + DAY - 1
        : now;
      return { from, to };
    }
  }
};

const getDateGroup = (timestamp: number, now: number): DateGroup => {
  const today = startOfDay(now);
  const activityDay = startOfDay(timestamp);
  const daysAgo = Math.round((today - activityDay) / DAY);

  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo <= 6) return "This Week";
  if (daysAgo <= 13) return "Last Week";
  return "Older";
};

/**
 * Collapses runs of same-user / same-kind activities into a single expandable
 * entry, e.g. "Woody made 5 commits to feature/auth-fix".
 */
const aggregateEntries = (activities: Activity[]): TimelineEntry[] => {
  const entries: TimelineEntry[] = [];
  let index = 0;

  while (index < activities.length) {
    const current = activities[index];
    const bucket: Activity[] = [current];
    const bucketKey = getAggregationKey(current);

    let next = index + 1;
    while (
      bucketKey !== null &&
      next < activities.length &&
      getAggregationKey(activities[next]) === bucketKey
    ) {
      bucket.push(activities[next]);
      next += 1;
    }

    if (bucket.length >= AGGREGATION_THRESHOLD) {
      entries.push({
        kind: "aggregate",
        id: `aggregate-${current.id}`,
        label: getAggregateLabel(bucket),
        user: current.user,
        activityType: current.detail.type,
        createdAt: current.createdAt,
        activities: bucket,
      });
      index = next;
      continue;
    }

    bucket.forEach((activity) => entries.push({ kind: "single", activity }));
    index = next;
  }

  return entries;
};

/**
 * Activities share an aggregation bucket when they are the same kind, by the
 * same user, and (for commits) on the same branch. Returns null for kinds that
 * are never aggregated.
 */
const getAggregationKey = (activity: Activity): string | null => {
  const { detail, user } = activity;

  switch (detail.type) {
    case "commit":
      return `commit:${user.id}:${detail.commit.branch}`;
    case "comment":
      return `comment:${detail.comment.fileName}`;
    case "task":
      return detail.task.action === "completed" ? `task-completed:${user.id}` : null;
    default:
      return null;
  }
};

const getAggregateLabel = (activities: Activity[]): string => {
  const [first] = activities;
  const count = activities.length;

  switch (first.detail.type) {
    case "commit":
      return `${first.user.name} made ${count} commits to ${first.detail.commit.branch}`;
    case "comment":
      return `${count} new comments on ${first.detail.comment.fileName}`;
    case "task":
      return `${first.user.name} completed ${count} tasks`;
    default:
      return `${count} activities`;
  }
};

const groupActivities = (
  activities: Activity[],
  groupBy: GroupBy,
  now: number
): TimelineGroup[] => {
  if (groupBy === "none") {
    return [
      {
        id: "all",
        label: "All activities",
        count: activities.length,
        entries: aggregateEntries(activities),
      },
    ];
  }

  if (groupBy === "date") {
    return DATE_GROUPS.map((dateGroup) => {
      const groupActivitiesList = activities.filter(
        (activity) => getDateGroup(activity.createdAt, now) === dateGroup
      );
      return {
        id: dateGroup,
        label: dateGroup,
        count: groupActivitiesList.length,
        entries: aggregateEntries(groupActivitiesList),
      };
    }).filter((group) => group.count > 0);
  }

  if (groupBy === "user") {
    const byUser = new Map<UserId, Activity[]>();
    activities.forEach((activity) => {
      const bucket = byUser.get(activity.user.id) || [];
      bucket.push(activity);
      byUser.set(activity.user.id, bucket);
    });

    return Array.from(byUser.entries()).map(([userId, userActivities]) => ({
      id: `user-${userId}`,
      label: userActivities[0].user.name,
      user: userActivities[0].user,
      count: userActivities.length,
      entries: aggregateEntries(userActivities),
    }));
  }

  const byType = new Map<ActivityType, Activity[]>();
  activities.forEach((activity) => {
    const bucket = byType.get(activity.detail.type) || [];
    bucket.push(activity);
    byType.set(activity.detail.type, bucket);
  });

  return Array.from(byType.entries()).map(([activityType, typeActivities]) => ({
    id: `type-${activityType}`,
    label: ACTIVITY_TYPE_CONFIG[activityType].groupLabel,
    activityType,
    count: typeActivities.length,
    entries: aggregateEntries(typeActivities),
  }));
};

export const useActivityTimeline = ({ activities, users, now }: UseActivityTimelineParams) => {
  const [filters, setFilters] = useState<ActivityFilters>(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>(DEFAULT_GROUP_BY);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(filters.searchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery]);

  // Any filter, grouping or sorting change restarts pagination. Comparing to
  // the previous key during render avoids a cascading render from an effect.
  const paginationKey = [
    debouncedSearch,
    filters.activityType,
    filters.userId,
    filters.dateRange,
    filters.customStartDate,
    filters.customEndDate,
    groupBy,
    sortOrder,
  ].join("|");
  const [previousPaginationKey, setPreviousPaginationKey] = useState<string>(paginationKey);

  if (paginationKey !== previousPaginationKey) {
    setPreviousPaginationKey(paginationKey);
    setPage(1);
  }

  const filteredActivities = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();
    const { from, to } = getDateRangeBounds(filters, now);

    // AND logic: an activity must satisfy every active filter.
    const matching = activities.filter((activity) => {
      const matchesSearch =
        search.length === 0 || getActivitySearchText(activity).toLowerCase().includes(search);
      const matchesUser = filters.userId === ALL_USERS || activity.user.id === filters.userId;
      const matchesDate = activity.createdAt >= from && activity.createdAt <= to;

      return (
        matchesSearch && matchesUser && matchesDate && matchesType(activity, filters.activityType)
      );
    });

    return matching.sort((a, b) =>
      sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
  }, [activities, debouncedSearch, filters, now, sortOrder]);

  const visibleActivities = useMemo(
    () => filteredActivities.slice(0, page * PAGE_SIZE),
    [filteredActivities, page]
  );

  const groups = useMemo(
    () => groupActivities(visibleActivities, groupBy, now),
    [visibleActivities, groupBy, now]
  );

  const typeCounts = useMemo(() => {
    const counts: Record<ActivityTypeFilter, number> = {
      all: 0,
      commit: 0,
      comment: 0,
      task: 0,
      settings: 0,
      user: 0,
      file: 0,
      branch: 0,
      pr: 0,
    };

    // Counts ignore the type filter itself so the tabs stay stable while
    // switching between them, but honour search / user / date filters.
    const search = debouncedSearch.trim().toLowerCase();
    const { from, to } = getDateRangeBounds(filters, now);

    activities.forEach((activity) => {
      const matchesSearch =
        search.length === 0 || getActivitySearchText(activity).toLowerCase().includes(search);
      const matchesUser = filters.userId === ALL_USERS || activity.user.id === filters.userId;
      const matchesDate = activity.createdAt >= from && activity.createdAt <= to;

      if (!matchesSearch || !matchesUser || !matchesDate) return;

      counts.all += 1;
      counts[activity.detail.type] += 1;
      if (activity.detail.type === "branch" || activity.detail.type === "pr") {
        counts.commit += 1;
      }
    });

    return counts;
  }, [activities, debouncedSearch, filters, now]);

  const hasMore = visibleActivities.length < filteredActivities.length;

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((current) => ({ ...current, searchQuery }));
  }, []);

  const setActivityType = useCallback((activityType: ActivityTypeFilter) => {
    setFilters((current) => ({ ...current, activityType }));
  }, []);

  const setUserId = useCallback((userId: UserId | typeof ALL_USERS) => {
    setFilters((current) => ({ ...current, userId }));
  }, []);

  const setDateRange = useCallback((dateRange: DateRangeId) => {
    setFilters((current) => ({ ...current, dateRange }));
  }, []);

  const setCustomStartDate = useCallback((customStartDate: string) => {
    setFilters((current) => ({ ...current, customStartDate }));
  }, []);

  const setCustomEndDate = useCallback((customEndDate: string) => {
    setFilters((current) => ({ ...current, customEndDate }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setDebouncedSearch("");
  }, []);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setPage((current) => current + 1);
      setIsLoading(false);
    }, LOAD_MORE_DELAY_MS);
  }, [isLoading]);

  const refresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), LOAD_MORE_DELAY_MS);
  }, [isRefreshing]);

  const openActivity = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
  }, []);

  const closeActivity = useCallback(() => setSelectedActivity(null), []);

  const relatedActivities = useMemo(() => {
    if (!selectedActivity) return [];
    return activities
      .filter(
        (activity) =>
          activity.id !== selectedActivity.id &&
          (activity.detail.type === selectedActivity.detail.type ||
            activity.user.id === selectedActivity.user.id)
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4);
  }, [activities, selectedActivity]);

  return {
    users,
    filters,
    groupBy,
    sortOrder,
    typeCounts,
    groups,
    visibleCount: visibleActivities.length,
    totalCount: filteredActivities.length,
    hasMore,
    isLoading,
    isRefreshing,
    selectedActivity,
    relatedActivities,
    setSearchQuery,
    setActivityType,
    setUserId,
    setDateRange,
    setCustomStartDate,
    setCustomEndDate,
    setGroupBy,
    setSortOrder,
    clearFilters,
    loadMore,
    refresh,
    openActivity,
    closeActivity,
  };
};

export type ActivityTimelineState = ReturnType<typeof useActivityTimeline>;

interface UseActivityTimelineParams {
  activities: Activity[];
  users: User[];
  /** Injected "now" keeps relative labels deterministic for mock data. */
  now: number;
}
