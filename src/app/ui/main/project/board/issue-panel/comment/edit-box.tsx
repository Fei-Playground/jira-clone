import { useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { useProjectStore } from "@app/ui/main/project";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { MentionList } from "./mention-list";
import {
  MentionToken,
  getMentionToken,
  insertMention,
  matchUsers,
} from "./mentions";

export const EditBox = ({
  defaultMessage,
  placeholder = "Add your comment...",
  autofocus,
  save,
  cancel,
}: EditBoxProps): JSX.Element => {
  const { project } = useProjectStore();
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mention, setMention] = useState<MentionToken | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const mentionCandidates = mention
    ? matchUsers(project.users, mention.query)
    : [];
  const isMentionListOpen = mentionCandidates.length > 0;

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

  const updateMention = (value: string, caret: number): void => {
    setMention(getMentionToken(value, caret));
    setHighlightedIndex(0);
  };

  const onMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { value, selectionStart } = event.currentTarget;
    updateMention(value, selectionStart ?? value.length);
  };

  const pickMention = (user: User): void => {
    if (!mention) return;

    setMessage(insertMention(message, mention, user.name));
    setMention(null);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!isMentionListOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % mentionCandidates.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(
        (index) =>
          (index - 1 + mentionCandidates.length) % mentionCandidates.length
      );
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      pickMention(mentionCandidates[highlightedIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      // Dismiss the list without also closing the issue panel behind it.
      event.nativeEvent.stopPropagation();
      setMention(null);
    }
  };

  const isError = initError && !messageIsValid();
  const currentPlaceholder = isError ? "Message cannot be empty" : placeholder;

  return (
    <div className="w-full">
      <div className="relative">
        <TextareaAutosize
          name="comment"
          value={message}
          setValue={setMessage}
          placeholder={currentPlaceholder}
          onFocus={onFocus}
          onBlur={() => setMention(null)}
          onChange={onMessageChange}
          onKeyDown={onKeyDown}
          autofocus={autofocus}
          textareaClassName={cx(
            "min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
            isError &&
              "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
          )}
        />
        {isMentionListOpen && (
          <MentionList
            users={mentionCandidates}
            highlightedIndex={highlightedIndex}
            onSelect={pickMention}
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
  placeholder?: string;
  autofocus?: boolean;
  save: (commentText: string) => void;
  cancel?: () => void;
}
