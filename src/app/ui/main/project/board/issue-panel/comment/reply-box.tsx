import { useState } from "react";
import cx from "classix";
import { User } from "@domain/user";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";
import { MentionTextarea } from "./mention-textarea";

export const ReplyBox = ({
  onSave,
  onCancel,
  users = [],
}: ReplyBoxProps): JSX.Element => {
  const [message, setMessage] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const handleSave = () => {
    if (messageIsValid()) {
      onSave(message);
      setMessage("");
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const handleCancel = () => {
    setMessage("");
    setHasError(false);
    onCancel();
  };

  const isError = hasError && !messageIsValid();
  const placeholder = isError ? "Reply cannot be empty" : "Add a reply...";

  const textareaClass = cx(
    "min-h-[60px] bg-background-input font-primary-light leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
    isError &&
      "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
  );

  return (
    <div className="w-full">
      {users.length > 0 ? (
        <MentionTextarea
          name="reply"
          value={message}
          setValue={setMessage}
          placeholder={placeholder}
          autofocus
          textareaClassName={textareaClass}
          users={users}
        />
      ) : (
        <TextareaAutosize
          name="reply"
          value={message}
          setValue={setMessage}
          placeholder={placeholder}
          autofocus
          textareaClassName={textareaClass}
        />
      )}
      <div className="mt-2 flex gap-2 text-sm">
        <Button
          type="button"
          className="px-4 py-2"
          onClick={handleSave}
          aria-label="Save reply"
        >
          Save
        </Button>
        <Button
          color="neutral"
          variant="text"
          className="px-4 py-2"
          onClick={handleCancel}
          aria-label="Cancel reply"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

interface ReplyBoxProps {
  onSave: (message: string) => void;
  onCancel: () => void;
  users?: User[];
}
