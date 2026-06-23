import type { Meta, StoryObj } from "@storybook/react-vite";
import { AceBenchView } from "./ace-bench.view";

/**
 * The ACE Bench Playground — top-level view with header, tab navigation
 * and tab content. The component renders the real `ScenarioLibrary` and
 * `ResultsExplorer` panels driven by the `@domain/ace-bench` mock data
 * (SCENARIOS, SUITES, OWNERS, RUN_DETAIL). No app providers or router
 * context are required: the view and its children rely only on local
 * `useState`.
 */
const meta: Meta<typeof AceBenchView> = {
  title: "Pages/AceBench/AceBenchView",
  component: AceBenchView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AceBenchView>;

/**
 * Default landing view of the Playground — the Scenario Library tab,
 * showing the stat tiles, frequently-used scenarios, filter toolbar and
 * the grouped scenarios table.
 */
export const ScenarioLibrary: Story = {};

/**
 * The Results Explorer tab — composite score ring, quality-dimension
 * radar/meters/heatmap and the per-scenario results list. The story
 * activates the "Results" tab on mount.
 */
export const ResultsExplorer: Story = {
  play: async ({ canvasElement }) => {
    const resultsTab = Array.from(
      canvasElement.querySelectorAll("button")
    ).find((b) => b.textContent?.trim() === "Results Explorer");
    resultsTab?.click();
  },
};

/**
 * The Executions tab — live execution monitor with stat tiles, an
 * attention banner, the active-now panel and the recent-executions table,
 * all driven by the `EXECUTIONS` mock data. The story activates the
 * "Executions" tab on mount.
 */
export const ExecutionsCenter: Story = {
  play: async ({ canvasElement }) => {
    const executionsTab = Array.from(
      canvasElement.querySelectorAll("button")
    ).find((b) => b.textContent?.trim() === "Executions");
    executionsTab?.click();
  },
};

/**
 * The History tab — KPI tiles, the performance-over-time line chart,
 * per-suite mini trends and the run-history table, driven by the
 * `HISTORY` and `TRENDS` mock data. The story activates the "History"
 * tab on mount.
 */
export const HistoricalRuns: Story = {
  play: async ({ canvasElement }) => {
    const historyTab = Array.from(
      canvasElement.querySelectorAll("button")
    ).find((b) => b.textContent?.trim() === "History");
    historyTab?.click();
  },
};
