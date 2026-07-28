import cx from "classix";
import { User } from "@domain/user";
import { ActivityType } from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { ACTIVITY_TYPE_CONFIG } from "../activity-timeline.const";

export const GroupHeader = ({
  label,
  count,
  user,
  activityType,
}: GroupHeaderProps): JSX.Element => (
  <div className="sticky top-0 z-10 -mx-1 mb-3 flex items-center gap-2 bg-elevation-surface px-1 py-2">
    {activityType && (
      <span
        aria-hidden
        className={cx(
          "h-2.5 w-2.5 rounded-full",
          ACTIVITY_TYPE_CONFIG[activityType].nodeClass
        )}
      />
    )}
    {user && <UserAvatar {...user} size={24} />}
    <h3 className="font-primary-bold text-sm uppercase tracking-wide text-font-subtle">
      {label}
    </h3>
    <span className="rounded bg-background-neutral px-1.5 py-px text-2xs text-font-subtlest">
      {count}
    </span>
    <span aria-hidden className="ml-1 h-px flex-grow bg-border" />
  </div>
);

interface GroupHeaderProps {
  label: string;
  count: number;
  user?: User;
  activityType?: ActivityType;
}
