import { useState, useEffect, useRef } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

export const MentionSuggestions = ({
  users,
  query,
  onSelect,
  onClose,
  position,
}: MentionSuggestionsProps): JSX.Element | null => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeItem = listRef.current.children[
        activeIndex
      ] as HTMLElement | null;
      if (activeItem) {
        activeItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  // Handle keyboard navigation (arrows, enter, escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredUsers.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredUsers.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredUsers[activeIndex]) {
            onSelect(filteredUsers[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, filteredUsers, onSelect, onClose]);

  if (filteredUsers.length === 0) {
    return (
      <div
        className="absolute z-50 mt-1 w-64 rounded-md bg-elevation-surface-overlay p-3 text-sm shadow-md"
        style={{ top: position.top, left: position.left }}
      >
        <p className="font-primary-light text-font-subtlest">No users found</p>
      </div>
    );
  }

  return (
    <div
      className="absolute z-50 mt-1 w-64 rounded-md bg-elevation-surface-overlay shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      <ul
        ref={listRef}
        role="listbox"
        className="max-h-60 overflow-y-auto py-1"
        aria-label="User suggestions"
      >
        {filteredUsers.map((user, index) => (
          <li
            key={user.id}
            role="option"
            aria-selected={index === activeIndex}
            className={cx(
              "flex cursor-pointer items-center gap-3 px-3 py-2",
              "font-primary-light text-sm transition-colors duration-100",
              index === activeIndex
                ? "bg-background-neutral-hovered"
                : "hover:bg-background-neutral-hovered"
            )}
            onClick={() => onSelect(user)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <UserAvatar {...user} size={24} />
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface MentionSuggestionsProps {
  users: User[];
  query: string;
  onSelect: (user: User) => void;
  onClose: () => void;
  position: {
    top: number;
    left: number;
  };
}
