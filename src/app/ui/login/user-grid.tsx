import { useState, useRef, useEffect, useMemo } from "react";
import { User } from "@domain/user";
import { UserCard } from "./user-card";

export const UserGrid = ({
  users,
  selectedUser,
  onUserSelect,
}: Props): JSX.Element => {
  const initialFocusedIndex = useMemo(
    () => users.findIndex((user) => user.id === selectedUser.id),
    [users, selectedUser.id]
  );

  const [focusedIndex, setFocusedIndex] = useState<number>(
    initialFocusedIndex !== -1 ? initialFocusedIndex : 0
  );
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Manage focus for keyboard navigation — when focusedIndex changes, focus the corresponding card
  // This enables proper keyboard navigation experience and accessibility for the user grid
  useEffect(() => {
    const card = cardRefs.current[focusedIndex];
    if (card) {
      card.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const colCount = 3;
    let newIndex = focusedIndex;

    switch (e.key) {
      case "ArrowUp":
        // Move up by one row (3-column grid)
        newIndex = Math.max(0, focusedIndex - colCount);
        e.preventDefault();
        break;
      case "ArrowDown":
        // Move down by one row (3-column grid)
        newIndex = Math.min(users.length - 1, focusedIndex + colCount);
        e.preventDefault();
        break;
      case "ArrowLeft":
        // Move left with wrapping for circular navigation
        newIndex = focusedIndex === 0 ? users.length - 1 : focusedIndex - 1;
        e.preventDefault();
        break;
      case "ArrowRight":
        // Move right with wrapping for circular navigation
        newIndex = focusedIndex === users.length - 1 ? 0 : focusedIndex + 1;
        e.preventDefault();
        break;
      case "Enter":
      case " ":
        // Select the currently focused user
        onUserSelect(users[focusedIndex]);
        e.preventDefault();
        break;
      default:
        return;
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
    }
  };

  const handleCardSelect = (user: User) => {
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      setFocusedIndex(index);
    }
    onUserSelect(user);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Select a user"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-3 gap-3"
    >
      {users.map((user, index) => (
        <UserCard
          key={user.id}
          user={user}
          isSelected={user.id === selectedUser.id}
          onSelect={handleCardSelect}
          tabIndex={index === focusedIndex ? 0 : -1}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

interface Props {
  users: User[];
  selectedUser: User;
  onUserSelect: (user: User) => void;
}
