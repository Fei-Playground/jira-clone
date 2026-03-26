import { v4 as uuid } from "uuid";
import { Comment, Mention } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";

export const CreateComment = ({
  addComment,
}: CreateCommentProps): JSX.Element => {
  const { user } = useUserStore();

  const save = (message: string, mentions: Mention[] = []) => {
    addComment({
      id: "temp-" + uuid(),
      user,
      message,
      mentions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} />
      <EditBox defaultMessage="" save={save} />
    </div>
  );
};

interface CreateCommentProps {
  addComment: (comment: Comment) => void;
}
