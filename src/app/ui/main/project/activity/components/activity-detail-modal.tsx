import { IoCloseOutline } from "react-icons/io5";
import { Activity } from "@domain/activity";
import * as Dialog from "@app/components/dialog";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";
import { formatDateTime } from "@utils/formatDateTime";
import { formatRelativeTime, formatShortDate } from "@utils/formatRelativeTime";
import {
  ACTIVITY_TYPE_CONFIG,
  PRIORITY_LABEL,
  PR_STATUS_CONFIG,
  TASK_STATUS_CONFIG,
} from "../activity-timeline.const";
import { ActivityTypeBadge, Badge } from "./activity-type-badge";
import { DiffStat } from "./activity-parts";

export const ActivityDetailModal = ({
  activity,
  relatedActivities,
  now,
  onClose,
  onSelectRelated,
}: ActivityDetailModalProps): JSX.Element => (
  <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay>
        <Dialog.Content
          aria-describedby={undefined}
          className="max-w-[760px]"
          onEscapeKeyDown={onClose}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="mb-2 text-2xl">
                {activity.description}
              </Dialog.Title>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <UserAvatar {...activity.user} size={28} />
                <span className="font-primary-bold text-sm">
                  {activity.user.name}
                </span>
                <ActivityTypeBadge activityType={activity.detail.type} />
                <span className="font-primary-light text-xs text-font-subtlest">
                  {formatRelativeTime(activity.createdAt, now)} ·{" "}
                  {formatDateTime(activity.createdAt)}
                </span>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close activity details"
                className="flex cursor-pointer items-center rounded border-none p-1 text-icon hover:bg-background-neutral-hovered"
              >
                <IoCloseOutline size={24} />
              </button>
            </Dialog.Close>
          </div>

          <DetailBody activity={activity} />

          {relatedActivities.length > 0 && (
            <section className="mt-6">
              <SectionTitle>Related activities</SectionTitle>
              <ul className="flex flex-col gap-2">
                {relatedActivities.map((related) => (
                  <li key={related.id}>
                    <button
                      type="button"
                      onClick={() => onSelectRelated(related)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded border-none bg-elevation-surface-sunken p-2 text-left hover:bg-elevation-surface-raised-hovered"
                    >
                      <span
                        aria-hidden
                        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${ACTIVITY_TYPE_CONFIG[related.detail.type].nodeClass}`}
                      />
                      <UserAvatar {...related.user} size={20} />
                      <span className="flex-grow truncate text-sm text-font">
                        {related.description}
                      </span>
                      <span className="whitespace-nowrap font-primary-light text-2xs text-font-subtlest">
                        {formatRelativeTime(related.createdAt, now)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-6 flex justify-end">
            <Button color="neutral" variant="subtlest" onClick={onClose}>
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
);

interface ActivityDetailModalProps {
  activity: Activity;
  relatedActivities: Activity[];
  now: number;
  onClose: () => void;
  onSelectRelated: (activity: Activity) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2 font-primary-bold text-sm uppercase tracking-wide text-font-subtle">
    {children}
  </h3>
);

const DetailRow = ({ label, value }: DetailRowProps): JSX.Element => (
  <div className="flex flex-wrap items-center gap-2 py-1 text-sm">
    <span className="min-w-[120px] font-primary-light text-font-subtlest">
      {label}
    </span>
    <span className="text-font">{value}</span>
  </div>
);

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailBody = ({ activity }: { activity: Activity }): JSX.Element => {
  const { detail } = activity;

  switch (detail.type) {
    case "commit": {
      const { commit } = detail;
      return (
        <div className="flex flex-col gap-4">
          <section>
            <SectionTitle>Commit</SectionTitle>
            <DetailRow label="Message" value={commit.message} />
            <DetailRow label="Hash" value={commit.hash} />
            <DetailRow label="Branch" value={commit.branch} />
            <DetailRow
              label="Changes"
              value={
                <span className="flex items-center gap-3">
                  {commit.filesChanged} files
                  <DiffStat
                    additions={commit.additions}
                    deletions={commit.deletions}
                  />
                </span>
              }
            />
          </section>

          <section>
            <SectionTitle>Files changed</SectionTitle>
            <ul className="flex flex-col gap-1 rounded bg-elevation-surface-sunken p-2">
              {commit.files.map((file) => (
                <li
                  key={file.path}
                  className="flex items-center justify-between gap-4 text-xs"
                >
                  <span className="truncate font-primary-light text-font-subtle">
                    {file.path}
                  </span>
                  <DiffStat
                    additions={file.additions}
                    deletions={file.deletions}
                  />
                </li>
              ))}
            </ul>
          </section>

          {commit.diff && (
            <section>
              <SectionTitle>Diff</SectionTitle>
              <pre className="overflow-x-auto rounded bg-elevation-surface-sunken p-3 text-2xs leading-5 text-font-subtle">
                {commit.diff.split("\n").map((line, index) => (
                  <span
                    key={index}
                    className={
                      line.startsWith("+")
                        ? "block text-font-success"
                        : line.startsWith("-")
                          ? "block text-font-danger"
                          : "block"
                    }
                  >
                    {line}
                  </span>
                ))}
              </pre>
            </section>
          )}
        </div>
      );
    }

    case "comment": {
      const { comment } = detail;
      return (
        <div className="flex flex-col gap-4">
          <section>
            <SectionTitle>Comment</SectionTitle>
            <DetailRow
              label="Location"
              value={`${comment.fileName}:${comment.line}`}
            />
            <blockquote className="mt-2 rounded border-l-[3px] border-l-border-brand bg-elevation-surface-sunken px-3 py-2 font-primary-light text-sm text-font-subtle">
              {comment.message}
            </blockquote>
          </section>

          <section>
            <SectionTitle>Thread ({comment.replies.length})</SectionTitle>
            {comment.replies.length === 0 ? (
              <p className="font-primary-light text-sm text-font-subtlest">
                No replies yet
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {comment.replies.map((reply, index) => (
                  <li key={index} className="flex gap-3">
                    <UserAvatar {...reply.user} size={28} />
                    <div>
                      <p className="font-primary-bold text-sm text-font">
                        {reply.user.name}
                        <span className="ml-2 font-primary-light text-2xs text-font-subtlest">
                          {formatDateTime(reply.createdAt)}
                        </span>
                      </p>
                      <p className="font-primary-light text-sm text-font-subtle">
                        {reply.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      );
    }

    case "task": {
      const { task } = detail;
      const status = TASK_STATUS_CONFIG[task.status];
      return (
        <section>
          <SectionTitle>Task</SectionTitle>
          <DetailRow label="Title" value={task.title} />
          <DetailRow label="Id" value={task.taskId} />
          <DetailRow
            label="Status"
            value={<Badge className={status.className}>{status.label}</Badge>}
          />
          <DetailRow label="Priority" value={PRIORITY_LABEL[task.priority]} />
          {task.asignee && (
            <DetailRow
              label="Assignee"
              value={
                <span className="flex items-center gap-2">
                  <UserAvatar {...task.asignee} size={20} />
                  {task.asignee.name}
                </span>
              }
            />
          )}
          {task.dueDate && (
            <DetailRow label="Due date" value={formatShortDate(task.dueDate)} />
          )}
          {task.description && (
            <DetailRow label="Description" value={task.description} />
          )}
        </section>
      );
    }

    case "settings": {
      const { settings } = detail;
      return (
        <section>
          <SectionTitle>Settings change</SectionTitle>
          <DetailRow label="Setting" value={settings.settingName} />
          <DetailRow
            label="Before"
            value={<span className="line-through">{settings.before}</span>}
          />
          <DetailRow
            label="After"
            value={<span className="font-primary-bold">{settings.after}</span>}
          />
          <DetailRow label="Scope" value={settings.scope} />
        </section>
      );
    }

    case "user": {
      const { userEvent } = detail;
      return (
        <section>
          <SectionTitle>Team activity</SectionTitle>
          <DetailRow
            label="Member"
            value={
              userEvent.targetUser
                ? userEvent.targetUser.name
                : activity.user.name
            }
          />
          <DetailRow label="Action" value={userEvent.action} />
        </section>
      );
    }

    case "file": {
      const { file } = detail;
      return (
        <section>
          <SectionTitle>File operation</SectionTitle>
          <DetailRow label="Operation" value={file.operation} />
          <DetailRow label="File" value={file.fileName} />
          <DetailRow label="Path" value={`${file.path}${file.fileName}`} />
          {file.previousName && (
            <DetailRow label="Previous name" value={file.previousName} />
          )}
          {file.size && <DetailRow label="Size" value={file.size} />}
        </section>
      );
    }

    case "branch": {
      const { branch } = detail;
      return (
        <section>
          <SectionTitle>Branch</SectionTitle>
          <DetailRow label="Action" value={branch.action} />
          <DetailRow label="Branch" value={branch.branch} />
          {branch.baseBranch && (
            <DetailRow label="Base branch" value={branch.baseBranch} />
          )}
        </section>
      );
    }

    case "pr": {
      const { pullRequest } = detail;
      const status = PR_STATUS_CONFIG[pullRequest.status];
      return (
        <section>
          <SectionTitle>Pull request</SectionTitle>
          <DetailRow label="Title" value={pullRequest.title} />
          <DetailRow label="Number" value={`#${pullRequest.number}`} />
          <DetailRow
            label="Status"
            value={<Badge className={status.className}>{status.label}</Badge>}
          />
          <DetailRow label="Branch" value={pullRequest.branch} />
          <DetailRow
            label="Reviewers"
            value={
              <span className="flex items-center gap-2">
                {pullRequest.reviewers.map((reviewer) => (
                  <span key={reviewer.id} className="flex items-center gap-1.5">
                    <UserAvatar {...reviewer} size={20} />
                    {reviewer.name}
                  </span>
                ))}
              </span>
            }
          />
        </section>
      );
    }
  }
};
