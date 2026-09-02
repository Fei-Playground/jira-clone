import { useState } from "react";
import { useFetcher } from "react-router";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Comment, CommentId, CommentReply } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { ReplyBox } from "./reply-box";
import { renderWithMentions } from "./render-with-mentions";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
  onRepliesChange,
  users = [],
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const [replies, setReplies] = useState<CommentReply[]>(comment.replies ?? []);
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

  const addReply = (replyMessage: string): void => {
    const newReply: CommentReply = {
      id: "temp-reply-" + uuid(),
      user,
      message: replyMessage,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    setIsReplying(false);
    onRepliesChange?.(comment.id, updatedReplies);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p className="leading-6">{renderWithMentions(message, users)}</p>
      <div className="mt-3 flex items-center gap-0 text-font-subtlest">
        <span
          className={cx(
            "flex items-center gap-0",
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
        </span>
        <button
          onClick={() => setIsReplying((prev) => !prev)}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        {replies.length > 0 && (
          <span className="ml-2 font-primary-light text-xs text-font-subtlest">
            · {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </span>
        )}
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
              users={users}
            />
          ) : (
            idleComment
          )}
        </div>

        {/* Reply form */}
        {isReplying && !isEditing && (
          <div className="mt-4 flex items-start gap-4">
            <UserAvatar {...user} size={28} />
            <div className="flex-1">
              <ReplyBox
                onSave={addReply}
                onCancel={() => setIsReplying(false)}
                users={users}
              />
            </div>
          </div>
        )}

        {/* Replies list */}
        {replies.length > 0 && (
          <ul className="mt-4 space-y-4 border-l-2 border-border-input pl-4">
            {replies.map((reply) => (
              <li key={reply.id} className="flex gap-4">
                <UserAvatar {...reply.user} size={28} />
                <div>
                  <p className="mr-3 inline-block font-primary-bold text-sm">
                    {reply.user.name}
                  </p>
                  <span className="font-primary-light text-xs text-font-subtlest">
                    {reply.createdAt ? (
                      formatDateTime(reply.createdAt)
                    ) : (
                      <i>Date undefined</i>
                    )}
                  </span>
                  <p className="mt-1 font-primary-light text-sm leading-6">
                    {renderWithMentions(reply.message, users)}
                  </p>
                </div>
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
  onRepliesChange?: (commentId: CommentId, replies: CommentReply[]) => void;
  users?: User[];
}
