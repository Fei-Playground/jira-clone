import React from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { BsCalendar3, BsCollection } from "react-icons/bs";
import { UserId } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";
import {
  ACTIVITY_TYPE_TABS,
  ActivityTypeFilter,
  ALL_USERS,
  DATE_RANGE_OPTIONS,
  DateRangeId,
  GROUP_BY_OPTIONS,
  GroupBy,
  SORT_ORDER_OPTIONS,
  SortOrder,
} from "../activity-timeline.const";
import type { ActivityTimelineState } from "../activity-timeline.hook";

export const ActivityFilters = ({
  state,
}: ActivityFiltersProps): JSX.Element => {
  const {
    users,
    filters,
    groupBy,
    sortOrder,
    typeCounts,
    setSearchQuery,
    setActivityType,
    setUserId,
    setDateRange,
    setCustomStartDate,
    setCustomEndDate,
    setGroupBy,
    setSortOrder,
  } = state;

  const selectedUser = users.find((user) => user.id === filters.userId);

  return (
    <section
      aria-label="Filter and search activities"
      className="flex flex-col gap-3 rounded bg-elevation-surface-raised p-3 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchActivities
          value={filters.searchQuery}
          onChange={setSearchQuery}
        />

        <TypeTabs
          value={filters.activityType}
          counts={typeCounts}
          onChange={setActivityType}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select.Root
            value={filters.userId}
            onValueChange={(value) => setUserId(value as UserId)}
          >
            <Select.Trigger aria-label="Filter activities by user">
              {selectedUser ? (
                <span className="mr-2 flex items-center">
                  <UserAvatar {...selectedUser} size={20} />
                </span>
              ) : null}
              <Select.Value>
                {selectedUser ? selectedUser.name : "All Users"}
              </Select.Value>
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
                    <UserAvatar {...user} size={24} />
                    <Select.ItemText>{user.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <IconSelect
            ariaLabel="Filter activities by date range"
            icon={<BsCalendar3 size={13} />}
            value={filters.dateRange}
            options={DATE_RANGE_OPTIONS}
            onChange={(value) => setDateRange(value as DateRangeId)}
          />

          <IconSelect
            ariaLabel="Group activities by"
            icon={<BsCollection size={14} />}
            prefix="Group by"
            value={groupBy}
            options={GROUP_BY_OPTIONS}
            onChange={(value) => setGroupBy(value as GroupBy)}
          />

          <IconSelect
            ariaLabel="Sort activities by date"
            icon={<FaSortAmountDownAlt size={13} />}
            value={sortOrder}
            options={SORT_ORDER_OPTIONS}
            onChange={(value) => setSortOrder(value as SortOrder)}
          />
        </div>
      </div>

      {filters.dateRange === "custom" && (
        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
          <label className="flex items-center gap-2 text-xs text-font-subtle">
            From
            <input
              type="date"
              value={filters.customStartDate}
              onChange={(event) => setCustomStartDate(event.target.value)}
              aria-label="Custom range start date"
              className="rounded border-none bg-background-input px-2 py-1.5 text-xs text-font outline outline-2 outline-border-input hover:bg-background-input-hovered"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-font-subtle">
            To
            <input
              type="date"
              value={filters.customEndDate}
              onChange={(event) => setCustomEndDate(event.target.value)}
              aria-label="Custom range end date"
              className="rounded border-none bg-background-input px-2 py-1.5 text-xs text-font outline outline-2 outline-border-input hover:bg-background-input-hovered"
            />
          </label>
        </div>
      )}
    </section>
  );
};

interface ActivityFiltersProps {
  state: ActivityTimelineState;
}

const SearchActivities = ({
  value,
  onChange,
}: SearchActivitiesProps): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <div className="relative w-fit">
      <input
        type="text"
        name="searchActivities"
        value={value}
        placeholder="Search activities…"
        aria-label="Search activities"
        onChange={handleChange}
        className={cx(
          "h-[36px] w-[220px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
          "box-border pl-8 pr-8 text-sm text-font outline outline-2 outline-border-input duration-200 ease-in-out",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
        )}
      />
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-icon-subtle">
        <BiSearch size={16} />
      </span>
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear activity search"
          className="absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded border-none text-icon hover:bg-background-neutral"
        >
          <IoCloseOutline size={16} />
        </button>
      )}
    </div>
  );
};

interface SearchActivitiesProps {
  value: string;
  onChange: (value: string) => void;
}

const TypeTabs = ({ value, counts, onChange }: TypeTabsProps): JSX.Element => (
  <div
    role="tablist"
    aria-label="Filter activities by type"
    className="flex flex-wrap items-center gap-1 rounded bg-background-neutral p-1"
  >
    {ACTIVITY_TYPE_TABS.map((tab) => {
      const isSelected = tab.id === value;
      const count = counts[tab.id];

      return (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={isSelected}
          onClick={() => onChange(tab.id)}
          className={cx(
            "flex cursor-pointer items-center gap-1.5 rounded border-none px-2.5 py-1.5 text-xs duration-200 ease-in-out",
            isSelected
              ? "bg-elevation-surface font-primary-bold text-font-brand shadow-xs"
              : "text-font-subtle hover:bg-background-neutral-hovered"
          )}
        >
          <span>{tab.label}</span>
          <span
            className={cx(
              "rounded px-1 py-px text-2xs",
              isSelected
                ? "bg-background-brand-subtlest text-font-brand"
                : "bg-background-neutral text-font-subtlest"
            )}
          >
            {count}
          </span>
        </button>
      );
    })}
  </div>
);

interface TypeTabsProps {
  value: ActivityTypeFilter;
  counts: Record<ActivityTypeFilter, number>;
  onChange: (value: ActivityTypeFilter) => void;
}

const IconSelect = ({
  ariaLabel,
  icon,
  prefix,
  value,
  options,
  onChange,
}: IconSelectProps): JSX.Element => {
  const selectedLabel =
    options.find((option) => option.id === value)?.label || "";

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger aria-label={ariaLabel}>
        <span className="mr-2 flex items-center text-icon-subtle">{icon}</span>
        <Select.Value>
          {prefix ? `${prefix}: ${selectedLabel}` : selectedLabel}
        </Select.Value>
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.Viewport>
          {options.map((option) => (
            <Select.Item key={option.id} value={option.id}>
              <Select.ItemIndicator />
              <Select.ItemText>{option.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
};

interface IconSelectProps {
  ariaLabel: string;
  icon: JSX.Element;
  prefix?: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}
