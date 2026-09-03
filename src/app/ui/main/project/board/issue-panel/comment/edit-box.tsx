import { useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

const mentionTriggerRegex = /(?:^|\s)@([\w ]*)$/;

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
  mentionUsers,
}: EditBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState<number>(0);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setMentionQuery(null);
    setMentionIndex(0);
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

  const mentionSuggestions: User[] =
    mentionQuery === null || !mentionUsers
      ? []
      : mentionUsers
          .filter((mentionUser) =>
            mentionUser.name
              .toLowerCase()
              .startsWith(mentionQuery.trim().toLowerCase())
          )
          .slice(0, 5);

  const onMessageChange = (value: string) => {
    setMessage(value);
    const match = value.match(mentionTriggerRegex);
    setMentionQuery(match ? match[1] : null);
    setMentionIndex(0);
  };

  const selectMention = (mentionUser: User): void => {
    setMessage(
      message.replace(mentionTriggerRegex, (match) =>
        match.startsWith("@")
          ? `@${mentionUser.name} `
          : `${match[0]}@${mentionUser.name} `
      )
    );
    setMentionQuery(null);
    setMentionIndex(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (mentionSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMentionIndex((mentionIndex + 1) % mentionSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMentionIndex(
        (mentionIndex - 1 + mentionSuggestions.length) %
          mentionSuggestions.length
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectMention(mentionSuggestions[mentionIndex]);
    } else if (e.key === "Escape") {
      setMentionQuery(null);
    }
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";

  return (
    <div className="relative w-full" onKeyDown={onKeyDown}>
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={onMessageChange}
        placeholder={placeholder}
        onFocus={onFocus}
        autofocus={autofocus}
        textareaClassName={cx(
          "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
          isError &&
            "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
        )}
      />
      {mentionSuggestions.length > 0 && (
        <ul
          className="absolute z-10 mt-1 w-64 overflow-hidden rounded-md border border-border bg-elevation-surface shadow-lg"
          role="listbox"
          aria-label="Mention a user"
        >
          {mentionSuggestions.map((mentionUser, index) => (
            <li key={mentionUser.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === mentionIndex}
                onClick={() => selectMention(mentionUser)}
                className={cx(
                  "flex w-full items-center gap-3 px-3 py-2 text-left text-sm",
                  index === mentionIndex
                    ? "bg-background-neutral"
                    : "hover:bg-background-neutral"
                )}
              >
                <UserAvatar {...mentionUser} size={24} />
                <span className="font-primary-light">{mentionUser.name}</span>
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
  mentionUsers?: User[];
}
