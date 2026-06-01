import { useState } from "react";
import { useFetcher } from "react-router";
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
  addReply,
  depth = 0,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;
  const canReply = (depth ?? 0) < 2; // Show reply button for depth 0 and 1, hide for depth 2+

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

  const saveReply = (replyText: string): void => {
    if (addReply) {
      const newReply: Comment = {
        id: "temp-" + uuid(),
        user,
        message: replyText,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        parentId: comment.id,
        replies: [],
      };
      addReply(comment.id, newReply);
      setIsReplying(false);
    }
  };

  const cancelReply = () => {
    setIsReplying(false);
  };

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 text-font-subtlest flex items-center">
        {!isNotSelfComment && (
          <>
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
        {canReply && (
          <>
            {!isNotSelfComment && <span className="mx-2">{"·"}</span>}
            <button
              onClick={() => setIsReplying(true)}
              className="font-primary-light text-xs hover:underline"
              aria-label="Reply to comment"
            >
              Reply
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={cx("flex gap-6", depth > 0 && "ml-12")}>
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

        {/* Inline reply box */}
        {isReplying && (
          <div className="mt-4 flex items-start gap-6">
            <UserAvatar {...user} />
            <EditBox
              defaultMessage={`@${comment.user.name.split(" ")[0]} `}
              save={saveReply}
              cancel={cancelReply}
              autofocus
            />
          </div>
        )}

        {/* Render replies */}
        {((comment.replies ?? []).length > 0) && (
          <ul className="mt-6 space-y-6">
            {(comment.replies ?? []).map((reply) => (
              <li key={reply.id}>
                <ViewComment
                  comment={reply}
                  removeComment={removeComment}
                  addReply={addReply}
                  depth={(depth ?? 0) + 1}
                />
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
  addReply?: (parentId: CommentId, reply: Comment) => void;
  depth?: number;
}
