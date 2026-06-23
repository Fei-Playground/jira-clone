import { useState } from "react";
import cx from "classix";
import {
  RUN_DETAIL,
  type Dimensions,
  type ScenarioResult,
} from "@domain/ace-bench";
import {
  Card,
  StatusBadge,
  ScoreRing,
  Btn,
  DimMeter,
  Eyebrow,
} from "@app/components/ace-primitives";
import { AceIcons } from "@app/components/ace-icons";

// ─── Dimension Definitions ───────────────────────────────────────────────────

const DIMENSIONS = [
  { key: "accuracy", label: "Accuracy", short: "Acc", ck: "brand" },
  { key: "tooluse", label: "Tool use", short: "Tool", ck: "purple" },
  { key: "completeness", label: "Completeness", short: "Comp", ck: "teal" },
  { key: "safety", label: "Safety", short: "Safe", ck: "orange" },
  { key: "coherence", label: "Coherence", short: "Coh", ck: "indigo" },
];

// ─── Radar Chart ─────────────────────────────────────────────────────────────

interface RadarProps {
  scores: Dimensions;
  prev?: Dimensions;
  size?: number;
}

const Radar = ({ scores, prev, size = 220 }: RadarProps): JSX.Element => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;
  const n = DIMENSIONS.length;

  const pt = (i: number, v: number): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const rr = (v / 100) * r;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  };

  const poly = (vals: number[]) =>
    vals.map((v, i) => pt(i, v).join(",")).join(" ");

  const grid = [25, 50, 75, 100];
  const cur = DIMENSIONS.map((d) => scores[d.key as keyof Dimensions]);
  const old = prev
    ? DIMENSIONS.map((d) => prev[d.key as keyof Dimensions])
    : null;

  return (
    <svg width={size} height={size} className="block">
      {/* Grid */}
      {grid.map((g) => (
        <polygon
          key={g}
          points={poly(DIMENSIONS.map(() => g))}
          fill="none"
          stroke="var(--Neutral300)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {DIMENSIONS.map((d, i) => {
        const [x, y] = pt(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--Neutral300)"
            strokeWidth="1"
          />
        );
      })}
      {/* Previous data */}
      {old && (
        <polygon
          points={poly(old)}
          fill="none"
          stroke="var(--Neutral600)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      )}
      {/* Current data */}
      <polygon
        points={poly(cur)}
        fill="rgba(0,78,197,0.13)"
        stroke="var(--Blue700)"
        strokeWidth="2"
      />
      {cur.map((v, i) => {
        const [x, y] = pt(i, v);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--Blue700)" />;
      })}
      {/* Labels */}
      {DIMENSIONS.map((d, i) => {
        const [x, y] = pt(i, 122);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize="10.5"
            fontWeight="700"
            fill="var(--Neutral900)"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="CircularStdMedium, sans-serif"
          >
            {d.short}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Heatmap ─────────────────────────────────────────────────────────────────

interface HeatmapProps {
  results: ScenarioResult[];
}

const Heatmap = ({ results }: HeatmapProps): JSX.Element => {
  const cell = (v: number) => {
    const c = v >= 85 ? "#1A9B5C" : v >= 70 ? "#D07700" : "#D93A3F";
    const op = 0.18 + (v / 100) * 0.55;
    return { background: c, opacity: op };
  };

  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[560px] gap-1"
        style={{
          gridTemplateColumns: `minmax(200px,1.4fr) repeat(${DIMENSIONS.length}, 1fr) 64px`,
        }}
      >
        <div />
        {DIMENSIONS.map((d) => (
          <div
            key={d.key}
            className="pb-1 text-center font-primary-bold text-2xs text-font-subtle"
          >
            {d.short}
          </div>
        ))}
        <div className="pb-1 text-center font-primary-bold text-2xs text-font-subtle">
          Comp
        </div>

        {results.map((rscn) => (
          <>
            <div
              key={`${rscn.id}-name`}
              className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-font"
            >
              <span
                className={cx(
                  "flex",
                  rscn.verdict === "passed"
                    ? "text-font-accent-green"
                    : "text-font-danger"
                )}
              >
                {rscn.verdict === "passed" ? (
                  <AceIcons.checkCirc size={13} />
                ) : (
                  <AceIcons.xCirc size={13} />
                )}
              </span>
              <span className="overflow-hidden text-ellipsis">{rscn.name}</span>
            </div>
            {DIMENSIONS.map((d) => (
              <div
                key={`${rscn.id}-${d.key}`}
                className="flex h-8 items-center justify-center rounded"
                style={cell(rscn.dims[d.key as keyof Dimensions])}
              >
                <span className="relative font-primary-black text-2xs text-[#0c2a18] mix-blend-multiply">
                  {rscn.dims[d.key as keyof Dimensions]}
                </span>
              </div>
            ))}
            <div
              key={`${rscn.id}-score`}
              className={cx(
                "flex h-8 items-center justify-center rounded bg-background-subtlest font-primary-black text-xs",
                rscn.score >= 80 ? "text-font-accent-green" : "text-font-danger"
              )}
            >
              {rscn.score}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

// ─── Dimension Breakdown ─────────────────────────────────────────────────────

interface DimBreakdownProps {
  layout: "meters" | "radar" | "heatmap";
  dims: Dimensions;
  prev?: Dimensions;
  results: ScenarioResult[];
}

const DimBreakdown = ({
  layout,
  dims,
  prev,
  results,
}: DimBreakdownProps): JSX.Element => {
  if (layout === "radar") {
    return (
      <div className="flex items-center gap-5">
        <Radar scores={dims} prev={prev} />
        <div className="flex flex-1 flex-col gap-2">
          {DIMENSIONS.map((d) => (
            <DimMeter
              key={d.key}
              dim={d}
              score={dims[d.key as keyof Dimensions]}
              prev={prev ? prev[d.key as keyof Dimensions] : null}
            />
          ))}
        </div>
      </div>
    );
  }

  if (layout === "heatmap") return <Heatmap results={results} />;

  return (
    <div className="grid grid-cols-2 gap-x-7 gap-y-3">
      {DIMENSIONS.map((d) => (
        <DimMeter
          key={d.key}
          dim={d}
          score={dims[d.key as keyof Dimensions]}
          prev={prev ? prev[d.key as keyof Dimensions] : null}
        />
      ))}
    </div>
  );
};

// ─── Results Explorer ────────────────────────────────────────────────────────

export const ResultsExplorer = (): JSX.Element => {
  const [layout, setLayout] = useState<"meters" | "radar" | "heatmap">("radar");
  const R = RUN_DETAIL;
  // prevScore is always present in mock data; in production would need null check
  const delta = R.score - (R.prevScore ?? R.score);

  return (
    <div className="flex-1 overflow-y-auto bg-background-input">
      <div className="mx-auto max-w-[1320px] px-6 py-5 pb-12">
        {/* Run selector / header */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-elevation-surface px-3 py-2 transition-colors hover:border-border-input">
            <StatusBadge status={R.status === "passed" || R.status === "failed" ? R.status : "passed"} size="sm" />
            <div>
              <div className="font-primary-bold text-sm text-font">
                {R.label}
              </div>
              <div className="font-[FiraMono] text-2xs text-font-subtlest">
                {R.id} · {R.date}
              </div>
            </div>
            <span className="ml-1 flex text-font-subtle">
              <AceIcons.chevDown size={14} />
            </span>
          </div>
          <div className="flex-1" />
          <Btn variant="secondary" icon={<AceIcons.compare size={14} />}>
            Compare runs
          </Btn>
          <Btn variant="secondary" icon={<AceIcons.download size={14} />}>
            Export
          </Btn>
          <Btn variant="primary" icon={<AceIcons.refresh size={14} />}>
            Re-run suite
          </Btn>
        </div>

        {/* Summary band */}
        <div className="mb-4 grid grid-cols-[260px_1fr] gap-3.5">
          <Card pad={18}>
            <div className="flex flex-col items-center justify-center gap-2.5">
              <ScoreRing
                score={R.score}
                size={108}
                stroke={9}
                label="composite"
              />
              <div className="flex items-center gap-1.5">
                <span
                  className={cx(
                    "inline-flex items-center gap-0.5 font-primary-bold text-xs",
                    delta < 0 ? "text-font-danger" : "text-font-accent-green"
                  )}
                >
                  {delta < 0 ? (
                    <AceIcons.arrowDn size={13} />
                  ) : (
                    <AceIcons.arrowUp size={13} />
                  )}
                  {Math.abs(delta)} pts
                </span>
                <span className="text-xs text-font-subtlest">vs previous</span>
              </div>
              <div className="mt-0.5 flex gap-3.5">
                <div className="text-center">
                  <div className="font-primary-black text-lg leading-none text-font-accent-green">
                    {R.passed}
                  </div>
                  <div className="mt-0.5 text-2xs text-font-subtle">passed</div>
                </div>
                <div className="text-center">
                  <div className="font-primary-black text-lg leading-none text-font-danger">
                    {R.failed}
                  </div>
                  <div className="mt-0.5 text-2xs text-font-subtle">failed</div>
                </div>
                <div className="text-center">
                  <div className="font-primary-black text-lg leading-none text-font-subtle">
                    {R.total}
                  </div>
                  <div className="mt-0.5 text-2xs text-font-subtle">total</div>
                </div>
              </div>
            </div>
          </Card>

          <Card pad={18}>
            <div className="mb-3 flex items-center justify-between">
              <Eyebrow>Quality dimensions</Eyebrow>
              <div className="flex gap-1">
                <button
                  onClick={() => setLayout("meters")}
                  className={cx(
                    "rounded border-0 px-2 py-1 text-xs transition-colors",
                    layout === "meters"
                      ? "bg-background-brand-subtlest font-primary-bold text-link"
                      : "bg-transparent font-primary text-font-subtle hover:bg-background-subtlest"
                  )}
                >
                  Meters
                </button>
                <button
                  onClick={() => setLayout("radar")}
                  className={cx(
                    "rounded border-0 px-2 py-1 text-xs transition-colors",
                    layout === "radar"
                      ? "bg-background-brand-subtlest font-primary-bold text-link"
                      : "bg-transparent font-primary text-font-subtle hover:bg-background-subtlest"
                  )}
                >
                  Radar
                </button>
                <button
                  onClick={() => setLayout("heatmap")}
                  className={cx(
                    "rounded border-0 px-2 py-1 text-xs transition-colors",
                    layout === "heatmap"
                      ? "bg-background-brand-subtlest font-primary-bold text-link"
                      : "bg-transparent font-primary text-font-subtle hover:bg-background-subtlest"
                  )}
                >
                  Heatmap
                </button>
              </div>
            </div>
            <DimBreakdown
              layout={layout}
              dims={R.dims}
              prev={R.prevDims}
              results={R.results}
            />
          </Card>
        </div>

        {/* Scenarios table */}
        <Card pad={0}>
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Eyebrow>
                <AceIcons.layers size={12} />
                Scenario results ({R.results.length})
              </Eyebrow>
            </div>
          </div>

          {R.results.map((result) => (
            <div
              key={result.id}
              className="border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-background-input"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cx(
                      "flex",
                      result.verdict === "passed"
                        ? "text-font-accent-green"
                        : "text-font-danger"
                    )}
                  >
                    {result.verdict === "passed" ? (
                      <AceIcons.checkCirc size={16} />
                    ) : (
                      <AceIcons.xCirc size={16} />
                    )}
                  </span>
                  <div>
                    <span className="font-primary-bold text-sm text-font">
                      {result.name}
                    </span>
                    <span className="ml-2 font-primary text-xs text-font-subtlest">
                      {result.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <AceIcons.clock size={13} className="text-font-subtle" />
                    <span className="text-xs text-font-subtle">
                      {result.latency}s
                    </span>
                  </div>
                  <ScoreRing score={result.score} size={36} stroke={3.5} />
                </div>
              </div>
              <div className="text-xs leading-relaxed text-font-subtle">
                {result.reason}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
