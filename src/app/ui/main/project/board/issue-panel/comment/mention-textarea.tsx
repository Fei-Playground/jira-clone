import { useState, useRef, useLayoutEffect } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

interface MentionTextareaProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  autofocus?: boolean;
  textareaClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  users: User[];
}

export const MentionTextarea = ({
  name,
  value,
  setValue,
  placeholder,
  autofocus,
  textareaClassName,
  onFocus,
  onBlur,
  users,
}: MentionTextareaProps): JSX.Element => {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState<number>(-1);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [textareaHeight, setTextareaHeight] = useState<number>(40);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtered users from the current @ query
  const filteredUsers =
    mentionQuery !== null
      ? users.filter((u) =>
          u.name.toLowerCase().includes(mentionQuery.toLowerCase())
        )
      : [];

  // Auto-height mirroring
  useLayoutEffect(() => {
    if (!mirrorRef.current) return;
    setTextareaHeight(mirrorRef.current.scrollHeight);
  }, [value]);

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value;
    const cursor = e.currentTarget.selectionStart ?? newValue.length;
    setValue(newValue);

    // Detect @ trigger: find the last @ before cursor with no space after it
    const textBeforeCursor = newValue.slice(0, cursor);
    const atMatch = textBeforeCursor.match(/@([\w\s]*)$/);
    if (atMatch) {
      const newQuery = atMatch[1];
      if (newQuery !== mentionQuery) {
        setActiveIndex(0);
      }
      setMentionQuery(newQuery);
      setMentionStart(cursor - atMatch[0].length);
    } else {
      setMentionQuery(null);
      setMentionStart(-1);
      setActiveIndex(0);
    }
  };

  const insertMention = (user: User) => {
    const before = value.slice(0, mentionStart);
    const after = value.slice(mentionStart + 1 + (mentionQuery?.length ?? 0));
    const inserted = `@${user.name} `;
    const newValue = before + inserted + after;
    setValue(newValue);
    setMentionQuery(null);
    setMentionStart(-1);

    // Restore focus + cursor position after React re-renders
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursor = before.length + inserted.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery === null || filteredUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredUsers.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const target = filteredUsers[activeIndex];
      if (target) insertMention(target);
    } else if (e.key === "Escape") {
      setMentionQuery(null);
      setMentionStart(-1);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const len = target.value.length;
    target.setSelectionRange(len, len);
    if (onFocus) onFocus();
  };

  const valueIsNotOnlySpaces = () => !/^( )\1*$/.test(value);

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        name={name}
        className={cx(
          "box-border w-full resize-none overflow-y-hidden rounded-md border-none bg-background-input p-3 text-font outline-2 hover:bg-background-input-hovered focus-visible:bg-background-input-pressed",
          textareaClassName
        )}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={onBlur}
        style={{ height: `${textareaHeight}px` }}
        autoFocus={autofocus}
      />
      {/* height mirror */}
      <p
        ref={mirrorRef}
        className={cx(
          "absolute left-0 top-0 -z-10 box-border overflow-y-hidden p-3 opacity-0",
          textareaClassName
        )}
      >
        {(valueIsNotOnlySpaces() && value) || placeholder}
      </p>

      {/* Mention dropdown */}
      {mentionQuery !== null && filteredUsers.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Mention a user"
          className="absolute z-50 mt-1 w-56 overflow-hidden rounded-md border border-border bg-elevation-surface shadow-md"
          style={{ bottom: "calc(100% - 44px)", left: 0 }}
        >
          {filteredUsers.map((u, i) => (
            <li
              key={u.id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                // prevent blur before click
                e.preventDefault();
                insertMention(u);
              }}
              className={cx(
                "flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors",
                i === activeIndex
                  ? "bg-background-selected text-font-selected"
                  : "hover:bg-background-neutral-hovered"
              )}
            >
              <UserAvatar {...u} size={24} />
              <span className="font-primary-light">{u.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
