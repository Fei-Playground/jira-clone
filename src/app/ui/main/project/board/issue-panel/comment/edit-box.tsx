import { useState } from "react";
import cx from "classix";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
  placeholder = "Add your comment...",
  compact = false,
  saveLabel = "Save",
}: EditBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [initError, setInitError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(Boolean(autofocus));

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
  const activePlaceholder = isError ? "Message cannot be empty" : placeholder;

  return (
    <div className="w-full">
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={setMessage}
        placeholder={activePlaceholder}
        onFocus={onFocus}
        autofocus={autofocus}
        textareaClassName={cx(
          "bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
          compact ? "min-h-[40px]" : "min-h-[80px]",
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
          className={compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5"}
          onClick={onSave}
          aria-label={`${saveLabel} comment`}
        >
          {saveLabel}
        </Button>
        <Button
          color="neutral"
          variant="text"
          className={compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5"}
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
  compact?: boolean;
  saveLabel?: string;
}
