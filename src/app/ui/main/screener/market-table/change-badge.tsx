import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import cx from "classix";

export const ChangeBadge = ({ pct }: ChangeBadgeProps): JSX.Element => {
  const isPositive = pct >= 0;

  return (
    <span
      className={cx(
        "flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-xs",
        isPositive ? "bg-background-accent-green-subtler text-font-accent-green" : "bg-background-danger text-font-danger"
      )}
    >
      {isPositive ? <BsArrowUp size={10} /> : <BsArrowDown size={10} />}
      {isPositive ? "+" : ""}
      {pct.toFixed(2)}%
    </span>
  );
};

interface ChangeBadgeProps {
  pct: number;
}
