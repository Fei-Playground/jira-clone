export const Sparkline = ({ values, width = 60, height = 24 }: SparklineProps): JSX.Element => {
  if (values.length < 2) {
    return <span className="text-2xs text-font-subtlest">—</span>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isUp = values[values.length - 1] >= values[0];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        strokeWidth={1.5}
        className={isUp ? "stroke-icon-accent-green" : "stroke-icon-accent-red"}
      />
    </svg>
  );
};

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
}
