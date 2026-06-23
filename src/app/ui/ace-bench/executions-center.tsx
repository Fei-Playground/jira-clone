import { useMemo } from "react";
import cx from "classix";
import { EXECUTIONS, type Execution } from "@domain/ace-bench";
import {
  Card,
  StatusBadge,
  ProgressBar,
  Badge,
  Btn,
  FilterChip,
  Menu,
  IconBtn,
} from "@app/components/ace-primitives";
import { AceIcons } from "@app/components/ace-icons";

// ─── Stat Tile ───────────────────────────────────────────────────────────────

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: string;
  pulse?: boolean;
}

const StatTile = ({
  icon,
  label,
  value,
  accent,
  pulse,
}: StatTileProps): JSX.Element => {
  return (
    <Card pad={14} style={{ flex: 1, minWidth: 0 }}>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex" style={accent ? { color: accent } : undefined}>
          {icon}
        </span>
        <span className="font-primary-bold text-xs text-font-subtle">
          {label}
        </span>
        {pulse && (
          <span
            className="ml-auto h-2 w-2 animate-pulse rounded-full"
            style={accent ? { background: accent } : undefined}
          />
        )}
      </div>
      <span
        className="font-primary-black text-2xl leading-none tracking-tight text-font"
        style={{ fontFamily: "CircularStdBlack, sans-serif" }}
      >
        {value}
      </span>
    </Card>
  );
};

// ─── Execution Row ───────────────────────────────────────────────────────────

interface ExecutionRowProps {
  execution: Execution;
}

const ExecutionRow = ({ execution }: ExecutionRowProps): JSX.Element => {
  const isActive =
    execution.status === "running" || execution.status === "queued";

  return (
    <div
      className={cx(
        "grid cursor-pointer items-center gap-3 border-b border-border px-4 py-2.5 transition-colors hover:bg-background-input",
        "grid-cols-[1fr_150px_150px_120px_96px_40px]"
      )}
    >
      {/* Execution label and details */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="flex shrink-0"
            style={{
              color:
                execution.kind === "single"
                  ? "var(--Magenta700)"
                  : "var(--Blue700)",
            }}
          >
            <AceIcons.layers size={15} />
          </span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-primary-bold text-sm text-font">
            {execution.label}
          </span>
          {execution.attention && (
            <Badge variant="danger">Needs attention</Badge>
          )}
        </div>
        <div
          className="mt-0.5 text-2xs text-font-subtlest"
          style={{ fontFamily: "monospace" }}
        >
          {execution.id} · {execution.scenarios} scenario
          {execution.scenarios > 1 ? "s" : ""} · {execution.model}
        </div>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={execution.status} size="sm" />
      </div>

      {/* Progress/Outcome */}
      <div>
        {execution.status === "running" && execution.progress != null ? (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ProgressBar value={execution.progress} color="var(--Blue700)" />
            </div>
            <span
              className="font-primary-bold text-xs text-link"
              style={{ fontFamily: "CircularStdBold, sans-serif" }}
            >
              {execution.progress}%
            </span>
          </div>
        ) : execution.status === "queued" ? (
          <span className="text-xs text-font-subtle">Waiting…</span>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-primary-bold text-font-accent-green">
              {execution.passed}✓
            </span>
            {execution.failed > 0 && (
              <span className="font-primary-bold text-font-danger">
                {execution.failed}✕
              </span>
            )}
          </div>
        )}
      </div>

      {/* Started */}
      <div className="text-xs text-font">{execution.started}</div>

      {/* Duration */}
      <div
        className="text-xs text-font-subtle"
        style={{ fontFamily: "monospace" }}
      >
        {execution.dur}
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
          items={
            isActive
              ? [
                  {
                    label: "Open monitor",
                    icon: <AceIcons.pulse size={14} />,
                  },
                  {
                    label: "Cancel run",
                    icon: <AceIcons.x size={14} />,
                    danger: true,
                  },
                ]
              : [
                  {
                    label: "View results",
                    icon: <AceIcons.results size={14} />,
                  },
                  {
                    label: "Re-run",
                    icon: <AceIcons.refresh size={14} />,
                  },
                  {
                    label: "Compare with…",
                    icon: <AceIcons.compare size={14} />,
                  },
                ]
          }
        />
      </div>
    </div>
  );
};

// ─── Executions Center ───────────────────────────────────────────────────────

export const ExecutionsCenter = (): JSX.Element => {
  // Derived execution lists
  const running = useMemo(
    () => EXECUTIONS.filter((e) => e.status === "running"),
    []
  );
  const queued = useMemo(
    () => EXECUTIONS.filter((e) => e.status === "queued"),
    []
  );
  const attention = useMemo(() => EXECUTIONS.filter((e) => e.attention), []);
  const active = useMemo(() => [...running, ...queued], [running, queued]);
  const recent = useMemo(
    () =>
      EXECUTIONS.filter((e) => e.status === "passed" || e.status === "failed"),
    []
  );

  const queuedScenarios = useMemo(
    () => queued.reduce((sum, e) => sum + e.scenarios, 0),
    [queued]
  );

  // Hardcoded stat (from mock data)
  const PASSED_TODAY_COUNT = 28;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background-input">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-5 pb-12">
        {/* Stats */}
        <div className="mb-4 flex gap-3">
          <StatTile
            icon={<AceIcons.pulse size={16} />}
            label="Running"
            value={running.length}
            accent="var(--Blue700)"
            pulse
          />
          <StatTile
            icon={<AceIcons.clock size={16} />}
            label="Queued"
            value={queuedScenarios}
            accent="var(--Orange700)"
          />
          <StatTile
            icon={<AceIcons.checkCirc size={16} />}
            label="Passed today"
            value={PASSED_TODAY_COUNT}
            accent="var(--Green700)"
          />
          <StatTile
            icon={<AceIcons.alert size={16} />}
            label="Need attention"
            value={attention.length}
            accent="var(--Red700)"
          />
        </div>

        {/* Attention banner */}
        {attention.length > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-background-danger px-4 py-3">
            <span className="flex shrink-0 text-font-danger">
              <AceIcons.alert size={18} />
            </span>
            <div className="flex-1">
              <div className="font-primary-bold text-sm text-font-danger">
                {attention.length} run{attention.length > 1 ? "s" : ""} need
                your attention
              </div>
              {/* Hardcoded message from mock data — in production, would derive from actual failure details */}
              <div className="mt-0.5 text-xs text-font-danger">
                Failures in Security &amp; IAM and Safety guardrails since the
                last nightly run.
              </div>
            </div>
            <Btn variant="danger" size="sm">
              Review failures
            </Btn>
          </div>
        )}

        {/* Active now */}
        {active.length > 0 && (
          <Card pad={0} style={{ marginBottom: 16 }}>
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-link" />
              <span className="font-primary-bold text-sm text-font">
                Active now
              </span>
              <span className="flex-1" />
              <span className="flex items-center gap-1.5 text-2xs text-font-subtle">
                <AceIcons.refresh size={12} /> Auto-refreshing
              </span>
            </div>
            {active.map((e) => (
              <ExecutionRow key={e.id} execution={e} />
            ))}
          </Card>
        )}

        {/* Recent executions */}
        <Card pad={0}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-primary-bold text-sm text-font">
              Recent executions
            </span>
            <div className="flex gap-2">
              <FilterChip
                label="Status"
                value="All"
                options={["All", "Passed", "Failed"]}
                onChange={() => {}}
              />
              <FilterChip
                label="Trigger"
                value="All"
                options={["All", "Manual", "Schedule"]}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* Table header */}
          <div
            className={cx(
              "grid gap-3 border-b border-border bg-background-subtlest px-4 py-2.5",
              "grid-cols-[1fr_150px_150px_120px_96px_40px]"
            )}
          >
            {["Execution", "Status", "Outcome", "Started", "Duration", ""].map(
              (h, i) => (
                <div
                  key={i}
                  className="font-primary-bold text-2xs text-font-subtle"
                >
                  {h}
                </div>
              )
            )}
          </div>

          {/* Rows */}
          {recent.map((e) => (
            <ExecutionRow key={e.id} execution={e} />
          ))}
        </Card>
      </div>
    </div>
  );
};
