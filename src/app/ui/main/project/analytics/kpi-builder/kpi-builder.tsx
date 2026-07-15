import { useState } from "react";
import cx from "classix";
import {
  RiArrowLeftLine,
  RiInformationLine,
  RiLoader4Line,
  RiRefreshLine,
  RiSparklingLine,
} from "react-icons/ri";
import { Button } from "@app/components/button";
import {
  KpiFormData,
  AggregationType,
  GenerationState,
  SubKpi,
  createSubKpi,
} from "./kpi-builder.types";
import { KpiDetailsPanel } from "./kpi-details-panel";
import { SubKpiNode } from "./sub-kpi-node";

interface KpiBuilderProps {
  onCancel?: () => void;
  onSubmit?: (data: KpiFormData) => void;
  /** Optional initial form state (used by stories / deep-links) */
  initialForm?: KpiFormData;
  /** Optional initial generation state (used by stories) */
  initialGenerationState?: GenerationState;
}

const DEFAULT_FORM: KpiFormData = {
  name: "Customer Churn Rate",
  tooltipText: "Measures customer attrition as a percentage",
  description: "",
  aggregationType: "count",
  formula: "",
  conditions: "",
  example: "",
  subKpis: [],
};

// ── Simulated backend response ─────────────────────────────────────────────
// In production this would be replaced by a real API call that returns the
// entire KPI tree (main KPI + nested sub-KPIs) in one shot.
function simulateGenerate(
  cb: (result: Pick<KpiFormData, "formula" | "conditions" | "example" | "subKpis">) => void
) {
  setTimeout(() => {
    // Build nested sub-KPI tree
    const grossChurned = createSubKpi("Total Churned Customers");
    grossChurned.aggregationType = "count";
    grossChurned.formula = "COUNT(CustomerID) WHERE Status = 'Churned'";
    grossChurned.conditions = "Status = 'Churned' AND Period = QUARTER";
    grossChurned.example = "1000 customers churned this quarter";

    const startCustomers = createSubKpi("Starting Customer Count");
    startCustomers.aggregationType = "count";
    startCustomers.formula = "COUNT(CustomerID) WHERE Period_Start = TRUE";
    startCustomers.conditions = "Period_Start = TRUE";
    startCustomers.example = "12 500 customers at start of quarter";

    // Churned customers itself depends on two signals
    const cancelledSubs = createSubKpi("Cancelled Subscriptions");
    cancelledSubs.aggregationType = "count";
    cancelledSubs.formula = "COUNT(SubscriptionID) WHERE Event = 'Cancel'";
    cancelledSubs.conditions = "Event = 'Cancel' AND Period = QUARTER";
    cancelledSubs.example = "780 cancelled subscriptions";

    const nonRenewals = createSubKpi("Non-Renewals");
    nonRenewals.aggregationType = "count";
    nonRenewals.formula = "COUNT(CustomerID) WHERE RenewalDate < NOW() AND Status != 'Active'";
    nonRenewals.conditions = "RenewalDate < NOW() AND Status != 'Active'";
    nonRenewals.example = "220 non-renewals";

    grossChurned.subKpis = [cancelledSubs, nonRenewals];

    cb({
      formula: "( Total Churned Customers / Starting Customer Count ) × 100",
      conditions: "Period = QUARTER AND CustomerType = 'Paying'",
      example: "( 1000 / 12 500 ) × 100 = 8%",
      subKpis: [grossChurned, startCustomers],
    });
  }, 2000);
}

export const KpiBuilder = ({
  onCancel,
  onSubmit,
  initialForm,
  initialGenerationState = "idle",
}: KpiBuilderProps): JSX.Element => {
  const [form, setForm] = useState<KpiFormData>(initialForm ?? DEFAULT_FORM);
  const [generationState, setGenerationState] = useState<GenerationState>(
    initialGenerationState
  );

  const updateForm = (patch: Partial<KpiFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubKpiChange = (index: number, updated: SubKpi) => {
    const next = [...form.subKpis];
    next[index] = updated;
    updateForm({ subKpis: next });
  };

  /** Trigger formula + sub-KPI auto-generation */
  const handleGenerate = () => {
    if (!form.description.trim()) return;
    setGenerationState("generating");
    // Clear previous results
    updateForm({ formula: "", conditions: "", example: "", subKpis: [] });

    simulateGenerate((result) => {
      updateForm(result);
      setGenerationState("done");
    });
  };

  const handleDiscard = () => {
    updateForm({ description: "", formula: "", conditions: "", example: "", subKpis: [] });
    setGenerationState("idle");
  };

  const handleSubmit = () => {
    onSubmit?.(form);
  };

  const isGenerating = generationState === "generating";
  const isDone = generationState === "done";
  const isIdle = generationState === "idle";

  return (
    <div className="flex h-full min-h-screen flex-col bg-elevation-surface">
      {/* ── Page content ── */}
      <div className="flex-1 overflow-auto p-6">
        {/* Back header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-font-subtle hover:text-font"
            aria-label="Go back"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <h1 className="font-primary-bold text-xl text-font">Create new KPI</h1>
        </div>

        {/* ── Two-column layout ── */}
        <div
          className="grid grid-cols-2 gap-8"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Left column — basic info + description */}
          <div className="flex flex-col gap-5">
            {/* KPI Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-primary-medium text-sm text-font">
                KPI Name
                <span className="ml-0.5 text-font-danger">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className={cx(
                  "rounded border border-border bg-elevation-surface px-3 py-2 text-sm text-font outline-none",
                  "hover:bg-background-input-hovered",
                  "focus:border-border-brand focus:ring-2 focus:ring-border-brand"
                )}
                placeholder="Enter KPI name"
              />
            </div>

            {/* Tooltip Text */}
            <div className="flex flex-col gap-1.5">
              <label className="font-primary-medium text-sm text-font">
                Tooltip Text
                <span className="ml-0.5 text-font-danger">*</span>
              </label>
              <input
                type="text"
                value={form.tooltipText}
                onChange={(e) => updateForm({ tooltipText: e.target.value })}
                className={cx(
                  "rounded border border-border bg-elevation-surface px-3 py-2 text-sm text-font outline-none",
                  "hover:bg-background-input-hovered",
                  "focus:border-border-brand focus:ring-2 focus:ring-border-brand"
                )}
                placeholder="Short description shown on hover"
              />
            </div>

            {/* Describe your KPI */}
            <div className="flex flex-col gap-1.5">
              <label className="font-primary-medium flex items-center gap-1.5 text-sm text-font">
                Describe your KPI
                <span className="ml-0.5 text-font-danger">*</span>
                <span className="cursor-help text-font-subtlest" title="Describe what this KPI measures. The AI will generate the formula and any dependent sub-KPIs automatically.">
                  <RiInformationLine size={15} />
                </span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                rows={9}
                disabled={isGenerating}
                className={cx(
                  "resize-none rounded border border-border bg-elevation-surface px-3 py-2 text-sm text-font outline-none",
                  "hover:bg-background-input-hovered",
                  "focus:border-border-brand focus:ring-2 focus:ring-border-brand",
                  isGenerating && "opacity-60 cursor-not-allowed"
                )}
                placeholder="Describe what this KPI measures and why it matters…"
              />
            </div>

            {/* Generate / Discard actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                color="neutral"
                variant="subtlest"
                onClick={handleDiscard}
                disabled={isGenerating}
              >
                Discard
              </Button>
              <Button
                type="button"
                color="primary"
                variant="subtlest"
                onClick={handleGenerate}
                disabled={isGenerating || !form.description.trim()}
              >
                {isGenerating ? (
                  <>
                    <RiLoader4Line size={14} className="animate-spin" />
                    Generating…
                  </>
                ) : isDone ? (
                  <>
                    <RiRefreshLine size={14} />
                    Regenerate formula
                  </>
                ) : (
                  <>
                    <RiSparklingLine size={14} />
                    Generate formula
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right column — KPI details */}
          <div className="flex flex-col gap-6">
            <KpiDetailsPanel
              aggregationType={form.aggregationType}
              onAggregationChange={(v: AggregationType) =>
                updateForm({ aggregationType: v })
              }
              formula={form.formula}
              onFormulaChange={(v) => updateForm({ formula: v })}
              conditions={form.conditions}
              onConditionsChange={(v) => updateForm({ conditions: v })}
              example={form.example}
              onExampleChange={(v) => updateForm({ example: v })}
              isLoading={isGenerating}
            />
          </div>
        </div>

        {/* ── Sub KPIs section ── */}
        <div className="mt-8 flex flex-col gap-4">
          {/* Section header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-primary-bold text-base text-font">Sub KPIs</h2>
              <p className="text-sm text-font-subtlest">
                {isIdle
                  ? "Dependent sub-KPIs will be auto-generated based on your KPI description."
                  : isGenerating
                  ? "Analysing dependencies and building sub-KPI tree…"
                  : `${countNodes(form.subKpis)} sub-KPI${countNodes(form.subKpis) !== 1 ? "s" : ""} auto-generated across ${maxDepth(form.subKpis)} level${maxDepth(form.subKpis) !== 1 ? "s" : ""} of nesting.`}
              </p>
            </div>

            {/* AI badge */}
            {!isIdle && (
              <span
                className={cx(
                  "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
                  isGenerating
                    ? "bg-background-brand-subtlest text-font-brand"
                    : "bg-background-success text-font-success"
                )}
              >
                {isGenerating ? (
                  <RiLoader4Line size={13} className="animate-spin" />
                ) : (
                  <RiSparklingLine size={13} />
                )}
                {isGenerating ? "AI generating" : "AI generated"}
              </span>
            )}
          </div>

          {/* Content area */}
          {isIdle && (
            <div
              className={cx(
                "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border py-12",
                "text-center text-font-subtlest"
              )}
            >
              <RiSparklingLine size={28} className="opacity-30" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-font-subtle">
                  Sub-KPIs are auto-generated
                </p>
                <p className="max-w-sm text-sm">
                  Describe your KPI above and click{" "}
                  <span className="font-medium text-font">Generate formula</span>. The AI
                  will analyse which dependent metrics are needed and build a
                  nested sub-KPI tree automatically.
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col gap-3">
              {/* Top-level loading skeletons */}
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-md border border-border"
                >
                  {/* Header skeleton */}
                  <div className="flex items-center gap-3 bg-background-neutral px-3 py-2">
                    <div className="h-5 w-5 animate-pulse rounded bg-background-neutral-hovered" />
                    <div className="h-4 w-40 animate-pulse rounded bg-background-neutral-hovered" />
                    <div className="ml-auto h-4 w-24 animate-pulse rounded-full bg-background-neutral-hovered" />
                  </div>
                  {/* Body skeleton */}
                  <div className="flex flex-col gap-3 p-4">
                    {[60, 100, 44].map((h, j) => (
                      <div
                        key={j}
                        className="animate-pulse rounded bg-background-neutral"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isDone && form.subKpis.length > 0 && (
            <div className="flex flex-col gap-3">
              {form.subKpis.map((sub, idx) => (
                <SubKpiNode
                  key={sub.id}
                  subKpi={sub}
                  onChange={(updated) => handleSubKpiChange(idx, updated)}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-elevation-surface px-6 py-4">
        <Button type="button" color="neutral" variant="text" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={handleSubmit}
          disabled={!isDone}
        >
          Create KPI
        </Button>
      </div>
    </div>
  );
};

/** Count total sub-KPI nodes recursively */
function countNodes(nodes: SubKpi[]): number {
  return nodes.reduce((acc, n) => acc + 1 + countNodes(n.subKpis), 0);
}

/** Find deepest nesting level */
function maxDepth(nodes: SubKpi[], current = 0): number {
  if (nodes.length === 0) return current;
  return Math.max(...nodes.map((n) => maxDepth(n.subKpis, current + 1)));
}
