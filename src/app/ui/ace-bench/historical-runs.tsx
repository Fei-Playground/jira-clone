import { useState, useMemo } from "react";
import cx from "classix";
import { HISTORY, TRENDS } from "@domain/ace-bench";
import {
  Card,
  Badge,
  ProgressBar,
  Btn,
  FilterChip,
  Menu,
  IconBtn,
  Segmented,
  Sparkline,
} from "@app/components/ace-primitives";
import { AceIcons } from "@app/components/ace-icons";

// ─── KPI Tile ────────────────────────────────────────────────────────────────

interface KpiTileProps {
  label: string;
  value: string;
  unit?: string;
  trend: number[];
  color: string;
  invert?: boolean;
}

const KpiTile = ({
  label,
  value,
  unit,
  trend,
  color,
  invert,
}: KpiTileProps): JSX.Element => {
  const first = trend[0];
  const last = trend[trend.length - 1];
  const up = last >= first;
  const good = invert ? !up : up;
  const pct =
    first !== 0 ? Math.abs(((last - first) / first) * 100).toFixed(1) : "0";

  return (
    <Card pad={16} style={{ flex: 1, minWidth: 0 }}>
      <div className="mb-2 font-primary-bold text-xs text-font-subtle">
        {label}
      </div>
      <div className="flex items-end justify-between gap-2.5">
        <div>
          <div className="flex items-baseline gap-1">
            <span
              className="font-primary-black text-2xl leading-none tracking-tight text-font"
              style={{ fontFamily: "CircularStdBlack, sans-serif" }}
            >
              {value}
            </span>
            {unit && <span className="text-sm text-font-subtle">{unit}</span>}
          </div>
          <div
            className={cx(
              "mt-1 inline-flex items-center gap-1 font-primary-bold text-2xs",
              good ? "text-font-accent-green" : "text-font-danger"
            )}
          >
            {up ? (
              <AceIcons.arrowUp size={12} />
            ) : (
              <AceIcons.arrowDn size={12} />
            )}
            {pct}%
            <span className="ml-0.5 font-primary text-font-subtle">7d</span>
          </div>
        </div>
        <Sparkline
          data={trend.map((v) => (v / Math.max(...trend)) * 100)}
          w={80}
          h={34}
          color={color}
        />
      </div>
    </Card>
  );
};

// ─── Line Chart ──────────────────────────────────────────────────────────────

interface LineChartSeries {
  data: number[];
  color: string;
}

interface LineChartProps {
  series: LineChartSeries[];
  days: string[];
  yMax?: number;
}

const LineChart = ({
  series,
  days,
  yMax = 100,
}: LineChartProps): JSX.Element => {
  const w = 760;
  const h = 200;
  const padL = 34;
  const padB = 24;
  const padT = 12;
  const padR = 12;
  const iw = w - padL - padR;
  const ih = h - padT - padB;

  const x = (i: number) => padL + (i / (days.length - 1)) * iw;
  const y = (v: number) => padT + ih - (v / yMax) * ih;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(yMax * f));

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="block">
      {/* Grid lines and Y-axis labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL}
            y1={y(t)}
            x2={w - padR}
            y2={y(t)}
            stroke="var(--Neutral300)"
            strokeWidth="1"
          />
          <text
            x={padL - 6}
            y={y(t) + 3}
            fontSize="9.5"
            fill="var(--Neutral700)"
            textAnchor="end"
            fontFamily="CircularStdMedium, sans-serif"
          >
            {t}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {days.map((d, i) => (
        <text
          key={i}
          x={x(i)}
          y={h - 7}
          fontSize="9.5"
          fill="var(--Neutral700)"
          textAnchor="middle"
          fontFamily="CircularStdMedium, sans-serif"
        >
          {d.replace("May ", "").replace("Jun ", "")}
        </text>
      ))}

      {/* Series lines */}
      {series.map((s, si) => {
        const path = s.data
          .map(
            (v, i) =>
              `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`
          )
          .join(" ");
        return (
          <g key={si}>
            <path
              d={path}
              fill="none"
              stroke={s.color}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {s.data.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r="2.6"
                fill="var(--Neutral50)"
                stroke={s.color}
                strokeWidth="1.8"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// ─── Suite Trend Mini Tile ───────────────────────────────────────────────────

interface SuiteTrendProps {
  name: string;
  data: number[];
  color: string;
}

const SuiteTrend = ({ name, data, color }: SuiteTrendProps): JSX.Element => {
  const lastScore = data[data.length - 1];

  return (
    <Card pad={14}>
      <div className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-primary-bold text-xs text-font">
        {name}
      </div>
      <div className="flex items-end justify-between">
        <span
          className="font-primary-black text-xl leading-none text-font"
          style={{ fontFamily: "CircularStdBlack, sans-serif" }}
        >
          {lastScore}
        </span>
        <Sparkline data={data} w={70} h={28} color={color} showDots />
      </div>
    </Card>
  );
};

// ─── Historical Runs ─────────────────────────────────────────────────────────

export const HistoricalRuns = (): JSX.Element => {
  const [metric, setMetric] = useState("score");
  const [fSuite, setFSuite] = useState("All");

  const metricSeries = useMemo(
    () => ({
      score: [{ data: TRENDS.score, color: "var(--Blue700)" }],
      passRate: [{ data: TRENDS.passRate, color: "var(--Green700)" }],
      latency: [
        { data: TRENDS.latency.map((v) => v * 30), color: "var(--Magenta700)" },
      ],
    }),
    []
  );

  const rows = useMemo(
    () => HISTORY.filter((r) => fSuite === "All" || r.suite === fSuite),
    [fSuite]
  );

  const suites = useMemo(() => {
    const uniqueSuites = Array.from(new Set(HISTORY.map((h) => h.suite)));
    return uniqueSuites;
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background-input">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-5 pb-12">
        {/* KPI tiles */}
        <div className="mb-4 flex gap-3">
          <KpiTile
            label="Avg composite score"
            value="82"
            trend={TRENDS.score}
            color="var(--Blue700)"
          />
          <KpiTile
            label="Pass rate"
            value="81"
            unit="%"
            trend={TRENDS.passRate}
            color="var(--Green700)"
          />
          <KpiTile
            label="Avg latency"
            value="2.2"
            unit="s"
            trend={TRENDS.latency.map((v) => v * 10)}
            color="var(--Magenta700)"
            invert
          />
          <KpiTile
            label="Eval cost / run"
            value="$0.41"
            trend={TRENDS.cost.map((v) => v * 100)}
            color="var(--Orange700)"
            invert
          />
        </div>

        {/* Trend chart */}
        <Card pad={18} style={{ marginBottom: 16 }}>
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <div className="font-primary-bold text-sm text-font">
                Performance over time
              </div>
              <div className="mt-0.5 text-2xs text-font-subtle">
                Last 8 scheduled runs · all suites
              </div>
            </div>
            <Segmented
              value={metric}
              onChange={setMetric}
              size="sm"
              options={[
                { value: "score", label: "Score" },
                { value: "passRate", label: "Pass rate" },
                { value: "latency", label: "Latency" },
              ]}
            />
          </div>
          <LineChart
            series={metricSeries[metric as keyof typeof metricSeries]}
            days={TRENDS.days}
            yMax={metric === "latency" ? 100 : 100}
          />
          {/* Annotation - hardcoded for Storybook; in production would detect from actual data */}
          <div className="mt-2.5 flex items-center gap-2 rounded-md border border-border bg-background-danger px-3 py-2">
            <span className="flex shrink-0 text-font-danger">
              <AceIcons.alert size={14} />
            </span>
            <span className="flex-1 text-xs text-font-danger">
              Security &amp; IAM regressed 7 pts on Jun 5 — a model update
              changed tool-selection behavior.
            </span>
            <button className="cursor-pointer border-none bg-transparent font-primary-bold text-xs text-font-danger">
              Compare runs →
            </button>
          </div>
        </Card>

        {/* Per-suite mini trends */}
        <div className="mb-4 grid grid-cols-4 gap-3">
          <SuiteTrend
            name="Cost optimization"
            data={[84, 85, 84, 85, 84, 85, 87, 87]}
            color="var(--Green700)"
          />
          <SuiteTrend
            name="Security & IAM"
            data={[80, 80, 78, 80, 79, 80, 78, 71]}
            color="var(--Red700)"
          />
          <SuiteTrend
            name="Operational"
            data={[76, 77, 78, 77, 78, 79, 78, 79]}
            color="var(--Orange700)"
          />
          <SuiteTrend
            name="Safety"
            data={[92, 93, 94, 94, 95, 95, 94, 90]}
            color="var(--Blue700)"
          />
        </div>

        {/* Run history */}
        <Card pad={0}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-primary-bold text-sm text-font">
              Run history
            </span>
            <div className="flex gap-2">
              <FilterChip
                label="Suite"
                value={fSuite}
                options={["All", ...suites]}
                onChange={setFSuite}
              />
              <FilterChip
                label="Range"
                value="Last 7 days"
                options={["Last 7 days", "Last 30 days", "Last quarter"]}
                onChange={() => {}}
              />
              <Btn
                variant="secondary"
                size="sm"
                icon={<AceIcons.download size={13} />}
              >
                Export
              </Btn>
            </div>
          </div>

          {/* Table header */}
          <div
            className={cx(
              "grid gap-3 border-b border-border bg-background-subtlest px-4 py-2.5",
              "grid-cols-[150px_1fr_90px_100px_90px_80px_80px_40px]"
            )}
          >
            {[
              "Run",
              "Suite",
              "Score",
              "Pass rate",
              "Duration",
              "Latency",
              "Cost",
              "",
            ].map((h, i) => (
              <div
                key={i}
                className="font-primary-bold text-2xs text-font-subtle"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((r, i) => (
            <div
              key={r.id + i}
              className={cx(
                "grid cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-background-input",
                "grid-cols-[150px_1fr_90px_100px_90px_80px_80px_40px]",
                i < rows.length - 1 && "border-b border-border"
              )}
            >
              {/* Run ID and date */}
              <div className="min-w-0">
                <div
                  className="whitespace-nowrap font-primary-bold text-xs text-font"
                  style={{ fontFamily: "monospace" }}
                >
                  {r.id}
                </div>
                <div className="text-2xs text-font-subtlest">{r.date}</div>
              </div>

              {/* Suite name */}
              <div className="flex min-w-0 items-center gap-2">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-font">
                  {r.suite}
                </span>
                {r.regressed && <Badge variant="danger">↓ regressed</Badge>}
              </div>

              {/* Score */}
              <div className="flex items-center gap-2">
                <span
                  className={cx(
                    "font-primary-bold text-sm",
                    r.score >= 85
                      ? "text-font-accent-green"
                      : r.score >= 75
                        ? "text-font-warning"
                        : "text-font-danger"
                  )}
                  style={{ fontFamily: "CircularStdBold, sans-serif" }}
                >
                  {r.score}
                </span>
              </div>

              {/* Pass rate */}
              <div className="flex items-center gap-2">
                <div className="w-9">
                  <ProgressBar
                    value={(r.passed / r.total) * 100}
                    color={
                      r.passed === r.total
                        ? "var(--Green700)"
                        : "var(--Orange700)"
                    }
                    height={5}
                  />
                </div>
                <span className="text-2xs text-font">
                  {r.passed}/{r.total}
                </span>
              </div>

              {/* Duration */}
              <div
                className="text-xs text-font"
                style={{ fontFamily: "monospace" }}
              >
                {r.dur}
              </div>

              {/* Latency */}
              <div
                className="text-xs text-font"
                style={{ fontFamily: "monospace" }}
              >
                {r.latency}s
              </div>

              {/* Cost */}
              <div
                className="text-xs text-font"
                style={{ fontFamily: "monospace" }}
              >
                ${r.cost.toFixed(2)}
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <Menu
                  align="right"
                  trigger={
                    <span>
                      <IconBtn icon={<AceIcons.more size={16} />} />
                    </span>
                  }
                  items={[
                    {
                      label: "View results",
                      icon: <AceIcons.results size={14} />,
                    },
                    {
                      label: "Compare with…",
                      icon: <AceIcons.compare size={14} />,
                    },
                    {
                      label: "Re-run",
                      icon: <AceIcons.refresh size={14} />,
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
