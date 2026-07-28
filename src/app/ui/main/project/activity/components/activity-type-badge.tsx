import cx from "classix";
import { ActivityType } from "@domain/activity";
import { activityTypeMeta } from "../activity-timeline.const";

export const Badge = ({ className, children }: BadgeProps): JSX.Element => (
  <span
    className={cx(
      "inline-flex w-fit items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 font-primary-bold text-2xs",
      className
    )}
  >
    {children}
  </span>
);

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

export const ActivityTypeBadge = ({ type }: Props): JSX.Element => {
  const { label, badge } = activityTypeMeta[type];

  return <Badge className={badge}>{label}</Badge>;
};

interface Props {
  type: ActivityType;
}
