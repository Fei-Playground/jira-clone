import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { LikeDislikeButtons } from "./like-dislike-buttons";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
  onReplyAdded,
  depth = 0,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const openReply = () => setIsReplying(true);
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
    comment.message = commentText;
    setIsEditing(false);
  };

  const saveReply = (replyText: string): void => {
    const newReply: Comment = {
      id: "temp-" + uuid(),
      user,
      message: replyText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    comment.replies = updatedReplies;
    setIsReplying(false);

    if (onReplyAdded) {
      onReplyAdded(comment);
    }
  };

  const handleReplyRemoved = (replyId: CommentId): void => {
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);
    setReplies(updatedReplies);
    comment.replies = updatedReplies;

    if (onReplyAdded) {
      onReplyAdded(comment);
    }
  };

  const handleNestedReplyAdded = (updatedReply: Comment): void => {
    const updatedReplies = replies.map((reply) =>
      reply.id === updatedReply.id ? updatedReply : reply
    );
    setReplies(updatedReplies);
    comment.replies = updatedReplies;

    if (onReplyAdded) {
      onReplyAdded(comment);
    }
  };

  // Maximum nesting depth: 0 (top-level) → 1 (reply) → 2 (reply-to-reply) → stop
  const maxDepth = 2;
  const canReply = depth < maxDepth;

  // Update parent when reaction counts change and notify of comment modification
  const handleReactionChange = (counts: {
    like_count: number;
    dislike_count: number;
  }): void => {
    comment.like_count = counts.like_count;
    comment.dislike_count = counts.dislike_count;

    if (onReplyAdded) {
      onReplyAdded(comment);
    }
  };

  const CommentActions = (): JSX.Element => (
    <div
      className={cx(
        "text-font-subtlest",
        // Hide actions if not the author and cannot reply
        isNotSelfComment && !canReply ? "hidden" : "visible"
      )}
    >
      {canReply && (
        <>
          <button
            onClick={openReply}
            className="font-primary-light text-xs hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </button>
          <span className="mx-2">{"·"}</span>
        </>
      )}
      {!isNotSelfComment && (
        <>
          <button
            onClick={edit}
            className="font-primary-light text-xs hover:underline"
            aria-label="Edit comment"
          >
            Edit
          </button>
          <span className="mx-2">{"·"}</span>
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
  );

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
      <div className="mt-3 flex flex-col gap-3">
        <LikeDislikeButtons
          commentId={comment.id}
          initialLikeCount={comment.like_count || 0}
          initialDislikeCount={comment.dislike_count || 0}
          onCountsChange={handleReactionChange}
        />
        <CommentActions />
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
                save={save}
                cancel={cancel}
                autofocus
              />
            ) : (
              <IdleComment />
            )}
          </div>

          {isReplying && (
            <div className="mt-4 flex items-start gap-6">
              <UserAvatar {...user} />
              <EditBox
                defaultMessage=""
                save={saveReply}
                cancel={cancelReply}
                autofocus
              />
            </div>
          )}

          {replies && replies.length > 0 && (
            <ul
              className={cx(
                "mt-4 space-y-6 border-l-2 border-border pl-4",
                "ml-8"
              )}
            >
              {replies.map((reply) => (
                <li key={reply.id}>
                  <ViewComment
                    comment={reply}
                    removeComment={handleReplyRemoved}
                    onReplyAdded={handleNestedReplyAdded}
                    depth={depth + 1}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Detect if a comment was edited by comparing created and updated timestamps
// Converts to seconds to handle potential sub-second time differences from rounding
const commentIsEdited = (comment: Comment): boolean => {
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
  onReplyAdded?: (comment: Comment) => void;
  depth?: number;
}
