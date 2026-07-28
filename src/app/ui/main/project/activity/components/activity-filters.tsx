import React from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { User } from "@domain/user";
import * as Select from "@app/components/select";
import { UserAvatar } from "@app/components/user-avatar";
import {
  ALL_USERS,
  ActivityTypeFilter,
  DateRangeId,
  GroupById,
  SortOrderId,
  dateRanges,
  groupByOptions,
  sortOrders,
  typeFilters,
} from "../activity-timeline.const";

export const ActivityFilters = ({
  searchQuery,
  onSearchChange,
  activityType,
  onActivityTypeChange,
  typeCounts,
  users,
  userId,
  onUserChange,
  dateRange,
  onDateRangeChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  groupBy,
  onGroupByChange,
  sortOrder,
  onSortOrderChange,
}: Props): JSX.Element => {
  const selectedUser = users.find((user) => user.id === userId);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void =>
    onSearchChange(e.target.value);

  return (
    <section
      aria-label="Activity filters"
      className="flex flex-col gap-3 rounded bg-elevation-surface-raised p-3 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <input
            type="text"
            name="activity-search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search activities…"
            aria-label="Search activities"
            className={cx(
              "h-[36px] w-[240px] rounded border-none bg-background-input py-2 pl-8 pr-8",
              "outline outline-2 outline-border-input duration-200 ease-in-out hover:bg-background-input-hovered",
              "text-sm text-font placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
              "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
            )}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-icon-subtle">
            <BiSearch size={16} />
          </span>
          {searchQuery.length > 0 && (
            <button
              type="button"
              onMouseDown={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded border-none text-icon-subtle hover:bg-background-neutral"
            >
              <IoCloseOutline size={16} />
            </button>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Filter activities by type"
          className="flex flex-wrap items-center gap-1 rounded bg-elevation-surface-sunken p-1"
        >
          {typeFilters.map(({ id, label }) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={activityType === id}
              onClick={() => onActivityTypeChange(id)}
              className={cx(
                "flex cursor-pointer items-center gap-1.5 rounded border-none px-2.5 py-1.5 font-primary-bold text-2xs",
                activityType === id
                  ? "bg-background-brand-bold text-font-inverse"
                  : "text-font-subtle hover:bg-background-neutral-hovered"
              )}
            >
              {label}
              <span
                className={cx(
                  "rounded px-1 text-2xs",
                  activityType === id
                    ? "bg-background-brand-bold-hovered"
                    : "bg-background-neutral text-font-subtlest"
                )}
              >
                {typeCounts[id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select.Root value={userId} onValueChange={onUserChange}>
            <Select.Trigger aria-label="Filter activities by user">
              <span className="flex items-center gap-2">
                {selectedUser && (
                  <UserAvatar
                    name={selectedUser.name}
                    image={selectedUser.image}
                    color={selectedUser.color}
                    size={18}
                  />
                )}
                <Select.Value>
                  {selectedUser ? selectedUser.name : "All Users"}
                </Select.Value>
              </span>
              <Select.TriggerIcon />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Item value={ALL_USERS}>
                  <Select.ItemIndicator />
                  <Select.ItemText>All Users</Select.ItemText>
                </Select.Item>
                {users.map((user) => (
                  <Select.Item key={user.id} value={user.id}>
                    <Select.ItemIndicator />
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      color={user.color}
                      size={18}
                    />
                    <Select.ItemText>{user.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={dateRange}
            onValueChange={(value) => onDateRangeChange(value as DateRangeId)}
          >
            <Select.Trigger aria-label="Filter activities by date range">
              <Select.Value />
              <Select.TriggerIcon />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                {dateRanges.map(({ id, label }) => (
                  <Select.Item key={id} value={id}>
                    <Select.ItemIndicator />
                    <Select.ItemText>{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={groupBy}
            onValueChange={(value) => onGroupByChange(value as GroupById)}
          >
            <Select.Trigger aria-label="Group activities by">
              <span className="text-font-subtlest">Group:</span>
              <Select.Value />
              <Select.TriggerIcon />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                {groupByOptions.map(({ id, label }) => (
                  <Select.Item key={id} value={id}>
                    <Select.ItemIndicator />
                    <Select.ItemText>{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <Select.Root
            value={sortOrder}
            onValueChange={(value) => onSortOrderChange(value as SortOrderId)}
          >
            <Select.Trigger aria-label="Sort activities">
              <Select.Value />
              <Select.TriggerIcon />
            </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                {sortOrders.map(({ id, label }) => (
                  <Select.Item key={id} value={id}>
                    <Select.ItemIndicator />
                    <Select.ItemText>{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      {dateRange === "custom" && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 font-primary-light text-xs text-font-subtle">
            From
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              aria-label="Custom range start date"
              className="rounded border-none bg-background-input px-2 py-1 text-xs text-font outline outline-2 outline-border-input"
            />
          </label>
          <label className="flex items-center gap-2 font-primary-light text-xs text-font-subtle">
            To
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              aria-label="Custom range end date"
              className="rounded border-none bg-background-input px-2 py-1 text-xs text-font outline outline-2 outline-border-input"
            />
          </label>
        </div>
      )}
    </section>
  );
};

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activityType: ActivityTypeFilter;
  onActivityTypeChange: (value: ActivityTypeFilter) => void;
  typeCounts: Record<string, number>;
  users: User[];
  userId: string;
  onUserChange: (value: string) => void;
  dateRange: DateRangeId;
  onDateRangeChange: (value: DateRangeId) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (value: string) => void;
  onCustomEndDateChange: (value: string) => void;
  groupBy: GroupById;
  onGroupByChange: (value: GroupById) => void;
  sortOrder: SortOrderId;
  onSortOrderChange: (value: SortOrderId) => void;
}
