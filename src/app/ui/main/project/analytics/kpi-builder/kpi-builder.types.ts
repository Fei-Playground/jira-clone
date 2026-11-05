export type AggregationType =
  | "count"
  | "sum"
  | "avg"
  | "min"
  | "max"
  | "count_distinct"
  | "ratio"
  | "custom";

export const AGGREGATION_OPTIONS: { value: AggregationType; label: string }[] = [
  { value: "count", label: "Count – Count number of records" },
  { value: "sum", label: "Sum – Sum of values" },
  { value: "avg", label: "Average – Average of values" },
  { value: "min", label: "Min – Minimum value" },
  { value: "max", label: "Max – Maximum value" },
  { value: "count_distinct", label: "Count Distinct – Unique count" },
  { value: "ratio", label: "Ratio – Divide two measures" },
  { value: "custom", label: "Custom – Custom formula" },
];

/** Status of an auto-generated sub-KPI node */
export type SubKpiStatus = "loading" | "ready" | "error";

export interface SubKpi {
  id: string;
  /** Human-readable name auto-derived from the backend (e.g. "Total Churned Customers") */
  name: string;
  aggregationType: AggregationType;
  /** Auto-generated formula string */
  formula: string;
  /** Auto-generated filter condition */
  conditions: string;
  /** Auto-generated example calculation */
  example: string;
  /** Recursively nested sub-KPIs (auto-populated, read-only) */
  subKpis: SubKpi[];
  /** Whether this node is visually collapsed */
  isCollapsed: boolean;
  /** Generation status for this node */
  status: SubKpiStatus;
}

export interface KpiFormData {
  name: string;
  tooltipText: string;
  description: string;
  aggregationType: AggregationType;
  formula: string;
  conditions: string;
  example: string;
  /** Auto-populated by the backend after Generate formula */
  subKpis: SubKpi[];
}

/** Overall generation state for the sub-KPI tree */
export type GenerationState = "idle" | "generating" | "done" | "error";

/** Internal factory — used by stories/mocks only, not exposed to end users */
export function createSubKpi(name?: string, status: SubKpiStatus = "ready"): SubKpi {
  return {
    id: crypto.randomUUID(),
    name: name ?? "Sub KPI",
    aggregationType: "count",
    formula: "",
    conditions: "",
    example: "",
    subKpis: [],
    isCollapsed: false,
    status,
  };
}
