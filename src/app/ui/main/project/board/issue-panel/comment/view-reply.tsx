import { Reply } from "@domain/comment";
import { UserAvatar } from "@app/components/user-avatar";
import { formatDateTime } from "@utils/formatDateTime";

export const ViewReply = ({ reply }: ViewReplyProps): JSX.Element => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">
        <UserAvatar {...reply.user} size={28} />
      </div>
      <div>
        <p className="mr-2 inline-block font-primary-bold text-sm">
          {reply.user.name}
        </p>
        <span className="font-primary-light text-xs text-font-subtlest">
          {reply.createdAt ? (
            formatDateTime(reply.createdAt)
          ) : (
            <i>Date undefined</i>
          )}
        </span>
        <p className="mt-1 text-sm">{reply.message}</p>
      </div>
    </div>
  );
};

interface ViewReplyProps {
  reply: Reply;
}
