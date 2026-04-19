import { Activity, activityTypeLabels } from "@domain/activity";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import { formatDateTime } from "@utils/formatDateTime";

export const ActivityTimeline = ({ activities, users }: Props): JSX.Element => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-2xs text-font-subtle">
        No activity yet
      </div>
    );
  }

  const getUser = (userId: string): User | undefined => {
    return users.find((user) => user.id === userId);
  };

  const getActivityDescription = (activity: Activity): string => {
    const baseLabel = activityTypeLabels[activity.activityType];

    if (activity.oldValue && activity.newValue) {
      return `${baseLabel} from ${activity.oldValue} to ${activity.newValue}`;
    }

    return baseLabel;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const user = getUser(activity.userId);
        if (!user) return null;

        return (
          <div key={activity.id} className="flex gap-3">
            <UserAvatar {...user} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-2xs font-primary-light text-font-subtle">
                  {user.name}
                </p>
                <p className="text-2xs text-font-subtle">
                  {getActivityDescription(activity)}
                </p>
              </div>
              <p className="text-2xs text-font-subtle mt-0.5">
                {formatDateTime(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface Props {
  activities?: Activity[];
  users: User[];
}
