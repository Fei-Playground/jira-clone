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
import { User } from "@domain/user";

interface WorkloadChartProps {
  issues: Issue[];
  users: User[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  userId: string;
}

export const WorkloadChart = ({ issues, users }: WorkloadChartProps): JSX.Element => {
  // Group issues by assignee
  const workloadMap = new Map<string, number>();
  issues.forEach((issue) => {
    const count = workloadMap.get(issue.asignee.id) || 0;
    workloadMap.set(issue.asignee.id, count + 1);
  });

  // Filter to users with assigned issues and build chart data
  const data: ChartData[] = users
    .filter((user) => workloadMap.has(user.id))
    .map((user) => ({
      name: user.name,
      value: workloadMap.get(user.id) || 0,
      color: user.color || "#3b82f6",
      userId: user.id,
    }));

  if (data.length === 0) {
    return (
      <div
        aria-label="No team members with assigned issues"
        className="flex h-48 items-center justify-center text-sm text-font-subtle"
      >
        No issues assigned yet
      </div>
    );
  }

  return (
    <div aria-label="Workload by Team Member: vertical bar chart" className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-font-subtle)" />
          <YAxis stroke="var(--color-font-subtle)" />
          <Tooltip
            formatter={(value) => [`${value} issues`, "Assigned"]}
            contentStyle={{
              backgroundColor: "var(--color-elevation-surface-overlay)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.375rem",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="value" position="top" fill="#000" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
