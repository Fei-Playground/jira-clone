import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import cx from "classix";
import { User, UserId } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import { ScrollArea } from "@app/components/scroll-area";
import { useProjectStore } from "@app/ui/main/project";

const AVATAR_SIZE = 40;
const MAX_DISPLAY_USERS = 4;

export const UserAvatarList = ({ users }: Props): JSX.Element => {
  const { selectedUserIds, setSelectedUserIds } = useProjectStore();
  const displayUsers = users.slice(0, MAX_DISPLAY_USERS);

  const toggleUser = (userId: UserId): void => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <span className="ml-2 flex">
      {displayUsers.map((user, index) => (
        <FilterAvatar
          key={index}
          user={user}
          isSelected={selectedUserIds.includes(user.id)}
          onToggle={toggleUser}
        />
      ))}
      {users.length > MAX_DISPLAY_USERS && (
        <MoreUsers
          users={users}
          selectedUserIds={selectedUserIds}
          onToggle={toggleUser}
        />
      )}
    </span>
  );
};

interface Props {
  users: User[];
}

const FilterAvatar = ({
  user,
  isSelected,
  onToggle,
}: FilterAvatarProps): JSX.Element => {
  const handleClick = (): void => onToggle(user.id);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-label={`Filter issues assigned to ${user.name}`}
      className={cx(
        "z-10 -ml-[5px] cursor-pointer rounded-full border-2 border-border bg-elevation-surface hover:z-20",
        isSelected
          ? "z-20 outline outline-2 outline-border-selected"
          : "hover:outline hover:outline-2 hover:outline-border-brand"
      )}
    >
      <UserAvatar {...user} size={AVATAR_SIZE} tooltip />
    </button>
  );
};

interface FilterAvatarProps {
  user: User;
  isSelected: boolean;
  onToggle: (userId: UserId) => void;
}

const MoreUsers = ({
  users,
  selectedUserIds,
  onToggle,
}: MoreUsersProps): JSX.Element => (
  <div className="bg-elevation-surface">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="-ml-[5px] box-content flex cursor-pointer items-center justify-center rounded-full border-2 border-border bg-background-neutral text-lg text-font hover:underline"
        style={{
          width: `${AVATAR_SIZE}px`,
          height: `${AVATAR_SIZE}px`,
        }}
      >
        {users.length - MAX_DISPLAY_USERS}+
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-50 h-[400px] rounded-md bg-elevation-surface-overlay p-2 shadow-blue">
        <ScrollArea className="pr-4">
          {users.map((user) => (
            <FilterUserItem
              key={user.id}
              user={user}
              isSelected={selectedUserIds.includes(user.id)}
              onToggle={onToggle}
            />
          ))}
        </ScrollArea>
        <DropdownMenu.Arrow className="fill-elevation-surface-overlay" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
);

interface MoreUsersProps {
  users: User[];
  selectedUserIds: UserId[];
  onToggle: (userId: UserId) => void;
}

const FilterUserItem = ({
  user,
  isSelected,
  onToggle,
}: FilterUserItemProps): JSX.Element => {
  // The menu is kept open so more than one person can be selected at a time
  const handleSelect = (event: Event): void => {
    event.preventDefault();
    onToggle(user.id);
  };

  return (
    <DropdownMenu.CheckboxItem
      checked={isSelected}
      onSelect={handleSelect}
      className={cx(
        "mb-1 flex cursor-pointer items-center justify-start gap-3 rounded px-1 py-1 outline-none last:mb-0 focus-visible:outline-none",
        isSelected
          ? "bg-background-selected focus:bg-background-selected-hovered"
          : "focus:bg-background-neutral"
      )}
    >
      <UserAvatar {...user} size={44} />
      <span>{user.name}</span>
    </DropdownMenu.CheckboxItem>
  );
};

interface FilterUserItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (userId: UserId) => void;
}
