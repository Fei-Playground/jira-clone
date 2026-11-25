import cx from "classix";
import { HiFlag } from "react-icons/hi";
import { PriorityId } from "@domain/priority";

export const PriorityIcon = ({
  priority,
  size = 18,
  label,
}: PriorityIconProps): JSX.Element => (
  <span
    className={cx(
      "flex",
      priority === "low" && "text-icon-accent-green",
      priority === "medium" && "text-icon-accent-yellow",
      priority === "high" && "text-icon-accent-red"
    )}
    role={label ? "img" : undefined}
    aria-label={label}
    // Without a label the flag is decorative and stays out of the accessibility tree.
    aria-hidden={label ? undefined : true}
  >
    <HiFlag size={size} />
  </span>
);

interface PriorityIconProps {
  priority: PriorityId;
  size?: number;
  label?: string;
}
