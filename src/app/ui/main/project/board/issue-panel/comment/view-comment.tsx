import { useState } from "react";
import { useFetcher } from "react-router";
import { Comment, CommentId } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";
import { parseMentions } from "@utils/mention-parser";

export const ViewComment = ({
  comment,
  removeComment,
  addReply,
  users = [],
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const reply = () => setIsReplying(true);
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
    addReply(comment.id, replyText);
    setIsReplying(false);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{parseMentions(message)}</p>
      <div className="mt-3 text-font-subtlest">
        <button
          onClick={reply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
        {!isNotSelfComment && (
          <>
            <span className="mx-2">{"·"}</span>
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
                users={users}
              />
            ) : (
              idleComment
            )}
          </div>
        </div>
      </div>
      {isReplying && (
        <div className="ml-16 mt-4 flex items-start gap-6">
          <UserAvatar {...user} />
          <EditBox
            defaultMessage=""
            save={saveReply}
            cancel={cancelReply}
            autofocus
            users={users}
          />
        </div>
      )}
      {/* Render nested replies recursively with left margin for visual hierarchy */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-16 mt-4 space-y-6">
          {comment.replies.map((reply) => (
            <ViewComment
              key={reply.id}
              comment={reply}
              removeComment={removeComment}
              addReply={addReply}
              users={users}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const commentIsEdited = (comment: Comment): boolean => {
  // Compare in seconds to ignore sub-second timestamp drift
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
  addReply: (parentId: CommentId, message: string) => void;
  users?: User[];
}
