import { useState, useRef, useCallback } from "react";
import cx from "classix";
import { User, UserId } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { MentionAutocomplete } from "./mention-autocomplete";

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
  const [mentions, setMentions] = useState<User[]>([]);
  const [showMentionAutocomplete, setShowMentionAutocomplete] =
    useState<boolean>(false);
  const [mentionFilter, setMentionFilter] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setMentions([]);
    setShowMentionAutocomplete(false);
    setMentionFilter("");
  };

  const extractMentionedUsers = useCallback(
    (text: string): User[] => {
      const mentionRegex = /@([\w\s]+)/g;
      const mentionMatches = text.match(mentionRegex) || [];
      const mentioned: User[] = [];
      const seenIds = new Set<UserId>();

      mentionMatches.forEach((mention) => {
        const name = mention.substring(1).trim();
        const user = users.find(
          (u) => u.name.toLowerCase() === name.toLowerCase()
        );
        if (user && !seenIds.has(user.id)) {
          mentioned.push(user);
          seenIds.add(user.id);
        }
      });

      return mentioned;
    },
    [users]
  );

  const handleMentionSelect = (user: User) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = message.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex === -1) return;

    const beforeMention = message.substring(0, lastAtIndex);
    const afterMention = message.substring(cursorPos);
    const newMessage = `${beforeMention}@${user.name} ${afterMention}`;

    setMessage(newMessage);
    setShowMentionAutocomplete(false);
    setMentionFilter("");

    const mentionedUsers = extractMentionedUsers(newMessage);
    setMentions(mentionedUsers);

    // Restore cursor position
    setTimeout(() => {
      const newCursorPos = beforeMention.length + user.name.length + 2;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);

    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = newMessage.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const filterText = textBeforeCursor.substring(lastAtIndex + 1);
      if (filterText && !filterText.includes(" ")) {
        setMentionFilter(filterText);
        setShowMentionAutocomplete(true);
      } else {
        setShowMentionAutocomplete(false);
      }
    } else {
      setShowMentionAutocomplete(false);
    }

    const mentionedUsers = extractMentionedUsers(newMessage);
    setMentions(mentionedUsers);
  };

  const onSave = () => {
    if (messageIsValid()) {
      save(message, mentions);
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

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";

  return (
    <div className="w-full">
      <div className="relative">
        <TextareaAutosize
          ref={textareaRef}
          name="comment"
          value={message}
          setValue={handleMessageChange}
          placeholder={placeholder}
          onFocus={onFocus}
          autofocus={autofocus}
          textareaClassName={cx(
            "min-h-[80px] leading-6 font-primary-light outline outline-2 outline-border-input focus:outline-border-brand bg-background-input",
            isError &&
              "placeholder:text-font-danger placeholder:text-opacity-70 !outline-border-danger !outline-2"
          )}
        />
        {showMentionAutocomplete && (
          <MentionAutocomplete
            isOpen={showMentionAutocomplete}
            filterText={mentionFilter}
            users={users}
            onSelect={handleMentionSelect}
          />
        )}
      </div>
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
  save: (commentText: string, mentions?: User[]) => void;
  cancel?: () => void;
  users?: User[];
}
