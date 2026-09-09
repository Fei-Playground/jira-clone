import { useState } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { usersMock } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
  addReply,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const reply = () => setIsReplying(true);
  const cancelReply = () => setIsReplying(false);

  const saveReply = (replyText: string): void => {
    const now = Date.now();
    addReply(comment.id, {
      id: `temp-${now}`,
      user,
      message: replyText,
      createdAt: now,
      updatedAt: now,
    });
    setIsReplying(false);
  };

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

  const idleComment = (
    <div className="font-primary-light">
      <p>{renderMessageWithMentions(message)}</p>
      <div className="mt-3 text-font-subtlest">
        <button
          onClick={reply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        <span className={cx(isNotSelfComment ? "hidden" : "visible")}>
          <span className="mx-2">{"·"}</span>
          <button
            onClick={edit}
            disabled={isNotSelfComment}
            className="font-primary-light text-xs hover:underline"
            aria-label="Edit comment"
          >
            Edit
          </button>
          <span className="mx-2">{"·"}</span>
          <button
            onClick={remove}
            disabled={isNotSelfComment}
            className="font-primary-light text-xs hover:underline"
            aria-label="Delete comment"
          >
            Delete
          </button>
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex gap-6">
      <UserAvatar {...comment.user} />
      <div style={{ width: "100%" }}>
        <p className="mr-4 inline-block font-primary-bold">
          {comment.user.name}
        </p>
        <span className="font-primary-light text-xs">
          {comment.createdAt ? (
            formatDateTime(comment.createdAt)
          ) : (
            <i>Date undefined</i>
          )}
          {commentIsEdited(comment) && (
            <>
              <span className="mx-2">·</span>
              <span>EDITED</span>
            </>
          )}
        </span>
        <div className="mt-3">
          {isEditing ? (
            <EditBox
              defaultMessage={message}
              save={save}
              cancel={cancel}
              autofocus
            />
          ) : (
            idleComment
          )}
        </div>
        {isReplying && (
          <div className="mt-3 flex gap-4">
            <UserAvatar {...user} />
            <EditBox
              defaultMessage=""
              save={saveReply}
              cancel={cancelReply}
              autofocus
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <ul className="mt-4 space-y-4">
            {comment.replies.map((replyComment) => (
              <li key={replyComment.id}>
                <ViewComment
                  comment={replyComment}
                  removeComment={removeComment}
                  addReply={addReply}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const renderMessageWithMentions = (text: string): JSX.Element[] => {
  const mentionPattern = new RegExp(
    `@(${usersMock
      .map((u) => u.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "g"
  );
  return text.split(mentionPattern).map((part, index) => {
    const mentioned = usersMock.some((u) => u.name === part);
    if (!mentioned) return <span key={index}>{part}</span>;
    return (
      <span
        key={index}
        className="rounded bg-background-brand-subtlest px-1 font-primary-bold font-bold text-font-brand"
      >
        @{part}
      </span>
    );
  });
};

const commentIsEdited = (comment: Comment): boolean => {
  // Convert miliseconds to seconds just in case there is a minimal difference
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
  addReply: (parentId: CommentId, reply: Comment) => void;
}
