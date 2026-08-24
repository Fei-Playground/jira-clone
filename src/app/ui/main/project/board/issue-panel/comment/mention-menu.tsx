import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionMenu = ({
  users,
  activeIndex,
  onSelect,
  onHover,
}: MentionMenuProps): JSX.Element => {
  if (users.length === 0) {
    return (
      <div
        role="listbox"
        aria-label="Mention users"
        className="border-border-default absolute left-0 top-full z-20 mt-1 w-full max-w-sm rounded-md border bg-elevation-surface-overlay py-2 shadow-lg"
      >
        <p className="px-3 py-2 font-primary-light text-sm text-font-subtlest">
          No matching people
        </p>
      </div>
    );
  }

  return (
    <ul
      role="listbox"
      aria-label="Mention users"
      className="border-border-default absolute left-0 top-full z-20 mt-1 max-h-56 w-full max-w-sm overflow-y-auto rounded-md border bg-elevation-surface-overlay py-1 shadow-lg"
    >
      {users.map((user, index) => {
        const isActive = index === activeIndex;
        return (
          <li key={user.id} role="option" aria-selected={isActive}>
            <button
              type="button"
              className={cx(
                "flex w-full items-center gap-3 px-3 py-2 text-left",
                isActive
                  ? "bg-background-neutral-hovered"
                  : "hover:bg-background-neutral-hovered"
              )}
              onMouseDown={(e) => {
                // Prevent textarea blur before click applies the mention
                e.preventDefault();
                onSelect(user);
              }}
              onMouseEnter={() => onHover(index)}
            >
              <UserAvatar {...user} size={28} />
              <span className="font-primary text-sm text-font">
                {user.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

interface MentionMenuProps {
  users: User[];
  activeIndex: number;
  onSelect: (user: User) => void;
  onHover: (index: number) => void;
}
