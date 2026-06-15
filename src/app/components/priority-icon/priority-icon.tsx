import cx from "classix";
import { FaStar } from "react-icons/fa";
import { PriorityId } from "@domain/priority";

export const PriorityIcon = ({
  priority,
  size = 18,
}: PriorityIconProps): JSX.Element => (
  <span
    className={cx(
      "flex",
      priority === "low" && "text-icon-accent-green",
      priority === "medium" && "text-[#1d9aaa]", // teal
      priority === "high" && "text-[#f87462]" // coral
    )}
  >
    <FaStar size={size} />
  </span>
);

interface PriorityIconProps {
  priority: PriorityId;
  size?: number;
}
