import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionAutocomplete = ({
  isOpen,
  filterText,
  users,
  onSelect,
  position,
}: MentionAutocompleteProps): JSX.Element | null => {
  if (!isOpen || !filterText) {
    return null;
  }

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div
      className="border-border-neutral absolute bottom-full left-0 z-50 mb-1 max-w-xs rounded border bg-elevation-surface-overlay shadow-md"
      style={position}
    >
      <ul className="max-h-48 overflow-y-auto py-1">
        {filtered.map((user) => (
          <li key={user.id}>
            <button
              type="button"
              onClick={() => onSelect(user)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-background-selected"
              aria-label={`Mention ${user.name}`}
            >
              <UserAvatar {...user} size={24} />
              <span className="font-primary-light text-sm">{user.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface MentionAutocompleteProps {
  isOpen: boolean;
  filterText: string;
  users: User[];
  onSelect: (user: User) => void;
  position?: React.CSSProperties;
}
