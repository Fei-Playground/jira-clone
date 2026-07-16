import { useState } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { v4 as uuid } from "uuid";
import { BsReply } from "react-icons/bs";
import { Comment, CommentId, Reply } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const [replies, setReplies] = useState<Reply[]>(comment.replies ?? []);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const remove = () => {
    removeComment(comment.id);
    if (comment.id.startsWith("temp-")) return;
    fetcher.submit(
      { commentId: comment.id, _action: "deleteComment" },
      { method: "delete" }
    );
  };

  const save = (commentText: string): void => {
    setMessage(commentText);
    setIsEditing(false);
  };

  const saveReply = (replyText: string): void => {
    const newReply: Reply = {
      id: "temp-reply-" + uuid(),
      user,
      message: replyText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setReplies([...replies, newReply]);
    setIsReplying(false);
  };

  const cancelReply = () => setIsReplying(false);

  const replyCount = replies.length;

  const actionBar = (
    <div
      className={cx(
        "mt-2 flex items-center gap-1 transition-opacity duration-150",
        isHovered || isReplying ? "opacity-100" : "opacity-50"
      )}
    >
      <button
        onClick={() => setIsReplying((v) => !v)}
        className={cx(
          "flex items-center gap-1.5 rounded px-2 py-1 text-xs font-primary-light transition-colors",
          "text-font-subtlest hover:bg-background-neutral hover:text-font"
        )}
        aria-label="Reply to comment"
      >
        <BsReply size={14} />
        Reply
        {replyCount > 0 && !isEditing && (
          <span className="ml-0.5 rounded-full bg-background-neutral px-1.5 py-0.5 text-[10px] leading-none text-font-subtle">
            {replyCount}
          </span>
        )}
      </button>

      {!isNotSelfComment && (
        <>
          <span className="text-border-bold mx-0.5 select-none">·</span>
          <button
            onClick={edit}
            className="rounded px-2 py-1 text-xs font-primary-light text-font-subtlest transition-colors hover:bg-background-neutral hover:text-font"
            aria-label="Edit comment"
          >
            Edit
          </button>
          <span className="text-border-bold mx-0.5 select-none">·</span>
          <button
            onClick={remove}
            className="rounded px-2 py-1 text-xs font-primary-light text-font-subtlest transition-colors hover:bg-background-danger hover:text-font-danger"
            aria-label="Delete comment"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );

  return (
    <div
      className="group flex gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar column with connector line */}
      <div className="flex flex-col items-center">
        <UserAvatar {...comment.user} />
        {(replies.length > 0 || isReplying) && (
          <div className="mt-2 w-0.5 flex-1 rounded-full bg-border-bold opacity-25" />
        )}
      </div>

      {/* Content column */}
      <div className="min-w-0 flex-1 pb-2">
        {/* Header */}
        <div className="flex items-baseline gap-2">
          <span className="font-primary-bold text-font">{comment.user.name}</span>
          <span className="font-primary-light text-xs text-font-subtlest">
            {comment.createdAt ? (
              formatDateTime(comment.createdAt)
            ) : (
              <i>Date undefined</i>
            )}
            {commentIsEdited(comment) && (
              <span className="ml-1.5 rounded bg-background-neutral px-1 py-0.5 text-[10px] uppercase tracking-wide text-font-subtlest">
                edited
              </span>
            )}
          </span>
        </div>

        {/* Body */}
        <div className="mt-1">
          {isEditing ? (
            <EditBox
              defaultMessage={message}
              save={save}
              cancel={cancel}
              autofocus
            />
          ) : (
            <>
              <p className="font-primary-light leading-relaxed text-font">
                {message}
              </p>
              {actionBar}
            </>
          )}
        </div>

        {/* Reply thread */}
        {replies.length > 0 && (
          <ul className="mt-3 space-y-4">
            {replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} />
            ))}
          </ul>
        )}

        {/* Inline reply composer */}
        {isReplying && (
          <div className="mt-4 flex items-start gap-3">
            <div className="shrink-0">
              <UserAvatar {...user} size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <ReplyEditBox save={saveReply} cancel={cancelReply} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Compact EditBox variant tuned for replies */
const ReplyEditBox = ({
  save,
  cancel,
}: {
  save: (text: string) => void;
  cancel: () => void;
}): JSX.Element => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const isValid = message.trim().length > 0;

  const handleSave = () => {
    if (isValid) {
      save(message);
      setMessage("");
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleCancel = () => {
    setMessage("");
    setError(false);
    cancel();
  };

  return (
    <div className="w-full">
      <textarea
        autoFocus
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
          if (e.key === "Escape") handleCancel();
        }}
        placeholder={error ? "Reply cannot be empty" : "Write a reply…"}
        rows={2}
        className={cx(
          "w-full resize-none rounded-md border-none p-2.5 text-sm font-primary-light leading-relaxed text-font",
          "bg-background-input outline outline-2 transition-colors",
          "placeholder:text-font-subtlest",
          "focus:outline-border-brand hover:bg-background-input-hovered",
          error
            ? "outline-border-danger placeholder:text-font-danger"
            : "outline-border-input"
        )}
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="rounded bg-background-brand-bold px-3 py-1.5 text-xs font-primary-bold text-font-inverse transition-colors hover:bg-background-brand-bold-hovered"
          aria-label="Save reply"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded px-3 py-1.5 text-xs font-primary-light text-font-subtlest transition-colors hover:bg-background-neutral hover:text-font"
          aria-label="Cancel reply"
        >
          Cancel
        </button>
        <span className="ml-auto text-[10px] font-primary-light text-font-subtlest opacity-70">
          Ctrl+Enter to save · Esc to cancel
        </span>
      </div>
    </div>
  );
};

const ReplyItem = ({ reply }: { reply: Reply }): JSX.Element => (
  <li className="flex items-start gap-3">
    <UserAvatar {...reply.user} size={28} />
    <div className="min-w-0 flex-1 rounded-lg bg-background-neutral px-3 py-2.5">
      <div className="flex items-baseline gap-2">
        <span className="font-primary-bold text-sm text-font">
          {reply.user.name}
        </span>
        <span className="font-primary-light text-xs text-font-subtlest">
          {reply.createdAt ? formatDateTime(reply.createdAt) : <i>Date undefined</i>}
        </span>
      </div>
      <p className="mt-1 font-primary-light text-sm leading-relaxed text-font">
        {reply.message}
      </p>
    </div>
  </li>
);

const commentIsEdited = (comment: Comment): boolean => {
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
}
