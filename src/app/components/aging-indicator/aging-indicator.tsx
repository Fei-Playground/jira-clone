import cx from "classix";
import { BsHourglassSplit } from "react-icons/bs";
import { AgingLevel } from "@domain/issue/issue";
import { Tooltip } from "@app/components/tooltip/tooltip";

export const AgingIndicator = ({
  level,
  ageInDays,
  size = 16,
}: AgingIndicatorProps): JSX.Element | null => {
  if (level === "fresh") return null;

  const tooltipTitle =
    ageInDays === 1
      ? "1 day without progress"
      : `${ageInDays} days without progress`;

  return (
    <Tooltip title={tooltipTitle}>
      <span
        className={cx(
          "flex items-center",
          level === "aging" && "text-icon-accent-yellow",
          level === "stale" && "text-icon-accent-red"
        )}
        aria-label={tooltipTitle}
      >
        <BsHourglassSplit size={size} />
      </span>
    </Tooltip>
  );
};

interface AgingIndicatorProps {
  level: AgingLevel;
  ageInDays: number;
  size?: number;
}
