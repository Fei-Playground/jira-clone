import { useState } from "react";
import cx from "classix";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";

export const EditBox = ({
  defaultMessage,
  autofocus,
  save,
  cancel,
}: EditBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // A comment is only valid when it holds something other than whitespace
  const trimmedMessage = message.trim();
  const messageIsValid = trimmedMessage.length > 0;

  const resetValues = () => {
    setMessage(defaultMessage);
    setIsEditing(false);
  };

  const onSave = () => {
    if (!messageIsValid) return;

    save(trimmedMessage);
    resetValues();
  };

  const onCancel = () => {
    if (cancel) cancel();
    resetValues();
  };
  const onFocus = () => setIsEditing(true);

  return (
    <div className="w-full">
      <TextareaAutosize
        name="comment"
        value={message}
        setValue={setMessage}
        placeholder="Add your comment..."
        onFocus={onFocus}
        autofocus={autofocus}
        textareaClassName="min-h-[80px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand"
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
          disabled={!messageIsValid}
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
