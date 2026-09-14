import { useMemo } from "react";
import { useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { UserAvatar } from "@app/components/user-avatar";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

const MENTION_TRIGGER = /(?:^|\s)@([\w.-]*)$/;

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

  const mentionQuery = useMemo(() => {
    if (!mentionUsers || mentionUsers.length === 0) return null;
    const match = MENTION_TRIGGER.exec(message);
    return match ? match[1].toLowerCase() : null;
  }, [message, mentionUsers]);

  const mentionCandidates = useMemo(() => {
    if (mentionQuery === null || !mentionUsers) return [];
    const startOfQuery = message.slice(0, message.length - mentionQuery.length);
    const trimmedQuery = mentionQuery.trim();
    return mentionUsers
      .filter(
        (user) =>
          trimmedQuery === "" || user.name.toLowerCase().includes(trimmedQuery)
      )
      .map((user) => ({
        user,
        prefix: startOfQuery,
      }))
      .slice(0, 5);
  }, [message, mentionQuery, mentionUsers]);

  const onSelectMention = (user: User, prefix: string): void => {
    setMessage(`${prefix}@${user.name} `);
    setIsEditing(true);
  };

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

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add your comment...";
  const showMentionList = mentionCandidates.length > 0;

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
      {showMentionList && (
        <ul className="absolute left-0 top-full z-10 mt-1 w-full max-w-[320px] rounded bg-elevation-surface-raised p-1 shadow-overlay">
          {mentionCandidates.map(({ user, prefix }) => (
            <li key={user.id}>
              <button
                type="button"
                onClick={() => onSelectMention(user, prefix)}
                className="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-left hover:bg-background-neutral-hovered focus:bg-background-neutral-hovered"
              >
                <UserAvatar {...user} size={24} />
                <span className="font-primary text-xs">{user.name}</span>
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
  /** Users to offer when the user types "@" — omit to disable mentions. */
  mentionUsers?: User[];
}
