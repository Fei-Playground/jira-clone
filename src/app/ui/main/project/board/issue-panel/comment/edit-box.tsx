import { useEffect, useRef, useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { useProjectStore } from "@app/ui/main/project";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import {
  filterUsersByMentionQuery,
  findMentionQuery,
  insertMention,
  MentionQuery,
} from "@utils/comment-mentions";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
}: EditBoxProps): JSX.Element => {
  const { project } = useProjectStore();
  const users = project.users;
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mentionQuery, setMentionQuery] = useState<MentionQuery | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = mentionQuery
    ? filterUsersByMentionQuery(users, mentionQuery.query)
    : [];
  const showSuggestions = Boolean(mentionQuery) && suggestions.length > 0;

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setMentionQuery(null);
    setHighlightedIndex(0);
  };

  const updateMentionFromCaret = (value: string, caretIndex: number) => {
    const nextQuery = findMentionQuery(value, caretIndex);
    setMentionQuery(nextQuery);
    if (
      mentionQuery?.query !== nextQuery?.query ||
      mentionQuery?.startIndex !== nextQuery?.startIndex
    ) {
      setHighlightedIndex(0);
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    const caret = textareaRef.current?.selectionStart ?? value.length;
    updateMentionFromCaret(value, caret);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    updateMentionFromCaret(target.value, target.selectionStart);
  };

  const applyMention = (user: User) => {
    if (!mentionQuery) return;

    const { message: nextMessage, cursorIndex } = insertMention(
      message,
      mentionQuery,
      user
    );
    setMessage(nextMessage);
    setMentionQuery(null);

    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(cursorIndex, cursorIndex);
    });
  };

  const onSave = () => {
    if (messageIsValid()) {
      save(message);
      resetValues();
    } else {
      setInitError(true);
    }
  };

  const onCancel = () => {
    if (cancel) cancel();
    resetValues();
  };

  const onFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsEditing(true);
    const target = e.currentTarget;
    updateMentionFromCaret(target.value, target.selectionStart);
  };

  const onBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setMentionQuery(null);
    }, 150);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((index) => (index + 1) % suggestions.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (index) => (index - 1 + suggestions.length) % suggestions.length
      );
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      applyMention(suggestions[highlightedIndex]);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setMentionQuery(null);
    }
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment... Use @ to mention someone";

  return (
    <div className="relative w-full">
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={handleMessageChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onSelect={handleSelect}
        onKeyDown={onKeyDown}
        autofocus={autofocus}
        inputRef={textareaRef}
        textareaClassName={cx(
          "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
          isError &&
            "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
        )}
      />
      {showSuggestions && (
        <ul
          className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-elevation-surface-overlay py-1 shadow-md"
          role="listbox"
          aria-label="Mention user"
        >
          {suggestions.map((user, index) => (
            <li key={user.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                className={cx(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-font",
                  index === highlightedIndex
                    ? "bg-background-selected"
                    : "hover:bg-background-neutral"
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  applyMention(user);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <UserAvatar {...user} size={28} />
                <span className="font-primary">{user.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        className={cx(
          "mt-2 flex gap-2 text-sm",
          isEditing ? "visible" : "hidden"
        )}
      >
        <Button
          type="button"
          className="px-4 py-2.5"
          onClick={onSave}
          aria-label="Save comment"
        >
          Save
        </Button>
        <Button
          color="neutral"
          variant="text"
          className="px-4 py-2.5"
          onClick={onCancel}
          aria-label="Cancel comment"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

interface EditBoxProps {
  defaultMessage: string;
  autofocus?: boolean;
  save: (commentText: string) => void;
  cancel?: () => void;
}
