import { useState } from "react";
import cx from "classix";
import * as Select from "@radix-ui/react-select";
import { RiArrowDropDownLine, RiEditLine } from "react-icons/ri";
import { AGGREGATION_OPTIONS, AggregationType } from "./kpi-builder.types";

interface KpiDetailsPanelProps {
  aggregationType: AggregationType;
  onAggregationChange: (value: AggregationType) => void;
  formula: string;
  onFormulaChange: (value: string) => void;
  conditions: string;
  onConditionsChange: (value: string) => void;
  example: string;
  onExampleChange: (value: string) => void;
  /** Optional title override; defaults to "KPI details" */
  title?: string;
  /** When true the panel renders in a more compact style for nesting */
  compact?: boolean;
  /** When true renders animated loading skeletons in place of field values */
  isLoading?: boolean;
}

export const KpiDetailsPanel = ({
  aggregationType,
  onAggregationChange,
  formula,
  onFormulaChange,
  conditions,
  onConditionsChange,
  example,
  // onExampleChange intentionally unused — Example is a read-only generated output
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExampleChange: _onExampleChange,
  title = "KPI details",
  compact = false,
  isLoading = false,
}: KpiDetailsPanelProps): JSX.Element => {
  const [editingFormula, setEditingFormula] = useState(false);
  const [editingConditions, setEditingConditions] = useState(false);

  const selectedLabel =
    AGGREGATION_OPTIONS.find((o) => o.value === aggregationType)?.label ??
    "Select aggregation type";

  if (isLoading) {
    return (
      <div className={cx("flex flex-col gap-4", compact && "gap-3")}>
        <p className={cx("font-primary-bold text-font", compact ? "text-sm" : "text-base")}>
          {title}
        </p>
        {/* Aggregation skeleton */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-28 animate-pulse rounded bg-background-neutral" />
          <div className="h-10 animate-pulse rounded bg-background-neutral" />
        </div>
        {/* Formula skeleton */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-16 animate-pulse rounded bg-background-neutral" />
          <div className="h-28 animate-pulse rounded bg-background-neutral" />
        </div>
        {/* Conditions skeleton */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 animate-pulse rounded bg-background-neutral" />
          <div className="h-10 animate-pulse rounded bg-background-neutral" />
        </div>
        {/* Example skeleton */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-16 animate-pulse rounded bg-background-neutral" />
          <div className="h-10 animate-pulse rounded bg-background-neutral" />
        </div>
      </div>
    );
  }

  return (
    <div className={cx("flex flex-col gap-4", compact && "gap-3")}>
      {/* Title */}
      <p
        className={cx(
          "font-primary-bold text-font",
          compact ? "text-sm" : "text-base"
        )}
      >
        {title}
      </p>

      {/* Aggregation type */}
      <div className="flex flex-col gap-1.5">
        <label className="font-primary-medium text-sm text-font-subtle">
          Aggregation type
        </label>
        <Select.Root
          value={aggregationType}
          onValueChange={(v) => onAggregationChange(v as AggregationType)}
        >
          <Select.Trigger
            className={cx(
              "flex w-full cursor-pointer items-center justify-between rounded border border-border px-3 py-2",
              "bg-elevation-surface text-font outline-none",
              "hover:bg-background-neutral-hovered",
              "focus:border-border-brand focus:ring-2 focus:ring-border-brand focus:ring-offset-0",
              "transition-colors duration-150",
              compact ? "text-sm" : "text-sm"
            )}
            aria-label="Aggregation type"
          >
            <Select.Value placeholder="Select aggregation type">
              {selectedLabel}
            </Select.Value>
            <Select.Icon>
              <RiArrowDropDownLine size={24} className="text-font-subtle" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="z-50 overflow-hidden rounded border border-border bg-elevation-surface-overlay py-1 shadow-md"
              position="popper"
              sideOffset={4}
            >
              <Select.Viewport className="p-1">
                {AGGREGATION_OPTIONS.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className={cx(
                      "relative flex cursor-pointer select-none items-center rounded px-3 py-2 pl-8",
                      "text-sm text-font outline-none",
                      "hover:bg-background-selected",
                      "focus:bg-background-selected",
                      "data-[state=checked]:font-primary-bold"
                    )}
                  >
                    <Select.ItemIndicator className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-border-selected" />
                    <Select.ItemText>{opt.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Formula */}
      <div className="flex flex-col gap-1.5">
        <label className="font-primary-medium text-sm text-font-subtle">
          Formula
        </label>
        <div
          className={cx(
            "relative rounded border border-border bg-elevation-surface",
            "transition-colors duration-150",
            editingFormula && "border-border-brand ring-2 ring-border-brand"
          )}
        >
          {editingFormula ? (
            <textarea
              autoFocus
              value={formula}
              onChange={(e) => onFormulaChange(e.target.value)}
              onBlur={() => setEditingFormula(false)}
              className="min-h-[100px] w-full resize-none rounded bg-transparent p-3 text-sm text-font outline-none"
              placeholder="Enter formula…"
            />
          ) : (
            <div
              className="min-h-[100px] cursor-text p-3 text-sm text-font"
              onClick={() => setEditingFormula(true)}
            >
              {formula || (
                <span className="text-font-subtlest">
                  Formula will appear here…
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setEditingFormula((v) => !v)}
            className="absolute bottom-2 right-2 rounded p-1 text-font-subtle hover:bg-background-neutral-hovered hover:text-font"
            aria-label="Edit formula"
          >
            <RiEditLine size={16} />
          </button>
        </div>
      </div>

      {/* Conditions */}
      <div className="flex flex-col gap-1.5">
        <label className="font-primary-medium text-sm text-font-subtle">
          Conditions
        </label>
        <div
          className={cx(
            "relative flex items-center rounded border border-border bg-elevation-surface",
            "transition-colors duration-150",
            editingConditions && "border-border-brand ring-2 ring-border-brand"
          )}
        >
          {editingConditions ? (
            <input
              autoFocus
              type="text"
              value={conditions}
              onChange={(e) => onConditionsChange(e.target.value)}
              onBlur={() => setEditingConditions(false)}
              className="w-full rounded bg-transparent px-3 py-2 pr-10 text-sm text-font outline-none"
              placeholder="e.g. Purchase_units > 0"
            />
          ) : (
            <div
              className="flex-1 cursor-text px-3 py-2 text-sm text-font"
              onClick={() => setEditingConditions(true)}
            >
              {conditions || (
                <span className="text-font-subtlest">
                  e.g. Purchase_units &gt; 0
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setEditingConditions((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-font-subtle hover:bg-background-neutral-hovered hover:text-font"
            aria-label="Edit conditions"
          >
            <RiEditLine size={16} />
          </button>
        </div>
      </div>

      {/* Example */}
      <div className="flex flex-col gap-1.5">
        <label className="font-primary-medium text-sm text-font-subtle">
          Example
        </label>
        <div className="rounded border border-border bg-elevation-surface px-3 py-2 text-sm text-font-subtle">
          {example || (
            <span className="text-font-subtlest">
              Example calculation will appear here…
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
