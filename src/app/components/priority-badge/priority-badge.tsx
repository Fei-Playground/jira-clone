import cx from "classix";
import { Priority } from "@domain/priority";

export const PriorityBadge = ({
  priority,
}: PriorityBadgeProps): JSX.Element => (
  <span
    className={cx(
      "flex w-fit items-center rounded-full px-2 py-0.5 font-primary-bold text-2xs uppercase",
      priority.id === "low" && "bg-background-neutral text-font-subtle",
      priority.id === "medium" && "bg-background-warning text-font-warning",
      priority.id === "high" && "bg-background-danger-bold text-font-inverse"
    )}
  >
    {priority.name}
  </span>
);

interface PriorityBadgeProps {
  priority: Priority;
}
