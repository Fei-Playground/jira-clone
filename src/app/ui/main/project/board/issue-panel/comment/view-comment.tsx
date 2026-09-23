import { useState } from "react";
import { useFetcher } from "react-router";
import { Comment, CommentId } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { newComment } from "./new-comment";
import { splitMentions } from "./mentions";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  replies,
  addComment,
  removeComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const { project } = useProjectStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(comment.message);
  const fetcher = useFetcher();

  const isNotSelfComment = comment.user.id !== user.id;
  // A reply always hangs off the top-level comment, so a thread stays one level deep.
  const threadId = comment.parentId ?? comment.id;

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
    addComment(newComment(user, replyText, threadId));
    setIsReplying(false);
  };

  const commentActions = (
    <div className="mt-3 text-font-subtlest">
      <button
        onClick={startReply}
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
  );

  const idleComment = (
    <div className="font-primary-light">
      <p>{mentionParts(message, project.users)}</p>
      {commentActions}
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
        {isReplying && (
          <div className="mt-3">
            <EditBox
              defaultMessage=""
              placeholder="Write a reply..."
              save={saveReply}
              cancel={cancelReply}
              autofocus
            />
          </div>
        )}
        {replies.length > 0 && (
          <ul className="mt-6 space-y-6 border-l-2 border-border pl-6">
            {replies.map((reply) => (
              <li key={reply.id}>
                <ViewComment
                  comment={reply}
                  replies={[]}
                  addComment={addComment}
                  removeComment={removeComment}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/** The mentions of project members in a message are highlighted. */
const mentionParts = (
  message: string,
  users: User[]
): (string | JSX.Element)[] =>
  splitMentions(message, users).map((part, index) =>
    part.isMention ? (
      <span
        key={index}
        className="rounded-[3px] bg-background-brand-subtlest px-1 font-primary-bold text-font-brand"
      >
        {part.text}
      </span>
    ) : (
      part.text
    )
  );

const commentIsEdited = (comment: Comment): boolean => {
  // Convert miliseconds to seconds just in case there is a minimal difference
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  replies: Comment[];
  addComment: (comment: Comment) => void;
  removeComment: (commentId: CommentId) => void;
}
