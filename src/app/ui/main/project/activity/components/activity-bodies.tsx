import { useState } from "react";
import cx from "classix";
import { BiGitBranch, BiGitPullRequest } from "react-icons/bi";
import { BsFileEarmarkText } from "react-icons/bs";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import {
  BranchActivityItem,
  CommentActivityItem,
  CommitActivityItem,
  FileActivityItem,
  PrActivityItem,
  SettingsActivityItem,
  TaskActivityItem,
  UserActivityItem,
} from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { Badge } from "./activity-type-badge";
import {
  COMMENT_PREVIEW_LENGTH,
  priorityBadge,
  taskStatusBadge,
  taskStatusLabel,
} from "../activity-timeline.const";
import { shortDate } from "../activity-date";

const actionLinkClass = cx(
  "mt-3 inline-flex w-fit cursor-pointer items-center rounded border-none px-2 py-1",
  "font-primary-bold text-2xs text-font-brand",
  "hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
);

const metaTextClass = "font-primary-light text-xs text-font-subtlest";

export const ActionButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}): JSX.Element => (
  <button type="button" className={actionLinkClass} onClick={onClick}>
    {label}
  </button>
);

export const CommitActivityBody = ({
  activity,
  showFiles = false,
}: {
  activity: CommitActivityItem;
  showFiles?: boolean;
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(showFiles);
  const { commit } = activity;

  return (
    <div>
      <p className="font-primary-bold text-sm text-font">{commit.message}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="rounded bg-background-neutral px-1.5 py-0.5 font-primary-bold text-2xs text-font-subtle">
          {commit.hash}
        </span>
        <Badge className="bg-background-accent-blue-subtler text-font-accent-blue">
          <BiGitBranch size={12} />
          {commit.branch}
        </Badge>
        <span className={metaTextClass}>
          {commit.files.length} {commit.files.length === 1 ? "file" : "files"}{" "}
          changed
        </span>
        <span className="font-primary-bold text-2xs text-font-success">
          +{commit.additions}
        </span>
        <span className="font-primary-bold text-2xs text-font-danger">
          -{commit.deletions}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Hide" : "Show"} files changed in commit ${commit.hash}`}
        className="mt-3 flex cursor-pointer items-center gap-1 rounded border-none font-primary-bold text-2xs text-font-subtle hover:text-font-brand"
      >
        {isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
        {isOpen ? "Hide files" : "Show files"}
      </button>
      {isOpen && (
        <ul className="mt-2 flex flex-col gap-1 rounded bg-elevation-surface-sunken p-2">
          {commit.files.map((file) => (
            <li
              key={file.path}
              className="flex items-center justify-between gap-4 font-primary-light text-xs text-font-subtle"
            >
              <span className="truncate">{file.path}</span>
              <span className="flex shrink-0 gap-2 font-primary-bold text-2xs">
                <span className="text-font-success">+{file.additions}</span>
                <span className="text-font-danger">-{file.deletions}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const CommentActivityBody = ({
  activity,
  full = false,
}: {
  activity: CommentActivityItem;
  full?: boolean;
}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(full);
  const { comment } = activity;
  const isLong = comment.text.length > COMMENT_PREVIEW_LENGTH;
  const text =
    isExpanded || !isLong
      ? comment.text
      : `${comment.text.slice(0, COMMENT_PREVIEW_LENGTH)}…`;

  return (
    <div>
      <p className="font-primary-bold text-sm text-font">
        Commented on {comment.target}
      </p>
      <p className="mt-2 whitespace-pre-line font-primary-light text-sm text-font-subtle">
        {text}
      </p>
      {isLong && !full && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 cursor-pointer rounded border-none font-primary-bold text-2xs text-font-brand"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Badge className="bg-background-accent-grey-subtler text-font-subtle">
          <BsFileEarmarkText size={12} />
          {comment.target}
          {comment.line ? `:${comment.line}` : ""}
        </Badge>
        <span className={metaTextClass}>
          {comment.replies.length}{" "}
          {comment.replies.length === 1 ? "reply" : "replies"}
        </span>
      </div>
      {full && comment.replies.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2 border-l-2 border-l-border pl-3">
          {comment.replies.map((reply, index) => (
            <li key={index}>
              <p className="font-primary-bold text-2xs text-font">
                {reply.author}
              </p>
              <p className="font-primary-light text-xs text-font-subtle">
                {reply.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const TaskActivityBody = ({
  activity,
}: {
  activity: TaskActivityItem;
}): JSX.Element => {
  const { task } = activity;
  const actionLabel =
    task.action === "created"
      ? "Created"
      : task.action === "completed"
        ? "Completed"
        : "Updated";

  return (
    <div>
      <p className="font-primary-bold text-sm text-font">
        {actionLabel} {task.title}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="font-primary-bold text-2xs text-font-subtle">
          {task.key}
        </span>
        <Badge className={taskStatusBadge[task.status]}>
          {taskStatusLabel[task.status]}
        </Badge>
        <Badge className={priorityBadge[task.priority]}>
          {task.priority} priority
        </Badge>
        {task.assignee && (
          <span className="flex items-center gap-1.5">
            <UserAvatar name={task.assignee} size={20} />
            <span className={metaTextClass}>{task.assignee}</span>
          </span>
        )}
        {task.dueDate && (
          <span className={metaTextClass}>Due {shortDate(task.dueDate)}</span>
        )}
      </div>
    </div>
  );
};

export const SettingsActivityBody = ({
  activity,
}: {
  activity: SettingsActivityItem;
}): JSX.Element => {
  const { settings } = activity;

  return (
    <div>
      <p className="font-primary-bold text-sm text-font">{settings.name}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-primary-light text-sm text-font-subtlest line-through">
          {settings.before}
        </span>
        <span className={metaTextClass}>→</span>
        <span className="font-primary-bold text-sm text-font">
          {settings.after}
        </span>
      </div>
      <p className={cx("mt-2", metaTextClass)}>Scope: {settings.scope}</p>
    </div>
  );
};

export const UserActivityBody = ({
  activity,
}: {
  activity: UserActivityItem;
}): JSX.Element => (
  <div className="flex items-center gap-2">
    <HiOutlineUser size={16} className="text-icon-subtle" />
    <p className="font-primary-bold text-sm text-font">
      {activity.user.name} {activity.userEvent.action}
    </p>
  </div>
);

export const FileActivityBody = ({
  activity,
}: {
  activity: FileActivityItem;
}): JSX.Element => {
  const { file } = activity;
  const operationLabel =
    file.operation.charAt(0).toUpperCase() + file.operation.slice(1);

  return (
    <div>
      <p className="font-primary-bold text-sm text-font">
        {operationLabel} {file.path.split("/").slice(-1)[0]}
      </p>
      <p className="mt-2 break-all font-primary-light text-xs text-font-subtle">
        {file.previousPath ? `${file.previousPath} → ` : ""}
        {file.path}
      </p>
      {file.size && <p className={cx("mt-1", metaTextClass)}>{file.size}</p>}
    </div>
  );
};

export const BranchActivityBody = ({
  activity,
}: {
  activity: BranchActivityItem;
}): JSX.Element => (
  <div>
    <p className="font-primary-bold text-sm text-font">
      {activity.branch.action}
    </p>
    <Badge className="mt-2 bg-background-accent-blue-subtler text-font-accent-blue">
      <BiGitBranch size={12} />
      {activity.branch.branch}
    </Badge>
  </div>
);

export const PrActivityBody = ({
  activity,
}: {
  activity: PrActivityItem;
}): JSX.Element => {
  const { pr } = activity;
  const statusClass =
    pr.status === "merged"
      ? "bg-background-success text-font-success"
      : pr.status === "closed"
        ? "bg-background-danger text-font-danger"
        : "bg-background-info text-font-info";

  return (
    <div>
      <p className="flex items-center gap-2 font-primary-bold text-sm text-font">
        <BiGitPullRequest size={16} className="text-icon-subtle" />
        {pr.action}
      </p>
      <p className="mt-1 font-primary-light text-sm text-font-subtle">
        {pr.title}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Badge className={statusClass}>{pr.status}</Badge>
        <span className={metaTextClass}>
          Reviewers: {pr.reviewers.join(", ")}
        </span>
      </div>
    </div>
  );
};
