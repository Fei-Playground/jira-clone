import { useState } from "react";
import cx from "classix";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { User } from "@domain/user";
import { useProjectStore } from "@app/ui/main/project";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { MentionList } from "./mention-list";

interface ActiveMention {
  query: string;
  start: number;
  caret: number;
}

export const EditBox = ({
  defaultMessage,
  autofocus,
  placeholder = "Add your comment...",
  save,
  cancel,
}: EditBoxProps): JSX.Element => {
  const { project } = useProjectStore();
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mention, setMention] = useState<ActiveMention | null>(null);
  const [activeMentionIndex, setActiveMentionIndex] = useState<number>(0);

  const mentionUsers =
    mention === null
      ? []
      : project.users
          .filter((user) =>
            user.name.toLowerCase().includes(mention.query.toLowerCase())
          )
          .slice(0, 5);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setMention(null);
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

  const handleValueChange = (value: string, caret: number): void => {
    const match = value.slice(0, caret).match(/(?:^|\s)@([\w. ]*)$/);
    if (match) {
      setMention({
        query: match[1],
        start: caret - match[1].length - 1,
        caret,
      });
      setActiveMentionIndex(0);
    } else {
      setMention(null);
    }
  };

  const selectMention = (user: User): void => {
    if (!mention) return;
    const nextMessage = `${message.slice(0, mention.start)}@${user.name} ${message.slice(mention.caret)}`;
    setMessage(nextMessage);
    setMention(null);
    setIsEditing(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!mention || mentionUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveMentionIndex((index) => (index + 1) % mentionUsers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveMentionIndex(
        (index) => (index - 1 + mentionUsers.length) % mentionUsers.length
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectMention(mentionUsers[activeMentionIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setMention(null);
    }
  };

  const isError = initError && !messageIsValid();
  const textareaPlaceholder = isError ? "Message cannot be empty" : placeholder;

  return (
    <div className="w-full">
      <div className="relative">
        <TextareaAutosize
          name="comment"
          value={message}
          setValue={setMessage}
          placeholder={textareaPlaceholder}
          onFocus={onFocus}
          autofocus={autofocus}
          onValueChange={handleValueChange}
          onKeyDown={onKeyDown}
          textareaClassName={cx(
            "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
            isError &&
              "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
          )}
        />
        {mention && mentionUsers.length > 0 && (
          <MentionList
            users={mentionUsers}
            activeIndex={activeMentionIndex}
            onSelect={selectMention}
            onHover={setActiveMentionIndex}
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
  placeholder?: string;
  save: (commentText: string) => void;
  cancel?: () => void;
}
