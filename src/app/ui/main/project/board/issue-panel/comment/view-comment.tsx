import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import cx from "classix";
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
  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
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
    comment.message = commentText;
    setIsEditing(false);
  };

  const addReply = (newReply: Comment): void => {
    setReplies([...replies, newReply]);
  };

  const removeReply = (replyId: CommentId): void => {
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);
    setReplies(updatedReplies);
  };

  const openReplyInput = () => setIsReplyOpen(true);
  const closeReplyInput = () => setIsReplyOpen(false);

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
      <div
        className={cx(
          "mt-3 text-font-subtlest",
          isNotSelfComment && replies.length === 0 ? "hidden" : "visible"
        )}
      >
        <div>
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
        </div>
        <div className="mt-2">
          <button
            onClick={openReplyInput}
            className="font-primary-light text-xs hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </button>
        </div>
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
        </div>
      </div>
      {(isReplyOpen || replies.length > 0) && (
        <div className="mt-4 border-l-2 border-border-input pl-4">
          {isReplyOpen && (
            <CreateReplyInline
              addReply={addReply}
              onClose={closeReplyInput}
            />
          )}
          {replies.length > 0 && (
            <ul className="mt-4 space-y-4">
              {replies.map((reply) => (
                <li key={reply.id}>
                  <ViewReplyInline
                    reply={reply}
                    removeReply={removeReply}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const CreateReplyInline = ({
  addReply,
  onClose,
}: CreateReplyInlineProps): JSX.Element => {
  const { user } = useUserStore();

  const save = (message: string) => {
    addReply({
      id: "temp-" + uuid(),
      user,
      message,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="flex items-start gap-3">
      <UserAvatar {...user} size="sm" />
      <EditBox defaultMessage="" save={save} cancel={onClose} />
    </div>
  );
};

interface CreateReplyInlineProps {
  addReply: (reply: Comment) => void;
  onClose: () => void;
}

const ViewReplyInline = ({
  reply,
  removeReply,
}: ViewReplyInlineProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fetcher = useFetcher();

  const isNotSelfReply = reply.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const remove = () => {
    removeReply(reply.id);

    if (reply.id.startsWith("temp-")) return;

    fetcher.submit(
      { commentId: reply.id, _action: "deleteComment" },
      { method: "delete" }
    );
  };

  const save = (replyText: string): void => {
    reply.message = replyText;
    setIsEditing(false);
  };

  return (
    <div className="flex gap-3">
      <UserAvatar {...reply.user} size="sm" />
      <div style={{ width: "100%" }}>
        <p className="inline-block font-primary-bold text-sm">
          {reply.user.name}
        </p>
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
              defaultMessage={reply.message}
              save={save}
              cancel={cancel}
              autofocus
            />
          ) : (
            <div className="font-primary-light text-sm">
              <p>{reply.message}</p>
              <div
                className={cx(
                  "mt-2 text-font-subtlest",
                  isNotSelfReply ? "hidden" : "visible"
                )}
              >
                <button
                  onClick={edit}
                  disabled={isNotSelfReply}
                  className="font-primary-light text-xs hover:underline"
                  aria-label="Edit reply"
                >
                  Edit
                </button>
                <span className="mx-2">{"·"}</span>
                <button
                  onClick={remove}
                  disabled={isNotSelfReply}
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

interface ViewReplyInlineProps {
  reply: Comment;
  removeReply: (replyId: CommentId) => void;
}

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
