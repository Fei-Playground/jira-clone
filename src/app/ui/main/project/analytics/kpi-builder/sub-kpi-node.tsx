import { useState } from "react";
import cx from "classix";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiLoader4Line,
  RiErrorWarningLine,
} from "react-icons/ri";
import { SubKpi, AggregationType } from "./kpi-builder.types";
import { KpiDetailsPanel } from "./kpi-details-panel";

interface SubKpiNodeProps {
  subKpi: SubKpi;
  /** Called when a user edits a value within this sub-KPI's details panel */
  onChange: (updated: SubKpi) => void;
  depth?: number;
}

export const SubKpiNode = ({
  subKpi,
  onChange,
  depth = 0,
}: SubKpiNodeProps): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(subKpi.isCollapsed);

  const handleUpdate = (patch: Partial<SubKpi>) => {
    onChange({ ...subKpi, ...patch });
  };

  const handleChildChange = (index: number, updated: SubKpi) => {
    const next = [...subKpi.subKpis];
    next[index] = updated;
    handleUpdate({ subKpis: next });
  };

  // Depth-specific left-border accent color
  const depthAccentClass = [
    "border-l-border-brand",
    "border-l-border-info",
    "border-l-border-success",
    "border-l-border-warning",
  ][depth % 4];

  return (
    <div
      className={cx(
        "rounded-md border border-border bg-elevation-surface",
        depth > 0 && "border-l-4",
        depth > 0 && depthAccentClass
      )}
    >
      {/* ── Header ── */}
      <div
        className={cx(
          "flex items-center gap-2 px-3 py-2",
          "rounded-t-md border-b border-border bg-background-neutral"
        )}
      >
        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((v) => !v)}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-font-subtle hover:bg-background-neutral-hovered hover:text-font"
          aria-label={isCollapsed ? "Expand sub KPI" : "Collapse sub KPI"}
        >
          {isCollapsed ? (
            <RiArrowRightSLine size={18} />
          ) : (
            <RiArrowDownSLine size={18} />
          )}
        </button>

        {/* Sub-KPI name — read-only, auto-generated */}
        <span className="flex-1 truncate font-primary-bold text-sm text-font">
          {subKpi.name}
        </span>

        {/* Depth badge */}
        <span className="rounded-full bg-background-neutral-hovered px-2 py-0.5 text-2xs text-font-subtlest">
          depth {depth + 1}
        </span>

        {/* Status indicator */}
        {subKpi.status === "loading" && (
          <span className="flex items-center gap-1 text-xs text-font-subtle">
            <RiLoader4Line size={14} className="animate-spin" />
            Generating…
          </span>
        )}
        {subKpi.status === "error" && (
          <span className="flex items-center gap-1 rounded-full bg-background-danger px-2 py-0.5 text-xs text-font-danger">
            <RiErrorWarningLine size={13} />
            Failed
          </span>
        )}

        {/* Auto-generated label */}
        {subKpi.status === "ready" && (
          <span className="rounded-full bg-background-success px-2 py-0.5 text-2xs text-font-success">
            Auto-generated
          </span>
        )}
      </div>

      {/* ── Body ── */}
      {!isCollapsed && (
        <div className="flex flex-col gap-5 p-4">
          {subKpi.status === "loading" ? (
            /* Loading skeleton */
            <div className="flex flex-col gap-4">
              {[80, 120, 48, 48].map((h, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded bg-background-neutral"
                  style={{ height: h }}
                />
              ))}
            </div>
          ) : subKpi.status === "error" ? (
            <div className="flex flex-col items-center gap-2 py-6 text-font-danger">
              <RiErrorWarningLine size={24} />
              <p className="text-sm">
                Failed to generate this sub-KPI. Please regenerate the formula
                to retry.
              </p>
            </div>
          ) : (
            <KpiDetailsPanel
              aggregationType={subKpi.aggregationType}
              onAggregationChange={(v: AggregationType) =>
                handleUpdate({ aggregationType: v })
              }
              formula={subKpi.formula}
              onFormulaChange={(v) => handleUpdate({ formula: v })}
              conditions={subKpi.conditions}
              onConditionsChange={(v) => handleUpdate({ conditions: v })}
              example={subKpi.example}
              onExampleChange={(v) => handleUpdate({ example: v })}
              title={`${subKpi.name} details`}
              compact
            />
          )}

          {/* Recursively render nested sub-KPIs */}
          {subKpi.subKpis.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-font-subtlest">
                Dependent sub KPIs
              </p>
              {subKpi.subKpis.map((child, idx) => (
                <SubKpiNode
                  key={child.id}
                  subKpi={child}
                  onChange={(updated) => handleChildChange(idx, updated)}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
