import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import cx from "classix";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewReply = ({
  reply,
  removeReply,
}: ViewReplyProps): JSX.Element => {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fetcher = useFetcher();

  const isNotSelfReply = reply.user.id !== user.id;

  const edit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const remove = () => {
    removeReply(reply.id);

    if (reply.id.startsWith("temp-")) return;

    fetcher.submit(
      { replyId: reply.id, _action: "deleteReply" },
      { method: "delete" }
    );
  };

  const save = (replyText: string): void => {
    reply.message = replyText;
    setIsEditing(false);
  };

  const IdleReply = (): JSX.Element => (
    <div className="font-primary-light text-sm">
      <p>{reply.message}</p>
      <div
        className={cx(
          "mt-2 text-xs text-font-subtlest",
          isNotSelfReply ? "hidden" : "visible"
        )}
      >
        <button
          onClick={edit}
          disabled={isNotSelfReply}
          className="font-primary-light hover:underline"
          aria-label="Edit reply"
        >
          Edit
        </button>
        <span className="mx-1.5">{"·"}</span>
        <button
          onClick={remove}
          disabled={isNotSelfReply}
          className="font-primary-light hover:underline"
          aria-label="Delete reply"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex gap-3">
      <UserAvatar {...reply.user} size={28} />
      <div style={{ width: "100%" }}>
        <div className="flex items-baseline gap-2">
          <p className="font-primary-bold text-sm">{reply.user.name}</p>
          <span className="font-primary-light text-xs text-font-subtlest">
            {reply.createdAt ? (
              formatDateTime(reply.createdAt)
            ) : (
              <i>Date undefined</i>
            )}
            {replyIsEdited(reply) && (
              <>
                <span className="mx-1">·</span>
                <span>EDITED</span>
              </>
            )}
          </span>
        </div>
        <div className="mt-2">
          {isEditing ? (
            <EditBox
              defaultMessage={reply.message}
              save={save}
              cancel={cancel}
              autofocus
            />
          ) : (
            <IdleReply />
          )}
        </div>
      </div>
    </div>
  );
};

const replyIsEdited = (reply: Comment): boolean => {
  const createdAtInSeconds = Math.floor(reply.createdAt / 1000);
  const updatedAtInSeconds = Math.floor(reply.updatedAt / 1000);
  return createdAtInSeconds !== updatedAtInSeconds;
};

interface ViewReplyProps {
  reply: Comment;
  removeReply: (replyId: CommentId) => void;
}
