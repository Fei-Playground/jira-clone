import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionList = ({
  users,
  activeIndex,
  onSelect,
  onHover,
}: MentionListProps): JSX.Element => {
  return (
    <ul
      role="listbox"
      aria-label="Mention a user"
      className="absolute left-0 top-full z-10 mt-1 max-h-56 w-64 overflow-y-auto rounded-md bg-elevation-surface-overlay py-1 shadow-lg"
    >
      {users.map((user, index) => (
        <li key={user.id} role="option" aria-selected={index === activeIndex}>
          <button
            type="button"
            // onMouseDown so the selection fires before the textarea blur
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(user);
            }}
            onMouseEnter={() => onHover(index)}
            className={cx(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
              index === activeIndex && "bg-background-neutral"
            )}
          >
            <UserAvatar {...user} size={24} />
            <span className="font-primary-light">{user.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

interface MentionListProps {
  users: User[];
  activeIndex: number;
  onSelect: (user: User) => void;
  onHover: (index: number) => void;
}
