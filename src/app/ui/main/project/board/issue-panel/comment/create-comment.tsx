import { v4 as uuid } from "uuid";
import { Comment } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";

export const CreateComment = ({
  addComment,
  mentionUsers,
}: CreateCommentProps): JSX.Element => {
  const { user } = useUserStore();

  const save = (message: string) => {
    addComment({
      id: "temp-" + uuid(),
      user,
      message,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} />
      <EditBox defaultMessage="" save={save} mentionUsers={mentionUsers} />
    </div>
  );
};

interface CreateCommentProps {
  addComment: (comment: Comment) => void;
  mentionUsers?: User[];
}
