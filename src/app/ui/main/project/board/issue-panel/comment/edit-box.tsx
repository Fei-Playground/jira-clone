import { useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { UserAvatar } from "@app/components/user-avatar";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

export const EditBox = ({
  defaultMessage,
  autofocus,
  mentionables = [],
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

  const mention = findTrailingMention(message);
  const mentionMatches = mention
    ? mentionables.filter((mentionable) =>
        mentionable.name.toLowerCase().includes(mention.query.toLowerCase())
      )
    : [];

  const onMessageChange = (value: string) => {
    setMessage(value);
  };

  const insertMention = (user: User) => {
    if (!mention) return;
    const before = message.slice(0, mention.start);
    setMessage(`${before}@${user.name} `);
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";

  return (
    <div className="relative w-full">
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
      {mentionMatches.length > 0 && (
        <ul
          className="absolute left-0 z-10 mt-1 max-h-60 w-64 overflow-y-auto rounded-md bg-elevation-surface-overlay p-1 shadow-lg"
          role="listbox"
          aria-label="Mention a user"
        >
          {mentionMatches.map((mentionable) => (
            <li key={mentionable.id}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => insertMention(mentionable)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-background-neutral-hovered"
              >
                <UserAvatar {...mentionable} />
                <span className="font-primary-light">{mentionable.name}</span>
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

const findTrailingMention = (
  value: string
): { start: number; query: string } | null => {
  const atIndex = value.lastIndexOf("@");
  if (atIndex === -1) return null;
  if (atIndex > 0 && !/\s/.test(value[atIndex - 1])) return null;
  const query = value.slice(atIndex + 1);
  if (query.includes("@") || query.includes("\n") || query.length > 40)
    return null;
  return { start: atIndex, query };
};

interface EditBoxProps {
  defaultMessage: string;
  autofocus?: boolean;
  mentionables?: User[];
  save: (commentText: string) => void;
  cancel?: () => void;
}
