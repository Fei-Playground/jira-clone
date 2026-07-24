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
  replies = [],
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
  const startReply = () => setIsReplying(true);
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
    if (addReply) {
      addReply(comment.id, replyText);
    }
    setIsReplying(false);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 flex items-center gap-0 text-font-subtlest">
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

        {/* Inline reply input */}
        {isReplying && (
          <div className="mt-4 flex items-start gap-4">
            <UserAvatar {...user} size={28} />
            <EditBox
              defaultMessage=""
              save={saveReply}
              cancel={cancelReply}
              autofocus
            />
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <ul className="mt-4 space-y-4">
            {replies.map((reply) => (
              <li key={reply.id}>
                <ReplyComment reply={reply} removeComment={removeComment} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/** Compact inline component for rendering a reply (no further nesting). */
const ReplyComment = ({
  reply,
  removeComment,
}: ReplyCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(reply.message);
  const fetcher = useFetcher();

  const isNotSelfReply = reply.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const remove = () => {
    removeComment(reply.id);
    if (reply.id.startsWith("temp-")) return;
    fetcher.submit(
      { commentId: reply.id, _action: "deleteComment" },
      { method: "delete" }
    );
  };

  const save = (text: string): void => {
    setMessage(text);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-4">
      <UserAvatar {...reply.user} size={28} />
      <div style={{ width: "100%" }}>
        <p className="mr-3 inline-block font-primary-bold text-sm">
          {reply.user.name}
        </p>
        <span className="font-primary-light text-xs text-font-subtlest">
          {reply.createdAt ? (
            formatDateTime(reply.createdAt)
          ) : (
            <i>Date undefined</i>
          )}
          {commentIsEdited(reply) && (
            <>
              <span className="mx-2">·</span>
              <span>EDITED</span>
            </>
          )}
        </span>
        <div className="mt-2">
          {isEditing ? (
            <EditBox
              defaultMessage={message}
              save={save}
              cancel={cancel}
              autofocus
            />
          ) : (
            <div className="font-primary-light">
              <p className="text-sm">{message}</p>
              <div className="mt-2 flex items-center gap-0 text-font-subtlest">
                <button
                  onClick={edit}
                  disabled={isNotSelfReply}
                  className={cx(
                    "font-primary-light text-xs hover:underline",
                    isNotSelfReply ? "hidden" : "visible"
                  )}
                  aria-label="Edit reply"
                >
                  Edit
                </button>
                <span
                  className={cx("mx-2", isNotSelfReply ? "hidden" : "visible")}
                >
                  {"·"}
                </span>
                <button
                  onClick={remove}
                  disabled={isNotSelfReply}
                  className={cx(
                    "font-primary-light text-xs hover:underline",
                    isNotSelfReply ? "hidden" : "visible"
                  )}
                  aria-label="Delete reply"
                >
                  Delete
                </button>
              </div>
            </div>
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
  replies?: Comment[];
  removeComment: (commentId: CommentId) => void;
  addReply?: (parentId: CommentId, message: string) => void;
}

interface ReplyCommentProps {
  reply: Comment;
  removeComment: (commentId: CommentId) => void;
}
