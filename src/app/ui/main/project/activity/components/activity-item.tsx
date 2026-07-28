import cx from "classix";
import { Activity } from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { Tooltip } from "@app/components/tooltip";
import { formatDateTime } from "@utils/formatDateTime";
import { formatRelativeTime } from "@utils/formatRelativeTime";
import { ACTIVITY_TYPE_CONFIG } from "../activity-timeline.const";
import { ActivityTypeBadge } from "./activity-type-badge";
import { CommitActivity } from "./commit-activity";
import { CommentActivity } from "./comment-activity";
import { TaskActivity } from "./task-activity";
import { SettingsActivity } from "./settings-activity";
import { UserActivity } from "./user-activity";
import { FileActivity } from "./file-activity";
import { BranchActivity, PullRequestActivity } from "./branch-activity";

export const ActivityItem = ({
  activity,
  now,
  onOpen,
  isNested = false,
}: ActivityItemProps): JSX.Element => {
  const { nodeClass } = ACTIVITY_TYPE_CONFIG[activity.detail.type];
  const openDetail = () => onOpen(activity);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>): void => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openDetail();
  };

  return (
    <li
      tabIndex={0}
      aria-label={`${activity.user.name}: ${activity.description}, ${formatRelativeTime(activity.createdAt, now)}. Press Enter for details.`}
      onKeyDown={handleKeyDown}
      className="relative flex gap-4 rounded outline-offset-4"
    >
      <TimelineNode nodeClass={nodeClass} isNested={isNested} />

      <article
        className={cx(
          "mb-3 flex-grow rounded bg-elevation-surface-raised p-3 shadow-xs duration-200 ease-in-out",
          "hover:bg-elevation-surface-raised-hovered"
        )}
      >
        <header className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <UserAvatar {...activity.user} size={isNested ? 28 : 40} />
          <span className="font-primary-bold text-sm text-font">
            {activity.user.name}
          </span>
          <ActivityTypeBadge activityType={activity.detail.type} />
          <Tooltip title={formatDateTime(activity.createdAt)}>
            <time
              dateTime={new Date(activity.createdAt).toISOString()}
              className="cursor-default font-primary-light text-xs text-font-subtlest"
            >
              {formatRelativeTime(activity.createdAt, now)}
            </time>
          </Tooltip>
        </header>

        <ActivityBody activity={activity} onViewDetail={openDetail} />
      </article>
    </li>
  );
};

interface ActivityItemProps {
  activity: Activity;
  now: number;
  onOpen: (activity: Activity) => void;
  /** Nested items sit inside an expanded aggregation row. */
  isNested?: boolean;
}

const TimelineNode = ({
  nodeClass,
  isNested,
}: TimelineNodeProps): JSX.Element => (
  <div
    aria-hidden
    className={cx(
      "relative flex flex-shrink-0 justify-center",
      isNested ? "w-4" : "w-6"
    )}
  >
    <span className="absolute top-0 h-full w-[2px] bg-border" />
    <span
      className={cx(
        "relative mt-4 rounded-full ring-2 ring-elevation-surface",
        isNested ? "h-2.5 w-2.5" : "h-3.5 w-3.5",
        nodeClass
      )}
    />
  </div>
);

interface TimelineNodeProps {
  nodeClass: string;
  isNested: boolean;
}

const ActivityBody = ({
  activity,
  onViewDetail,
}: ActivityBodyProps): JSX.Element => {
  const { detail } = activity;

  switch (detail.type) {
    case "commit":
      return (
        <CommitActivity commit={detail.commit} onViewDetail={onViewDetail} />
      );
    case "comment":
      return (
        <CommentActivity comment={detail.comment} onViewDetail={onViewDetail} />
      );
    case "task":
      return <TaskActivity task={detail.task} onViewDetail={onViewDetail} />;
    case "settings":
      return (
        <SettingsActivity
          settings={detail.settings}
          onViewDetail={onViewDetail}
        />
      );
    case "user":
      return <UserActivity userEvent={detail.userEvent} user={activity.user} />;
    case "file":
      return <FileActivity file={detail.file} onViewDetail={onViewDetail} />;
    case "branch":
      return (
        <BranchActivity branch={detail.branch} onViewDetail={onViewDetail} />
      );
    case "pr":
      return (
        <PullRequestActivity
          pullRequest={detail.pullRequest}
          onViewDetail={onViewDetail}
        />
      );
  }
};

interface ActivityBodyProps {
  activity: Activity;
  onViewDetail: () => void;
}
