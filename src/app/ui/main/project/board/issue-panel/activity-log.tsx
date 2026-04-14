import { Issue } from "@domain/issue";
import { formatDateTime } from "@utils/formatDateTime";
import { MdEdit, MdCheck } from "react-icons/md";
import cx from "classix";

export const ActivityLog = ({ issue }: Props): JSX.Element => {
  // Display empty state when no issue is provided (e.g., creating a new issue)
  if (!issue) {
    return <div className="text-xs text-font-subtlest">No activity yet</div>;
  }

  const activities = [
    {
      type: "created",
      label: "Created",
      timestamp: issue.createdAt,
      user: issue.reporter.name,
    },
    // Only show "Updated" entry if the issue was actually modified after creation
    ...(issue.updatedAt > issue.createdAt
      ? [
          {
            type: "updated",
            label: "Updated",
            timestamp: issue.updatedAt,
            user: issue.reporter.name,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div
          key={`${activity.type}-${index}`}
          className="flex items-start gap-3"
        >
          <div
            className={cx(
              "mt-1 flex items-center justify-center rounded-full p-1",
              activity.type === "created"
                ? "bg-background-info-subtler text-font-info"
                : "bg-background-success-subtler text-font-success"
            )}
          >
            {activity.type === "created" ? (
              <MdCheck size={12} />
            ) : (
              <MdEdit size={12} />
            )}
          </div>
          <div className="flex-1">
            <p className="font-primary-bold text-xs text-font">
              {activity.label} by {activity.user}
            </p>
            <p className="text-2xs text-font-subtlest">
              {formatDateTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

interface Props {
  issue?: Issue;
}
