import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Issue } from "@domain/issue";

interface WorkflowChartProps {
  issues: Issue[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

/** Status colors for workflow visualization: blue for TODO, amber for IN_PROGRESS, green for DONE */
const STATUS_COLORS = {
  TODO: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  DONE: "#10b981",
} as const;

/** Status labels for user-friendly display */
const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
} as const;

export const WorkflowChart = ({ issues }: WorkflowChartProps): JSX.Element => {
  const todoCount = issues.filter((i) => i.categoryType === "TODO")
    .length;
  const inProgressCount = issues.filter(
    (i) => i.categoryType === "IN_PROGRESS"
  ).length;
  const doneCount = issues.filter((i) => i.categoryType === "DONE")
    .length;

  const data: ChartData[] = [
    {
      name: STATUS_LABELS.TODO,
      value: todoCount,
      color: STATUS_COLORS.TODO,
    },
    {
      name: STATUS_LABELS.IN_PROGRESS,
      value: inProgressCount,
      color: STATUS_COLORS.IN_PROGRESS,
    },
    {
      name: STATUS_LABELS.DONE,
      value: doneCount,
      color: STATUS_COLORS.DONE,
    },
  ];

  const total = todoCount + inProgressCount + doneCount;

  return (
    <div
      aria-label="Workflow Progress: status distribution pie chart"
      className="w-full"
    >
      {total === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-font-subtle">
          No issues yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({
                name,
                value,
                percent,
              }) =>
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} issues`, "Count"]}
              contentStyle={{
                backgroundColor: "var(--color-elevation-surface-overlay)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.375rem",
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "1rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
