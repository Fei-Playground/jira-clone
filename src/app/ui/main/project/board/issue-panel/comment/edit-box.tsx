import { useLayoutEffect, useRef, useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { useProjectStore } from "@app/ui/main/project";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import {
  filterUsersByMentionQuery,
  getActiveMentionAt,
  insertMention,
} from "./mention-utils";
import { MentionMenu } from "./mention-menu";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
  placeholder: placeholderProp,
}: EditBoxProps): JSX.Element => {
  const { project } = useProjectStore();
  const users = project.users;

  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(defaultMessage.length);
  const [activeIndex, setActiveIndex] = useState(0);
  /** When set to the current mention key, the menu stays closed (e.g. after Escape). */
  const [dismissedMentionKey, setDismissedMentionKey] = useState<string | null>(
    null
  );

  const textareaNode = useRef<HTMLTextAreaElement | null>(null);
  const pendingCursor = useRef<number | null>(null);

  const onTextareaRef = (node: HTMLTextAreaElement | null) => {
    textareaNode.current = node;
  };

  const activeMention = getActiveMentionAt(message, cursor);
  const mentionKey = activeMention
    ? `${activeMention.start}:${activeMention.query}`
    : null;
  const filteredUsers = activeMention
    ? filterUsersByMentionQuery(users, activeMention.query)
    : [];
  const showMentionMenu =
    Boolean(activeMention) && dismissedMentionKey !== mentionKey;
  const safeActiveIndex =
    filteredUsers.length === 0
      ? 0
      : Math.min(activeIndex, filteredUsers.length - 1);

  // Restore caret after programmatic mention insert (DOM, not React state cascade)
  useLayoutEffect(() => {
    if (pendingCursor.current === null || !textareaNode.current) return;
    const pos = pendingCursor.current;
    pendingCursor.current = null;
    textareaNode.current.focus();
    textareaNode.current.setSelectionRange(pos, pos);
    setCursor(pos);
  }, [message]);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const resetValues = () => {
    setMessage(defaultMessage);
    setInitError(false);
    setIsEditing(false);
    setDismissedMentionKey(null);
    setCursor(defaultMessage.length);
    setActiveIndex(0);
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

  const syncCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursor(e.currentTarget.selectionStart ?? 0);
  };

  const handleSetMessage = (value: string) => {
    setMessage(value);
    setActiveIndex(0);
    // selection updates after React applies the value — read it next frame
    requestAnimationFrame(() => {
      if (textareaNode.current) {
        setCursor(textareaNode.current.selectionStart ?? value.length);
      } else {
        setCursor(value.length);
      }
    });
  };

  const applyMention = (user: User) => {
    const result = insertMention(message, cursor, user);
    if (!result) return;
    pendingCursor.current = result.cursor;
    setMessage(result.text);
    setDismissedMentionKey(null);
    setActiveIndex(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionMenu) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        filteredUsers.length === 0 ? 0 : (i + 1) % filteredUsers.length
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        filteredUsers.length === 0
          ? 0
          : (i - 1 + filteredUsers.length) % filteredUsers.length
      );
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      if (filteredUsers[safeActiveIndex]) {
        e.preventDefault();
        applyMention(filteredUsers[safeActiveIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setDismissedMentionKey(mentionKey);
    }
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : placeholderProp || "Add your comment...";

  return (
    <div className="relative w-full">
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={handleSetMessage}
        placeholder={placeholder}
        onFocus={onFocus}
        autofocus={autofocus}
        onKeyDown={onKeyDown}
        onSelect={syncCursor}
        onTextareaRef={onTextareaRef}
        textareaClassName={cx(
          "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
          isError &&
            "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
        )}
      />
      {showMentionMenu && (
        <MentionMenu
          users={filteredUsers}
          activeIndex={safeActiveIndex}
          onSelect={applyMention}
          onHover={setActiveIndex}
        />
      )}
      <p className="mt-1 font-primary-light text-2xs text-font-subtlest">
        Type <span className="font-primary">@</span> to mention someone
      </p>
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
  placeholder?: string;
}
