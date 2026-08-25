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
  comments,
  addComment,
  removeComment,
  depth = 0,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;
  const isNested = depth > 0;
  const replies = comments.filter((item) => item.parentId === comment.id);
  const hasThread = isReplying || replies.length > 0;

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
    addComment({
      id: "temp-" + uuid(),
      parentId: comment.id,
      user,
      message: replyText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setIsReplying(false);
  };

  const actionButtonClass =
    "font-primary-light text-xs hover:underline disabled:cursor-not-allowed disabled:no-underline";

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 text-font-subtlest">
        <button
          type="button"
          onClick={startReply}
          className={actionButtonClass}
          aria-label="Reply to comment"
        >
          Reply
        </button>
        {!isNotSelfComment && (
          <>
            <span className="mx-2">{"·"}</span>
            <button
              type="button"
              onClick={edit}
              className={actionButtonClass}
              aria-label="Edit comment"
            >
              Edit
            </button>
            <span className="mx-2">{"·"}</span>
            <button
              type="button"
              onClick={remove}
              className={actionButtonClass}
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
    <div className={cx("flex", isNested ? "gap-3" : "gap-6")}>
      <UserAvatar {...comment.user} size={isNested ? 32 : 36} />
      <div className="min-w-0 flex-1">
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
        {hasThread && (
          <div className="ml-2 mt-5 space-y-5 border-l-[3px] border-border-bold pl-6">
            {isReplying && (
              <div className="flex items-start gap-3 rounded-md bg-background-neutral px-3 py-3">
                <UserAvatar {...user} size={28} />
                <div className="min-w-0 flex-1">
                  <EditBox
                    defaultMessage=""
                    placeholder="Write a reply..."
                    save={saveReply}
                    cancel={cancelReply}
                    autofocus
                  />
                </div>
              </div>
            )}
            {replies.map((reply) => (
              <div key={reply.id} className="min-w-0">
                <ViewComment
                  comment={reply}
                  comments={comments}
                  addComment={addComment}
                  removeComment={removeComment}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
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
  comments: Comment[];
  addComment: (comment: Comment) => void;
  removeComment: (commentId: CommentId) => void;
  depth?: number;
}
