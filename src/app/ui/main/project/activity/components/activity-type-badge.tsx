import cx from "classix";
import { ActivityType } from "@domain/activity";
import { ACTIVITY_TYPE_CONFIG } from "../activity-timeline.const";

export const ActivityTypeBadge = ({
  activityType,
}: ActivityTypeBadgeProps): JSX.Element => {
  const { badgeLabel, badgeClass } = ACTIVITY_TYPE_CONFIG[activityType];

  return <Badge className={badgeClass}>{badgeLabel}</Badge>;
};

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

interface ActivityTypeBadgeProps {
  activityType: ActivityType;
}

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}
