import cx from "classix";

export const MetricCell = ({ value, kind }: MetricCellProps): JSX.Element => {
  if (Number.isNaN(value)) {
    return <span className="text-2xs text-font-subtlest">—</span>;
  }

  const colorClass = (() => {
    if (kind === "rs") {
      if (value >= 80) return "text-font-accent-green";
      if (value < 40) return "text-font-danger";
      return "text-font-subtle";
    }
    if (kind === "rsi") {
      if (value > 80 || value < 30) return "text-font-danger";
      return "text-font-subtle";
    }
    if (kind === "volumeRatio") {
      return value >= 2 ? "text-font-accent-green" : "text-font-subtle";
    }
    return "text-font-subtle";
  })();

  const label = kind === "volumeRatio" ? `${value.toFixed(1)}x` : value.toFixed(0);

  return <span className={cx("text-xs tabular-nums", colorClass)}>{label}</span>;
};

interface MetricCellProps {
  value: number;
  kind: "rs" | "rsi" | "adx" | "volumeRatio";
}
