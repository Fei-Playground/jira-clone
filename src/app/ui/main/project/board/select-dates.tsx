import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsCalendar3, BsCheck } from "react-icons/bs";
import cx from "classix";
import {
  DateFilterField,
  DateFilterPreset,
  dateFilterFieldDict,
  dateFilterPresetDict,
  dateFilterPresets,
  getDateFilterLabel,
  isDateFilterActive,
  DEFAULT_DATE_FILTER,
} from "@domain/filter";
import { useProjectStore } from "@app/ui/main/project";

const PRESET_OPTIONS = dateFilterPresets.filter(
  (preset) => preset !== "custom"
);

export const SelectDates = (): JSX.Element => {
  const { dateFilter, setDateFilter } = useProjectStore();
  const isActive = isDateFilterActive(dateFilter);

  const setField = (field: DateFilterField): void => {
    setDateFilter((prev) => ({ ...prev, field }));
  };

  const setPreset = (preset: DateFilterPreset): void => {
    setDateFilter((prev) => ({
      ...prev,
      preset,
      ...(preset !== "custom" ? { from: undefined, to: undefined } : {}),
    }));
  };

  const setFrom = (from: string): void => {
    setDateFilter((prev) => ({
      ...prev,
      preset: "custom",
      from: from || undefined,
    }));
  };

  const setTo = (to: string): void => {
    setDateFilter((prev) => ({
      ...prev,
      preset: "custom",
      to: to || undefined,
    }));
  };

  const clearFilter = (): void => {
    setDateFilter(DEFAULT_DATE_FILTER);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cx(
          "flex cursor-pointer items-center justify-center rounded border-none px-3 py-1.5 text-xs",
          isActive
            ? "bg-background-selected text-font-brand hover:bg-background-selected-hovered"
            : "bg-background-brand-subtlest text-font-brand hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
        )}
        aria-label="Filter issues by date"
      >
        <div className="mr-2 flex items-center">
          <BsCalendar3 size={14} />
        </div>
        <span className="max-w-[200px] truncate">
          {getDateFilterLabel(dateFilter)}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="start"
        sideOffset={6}
        className="z-50 w-[280px] select-none rounded-md bg-elevation-surface-overlay p-3 shadow-md"
      >
        <div className="mb-3">
          <p className="mb-1.5 font-primary-bold text-2xs uppercase text-font-subtlest">
            Date field
          </p>
          <div className="flex gap-1">
            {(
              Object.entries(dateFilterFieldDict) as [DateFilterField, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setField(id)}
                className={cx(
                  "flex-1 rounded px-2 py-1.5 text-xs",
                  dateFilter.field === id
                    ? "bg-background-selected font-primary-bold text-font-brand"
                    : "bg-background-neutral text-font hover:bg-background-neutral-hovered"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="mb-1.5 font-primary-bold text-2xs uppercase text-font-subtlest">
            Range
          </p>
          <div className="flex flex-col gap-0.5">
            {PRESET_OPTIONS.map((preset) => {
              const selected = dateFilter.preset === preset;
              return (
                <DropdownMenu.Item
                  key={preset}
                  onSelect={(event) => {
                    event.preventDefault();
                    setPreset(preset);
                  }}
                  className={cx(
                    "flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs outline-none",
                    "hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered",
                    selected && "text-font-brand"
                  )}
                >
                  <span>{dateFilterPresetDict[preset]}</span>
                  {selected && <BsCheck size={16} />}
                </DropdownMenu.Item>
              );
            })}
          </div>
        </div>

        <div className="mb-3 border-t border-border pt-3">
          <p className="mb-1.5 font-primary-bold text-2xs uppercase text-font-subtlest">
            Custom range
          </p>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-2xs text-font-subtle">
              From
              <input
                type="date"
                value={dateFilter.from ?? ""}
                onChange={(e) => setFrom(e.target.value)}
                className={cx(
                  "rounded border-none bg-background-input px-2 py-1.5 text-xs text-font",
                  "outline outline-1 outline-border-input",
                  "focus:outline-2 focus:outline-border-brand"
                )}
              />
            </label>
            <label className="flex flex-col gap-1 text-2xs text-font-subtle">
              To
              <input
                type="date"
                value={dateFilter.to ?? ""}
                onChange={(e) => setTo(e.target.value)}
                className={cx(
                  "rounded border-none bg-background-input px-2 py-1.5 text-xs text-font",
                  "outline outline-1 outline-border-input",
                  "focus:outline-2 focus:outline-border-brand"
                )}
              />
            </label>
          </div>
        </div>

        {isActive && (
          <button
            type="button"
            onClick={clearFilter}
            className="w-full rounded px-2 py-1.5 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered"
          >
            Clear dates filter
          </button>
        )}
        <DropdownMenu.Arrow className="fill-elevation-surface-overlay" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
