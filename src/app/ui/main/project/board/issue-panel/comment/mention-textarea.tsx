import { useEffect, useLayoutEffect, useRef, useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";

interface MentionState {
  start: number;
  query: string;
}

const findMention = (value: string, cursor: number): MentionState | null => {
  const beforeCursor = value.slice(0, cursor);
  const atIndex = beforeCursor.lastIndexOf("@");
  if (atIndex === -1) return null;

  const query = beforeCursor.slice(atIndex + 1);
  // A mention query cannot contain a newline and must start right after a
  // word boundary (start of text or whitespace).
  if (query.includes("\n")) return null;
  if (atIndex > 0 && !/\s/.test(beforeCursor[atIndex - 1])) return null;

  return { start: atIndex, query };
};

export const MentionTextarea = (props: MentionTextareaProps): JSX.Element => {
  const {
    name,
    value,
    setValue,
    placeholder,
    readOnly,
    autofocus,
    textareaClassName,
    onFocus,
    onBlur,
    users,
  } = props;

  const [textareaHeight, setTextareaHeight] = useState<number>(40);
  const [mention, setMention] = useState<MentionState | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLParagraphElement>(null);

  const matchingUsers = mention
    ? users
        .filter((user) =>
          user.name.toLowerCase().includes(mention.query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const isOpen = matchingUsers.length > 0;

  const updateMention = (target: HTMLTextAreaElement): void => {
    setMention(findMention(target.value, target.selectionStart ?? 0));
    setHighlightedIndex(0);
  };

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    const target = e.currentTarget;
    setValue(target.value);
    updateMention(target);
  };

  const insertMention = (user: User): void => {
    if (!mention || !textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart ?? value.length;
    const before = value.slice(0, mention.start);
    const after = value.slice(cursor);
    const inserted = `@${user.name} `;
    setValue(before + inserted + after);
    setMention(null);
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      const newCursor = (before + inserted).length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newCursor, newCursor);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((index) => (index + 1) % matchingUsers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (index) => (index - 1 + matchingUsers.length) % matchingUsers.length
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insertMention(matchingUsers[highlightedIndex]);
    } else if (e.key === "Escape") {
      setMention(null);
    }
  };

  const handleBlur = () => {
    // Delay so a click on a suggestion registers before the dropdown closes
    setTimeout(() => setMention(null), 150);
    if (onBlur) onBlur();
  };

  useLayoutEffect(() => {
    if (!mirrorRef.current) return;
    setTextareaHeight(mirrorRef.current.scrollHeight);
  }, [value]);

  useEffect(() => {
    const target = textareaRef.current;
    if (!target || !autofocus) return;
    const length = target.value.length;
    target.setSelectionRange(length, length);
  }, [autofocus]);

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
        onKeyUp={(e) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            updateMention(e.currentTarget);
          }
        }}
        onClick={(e) => updateMention(e.currentTarget)}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={handleBlur}
        style={{ height: `${textareaHeight}px` }}
        autoFocus={autofocus}
        role="combobox"
        aria-expanded={isOpen}
        aria-label="Comment with user mentions"
      />
      <p
        ref={mirrorRef}
        className={cx(
          "absolute left-0 top-0 -z-10 box-border overflow-y-hidden p-3 opacity-0",
          textareaClassName
        )}
      >
        {value.trim().length > 0 ? value : placeholder}
      </p>
      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-64 overflow-hidden rounded-md border border-border bg-elevation-surface py-1 shadow-lg"
          role="listbox"
          aria-label="Mention a user"
        >
          {matchingUsers.map((user, index) => (
            <li key={user.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(user);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cx(
                  "flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-font",
                  index === highlightedIndex && "bg-background-input-hovered"
                )}
              >
                <UserAvatar {...user} size={24} />
                <span className="font-primary-light">{user.name}</span>
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
  readOnly?: boolean;
  textareaClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  users: User[];
}
