import { useState } from "react";
import { IoCloseOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { NumericField, RangeFilter, numericFieldDict } from "@domain/market";
import { Button } from "@app/components/button";
import { useScreenerStore } from "../screener.store";
import { FilterSearch } from "./filter-search";
import { FilterRange } from "./filter-range";
import { FilterMultiSelect } from "./filter-multi-select";

const primaryFields: NumericField[] = ["markPx", "change24hPct", "dayNtlVlm", "openInterestUsd", "fundingAnnualisedPct"];
const technicalFields: NumericField[] = ["rsRating", "rsi14", "adx14", "volumeRatio", "pctFrom52wHigh"];

const leverageTiers = [3, 5, 10, 20, 25, 40, 50];

export const FilterBar = (): JSX.Element => {
  const { filters, setFilters, resetFilters } = useScreenerStore();
  const [isOpen, setIsOpen] = useState(true);
  const [showTechnicals, setShowTechnicals] = useState(false);

  const activeFilterCount =
    Object.keys(filters.ranges).length +
    filters.types.length +
    filters.leverages.length +
    (filters.search ? 1 : 0);

  const setRange = (field: NumericField, value: RangeFilter | undefined) => {
    setFilters((prev) => {
      const nextRanges = { ...prev.ranges };
      if (value) nextRanges[field] = value;
      else delete nextRanges[field];
      return { ...prev, ranges: nextRanges };
    });
  };

  const removeChip = (kind: "search" | "type" | "leverage" | NumericField, value?: string | number) => {
    setFilters((prev) => {
      if (kind === "search") return { ...prev, search: "" };
      if (kind === "type") return { ...prev, types: prev.types.filter((t) => t !== value) };
      if (kind === "leverage") return { ...prev, leverages: prev.leverages.filter((l) => l !== value) };
      const nextRanges = { ...prev.ranges };
      delete nextRanges[kind];
      return { ...prev, ranges: nextRanges };
    });
  };

  return (
    <div className="rounded bg-elevation-surface-sunken p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 rounded border-none bg-transparent text-sm text-font-subtle hover:bg-background-neutral"
          aria-expanded={isOpen}
        >
          {isOpen ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
          <span>
            {isOpen ? "Hide" : "Show"} filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </span>
        </button>
        {activeFilterCount > 0 && (
          <Button color="neutral" variant="text" onClick={resetFilters} aria-label="Reset all filters">
            Reset all
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <FilterSearch value={filters.search} onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))} />
            <FilterMultiSelect
              label="Market type"
              options={[
                { value: "perp", label: "Perp" },
                { value: "spot", label: "Spot" },
              ]}
              selected={filters.types}
              onChange={(values) => setFilters((prev) => ({ ...prev, types: values as ("perp" | "spot")[] }))}
            />
            <FilterMultiSelect
              label="Max leverage"
              options={leverageTiers.map((t) => ({ value: String(t), label: `${t}x` }))}
              selected={filters.leverages.map(String)}
              onChange={(values) => setFilters((prev) => ({ ...prev, leverages: values.map(Number) }))}
            />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            {primaryFields.map((field) => (
              <FilterRange
                key={field}
                field={field}
                value={filters.ranges[field] ?? {}}
                onChange={(v) => setRange(field, v)}
              />
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowTechnicals((v) => !v)}
              className="flex items-center gap-1 rounded border-none bg-transparent text-xs uppercase text-font-subtlest hover:bg-background-neutral"
            >
              {showTechnicals ? <IoChevronUp size={12} /> : <IoChevronDown size={12} />}
              Technicals
            </button>
            {showTechnicals && (
              <div className="mt-2 flex flex-wrap items-end gap-4">
                {technicalFields.map((field) => (
                  <FilterRange
                    key={field}
                    field={field}
                    value={filters.ranges[field] ?? {}}
                    onChange={(v) => setRange(field, v)}
                  />
                ))}
              </div>
            )}
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Chip label={`Search: ${filters.search}`} onRemove={() => removeChip("search")} />
              )}
              {filters.types.map((type) => (
                <Chip key={type} label={`Type: ${type}`} onRemove={() => removeChip("type", type)} />
              ))}
              {filters.leverages.map((lev) => (
                <Chip key={lev} label={`Leverage: ${lev}x`} onRemove={() => removeChip("leverage", lev)} />
              ))}
              {(Object.keys(filters.ranges) as NumericField[]).map((field) => {
                const range = filters.ranges[field];
                if (!range) return null;
                const info = numericFieldDict[field];
                return (
                  <Chip
                    key={field}
                    label={`${info.label}: ${range.min ?? "Any"} - ${range.max ?? "Any"}`}
                    onRemove={() => removeChip(field)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }): JSX.Element => (
  <span className="flex items-center gap-1 rounded-full bg-background-brand-subtlest px-2 py-1 text-2xs text-font-brand">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className="flex items-center justify-center rounded-full border-none bg-transparent hover:bg-background-brand-subtlest-hovered"
    >
      <IoCloseOutline size={12} />
    </button>
  </span>
);
