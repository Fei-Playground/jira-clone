import { v4 as uuid } from "uuid";
import { Comment } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";

export const CreateReply = ({ addReply }: CreateReplyProps): JSX.Element => {
  const { user } = useUserStore();

  const save = (message: string) => {
    addReply({
      id: "temp-" + uuid(),
      user,
      message,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      replies: [],
    });
  };

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} />
      <EditBox defaultMessage="" save={save} />
    </div>
  );
};

interface CreateReplyProps {
  addReply: (reply: Comment) => void;
}
