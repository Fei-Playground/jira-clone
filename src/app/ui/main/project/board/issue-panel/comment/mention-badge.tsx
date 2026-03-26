import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionBadge = ({ user }: MentionBadgeProps): JSX.Element => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background-brand-subtlest hover:bg-background-brand-subtlest-hovered text-font-brand font-primary-light text-sm cursor-pointer transition-colors">
      <UserAvatar {...user} size={16} />
      {user.name}
    </span>
  );
};

interface MentionBadgeProps {
  user: User;
}
