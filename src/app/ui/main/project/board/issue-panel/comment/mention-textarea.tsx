import { useState, useRef, useMemo } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import { TextareaAutosize } from "@app/components/textarea-autosize";

/**
 * Textarea with "@mention" support: typing "@" opens a dropdown of users
 * filtered by the characters typed after it. Arrow keys navigate,
 * Enter/Tab selects, Escape closes.
 */
export const MentionTextarea = ({
  name,
  value,
  setValue,
  placeholder,
  autofocus,
  textareaClassName,
  onFocus,
  users,
}: MentionTextareaProps): JSX.Element => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const suggestions = useMemo(() => {
    if (mentionQuery === null) return [];
    const query = mentionQuery.toLowerCase();
    return users
      .filter((user) => user.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [mentionQuery, users]);

  const isOpen = suggestions.length > 0;

  const updateMentionQuery = (text: string, caret: number) => {
    const beforeCaret = text.slice(0, caret);
    const match = /(?:^|\s)@([\w ]*)$/.exec(beforeCaret);
    setMentionQuery(match ? match[1] : null);
    setActiveIndex(0);
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    const caret = textareaRef.current?.selectionStart ?? nextValue.length;
    updateMentionQuery(nextValue, caret);
  };

  const insertMention = (user: User) => {
    const caret = textareaRef.current?.selectionStart ?? value.length;
    const beforeCaret = value.slice(0, caret);
    const afterCaret = value.slice(caret);
    const newBefore = beforeCaret.replace(/@[\w ]*$/, `@${user.name} `);
    setValue(newBefore + afterCaret);
    setMentionQuery(null);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      const position = newBefore.length;
      textarea.setSelectionRange(position, position);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((activeIndex + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (activeIndex - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insertMention(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setMentionQuery(null);
    }
  };

  return (
    <div className="relative w-full">
      <TextareaAutosize
        name={name}
        value={value}
        setValue={handleChange}
        placeholder={placeholder}
        autofocus={autofocus}
        textareaClassName={textareaClassName}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        textareaRef={textareaRef}
      />
      {isOpen && (
        <ul
          role="listbox"
          aria-label="Mention a user"
          className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md bg-elevation-surface-overlay py-1 shadow-overlay"
        >
          {suggestions.map((user, index) => (
            <li key={user.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(user);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cx(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left font-primary-light text-sm text-font",
                  index === activeIndex && "bg-background-neutral-hovered"
                )}
              >
                <UserAvatar {...user} />
                <span>{user.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface MentionTextareaProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  autofocus?: boolean;
  textareaClassName?: string;
  onFocus?: () => void;
  users: User[];
}
