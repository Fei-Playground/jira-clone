import { useState } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

const IdleComment = ({
  comment,
  isNotSelfComment,
  edit,
  remove,
}: {
  comment: Comment;
  isNotSelfComment: boolean;
  edit: () => void;
  remove: () => void;
}): JSX.Element => (
  <div className="font-primary-light">
    <p>{comment.message}</p>
    <div
      className={cx(
        "mt-3 text-font-subtlest",
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

export const ViewComment = ({
  comment,
  removeComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const save = (commentText: string): void => {
    // TODO: Implement comment update via parent callback or state management
    // For now, just close the edit mode
    setIsEditing(false);
  };

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
              defaultMessage={comment.message}
              save={save}
              cancel={cancel}
              autofocus
            />
          ) : (
            <IdleComment
              comment={comment}
              isNotSelfComment={isNotSelfComment}
              edit={edit}
              remove={remove}
            />
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
  removeComment: (commentId: CommentId) => void;
}
