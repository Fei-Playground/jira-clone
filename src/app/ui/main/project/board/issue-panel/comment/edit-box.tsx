import { useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { UserAvatar } from "@app/components/user-avatar";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

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

  // Detect an active "@mention" being typed at the end of the text
  const mentionMatch = mentionUsers?.length
    ? /(?:^|\s)@([^@\n]*)$/.exec(message)
    : null;
  const mentionQuery = mentionMatch ? mentionMatch[1].toLowerCase() : null;
  const mentionSuggestions =
    mentionQuery !== null && mentionUsers
      ? mentionUsers.filter((user) =>
          user.name.toLowerCase().includes(mentionQuery)
        )
      : [];

  const insertMention = (user: User): void => {
    if (mentionQuery === null) return;
    const head = message.slice(0, message.length - mentionQuery.length - 1);
    setMessage(`${head}@${user.name} `);
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
      {mentionSuggestions.length > 0 && (
        <ul
          className="bg-background absolute z-10 mt-1 max-h-48 w-64 overflow-y-auto rounded-md py-1 shadow-lg outline outline-1 outline-border"
          aria-label="Mention suggestions"
        >
          {mentionSuggestions.map((user) => (
            <li key={user.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(user);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-background-input-hovered"
              >
                <UserAvatar {...user} size={24} />
                <span className="font-primary-light">{user.name}</span>
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
