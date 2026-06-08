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

export const WorkflowChart = ({ issues }: WorkflowChartProps): JSX.Element => {
  const todoCount = issues.filter((i) => i.categoryType === "TODO").length;
  const inProgressCount = issues.filter((i) => i.categoryType === "IN_PROGRESS").length;
  const doneCount = issues.filter((i) => i.categoryType === "DONE").length;

  const data: ChartData[] = [
    { name: "To Do", value: todoCount, color: "#3b82f6" },
    {
      name: "In Progress",
      value: inProgressCount,
      color: "#f59e0b",
    },
    { name: "Done", value: doneCount, color: "#10b981" },
  ];

  const total = todoCount + inProgressCount + doneCount;

  return (
    <div aria-label="Workflow Progress: status distribution pie chart" className="w-full">
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
              label={({ name, value, percent }) =>
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
