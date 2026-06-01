import { forwardRef } from "react";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import cx from "classix";

export const UserCard = forwardRef<HTMLButtonElement, Props>(
  ({ user, isSelected, onSelect, tabIndex }, ref) => {
    const handleClick = () => {
      onSelect(user);
    };

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={tabIndex}
        onClick={handleClick}
        aria-pressed={isSelected}
        className={cx(
          "flex flex-col items-center gap-2 rounded-lg p-3 transition-all",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-brand",
          isSelected
            ? "bg-background-brand-subtlest ring-2 ring-border-brand"
            : "hover:bg-background-neutral-hovered"
        )}
      >
        <UserAvatar {...user} size={64} />
        <span className="font-primary-medium max-w-full truncate text-center text-sm text-font">
          {user.name}
        </span>
      </button>
    );
  }
);

UserCard.displayName = "UserCard";

interface Props {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
  tabIndex: number;
}
