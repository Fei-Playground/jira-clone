import { v4 as uuid } from "uuid";
import { Comment } from "@domain/comment";
import { User } from "@domain/user";
import { useUserStore } from "@app/store/user.store";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";

export const CreateComment = ({
  addComment,
}: CreateCommentProps): JSX.Element => {
  const { user } = useUserStore();
  const projectStore = useProjectStore();
  const users = projectStore.project.users;

  const save = (message: string, mentions?: User[]) => {
    addComment({
      id: "temp-" + uuid(),
      user,
      message,
      mentions: mentions?.map((u) => u.id),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} />
      <EditBox defaultMessage="" save={save} users={users} />
    </div>
  );
};

interface CreateCommentProps {
  addComment: (comment: Comment) => void;
}
