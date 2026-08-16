import { v4 as uuid } from "uuid";
import { Comment, CommentId } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";

interface ReplyBoxProps {
  parentId: CommentId;
  onReply: (reply: Comment) => void;
  onCancel: () => void;
}

export const ReplyBox = ({
  parentId,
  onReply,
  onCancel,
}: ReplyBoxProps): JSX.Element => {
  const { user } = useUserStore();

  const save = (message: string) => {
    onReply({
      id: "temp-" + uuid(),
      user,
      message,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="mt-3 flex items-start gap-4">
      <UserAvatar {...user} />
      <EditBox defaultMessage="" save={save} cancel={onCancel} autofocus />
    </div>
  );
};
