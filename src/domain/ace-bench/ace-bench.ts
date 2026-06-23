// ACE Bench domain types — scenarios, executions, results

export type ScenarioId = string;
export type ExecutionId = string;
export type SuiteId = string;

export type ScenarioStatus = "passing" | "failing" | "running" | "ready" | "draft" | "archived";
export type ExecutionStatus = "running" | "queued" | "passed" | "failed" | "canceled" | "error" | "partial";

export interface Suite {
  id: SuiteId;
  name: string;
  count: number;
}

export interface DimensionScores {
  accuracy: number;
  tooluse: number;
  completeness: number;
  safety: number;
  coherence: number;
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  suite: SuiteId;
  status: ScenarioStatus;
  score: number | null;
  lastRun: string;
  owner: string;
  tags: string[];
  runs: number;
  trend: number[];
  dims: DimensionScores | null;
  starred?: boolean;
  model: string;
  toolbox: string;
  desc: string;
}

export interface Execution {
  id: ExecutionId;
  label: string;
  kind: "suite" | "single";
  scenarios: number;
  scenariosLabel?: string;
  status: ExecutionStatus;
  progress?: number;
  passed: number;
  failed: number;
  pending: number;
  started: string;
  by: string;
  dur: string;
  model: string;
  trigger: "schedule" | "manual";
  attention?: boolean;
  score?: number;
}

export interface HistoricalRun {
  id: ExecutionId;
  suite: string;
  date: string;
  score: number;
  passed: number;
  total: number;
  dur: string;
  model: string;
  latency: number;
  cost: number;
  by: string;
  regressed?: boolean;
}

export interface ScenarioResult {
  id: ScenarioId;
  name: string;
  verdict: "passed" | "failed" | "partial";
  score: number;
  dims: DimensionScores;
  latency: number;
  reason: string;
}

export interface RunDetail {
  id: ExecutionId;
  label: string;
  suite: string;
  status: ExecutionStatus;
  date: string;
  score: number;
  prevScore?: number;
  model: string;
  toolbox: string;
  passed: number;
  failed: number;
  total: number;
  latency: number;
  cost: number;
  dims: DimensionScores;
  prevDims?: DimensionScores;
  results: ScenarioResult[];
}

export interface Dimension {
  key: keyof DimensionScores;
  label: string;
  short: string;
  ck: string;
}

export interface TrendData {
  passRate: number[];
  score: number[];
  latency: number[];
  cost: number[];
  days: string[];
}

export interface Evaluator {
  dim: keyof DimensionScores;
  label: string;
  score: number;
  verdict: "passed" | "failed" | "partial";
  note: string;
}

export interface ExpectedOutcome {
  label: string;
  met: boolean;
  note?: string;
}

export interface TraceStep {
  step: number;
  type: "tool" | "reason";
  name: string;
  status: "ok" | "warn" | "missing";
  dur: string;
  detail: string;
}

export interface ScenarioDrillResult {
  id: ScenarioId;
  name: string;
  verdict: "passed" | "failed" | "partial";
  score: number;
  prevScore?: number;
  input: string;
  dims: DimensionScores;
  evaluators: Evaluator[];
  expected: ExpectedOutcome[];
  trace: TraceStep[];
  output: string;
}

export interface ComparisonData {
  a: {
    id: ExecutionId;
    label: string;
    score: number;
    model: string;
    dims: DimensionScores;
    passed: number;
    total: number;
    latency: number;
    cost: number;
  };
  b: {
    id: ExecutionId;
    label: string;
    score: number;
    model: string;
    dims: DimensionScores;
    passed: number;
    total: number;
    latency: number;
    cost: number;
  };
  scenarios: Array<{
    id: ScenarioId;
    name: string;
    a: number;
    b: number;
    change: "improved" | "regressed" | "same";
  }>;
}
