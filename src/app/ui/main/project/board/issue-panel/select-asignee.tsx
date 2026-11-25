import { useRef, useState } from "react";
import cx from "classix";
import { User, UserId } from "@domain/user";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";

export const SelectAsignee = ({ initAsignee }: Props): JSX.Element => {
  const projectStore = useProjectStore();
  const users = projectStore.project.users;

  const [selectedValue, setSelectedValue] = useState<User>(initAsignee);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // The field keeps the focus while the user is typing in it; the pointer and
  // the arrow keys hand it over to the member they move to.
  const isTypingRef = useRef(false);

  const onValueChange = (userId: UserId) => {
    const asignee = users.find((user) => user.id === userId);

    if (asignee) {
      setSelectedValue(asignee);
    }
  };

  const onOpenChange = (isOpen: boolean): void => {
    isTypingRef.current = isOpen;

    if (!isOpen) {
      setSearch("");
    }
  };

  // Leading and trailing spaces are ignored when matching, so a search of only
  // spaces (or an empty one) lists every member of the project.
  const searchTerm = search.trim().toLowerCase();
  const matchesSearch = (user: User): boolean =>
    searchTerm === "" || user.name.toLowerCase().includes(searchTerm);
  const hasMatches = users.some(matchesSearch);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    // The select runs its own typeahead on the first character typed, which
    // would move focus out of the field, so printable keys stay in the field.
    // The arrow keys still reach the select and move through the members.
    if (isPrintableKey(e)) {
      e.stopPropagation();
    }
  };

  const handleContentKeyDownCapture = (
    e: React.KeyboardEvent<HTMLDivElement>
  ): void => {
    if (isPrintableKey(e)) {
      isTypingRef.current = true;
      // Typing anywhere in the open list searches, so the field keeps working
      // even when the select has just moved focus onto a member.
      if (e.target !== searchInputRef.current) {
        e.preventDefault();
        e.stopPropagation();
        setSearch((previousSearch) => previousSearch + e.key);
        searchInputRef.current?.focus();
      }
      return;
    }

    if (NAVIGATION_KEYS.includes(e.key)) {
      isTypingRef.current = false;
    }
  };

  const handleContentFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
    // The select moves focus onto the selected member when the list opens and
    // whenever the filtered list changes under it, which would leave the next
    // backspace with that member instead of with the field.
    if (isTypingRef.current && e.target !== searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  };

  const handleContentPointerDownCapture = (
    e: React.PointerEvent<HTMLDivElement>
  ): void => {
    if (e.target !== searchInputRef.current) {
      isTypingRef.current = false;
    }
  };

  return (
    <Select.Root
      name="asignee"
      defaultValue={initAsignee.id}
      onValueChange={onValueChange}
      onOpenChange={onOpenChange}
    >
      <Select.Trigger aria-label="Open asignee select">
        <div className="mr-2">
          <UserAvatar {...selectedValue} size={32} />
        </div>
        <Select.Value />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content
        onKeyDownCapture={handleContentKeyDownCapture}
        onFocus={handleContentFocus}
        onPointerDownCapture={handleContentPointerDownCapture}
      >
        <div className="px-2 pb-1 pt-2">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search asignees"
            aria-label="Search asignees"
            autoComplete="off"
            autoFocus
            className={cx(
              "w-full rounded border-none bg-background-input px-2 py-1.5 font-primary-light text-sm text-font outline outline-2 outline-border-input",
              "placeholder:text-font-subtlest hover:bg-background-input-hovered",
              "focus:bg-background-input-pressed focus:outline-border-brand"
            )}
          />
        </div>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {users.map((user) => (
            <Select.Item
              key={user.id}
              value={user.id}
              disabled={!matchesSearch(user)}
              className={cx(!matchesSearch(user) && "hidden")}
            >
              <Select.ItemIndicator />
              <UserAvatar {...user} />
              <Select.ItemText>{user.name}</Select.ItemText>
            </Select.Item>
          ))}
          {!hasMatches && (
            <p className="px-2 py-3 text-center font-primary-light text-xs uppercase text-font-subtlest">
              No members found
            </p>
          )}
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};

const NAVIGATION_KEYS = ["ArrowUp", "ArrowDown", "Home", "End"];

const isPrintableKey = (e: React.KeyboardEvent): boolean => {
  const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
  return !isModifierKey && e.key.length === 1;
};

interface Props {
  initAsignee: User;
}
