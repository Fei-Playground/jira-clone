import { useState } from "react";
import { useFetcher } from "react-router";
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
  /**
   * Local copy of message to avoid mutating the comment prop directly.
   * Allows optimistic UI updates when editing without affecting parent state.
   */
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  // Only the original comment author can edit or delete their comment
  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const remove = () => {
    removeComment(comment.id);

    // Temporary comments (optimistically added) don't need server deletion
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
        {/**
         * Reply button: visible to all users on top-level comments only.
         * Hidden for nested replies to enforce single-level threading.
         */}
        {!isReply && onReply && (
          <button
            onClick={() => onReply(comment)}
            className="font-primary-light text-xs hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </button>
        )}
        {/**
         * Edit and Delete buttons: only visible to the comment author.
         */}
        {!isNotSelfComment && (
          <>
            {!isReply && onReply && <span className="mx-1">{"·"}</span>}
            <button
              onClick={edit}
              className="font-primary-light text-xs hover:underline"
              aria-label="Edit comment"
            >
              Edit
            </button>
            <span className="mx-1">{"·"}</span>
            <button
              onClick={remove}
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

/**
 * Determines if a comment has been edited by comparing creation and update timestamps.
 * Converts to seconds to avoid false positives from millisecond-level precision differences.
 */
const commentIsEdited = (comment: Comment): boolean => {
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
  /** Called when the user clicks Reply — passes the comment being replied to up to the parent. */
  onReply?: (comment: Comment) => void;
  /** True when this component is rendering a threaded reply (hides the Reply button to enforce single-level threading). */
  isReply?: boolean;
}
