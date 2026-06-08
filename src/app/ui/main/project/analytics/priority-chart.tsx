import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Issue } from "@domain/issue";

interface PriorityChartProps {
  issues: Issue[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

/** Priority colors for visualization: red for High, amber for Medium, green for Low */
const PRIORITY_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
} as const;

/** Priority labels for user-friendly display */
const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export const PriorityChart = ({ issues }: PriorityChartProps): JSX.Element => {
  const highCount = issues.filter((i) => i.priority.id === "high")
    .length;
  const mediumCount = issues.filter((i) => i.priority.id === "medium")
    .length;
  const lowCount = issues.filter((i) => i.priority.id === "low").length;

  const data: ChartData[] = [
    {
      name: PRIORITY_LABELS.high,
      value: highCount,
      color: PRIORITY_COLORS.high,
    },
    {
      name: PRIORITY_LABELS.medium,
      value: mediumCount,
      color: PRIORITY_COLORS.medium,
    },
    {
      name: PRIORITY_LABELS.low,
      value: lowCount,
      color: PRIORITY_COLORS.low,
    },
  ];

  const total = highCount + mediumCount + lowCount;

  return (
    <div
      aria-label="Priority Distribution: horizontal bar chart"
      className="w-full"
    >
      {total === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-font-subtle">
          No issues yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              type="number"
              stroke="var(--color-font-subtle)"
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="var(--color-font-subtle)"
            />
            <Tooltip
              formatter={(value) => [`${value} issues`, "Count"]}
              contentStyle={{
                backgroundColor: "var(--color-elevation-surface-overlay)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.375rem",
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="right" fill="#000" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
