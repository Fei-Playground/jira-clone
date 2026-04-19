import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { CreateReply } from "./create-reply";
import { ViewReply } from "./view-reply";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
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
    comment.message = commentText;
    setIsEditing(false);
  };

  const addReply = (newReply: Comment): void => {
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    comment.replies = updatedReplies;
    setIsReplyOpen(false);
  };

  const removeReply = (replyId: CommentId): void => {
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);
    setReplies(updatedReplies);
    comment.replies = updatedReplies;
  };

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
      <div className="mt-3 text-font-subtlest">
        <div
          className={cx(isNotSelfComment ? "hidden" : "visible")}
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
        <div className="mt-2">
          <button
            onClick={() => setIsReplyOpen(!isReplyOpen)}
            className="font-primary-light text-xs hover:underline"
            aria-label="Reply to comment"
          >
            Reply
          </button>
        </div>
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
            />
          ) : (
            <IdleComment />
          )}
        </div>
        {replies.length > 0 || isReplyOpen ? (
          <ReplySection
            replies={replies}
            isReplyOpen={isReplyOpen}
            addReply={addReply}
            removeReply={removeReply}
          />
        ) : null}
      </div>
    </div>
  );
};

const ReplySection = ({
  replies,
  isReplyOpen,
  addReply,
  removeReply,
}: ReplySectionProps): JSX.Element => (
  <div className="mt-4 border-l-2 border-border-input pl-4">
    {isReplyOpen && <CreateReply addReply={addReply} />}
    {replies.length > 0 && (
      <ul className="mt-4 space-y-4">
        {replies.map((reply) => (
          <li key={reply.id}>
            <ViewReply reply={reply} removeReply={removeReply} />
          </li>
        ))}
      </ul>
    )}
  </div>
);

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

interface ReplySectionProps {
  replies: Comment[];
  isReplyOpen: boolean;
  addReply: (reply: Comment) => void;
  removeReply: (replyId: CommentId) => void;
}
