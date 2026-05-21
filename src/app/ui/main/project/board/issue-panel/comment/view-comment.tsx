import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { v4 as uuid } from "uuid";
import { Comment, CommentId } from "@domain/comment";
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
  const [isReplying, setIsReplying] = useState<boolean>(false);
  // Initialize replies from comment data to support nested comment threads
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);
  const handleReply = () => setIsReplying(true);
  const handleCancelReply = () => setIsReplying(false);

  const handleRemove = () => {
    removeComment(comment.id);

    // Temporary comments (client-side only) don't need server deletion
    if (comment.id.startsWith("temp-")) return;

    fetcher.submit(
      { commentId: comment.id, _action: "deleteComment" },
      { method: "delete" }
    );
  };

  const handleSave = (commentText: string): void => {
    // Direct mutation for simplicity — comment object is passed by reference
    comment.message = commentText;
    setIsEditing(false);
  };

  const handleSaveReply = (replyText: string): void => {
    // Create a temporary reply with a unique ID for optimistic UI update
    const newReply: Comment = {
      id: `temp-${uuid()}`,
      user,
      message: replyText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setReplies([...replies, newReply]);
    setIsReplying(false);
  };

  const handleRemoveReply = (replyId: CommentId): void => {
    setReplies(replies.filter((reply) => reply.id !== replyId));
  };

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
      <div className="mt-3 flex gap-3 text-xs text-font-subtlest">
        <button
          onClick={handleReply}
          className="font-primary-light hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        {/* Only show edit/delete actions for the comment author */}
        {!isNotSelfComment && (
          <>
            <span>{"·"}</span>
            <button
              onClick={handleEdit}
              className="font-primary-light hover:underline"
              aria-label="Edit comment"
            >
              Edit
            </button>
            <span>{"·"}</span>
            <button
              onClick={handleRemove}
              className="font-primary-light hover:underline"
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
                defaultMessage={comment.message}
                save={handleSave}
                cancel={handleCancelEdit}
                autofocus
              />
            ) : (
              <IdleComment />
            )}
          </div>
          {/* Reply form appears inline below the comment when user clicks Reply */}
          {isReplying && (
            <div className="mt-4 flex gap-6">
              <UserAvatar {...user} />
              <EditBox
                defaultMessage=""
                save={handleSaveReply}
                cancel={handleCancelReply}
                autofocus
              />
            </div>
          )}
        </div>
      </div>
      {/* Nested replies are indented and rendered recursively */}
      {replies.length > 0 && (
        <div className="ml-16 mt-6 space-y-6">
          {replies.map((reply) => (
            <ViewComment
              key={reply.id}
              comment={reply}
              removeComment={handleRemoveReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Checks if a comment has been edited by comparing timestamps.
 * Converts to seconds to avoid false positives from millisecond-level differences.
 */
const commentIsEdited = (comment: Comment): boolean => {
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
}
