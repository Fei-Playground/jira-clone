import cx from "classix";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Activity } from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { Tooltip } from "@app/components/tooltip";
import { ActivityTypeBadge } from "./activity-type-badge";
import {
  ActionButton,
  BranchActivityBody,
  CommentActivityBody,
  CommitActivityBody,
  FileActivityBody,
  PrActivityBody,
  SettingsActivityBody,
  TaskActivityBody,
  UserActivityBody,
} from "./activity-bodies";
import { activityTypeMeta } from "../activity-timeline.const";
import { absoluteTime, relativeTime } from "../activity-date";
import { TimelineEntry } from "../activity-timeline.hook";

export const ActivityBody = ({
  activity,
  full = false,
}: {
  activity: Activity;
  full?: boolean;
}): JSX.Element => {
  switch (activity.type) {
    case "commit":
      return <CommitActivityBody activity={activity} showFiles={full} />;
    case "comment":
      return <CommentActivityBody activity={activity} full={full} />;
    case "task":
      return <TaskActivityBody activity={activity} />;
    case "settings":
      return <SettingsActivityBody activity={activity} />;
    case "user":
      return <UserActivityBody activity={activity} />;
    case "file":
      return <FileActivityBody activity={activity} />;
    case "branch":
      return <BranchActivityBody activity={activity} />;
    case "pr":
      return <PrActivityBody activity={activity} />;
  }
};

const detailButtonLabel = (activity: Activity): string => {
  switch (activity.type) {
    case "commit":
      return "View Commit";
    case "comment":
      return "View Full Comment";
    case "task":
      return "View Task";
    case "settings":
      return "View Settings";
    case "file":
      return "View File";
    case "user":
      return "View Details";
    default:
      return "View";
  }
};

export const TimelineNode = ({
  activity,
}: {
  activity: Activity;
}): JSX.Element => (
  <span
    aria-hidden="true"
    className={cx(
      "absolute left-0 top-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full ring-2 ring-elevation-surface",
      activityTypeMeta[activity.type].node
    )}
  />
);

export const ActivityItem = ({ activity, onOpen }: Props): JSX.Element => {
  return (
    <li className="relative pl-6">
      <TimelineNode activity={activity} />
      <article
        className={cx(
          "rounded bg-elevation-surface-raised p-3 shadow-xs",
          "hover:bg-elevation-surface-raised-hovered"
        )}
      >
        <header className="flex items-center gap-3">
          <UserAvatar
            name={activity.user.name}
            image={activity.user.image}
            color={activity.user.color}
            size={40}
          />
          <div className="flex flex-col">
            <span className="font-primary-bold text-sm text-font">
              {activity.user.name}
            </span>
            <span className="mt-0.5 flex items-center gap-2">
              <ActivityTypeBadge type={activity.type} />
              <Tooltip title={absoluteTime(activity.timestamp)}>
                <time
                  dateTime={new Date(activity.timestamp).toISOString()}
                  className="font-primary-light text-2xs text-font-subtlest"
                >
                  {relativeTime(activity.timestamp)}
                </time>
              </Tooltip>
            </span>
          </div>
        </header>
        <div className="mt-3">
          <ActivityBody activity={activity} />
        </div>
        <ActionButton
          label={detailButtonLabel(activity)}
          onClick={() => onOpen(activity)}
        />
      </article>
    </li>
  );
};

interface Props {
  activity: Activity;
  onOpen: (activity: Activity) => void;
}

export const AggregatedActivityItem = ({
  entry,
  isExpanded,
  onToggle,
  onOpen,
}: AggregatedProps): JSX.Element => {
  const [first] = entry.activities;

  return (
    <li className="relative pl-6">
      <TimelineNode activity={first} />
      <div className="rounded bg-elevation-surface-raised p-3 shadow-xs">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="flex w-full cursor-pointer items-center gap-3 rounded border-none text-left"
        >
          {isExpanded ? (
            <FiChevronDown size={16} className="text-icon-subtle" />
          ) : (
            <FiChevronRight size={16} className="text-icon-subtle" />
          )}
          <UserAvatar
            name={first.user.name}
            image={first.user.image}
            color={first.user.color}
            size={28}
          />
          <span className="font-primary-bold text-sm text-font">
            {entry.label}
          </span>
          <ActivityTypeBadge type={first.type} />
          <span className="ml-auto font-primary-light text-2xs text-font-subtlest">
            {relativeTime(first.timestamp)}
          </span>
        </button>
        {isExpanded && (
          <ul className="mt-3 flex flex-col gap-2 border-l-2 border-l-border pl-3">
            {entry.activities.map((activity) => (
              <li key={activity.id}>
                <ActivityBody activity={activity} />
                <ActionButton
                  label={detailButtonLabel(activity)}
                  onClick={() => onOpen(activity)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

interface AggregatedProps {
  entry: Extract<TimelineEntry, { kind: "aggregate" }>;
  isExpanded: boolean;
  onToggle: () => void;
  onOpen: (activity: Activity) => void;
}

const SKELETON_ROWS = [0, 1, 2];

export const ActivitySkeleton = (): JSX.Element => {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-3">
      {SKELETON_ROWS.map((row) => (
        <li key={row} className="relative pl-6">
          <span className="absolute left-0 top-4 h-3 w-3 -translate-x-1/2 animate-pulse rounded-full bg-background-neutral" />
          <div className="rounded bg-elevation-surface-raised p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 animate-pulse rounded-full bg-background-neutral" />
              <div className="flex flex-col gap-2">
                <span className="h-3 w-32 animate-pulse rounded bg-background-neutral" />
                <span className="h-3 w-20 animate-pulse rounded bg-background-neutral" />
              </div>
            </div>
            <span className="mt-3 block h-3 w-3/4 animate-pulse rounded bg-background-neutral" />
            <span className="mt-2 block h-3 w-1/2 animate-pulse rounded bg-background-neutral" />
          </div>
        </li>
      ))}
    </ul>
  );
};
