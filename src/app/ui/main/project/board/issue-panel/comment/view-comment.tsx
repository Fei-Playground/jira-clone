import { useState } from "react";
import { useFetcher } from "react-router";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { CommentMessage } from "./comment-message";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);
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

  const startReply = () => setIsReplying(true);
  const cancelReply = () => setIsReplying(false);

  const saveReply = (replyText: string): void => {
    const reply: Comment = {
      id: "temp-" + uuid(),
      user,
      message: replyText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setReplies([...replies, reply]);
    setIsReplying(false);
  };

  const removeReply = (replyId: CommentId): void => {
    setReplies(replies.filter((reply) => reply.id !== replyId));
  };

  const idleComment = (
    <div className="font-primary-light">
      <CommentMessage message={message} />
      <div className="mt-3 text-font-subtlest">
        <button
          onClick={startReply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        <span className={cx("mx-2", isNotSelfComment ? "hidden" : "visible")}>
          {"·"}
        </span>
        <button
          onClick={edit}
          disabled={isNotSelfComment}
          className={cx(
            "font-primary-light text-xs hover:underline",
            isNotSelfComment ? "hidden" : "visible"
          )}
          aria-label="Edit comment"
        >
          Edit
        </button>
        <span className={cx("mx-2", isNotSelfComment ? "hidden" : "visible")}>
          {"·"}
        </span>
        <button
          onClick={remove}
          disabled={isNotSelfComment}
          className={cx(
            "font-primary-light text-xs hover:underline",
            isNotSelfComment ? "hidden" : "visible"
          )}
          aria-label="Delete comment"
        >
          Delete
        </button>
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
          <div className="mt-4 flex items-start gap-4">
            <UserAvatar {...user} />
            <EditBox
              defaultMessage=""
              save={saveReply}
              cancel={cancelReply}
              autofocus
            />
          </div>
        )}
        {replies.length > 0 && (
          <ul className="mt-4 space-y-4 border-l-2 border-border pl-4">
            {replies.map((reply) => (
              <li key={reply.id}>
                <ViewComment comment={reply} removeComment={removeReply} />
              </li>
            ))}
          </ul>
        )}
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
}
