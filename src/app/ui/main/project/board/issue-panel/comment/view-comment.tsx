import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import cx from "classix";
import { v4 as uuid } from "uuid";
import { Comment, CommentId } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { MentionList } from "./mention-list";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewComment = ({
  comment,
  removeComment,
}: ViewCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const projectStore = useProjectStore();
  const users = projectStore.project.users;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplyingTo, setIsReplyingTo] = useState<boolean>(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const fetcher = useFetcher();

  // Edit/Delete actions are only available to comment author
  const isNotSelfComment = comment.user.id !== user.id;
  // Determine if we should show the "Show N replies" button
  const hasReplies = replies.length > 0;

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

  const save = (commentText: string, mentions?: User[]): void => {
    comment.message = commentText;
    comment.mentions = mentions?.map((u) => u.id);
    setIsEditing(false);
  };

  const startReply = () => setIsReplyingTo(true);
  const cancelReply = () => setIsReplyingTo(false);

  // Create a new reply and add it to the replies list
  // Temporary IDs use "temp-" prefix until persisted to backend
  const saveReply = (replyText: string, mentions?: User[]): void => {
    const newReply: Comment = {
      id: `temp-${uuid()}`,
      user,
      message: replyText,
      mentions: mentions?.map((u) => u.id),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setReplies([...replies, newReply]);
    setIsReplyingTo(false);
  };

  const removeReply = (replyId: CommentId): void => {
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);
    setReplies(updatedReplies);
  };

  // Resolve mentioned user IDs to User objects for display in MentionList
  const getMentionedUsers = (): User[] => {
    if (!comment.mentions) return [];
    return comment.mentions
      .map((mentionId) => users.find((u) => u.id === mentionId))
      .filter((u) => u !== undefined) as User[];
  };

  const IdleComment = (): JSX.Element => (
    <div className="font-primary-light">
      <p>{comment.message}</p>
      <MentionList mentionedUsers={getMentionedUsers()} />
      {/* Edit/Delete only visible to the comment author */}
      <div className="mt-3 flex items-center text-font-subtlest">
        <div
          className={cx(
            "flex items-center",
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
        </div>
        {/* Reply is always available to any user */}
        <button
          onClick={startReply}
          className="font-primary-light text-xs hover:underline"
          aria-label="Reply to comment"
        >
          Reply
        </button>
      </div>
    </div>
  );

  return (
    <>
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
                users={users}
              />
            ) : (
              <IdleComment />
            )}
          </div>

          {/* Reply composition box shown when user clicks "Reply" */}
          {isReplyingTo && (
            <div className="mt-4">
              <EditBox
                defaultMessage=""
                save={saveReply}
                cancel={cancelReply}
                autofocus
                users={users}
              />
            </div>
          )}

          {/* Replies section with show/hide toggle */}
          {hasReplies && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="font-primary-light text-xs text-font-subtle hover:underline"
                aria-label={showReplies ? "Hide replies" : "Show replies"}
              >
                {showReplies ? "Hide" : "Show"} {replies.length}{" "}
                {replies.length === 1 ? "reply" : "replies"}
              </button>

              {/* Recursively render replies using ViewComment component */}
              {showReplies && (
                <ul className="border-border-neutral mt-4 space-y-6 border-l-2 pl-6">
                  {replies.map((reply) => (
                    <li key={reply.id}>
                      <ViewComment
                        comment={reply}
                        removeComment={removeReply}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Determine if a comment has been edited after creation.
// Compares timestamps at second precision to avoid false positives from minor timing differences.
const commentIsEdited = (comment: Comment): boolean => {
  const createdAtInSeconds = Math.floor(comment.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(comment.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewCommentProps {
  comment: Comment;
  removeComment: (commentId: CommentId) => void;
}
