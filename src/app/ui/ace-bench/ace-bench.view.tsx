import { useState } from "react";
import { ScenarioLibrary } from "./scenarios-library";
import { ResultsExplorer } from "./results-explorer";
import { ExecutionsCenter } from "./executions-center";
import { HistoricalRuns } from "./historical-runs";


export const AceBenchView = (): JSX.Element => {
  // Tab state - controls which panel is displayed below
  const [activeTab, setActiveTab] = useState<
    "scenarios" | "executions" | "results" | "history"
  >("scenarios");

  return (
    <div className="flex h-full flex-col bg-background-input">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-4">
          <h1 className="font-primary-bold text-lg text-font">
            ACE Bench Playground
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-primary text-sm text-font-subtle">
            Toolbox: CloudOps
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border bg-elevation-surface px-6">
        <button
          onClick={() => setActiveTab("scenarios")}
          className={`px-4 py-3 font-primary-bold text-sm transition-colors ${
            activeTab === "scenarios"
              ? "border-b-2 border-link text-link"
              : "text-font-subtle hover:text-font"
          }`}
        >
          Scenario Library
        </button>
        <button
          onClick={() => setActiveTab("executions")}
          className={`px-4 py-3 font-primary-bold text-sm transition-colors ${
            activeTab === "executions"
              ? "border-b-2 border-link text-link"
              : "text-font-subtle hover:text-font"
          }`}
        >
          Executions
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-3 font-primary-bold text-sm transition-colors ${
            activeTab === "results"
              ? "border-b-2 border-link text-link"
              : "text-font-subtle hover:text-font"
          }`}
        >
          Results Explorer
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-3 font-primary-bold text-sm transition-colors ${
            activeTab === "history"
              ? "border-b-2 border-link text-link"
              : "text-font-subtle hover:text-font"
          }`}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "scenarios" && <ScenarioLibrary />}
        {activeTab === "executions" && <ExecutionsCenter />}
        {activeTab === "results" && <ResultsExplorer />}
        {activeTab === "history" && <HistoricalRuns />}
      </div>
    </div>
  );
};
