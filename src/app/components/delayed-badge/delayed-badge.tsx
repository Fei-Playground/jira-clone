import cx from "classix";
import { BsAlarm } from "react-icons/bs";

export const DelayedBadge = ({
  size = 14,
  showLabel = false,
  className = "",
}: DelayedBadgeProps): JSX.Element => (
  <span
    className={cx(
      "flex w-fit items-center gap-1.5 text-font-danger",
      showLabel &&
        "rounded bg-background-danger-bold px-2 py-1 text-font-inverse",
      !showLabel && "rounded px-1 py-0.5",
      className
    )}
    aria-label="Delayed"
    title="Delayed"
  >
    <BsAlarm size={size} />
    {showLabel && (
      <span className="font-primary-bold text-xs uppercase">Delayed</span>
    )}
  </span>
);

interface DelayedBadgeProps {
  size?: number;
  showLabel?: boolean;
  className?: string;
}
