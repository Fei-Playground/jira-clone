import { useState, useRef, useEffect } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { MentionSuggestions } from "./mention-suggestions";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
  users = [],
}: EditBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mentionState, setMentionState] = useState<MentionState | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
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
  const onFocus = () => setIsEditing(true);

  // Detect @ mentions in the textarea
  const detectMention = (text: string, cursorPosition: number) => {
    // Find the most recent @ symbol before the cursor
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex === -1) {
      setMentionState(null);
      return;
    }

    // Check if the mention was closed (whitespace between @ and cursor)
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    if (textAfterAt.includes(" ") || textAfterAt.includes("\n")) {
      setMentionState(null);
      return;
    }

    // Active mention detected — activate suggestions dropdown
    setMentionState({
      isActive: true,
      query: textAfterAt,
      startIndex: lastAtIndex,
    });
  };

  // Handle textarea value changes
  const handleTextChange = (newValue: string) => {
    setMessage(newValue);
    if (textareaRef.current) {
      detectMention(newValue, textareaRef.current.selectionStart);
    }
  };

  // Handle user selection from suggestions
  const handleUserSelect = (user: User) => {
    if (!mentionState || !textareaRef.current) return;

    const { startIndex, query } = mentionState;
    const beforeMention = message.substring(0, startIndex);
    const afterMention = message.substring(startIndex + 1 + query.length);
    const newMessage = `${beforeMention}@${user.name}${afterMention}`;

    setMessage(newMessage);
    setMentionState(null);

    // Place cursor after the inserted mention — deferred to allow React state update
    const newCursorPos = startIndex + 1 + user.name.length;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Calculate suggestion dropdown position
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (mentionState?.isActive && wrapperRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      setSuggestionPosition({
        top: wrapperRect.height,
        left: 0,
      });
    }
  }, [mentionState?.isActive]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setMentionState(null);
      }
    };

    if (mentionState?.isActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [mentionState]);

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <TextareaAutosize
        ref={textareaRef}
        name="comment"
        value={message}
        setValue={handleTextChange}
        placeholder={placeholder}
        onFocus={onFocus}
        autofocus={autofocus}
        textareaClassName={cx(
          "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
          isError &&
            "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
        )}
      />
      {mentionState?.isActive && users.length > 0 && (
        <MentionSuggestions
          key={mentionState.query}
          users={users}
          query={mentionState.query}
          onSelect={handleUserSelect}
          onClose={() => setMentionState(null)}
          position={suggestionPosition}
        />
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

interface MentionState {
  isActive: boolean;
  query: string;
  startIndex: number;
}

interface EditBoxProps {
  defaultMessage: string;
  autofocus?: boolean;
  save: (commentText: string) => void;
  cancel?: () => void;
  users?: User[];
}
