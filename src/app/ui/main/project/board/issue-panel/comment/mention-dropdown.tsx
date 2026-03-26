import { useMemo } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionDropdown = ({
  searchTerm,
  users,
  onSelectUser,
  selectedIndex,
}: MentionDropdownProps): JSX.Element | null => {
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter((user) =>
      user.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, users]);

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-48 rounded-md bg-elevation-surface-overlay shadow-md z-50">
      <ul className="py-1 max-h-48 overflow-y-auto">
        {filteredUsers.map((user, index) => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={cx(
              "flex items-center gap-3 px-3 py-2 cursor-pointer",
              index === selectedIndex
                ? "bg-background-selected"
                : "hover:bg-background-neutral-hovered"
            )}
          >
            <UserAvatar {...user} size={24} />
            <span className="font-primary-light text-sm text-font">
              {user.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface MentionDropdownProps {
  searchTerm: string;
  users: User[];
  onSelectUser: (user: User) => void;
  selectedIndex: number;
}
