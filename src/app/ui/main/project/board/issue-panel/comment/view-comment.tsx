import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import cx from "classix";
import { AiOutlinePaperClip } from "react-icons/ai";
import { Comment, CommentId, Attachment } from "@domain/comment";
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

  const save = (commentText: string, attachments: Attachment[]): void => {
    comment.message = commentText;
    comment.attachments = attachments;
    setIsEditing(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
      {comment.attachments && comment.attachments.length > 0 && (
        <div className="mt-3 rounded border border-border-brand bg-background-brand-subtlest p-2">
          <p className="mb-2 text-xs font-primary-bold text-font">
            Attachments ({comment.attachments.length})
          </p>
          <ul className="space-y-1">
            {comment.attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center gap-2 rounded bg-background-brand-subtlest-hovered p-2"
              >
                <AiOutlinePaperClip size={14} className="flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-primary-light text-font">
                    {attachment.fileName}
                  </p>
                  <p className="text-2xs font-primary-light text-font-subtlest">
                    {formatFileSize(attachment.fileSize)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
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
              defaultAttachments={comment.attachments || []}
            />
          ) : (
            <IdleComment />
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
