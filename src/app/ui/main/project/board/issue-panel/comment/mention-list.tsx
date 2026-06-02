import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionList = ({
  mentionedUsers,
}: MentionListProps): JSX.Element | null => {
  if (!mentionedUsers || mentionedUsers.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {mentionedUsers.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-1.5 rounded-full bg-background-neutral px-3 py-1.5"
        >
          <UserAvatar {...user} size={20} />
          <span className="font-primary-light text-xs">{user.name}</span>
        </div>
      ))}
    </div>
  );
};

interface MentionListProps {
  mentionedUsers?: User[];
}
