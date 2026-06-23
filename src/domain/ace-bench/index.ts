// Re-export types from ace-bench
export type {
  ScenarioId,
  ExecutionId,
  SuiteId,
  ScenarioStatus,
  ExecutionStatus,
  Suite,
  DimensionScores,
  Scenario,
  Execution,
  HistoricalRun,
  ScenarioResult,
  RunDetail,
  Dimension,
  TrendData,
  Evaluator,
  ExpectedOutcome,
  TraceStep,
  ScenarioDrillResult,
  ComparisonData,
} from "./ace-bench";

// Re-export mock data from ace-bench.mock
export type {
  Dimensions,
} from "./ace-bench.mock";

export {
  SUITES,
  OWNERS,
  SCENARIOS,
  EXECUTIONS,
  HISTORY,
  TRENDS,
  RUN_DETAIL,
} from "./ace-bench.mock";
