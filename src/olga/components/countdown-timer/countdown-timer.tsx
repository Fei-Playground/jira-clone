import cx from "classix";

const formatTime = (seconds: number): string => {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const CountdownTimer = ({
  secondsRemaining,
}: CountdownTimerProps): JSX.Element => {
  const isExpiring = secondsRemaining <= 600;

  return (
    <span
      className={cx(
        "font-mono text-2xl font-[500] tabular-nums transition-colors duration-[var(--olga-duration-fast)]",
        isExpiring ? "text-olga-expiring" : "text-olga-slate"
      )}
      aria-label={`${secondsRemaining} seconds remaining`}
      aria-live="polite"
    >
      {formatTime(secondsRemaining)}
    </span>
  );
};

interface CountdownTimerProps {
  secondsRemaining: number;
}
