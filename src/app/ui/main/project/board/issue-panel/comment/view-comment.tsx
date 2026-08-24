import { useState } from "react";
import { useFetcher } from "react-router";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import * as AlertDialog from "@app/components/alert-dialog";
import { Tooltip } from "@app/components/tooltip";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
  updateComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;
  const isUnsaved = comment.id.startsWith("temp-");

  const edit = () => {
    if (isNotSelfComment) return;
    setIsEditing(true);
  };
  const cancel = () => setIsEditing(false);

  const remove = () => {
    removeComment(comment.id);

    if (isUnsaved) return;

    fetcher.submit(
      { commentId: comment.id, _action: "deleteComment" },
      { method: "delete" }
    );
  };

  const save = (commentText: string): void => {
    setMessage(commentText);
    updateComment(comment.id, commentText);
    setIsEditing(false);
  };

  const actionButtonClass = cx(
    "font-primary-light text-xs",
    isNotSelfComment
      ? "cursor-not-allowed text-font-disabled"
      : "hover:underline"
  );

  const idleComment = (
    <div className="font-primary-light">
      <p>{message}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 text-font-subtlest">
        <Tooltip
          title="Only the author can edit this comment"
          show={isNotSelfComment}
        >
          <button
            type="button"
            onClick={edit}
            disabled={isNotSelfComment}
            className={actionButtonClass}
            aria-label="Edit comment"
          >
            Edit
          </button>
        </Tooltip>
        <span aria-hidden>·</span>
        {isNotSelfComment ? (
          <Tooltip title="Only the author can delete this comment" show>
            <button
              type="button"
              disabled
              className={actionButtonClass}
              aria-label="Delete comment"
            >
              Delete
            </button>
          </Tooltip>
        ) : (
          <AlertDialog.Root>
            <AlertDialog.Trigger
              type="button"
              className={actionButtonClass}
              aria-label="Delete comment"
            >
              Delete
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay />
              <AlertDialog.Content>
                <AlertDialog.Title>Delete comment?</AlertDialog.Title>
                <AlertDialog.Description>
                  This will permanently remove your comment
                  {isUnsaved
                    ? " from this issue."
                    : ". This action cannot be undone."}
                </AlertDialog.Description>
                <div className="mt-8 flex w-full justify-end gap-4">
                  <AlertDialog.Cancel aria-label="Cancel delete comment">
                    Cancel
                  </AlertDialog.Cancel>
                  <AlertDialog.Action
                    type="button"
                    aria-label="Confirm delete comment"
                    onClick={remove}
                  >
                    Delete
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}
        {isUnsaved && (
          <>
            <span aria-hidden>·</span>
            <span className="text-2xs text-font-warning">Not saved yet</span>
          </>
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
            />
          ) : (
            idleComment
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
  updateComment: (commentId: CommentId, message: string) => void;
}
