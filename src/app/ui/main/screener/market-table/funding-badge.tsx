import cx from "classix";
import { Tooltip } from "@app/components/tooltip";

export const FundingBadge = ({ hourlyPct, annualisedPct }: FundingBadgeProps): JSX.Element => {
  const isPositive = hourlyPct >= 0;

  return (
    <Tooltip title={`${annualisedPct >= 0 ? "+" : ""}${annualisedPct.toFixed(1)}% APR`}>
      <span
        className={cx(
          "text-xs",
          isPositive ? "text-font-accent-green" : "text-font-danger"
        )}
      >
        {isPositive ? "+" : ""}
        {hourlyPct.toFixed(4)}%
      </span>
    </Tooltip>
  );
};

interface FundingBadgeProps {
  hourlyPct: number;
  annualisedPct: number;
}
