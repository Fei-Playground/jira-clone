import { useState } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  getReplies,
  removeComment,
  addReply,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();
  const replies = getReplies(comment.id);

  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => {
    setIsReplying(false);
    setIsEditing(true);
  };
  const cancelEdit = () => setIsEditing(false);

  const reply = () => {
    setIsEditing(false);
    setIsReplying(true);
  };
  const cancelReply = () => setIsReplying(false);

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
    addReply(comment.id, replyText);
    setIsReplying(false);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-0 text-font-subtlest">
        <button
          type="button"
          onClick={reply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        <span
          className={cx("mx-2", isNotSelfComment ? "hidden" : "inline")}
          aria-hidden
        >
          {"·"}
        </span>
        <button
          type="button"
          onClick={edit}
          disabled={isNotSelfComment}
          className={cx(
            "font-primary-light text-xs hover:underline",
            isNotSelfComment && "hidden"
          )}
          aria-label="Edit comment"
        >
          Edit
        </button>
        <span
          className={cx("mx-2", isNotSelfComment ? "hidden" : "inline")}
          aria-hidden
        >
          {"·"}
        </span>
        <button
          type="button"
          onClick={remove}
          disabled={isNotSelfComment}
          className={cx(
            "font-primary-light text-xs hover:underline",
            isNotSelfComment && "hidden"
          )}
          aria-label="Delete comment"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div>
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
                cancel={cancelEdit}
                autofocus
              />
            ) : (
              idleComment
            )}
          </div>
          {isReplying && (
            <div className="mt-4 flex items-start gap-4">
              <UserAvatar {...user} size={32} />
              <EditBox
                defaultMessage=""
                save={saveReply}
                cancel={cancelReply}
                autofocus
                placeholder="Write a reply..."
              />
            </div>
          )}
        </div>
      </div>
      {replies.length > 0 && (
        <ul className="ml-5 mt-4 space-y-4 border-l-2 border-border pl-6">
          {replies.map((replyComment) => (
            <li key={replyComment.id}>
              <ViewComment
                comment={replyComment}
                getReplies={getReplies}
                removeComment={removeComment}
                addReply={addReply}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const commentIsEdited = (comment: Comment): boolean => {
  // Convert miliseconds to seconds just in case there is a minimal difference
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  /** Resolve direct replies nested under a parent comment. */
  getReplies: (parentId: CommentId) => Comment[];
  removeComment: (commentId: CommentId) => void;
  addReply: (parentId: CommentId, message: string) => void;
}
