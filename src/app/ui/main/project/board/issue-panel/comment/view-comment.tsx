import { useState } from "react";
import { useFetcher } from "react-router";
import { v4 as uuid } from "uuid";
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
  addComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);
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

  const saveReply = (replyMessage: string): void => {
    addComment({
      id: "temp-" + uuid(),
      user,
      message: replyMessage,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      parentId: comment.id,
    });
    setIsReplying(false);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 flex items-center text-font-subtlest">
        <button
          type="button"
          onClick={() => setIsReplying(true)}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        <span className={cx("mx-2", isNotSelfComment ? "hidden" : "visible")}>
          {"·"}
        </span>
        <button
          type="button"
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
          type="button"
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
                cancel={cancel}
                autofocus
              />
            ) : (
              idleComment
            )}
          </div>
        </div>
      </div>

      {/* Inline reply box */}
      {isReplying && (
        <div className="ml-14 mt-4">
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
        <ul className="ml-14 mt-4 space-y-4 border-l-2 border-border-input pl-4">
          {replies.map((reply) => (
            <li key={reply.id}>
              <ReplyComment reply={reply} removeComment={removeComment} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Simplified reply display component
const ReplyComment = ({
  reply,
  removeComment,
}: {
  reply: Comment;
  removeComment: (id: CommentId) => void;
}): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(reply.message);
  const fetcher = useFetcher();

  const isNotSelfComment = reply.user.id !== user.id;

  const remove = () => {
    removeComment(reply.id);
    if (reply.id.startsWith("temp-")) return;
    fetcher.submit(
      { commentId: reply.id, _action: "deleteComment" },
      { method: "delete" }
    );
  };

  const save = (text: string) => {
    setMessage(text);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-4">
      <UserAvatar {...reply.user} />
      <div style={{ width: "100%" }}>
        <p className="mr-4 inline-block font-primary-bold">{reply.user.name}</p>
        <span className="font-primary-light text-xs">
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
              cancel={() => setIsEditing(false)}
              autofocus
            />
          ) : (
            <div className="font-primary-light">
              <p>{message}</p>
              <div
                className={cx(
                  "mt-2 text-font-subtlest",
                  isNotSelfComment ? "hidden" : "visible"
                )}
              >
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isNotSelfComment}
                  className="font-primary-light text-xs hover:underline"
                  aria-label="Edit reply"
                >
                  Edit
                </button>
                <span className="mx-2">·</span>
                <button
                  type="button"
                  onClick={remove}
                  disabled={isNotSelfComment}
                  className="font-primary-light text-xs hover:underline"
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
  // Convert milliseconds to seconds just in case there is a minimal difference
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  replies?: Comment[];
  removeComment: (commentId: CommentId) => void;
  addComment: (comment: Comment) => void;
}
