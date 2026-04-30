import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { CreateComment } from "./create-comment";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
  addComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
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
    comment.message = commentText;
    setIsEditing(false);
  };

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
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

  const handleAddReply = (newComment: Comment): void => {
    addComment(newComment);
    setIsReplying(false);
  };

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
      {isReplying && (
        <div className="ml-16 mt-4">
          <CreateComment addComment={handleAddReply} />
          <button
            onClick={cancelReply}
            className="mt-2 font-primary-light text-xs text-font-subtlest hover:underline"
            aria-label="Cancel reply"
          >
            Cancel
          </button>
        </div>
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
  removeComment: (commentId: CommentId) => void;
  addComment: (comment: Comment) => void;
}
