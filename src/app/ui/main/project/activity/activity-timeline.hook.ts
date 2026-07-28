import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ActivityId, activitySearchText } from "@domain/activity";
import { User, UserId } from "@domain/user";
import {
  ACTIVITY_PAGE_SIZE,
  ALL_USERS,
  MIN_AGGREGATION_SIZE,
  LOAD_MORE_DELAY_MS,
  ActivityTypeFilter,
  DEFAULT_DATE_RANGE,
  DEFAULT_GROUP_BY,
  DEFAULT_SORT_ORDER,
  DEFAULT_TYPE_FILTER,
  DateRangeId,
  GroupById,
  SEARCH_DEBOUNCE_MS,
  SortOrderId,
  activityTypeMeta,
  typeFilterOf,
  typeFilters,
} from "./activity-timeline.const";
import { dateGroupLabel, dateRangeBounds } from "./activity-date";

export type ActivityGroup = {
  key: string;
  label: string;
  user?: User;
  entries: TimelineEntry[];
};

/**
 * A timeline row is either a single activity or an aggregation of several
 * similar ones ("John Doe made 5 commits to feature/auth-fix").
 */
export type TimelineEntry =
  | { kind: "single"; id: string; activity: Activity }
  | {
      kind: "aggregate";
      id: string;
      label: string;
      activities: Activity[];
    };

export type ActivityFilters = {
  searchQuery: string;
  activityType: ActivityTypeFilter;
  userId: UserId | typeof ALL_USERS;
  dateRange: DateRangeId;
  customStartDate: string;
  customEndDate: string;
};

const initialFilters: ActivityFilters = {
  searchQuery: "",
  activityType: DEFAULT_TYPE_FILTER,
  userId: ALL_USERS,
  dateRange: DEFAULT_DATE_RANGE,
  customStartDate: "",
  customEndDate: "",
};

export const useActivityTimeline = (activities: Activity[]) => {
  const [filters, setFilters] = useState<ActivityFilters>(initialFilters);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupById>(DEFAULT_GROUP_BY);
  const [sortOrder, setSortOrder] = useState<SortOrderId>(DEFAULT_SORT_ORDER);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Debounced search keeps typing responsive on large activity lists
  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(filters.searchQuery.trim().toLowerCase()),
      SEARCH_DEBOUNCE_MS
    );

    return () => clearTimeout(timeout);
  }, [filters.searchQuery]);

  const updateFilters = useCallback((partial: Partial<ActivityFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }, []);

  const setSearchQuery = useCallback(
    (searchQuery: string) => updateFilters({ searchQuery }),
    [updateFilters]
  );
  const setActivityType = useCallback(
    (activityType: ActivityTypeFilter) => updateFilters({ activityType }),
    [updateFilters]
  );
  const setUserId = useCallback((userId: string) => updateFilters({ userId }), [updateFilters]);
  const setDateRange = useCallback(
    (dateRange: DateRangeId) => updateFilters({ dateRange }),
    [updateFilters]
  );
  const setCustomStartDate = useCallback(
    (customStartDate: string) => updateFilters({ customStartDate }),
    [updateFilters]
  );
  const setCustomEndDate = useCallback(
    (customEndDate: string) => updateFilters({ customEndDate }),
    [updateFilters]
  );

  const changeGroupBy = useCallback((value: GroupById) => {
    setGroupBy(value);
    setPage(1);
  }, []);

  const changeSortOrder = useCallback((value: SortOrderId) => {
    setSortOrder(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setDebouncedSearch("");
    setPage(1);
  }, []);

  const isFiltered =
    filters.searchQuery.length > 0 ||
    filters.activityType !== DEFAULT_TYPE_FILTER ||
    filters.userId !== ALL_USERS ||
    filters.dateRange !== DEFAULT_DATE_RANGE ||
    filters.customStartDate.length > 0 ||
    filters.customEndDate.length > 0;

  // Date filter is shared by the visible list and the tab counts
  const dateFiltered = useMemo(() => {
    const bounds = dateRangeBounds(
      filters.dateRange,
      filters.customStartDate,
      filters.customEndDate
    );

    return activities.filter((activity) => {
      if (bounds && (activity.timestamp < bounds.from || activity.timestamp > bounds.to)) {
        return false;
      }
      if (filters.userId !== ALL_USERS && activity.user.id !== filters.userId) {
        return false;
      }
      if (debouncedSearch && !activitySearchText(activity).includes(debouncedSearch)) {
        return false;
      }

      return true;
    });
  }, [
    activities,
    debouncedSearch,
    filters.customEndDate,
    filters.customStartDate,
    filters.dateRange,
    filters.userId,
  ]);

  const typeCounts = useMemo(() => {
    const counts = typeFilters.reduce<Record<string, number>>(
      (acc, { id }) => ({ ...acc, [id]: 0 }),
      {}
    );

    dateFiltered.forEach((activity) => {
      counts.all += 1;
      counts[typeFilterOf(activity.type)] += 1;
    });

    return counts;
  }, [dateFiltered]);

  const filteredActivities = useMemo(() => {
    const matchingType =
      filters.activityType === "all"
        ? dateFiltered
        : dateFiltered.filter((activity) => typeFilterOf(activity.type) === filters.activityType);

    return [...matchingType].sort((a, b) =>
      sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );
  }, [dateFiltered, filters.activityType, sortOrder]);

  const visibleActivities = useMemo(
    () => filteredActivities.slice(0, page * ACTIVITY_PAGE_SIZE),
    [filteredActivities, page]
  );

  const groups = useMemo(
    () => buildGroups(visibleActivities, groupBy),
    [visibleActivities, groupBy]
  );

  const hasMore = visibleActivities.length < filteredActivities.length;

  const loadMore = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    // Mimics fetching the next page so skeleton loaders are visible
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoading(false);
    }, LOAD_MORE_DELAY_MS);
  }, [isLoading]);

  // Used by the Refresh button: collapse back to the first page of results
  const resetPagination = useCallback(() => {
    setPage(1);
    setExpandedIds([]);
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const isExpanded = useCallback((id: string) => expandedIds.includes(id), [expandedIds]);

  const openActivity = useCallback((activity: Activity) => setSelectedActivity(activity), []);
  const closeActivity = useCallback(() => setSelectedActivity(null), []);

  const relatedActivities = useMemo(
    () => findRelated(selectedActivity, activities),
    [selectedActivity, activities]
  );

  return {
    filters,
    setSearchQuery,
    setActivityType,
    setUserId,
    setDateRange,
    setCustomStartDate,
    setCustomEndDate,
    clearFilters,
    isFiltered,
    groupBy,
    setGroupBy: changeGroupBy,
    sortOrder,
    setSortOrder: changeSortOrder,
    typeCounts,
    filteredActivities,
    groups,
    hasMore,
    isLoading,
    loadMore,
    resetPagination,
    selectedActivity,
    openActivity,
    closeActivity,
    relatedActivities,
    toggleExpanded,
    isExpanded,
  };
};

const findRelated = (selected: Activity | null, activities: Activity[]): Activity[] => {
  if (!selected) return [];

  return activities
    .filter(
      (activity) =>
        activity.id !== selected.id &&
        (activity.user.id === selected.user.id || activity.type === selected.type)
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 4);
};

const aggregationKey = (activity: Activity): string | null => {
  switch (activity.type) {
    case "commit":
      return `commit:${activity.user.id}:${activity.commit.branch}`;
    case "comment":
      return `comment:${activity.comment.target}`;
    case "task":
      return activity.task.action === "completed" ? `task:${activity.user.id}:completed` : null;
    default:
      return null;
  }
};

const aggregationLabel = (key: string, activities: Activity[]): string => {
  const [type] = key.split(":");
  const first = activities[0];
  const count = activities.length;

  if (type === "commit" && first.type === "commit") {
    return `${first.user.name} made ${count} commits to ${first.commit.branch}`;
  }
  if (type === "comment" && first.type === "comment") {
    return `${count} new comments on ${first.comment.target}`;
  }
  if (type === "task" && first.type === "task") {
    return `${first.user.name} completed ${count} tasks`;
  }

  return `${count} activities`;
};

const aggregate = (activities: Activity[]): TimelineEntry[] => {
  const buckets = new Map<string, Activity[]>();

  activities.forEach((activity) => {
    const key = aggregationKey(activity);
    if (!key) return;

    buckets.set(key, [...(buckets.get(key) || []), activity]);
  });

  // Only collapse a bucket once it holds enough activities to be worth folding
  const aggregated = new Set<ActivityId>();
  buckets.forEach((bucketActivities) => {
    if (bucketActivities.length < MIN_AGGREGATION_SIZE) return;
    bucketActivities.forEach((activity) => aggregated.add(activity.id));
  });

  const entries: TimelineEntry[] = [];
  const emitted = new Set<string>();

  activities.forEach((activity) => {
    if (!aggregated.has(activity.id)) {
      entries.push({ kind: "single", id: activity.id, activity });
      return;
    }

    const key = aggregationKey(activity) as string;
    if (emitted.has(key)) return;

    emitted.add(key);
    const bucketActivities = buckets.get(key) as Activity[];
    entries.push({
      kind: "aggregate",
      id: key,
      label: aggregationLabel(key, bucketActivities),
      activities: bucketActivities,
    });
  });

  return entries;
};

const buildGroups = (activities: Activity[], groupBy: GroupById): ActivityGroup[] => {
  if (groupBy === "none") {
    return [{ key: "all", label: "", entries: aggregate(activities) }];
  }

  // Bucket first, then aggregate inside each group so a fold never spans groups
  const buckets: {
    key: string;
    label: string;
    user?: User;
    activities: Activity[];
  }[] = [];

  activities.forEach((activity) => {
    const { key, label, user } = groupIdentity(activity, groupBy);
    const existing = buckets.find((bucket) => bucket.key === key);

    if (existing) {
      existing.activities.push(activity);
      return;
    }

    buckets.push({ key, label, user, activities: [activity] });
  });

  return buckets.map(({ key, label, user, activities: grouped }) => ({
    key,
    label,
    user,
    entries: aggregate(grouped),
  }));
};

const groupIdentity = (
  activity: Activity,
  groupBy: GroupById
): { key: string; label: string; user?: User } => {
  if (groupBy === "user") {
    return {
      key: `user-${activity.user.id}`,
      label: activity.user.name,
      user: activity.user,
    };
  }

  if (groupBy === "type") {
    const { groupLabel } = activityTypeMeta[activity.type];
    return { key: `type-${groupLabel}`, label: groupLabel };
  }

  const label = dateGroupLabel(activity.timestamp);
  return { key: `date-${label}`, label };
};
