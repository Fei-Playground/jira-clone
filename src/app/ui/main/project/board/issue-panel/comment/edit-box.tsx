import { useState, useCallback, useRef } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { Mention } from "@domain/comment";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { useProjectStore } from "@app/ui/main/project";
import { MentionDropdown } from "./mention-dropdown";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
  mentions: initialMentions = [],
}: EditBoxProps): JSX.Element => {
  const projectStore = useProjectStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mentions, setMentions] = useState<Mention[]>(initialMentions);
  const [showMentionDropdown, setShowMentionDropdown] = useState<boolean>(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState<string>("");
  const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState<number>(0);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const extractMentionSearchTerm = useCallback(
    (text: string, cursorPosition: number): { searchTerm: string; startIndex: number } | null => {
      const beforeCursor = text.substring(0, cursorPosition);
      const lastAtIndex = beforeCursor.lastIndexOf("@");

      if (lastAtIndex === -1) {
        return null;
      }

      const spaceBetweenAtAndCursor = beforeCursor
        .substring(lastAtIndex)
        .indexOf(" ");
      if (spaceBetweenAtAndCursor !== -1) {
        return null;
      }

      const searchTerm = beforeCursor.substring(lastAtIndex + 1);
      return { searchTerm, startIndex: lastAtIndex };
    },
    []
  );

  const handleSelectUser = useCallback(
    (user: User) => {
      const mention = `@${user.name}`;
      const beforeMention = message.substring(0, mentionStartIndex);
      const afterMention = message.substring(
        mentionStartIndex + mentionSearchTerm.length + 1
      );
      const newMessage = beforeMention + mention + afterMention;

      const newMentions = [
        ...mentions,
        {
          id: user.id,
          name: user.name,
          startIndex: mentionStartIndex,
          endIndex: mentionStartIndex + mention.length,
        } as Mention,
      ];

      setMessage(newMessage);
      setMentions(newMentions);
      setShowMentionDropdown(false);
      setMentionSearchTerm("");
    },
    [message, mentions, mentionStartIndex, mentionSearchTerm]
  );

  const handleMessageChange = useCallback(
    (newMessage: string) => {
      setMessage(newMessage);

      if (textareaRef.current) {
        const cursorPosition = textareaRef.current.selectionStart;
        const mentionData = extractMentionSearchTerm(newMessage, cursorPosition);

        if (mentionData) {
          setShowMentionDropdown(true);
          setMentionSearchTerm(mentionData.searchTerm);
          setMentionStartIndex(mentionData.startIndex);
          setSelectedMentionIndex(0);
        } else {
          setShowMentionDropdown(false);
          setMentionSearchTerm("");
        }
      }
    },
    [extractMentionSearchTerm]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showMentionDropdown) return;

      const filteredUsers = projectStore.project.users.filter((user) =>
        user.name.toLowerCase().includes(mentionSearchTerm.toLowerCase())
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredUsers[selectedMentionIndex]) {
          handleSelectUser(filteredUsers[selectedMentionIndex]);
        }
      } else if (e.key === "Escape") {
        setShowMentionDropdown(false);
      }
    },
    [showMentionDropdown, mentionSearchTerm, selectedMentionIndex, projectStore, handleSelectUser]
  );

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setMentions(initialMentions);
    setShowMentionDropdown(false);
    setMentionSearchTerm("");
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
    <div className="w-full relative">
      <TextareaAutosize
        ref={textareaRef}
        name="comment"
        value={message}
        setValue={handleMessageChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        autofocus={autofocus}
        textareaClassName={cx(
          "min-h-[80px] leading-6 font-primary-light outline outline-2 outline-border-input focus:outline-border-brand bg-background-input",
          isError &&
            "placeholder:text-font-danger placeholder:text-opacity-70 !outline-border-danger !outline-2"
        )}
      />
      {showMentionDropdown && (
        <MentionDropdown
          searchTerm={mentionSearchTerm}
          users={projectStore.project.users}
          onSelectUser={handleSelectUser}
          selectedIndex={selectedMentionIndex}
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

interface EditBoxProps {
  defaultMessage: string;
  autofocus?: boolean;
  save: (commentText: string, mentions?: Mention[]) => void;
  cancel?: () => void;
  mentions?: Mention[];
}
