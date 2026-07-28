import { useState } from "react";
import cx from "classix";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Activity } from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { formatRelativeTime } from "@utils/formatRelativeTime";
import { ACTIVITY_TYPE_CONFIG } from "../activity-timeline.const";
import { ActivityTypeBadge } from "./activity-type-badge";
import { ActivityItem } from "./activity-item";
import type { TimelineEntry } from "../activity-timeline.hook";

export const AggregatedActivity = ({
  entry,
  now,
  onOpen,
}: AggregatedActivityProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { nodeClass } = ACTIVITY_TYPE_CONFIG[entry.activityType];
  const listId = `${entry.id}-list`;

  return (
    <li className="relative flex gap-4">
      <div
        aria-hidden
        className="relative flex w-6 flex-shrink-0 justify-center"
      >
        <span className="absolute top-0 h-full w-[2px] bg-border" />
        <span
          className={cx(
            "relative mt-4 h-3.5 w-3.5 rounded-full ring-2 ring-elevation-surface",
            nodeClass
          )}
        />
      </div>

      <div className="mb-3 flex-grow">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={listId}
          className={cx(
            "flex w-full cursor-pointer items-center gap-3 rounded border-none bg-elevation-surface-raised p-3 text-left shadow-xs",
            "duration-200 ease-in-out hover:bg-elevation-surface-raised-hovered"
          )}
        >
          <UserAvatar {...entry.user} size={32} />
          <span className="flex-grow font-primary-bold text-sm text-font">
            {entry.label}
          </span>
          <ActivityTypeBadge activityType={entry.activityType} />
          <span className="font-primary-light text-xs text-font-subtlest">
            {formatRelativeTime(entry.createdAt, now)}
          </span>
          <RiArrowDropDownLine
            size={22}
            className={cx(
              "text-icon-subtle duration-200 ease-out",
              !isExpanded && "-rotate-90"
            )}
          />
        </button>

        {isExpanded && (
          <ul id={listId} className="mt-3 pl-2">
            {entry.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                now={now}
                onOpen={onOpen}
                isNested
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

interface AggregatedActivityProps {
  entry: Extract<TimelineEntry, { kind: "aggregate" }>;
  now: number;
  onOpen: (activity: Activity) => void;
}
