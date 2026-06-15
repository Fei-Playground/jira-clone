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
  removeComment,
  onReply,
  isReply,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Local state prevents direct mutation of comment prop
  const [message, setMessage] = useState<string>(comment.message);
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

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 flex gap-2 text-font-subtlest">
        {/* Reply button - visible to all users, hidden for nested replies (single-level threading only) */}
        {!isReply && onReply && (
          <button
            onClick={() => onReply(comment)}
            className="font-primary-light text-xs hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </button>
        )}
        {/* Edit and Delete - only for comment author */}
        {!isNotSelfComment && (
          <>
            {!isReply && onReply && <span className="mx-1">{"·"}</span>}
            <button
              onClick={edit}
              disabled={isNotSelfComment}
              className="font-primary-light text-xs hover:underline"
              aria-label="Edit comment"
            >
              Edit
            </button>
            <span className="mx-1">{"·"}</span>
            <button
              onClick={remove}
              disabled={isNotSelfComment}
              className="font-primary-light text-xs hover:underline"
              aria-label="Delete comment"
            >
              Delete
            </button>
          </>
        )}
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
      </div>
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
  removeComment: (commentId: CommentId) => void;
  onReply?: (comment: Comment) => void;
  isReply?: boolean;
}
