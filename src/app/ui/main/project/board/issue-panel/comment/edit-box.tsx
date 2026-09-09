import { useState } from "react";
import cx from "classix";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import { User, usersMock } from "@domain/user";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
}: EditBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const mentionQuery = ((): string | null => {
    const match = /(?:^|\s)@([\w ]*)$/.exec(message);
    return match ? match[1] : null;
  })();

  const mentionCandidates: User[] =
    mentionQuery === null
      ? []
      : usersMock.filter((u) =>
          u.name.toLowerCase().includes(mentionQuery.toLowerCase())
        );

  const insertMention = (mentionedUser: User): void => {
    const updated = message.replace(/(?:^|\s)@([\w ]*)$/, (prefix) =>
      prefix.endsWith(`@${mentionQuery}`)
        ? `${prefix.slice(0, prefix.length - mentionQuery!.length - 1)}@${mentionedUser.name} `
        : prefix
    );
    setMessage(updated);
    setIsEditing(true);
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";

  return (
    <div className="relative w-full">
      {mentionCandidates.length > 0 && (
        <ul
          role="listbox"
          aria-label="Mention a user"
          className="absolute bottom-full left-0 z-10 mb-1 w-64 overflow-hidden rounded-md bg-elevation-surface-overlay shadow-lg"
        >
          {mentionCandidates.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => insertMention(candidate)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-background-neutral-hovered"
              >
                <UserAvatar {...candidate} />
                <span>{candidate.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={setMessage}
        placeholder={placeholder}
        onFocus={onFocus}
        autofocus={autofocus}
        textareaClassName={cx(
          "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
          isError &&
            "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
        )}
      />
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
