import { useState } from "react";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  comments,
  addComment,
  removeComment,
  depth = 0,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);

  const isNotSelfComment = comment.user.id !== user.id;
  const isNested = depth > 0;
  const replies = comments.filter((c) => c.parentId === comment.id);

  const edit = () => setIsEditing(true);
  const cancelEdit = () => setIsEditing(false);
  const startReply = () => setIsReplying(true);
  const cancelReply = () => setIsReplying(false);

  const remove = () => {
    removeComment(comment.id);
  };

  const save = (commentText: string): void => {
    setMessage(commentText);
    setIsEditing(false);
  };

  const saveReply = (replyText: string): void => {
    addComment({
      id: "temp-" + uuid(),
      user,
      message: replyText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      parentId: comment.id,
    });
    setIsReplying(false);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-0 text-font-subtlest">
        <button
          type="button"
          onClick={startReply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        <span
          className={cx("mx-2", isNotSelfComment ? "hidden" : "inline")}
          aria-hidden
        >
          ·
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
          ·
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        <UserAvatar {...comment.user} size={isNested ? 32 : 36} />
        <div className="w-full">
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
              <UserAvatar {...user} size={28} />
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
        <ul
          className={cx(
            "space-y-4 border-l-2 border-border pl-4",
            isNested ? "ml-8" : "ml-12"
          )}
        >
          {replies.map((reply) => (
            <li key={reply.id}>
              <ViewComment
                comment={reply}
                comments={comments}
                addComment={addComment}
                removeComment={removeComment}
                depth={depth + 1}
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
  comments: Comment[];
  addComment: (comment: Comment) => void;
  removeComment: (commentId: CommentId) => void;
  depth?: number;
}
