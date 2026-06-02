import { useState, useRef, useLayoutEffect, useEffect } from "react";
import cx from "classix";
import { User } from "@domain/user";

const DEFAULT_TEXTAREA_HEIGHT = 40;
const DROPDOWN_MAX_HEIGHT = 200;
const DROPDOWN_WIDTH = 240;
const LINE_HEIGHT = 24;
const DROPDOWN_TOP_OFFSET = 40;
const DROPDOWN_LEFT_OFFSET = 12;

export const MentionTextarea = ({
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
}: MentionTextareaProps): JSX.Element => {
  const [textareaHeight, setTextareaHeight] = useState<number>(
    DEFAULT_TEXTAREA_HEIGHT
  );
  const [mentionQuery, setMentionQuery] = useState<string>("");
  const [mentionStartPos, setMentionStartPos] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenTextRef = useRef<HTMLParagraphElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredUsers =
    mentionStartPos >= 0
      ? users.filter((user) =>
          user.name.toLowerCase().includes(mentionQuery.toLowerCase())
        )
      : [];

  const showDropdown = mentionStartPos >= 0 && filteredUsers.length > 0;

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const length = target.value.length;
    // Focus moves cursor to end to avoid interrupting existing text
    target.setSelectionRange(length, length);
    if (onFocus) onFocus();
  };

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    const newValue = e.currentTarget.value;
    const cursorPos = e.currentTarget.selectionStart;

    setValue(newValue);

    // Check for @ mention
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Mention is valid only if @ is followed by text with no spaces/newlines
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionStartPos(lastAtIndex);
        setMentionQuery(textAfterAt);
        setSelectedIndex(0);
        updateDropdownPosition(e.currentTarget, lastAtIndex);
        return;
      }
    }

    closeMentionDropdown();
  };

  const closeMentionDropdown = () => {
    setMentionStartPos(-1);
    setMentionQuery("");
    setDropdownPosition(null);
  };

  const updateDropdownPosition = (
    textarea: HTMLTextAreaElement,
    atIndex: number
  ) => {
    if (!textarea) return;

    const textBeforeAt = value.slice(0, atIndex);
    const lines = textBeforeAt.split("\n");
    const currentLine = lines.length;
    const top = currentLine * LINE_HEIGHT + DROPDOWN_TOP_OFFSET;
    const left = DROPDOWN_LEFT_OFFSET;

    setDropdownPosition({ top, left });
  };

  const insertMention = (user: User) => {
    if (!textareaRef.current || mentionStartPos < 0) return;

    const beforeMention = value.slice(0, mentionStartPos);
    const afterMention = value.slice(textareaRef.current.selectionStart);
    const newValue = `${beforeMention}@${user.name} ${afterMention}`;

    setValue(newValue);
    closeMentionDropdown();

    // Defer cursor positioning to allow value update to complete
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = mentionStartPos + user.name.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredUsers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" || e.key === "Tab") {
      if (filteredUsers[selectedIndex]) {
        e.preventDefault();
        insertMention(filteredUsers[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMentionDropdown();
    }
  };

  const valueIsNotOnlySpaces = (): boolean => {
    return !/^( )\1*$/.test(value);
  };

  useLayoutEffect(() => {
    if (!hiddenTextRef.current) return;
    setTextareaHeight(hiddenTextRef.current.scrollHeight);
  }, [value]);

  // Dismiss mention dropdown when clicking outside textarea or dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        closeMentionDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  // Scroll selected item into view
  useEffect(() => {
    if (showDropdown && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex, showDropdown]);

  return (
    <div className="relative">
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
        readOnly={readOnly}
        onFocus={handleOnFocus}
        onBlur={onBlur}
        style={{ height: `${textareaHeight}px` }}
        autoFocus={autofocus}
      />
      <p
        ref={hiddenTextRef}
        className={cx(
          "absolute left-0 top-0 -z-10 box-border overflow-y-hidden p-3 opacity-0",
          textareaClassName
        )}
      >
        {(valueIsNotOnlySpaces() && value) || placeholder}
      </p>
      {showDropdown && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="absolute z-50 overflow-y-auto rounded-md bg-elevation-surface-overlay py-1 shadow-md"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            maxHeight: `${DROPDOWN_MAX_HEIGHT}px`,
            width: `${DROPDOWN_WIDTH}px`,
          }}
        >
          {filteredUsers.map((user, index) => (
            <button
              key={user.id}
              type="button"
              className={cx(
                "flex w-full cursor-pointer items-center gap-2 border-l-[3px] border-l-transparent px-3 py-2 text-left font-primary-bold text-sm text-font hover:bg-background-selected",
                index === selectedIndex &&
                  "border-l-border-selected bg-background-selected"
              )}
              onClick={() => insertMention(user)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div
                className="h-6 w-6 flex-shrink-0 rounded-full"
                style={{
                  backgroundColor: user.color || "#ccc",
                }}
              />
              <span className="truncate">{user.name}</span>
            </button>
          ))}
        </div>
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
