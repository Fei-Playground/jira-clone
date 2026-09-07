import { useState } from "react";
import { useFetcher } from "react-router";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { MentionMessage } from "./mention-message";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
  mentionUsers,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const [isReplying, setIsReplying] = useState<boolean>(false);
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
    setReplies([
      ...replies,
      {
        id: "temp-" + uuid(),
        user,
        message: replyText,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);
    setIsReplying(false);
  };

  const removeReply = (replyId: CommentId): void => {
    setReplies(replies.filter((reply) => reply.id !== replyId));
  };

  const idleComment = (
    <div className="font-primary-light">
      <MentionMessage message={message} users={mentionUsers ?? []} />
      <div className="mt-3 text-font-subtlest">
        <button
          onClick={startReply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
      </div>
      <div
        className={cx(
          "mt-1 text-font-subtlest",
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
              mentionUsers={mentionUsers}
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
              mentionUsers={mentionUsers}
            />
          </div>
        )}
        {replies.length > 0 && (
          <ul className="mt-4 space-y-4 border-l-2 border-border pl-6">
            {replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                removeReply={removeReply}
                mentionUsers={mentionUsers}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const ReplyItem = ({
  reply,
  removeReply,
  mentionUsers,
}: ReplyItemProps): JSX.Element => {
  const { user } = useUserStore();
  const isSelfReply = reply.user.id === user.id;

  return (
    <li className="flex gap-4">
      <UserAvatar {...reply.user} />
      <div style={{ width: "100%" }}>
        <p className="mr-4 inline-block font-primary-bold">{reply.user.name}</p>
        <span className="font-primary-light text-xs">
          {formatDateTime(reply.createdAt)}
        </span>
        <div className="mt-2 font-primary-light">
          <MentionMessage message={reply.message} users={mentionUsers ?? []} />
          {isSelfReply && (
            <button
              onClick={() => removeReply(reply.id)}
              className="mt-2 font-primary-light text-xs text-font-subtlest hover:underline"
              aria-label="Delete reply"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

interface ReplyItemProps {
  reply: Comment;
  removeReply: (replyId: CommentId) => void;
  mentionUsers?: User[];
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
  mentionUsers?: User[];
}
