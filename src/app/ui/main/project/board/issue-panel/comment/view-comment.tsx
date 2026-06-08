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
  level = 0,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
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

  const removeReply = (replyId: CommentId): void => {
    const updatedReplies = replies.filter((r) => r.id !== replyId);
    setReplies(updatedReplies);
  };

  const handleReply = () => {
    onReply(comment.user.name.split(" ")[0], comment.id);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div
        className={cx(
          "mt-3 text-font-subtlest",
          isNotSelfComment ? "hidden" : "visible"
        )}
      >
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
        <span className="mx-2">{"·"}</span>
        <button
          onClick={handleReply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
      </div>
    </div>
  );

  const replyIdleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 text-font-subtlest">
        <button
          onClick={edit}
          disabled={isNotSelfComment}
          className="font-primary-light text-xs hover:underline"
          aria-label="Edit reply"
        >
          Edit
        </button>
        {!isNotSelfComment && (
          <>
            <span className="mx-2">{"·"}</span>
            <button
              onClick={remove}
              disabled={isNotSelfComment}
              className="font-primary-light text-xs hover:underline"
              aria-label="Delete reply"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
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
            ) : level === 0 ? (
              idleComment
            ) : (
              replyIdleComment
            )}
          </div>
        </div>
      </div>

      {/* Render nested replies */}
      {replies.length > 0 && (
        <ul className="border-border-subtle ml-10 mt-6 space-y-6 border-l-2 pl-6">
          {replies.map((reply) => (
            <li key={reply.id}>
              <ViewComment
                comment={reply}
                removeComment={removeReply}
                onReply={onReply}
                level={level + 1}
              />
            </li>
          ))}
        </ul>
      )}
    </>
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
  onReply: (firstName: string, parentCommentId: CommentId) => void;
  level?: number;
}
