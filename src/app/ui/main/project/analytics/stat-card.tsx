import { ReactNode } from "react";
import cx from "classix";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: "blue" | "green" | "yellow" | "red";
  trend?: number;
}

const colorClasses: Record<string, string> = {
  blue: "bg-background-brand-subtlest text-font-brand",
  green: "bg-background-success-subtlest text-font-success",
  yellow: "bg-background-warning-subtlest text-font-warning",
  red: "bg-background-danger-subtlest text-font-danger",
};

export const StatCard = ({
  label,
  value,
  icon,
  color = "blue",
  trend,
  className,
  ...rest
}: StatCardProps): JSX.Element => {
  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <article
      className={cx(
        "flex flex-col items-start rounded-lg border border-border bg-elevation-surface-raised p-6",
        className
      )}
      {...rest}
    >
      {/* Icon */}
      <div className={cx("mb-4 flex items-center justify-center rounded-lg p-3", colorClass)}>
        <div className="h-6 w-6 opacity-70">{icon}</div>
      </div>

      {/* Value with optional trend */}
      <div className="mb-2 flex items-baseline gap-2">
        <div className="font-primary-black text-3xl text-font">{value}</div>
        {typeof trend === "number" && (
          <div
            className={cx("text-sm font-primary", trend >= 0 ? "text-font-success" : "text-font-danger")}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-sm text-font-subtle">{label}</div>
    </article>
  );
};
