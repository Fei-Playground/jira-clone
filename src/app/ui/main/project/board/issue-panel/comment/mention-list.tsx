import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionList = ({
  users,
  highlightedIndex,
  onSelect,
}: MentionListProps): JSX.Element => (
  <ul
    role="listbox"
    aria-label="Mention a user"
    className="absolute left-2 top-full z-50 mt-1 max-h-[220px] w-[260px] overflow-y-auto rounded-md bg-elevation-surface-overlay p-1 shadow-md"
  >
    {users.map((user, index) => (
      <li
        key={user.id}
        role="option"
        aria-selected={index === highlightedIndex}
        // Selecting on mouse down keeps the textarea focused, so the
        // picked name lands where the caret already is.
        onMouseDown={(event) => {
          event.preventDefault();
          onSelect(user);
        }}
        className={cx(
          "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-primary-light text-sm",
          index === highlightedIndex
            ? "bg-background-neutral"
            : "hover:bg-background-neutral"
        )}
      >
        <UserAvatar {...user} size={24} />
        <span>{user.name}</span>
      </li>
    ))}
  </ul>
);

interface MentionListProps {
  users: User[];
  highlightedIndex: number;
  onSelect: (user: User) => void;
}
