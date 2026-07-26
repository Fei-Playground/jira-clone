import { useState } from "react";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Reply } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

export const ReplyBox = ({ onReply, onCancel }: ReplyBoxProps): JSX.Element => {
  const { user } = useUserStore();
  const [message, setMessage] = useState<string>("");
  const [initError, setInitError] = useState<boolean>(false);

  const messageIsValid = (): boolean => {
    return message.length > 0 && !textAreOnlySpaces(message);
  };

  const onSave = () => {
    if (messageIsValid()) {
      const newReply: Reply = {
        id: "reply-" + uuid(),
        user,
        message,
        createdAt: Date.now(),
      };
      onReply(newReply);
      setMessage("");
      setInitError(false);
    } else {
      setInitError(true);
    }
  };

  const onCancelClick = () => {
    setMessage("");
    setInitError(false);
    onCancel();
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError ? "Reply cannot be empty" : "Write a reply...";

  return (
    <div className="flex items-start gap-3 border-l-2 border-border-input pl-4">
      <div className="mt-0.5 shrink-0">
        <UserAvatar {...user} size={28} />
      </div>
      <div className="w-full">
        <TextareaAutosize
          name="reply"
          value={message}
          setValue={setMessage}
          placeholder={placeholder}
          autofocus
          textareaClassName={cx(
            "min-h-[60px] bg-background-input font-primary-light text-sm leading-6 outline outline-2 outline-border-input focus:outline-border-brand",
            isError &&
              "!outline-2 !outline-border-danger placeholder:text-font-danger placeholder:text-opacity-70"
          )}
        />
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            className="px-3 py-2 text-sm"
            onClick={onSave}
            aria-label="Save reply"
          >
            Reply
          </Button>
          <Button
            color="neutral"
            variant="text"
            className="px-3 py-2 text-sm"
            onClick={onCancelClick}
            aria-label="Cancel reply"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ReplyBoxProps {
  onReply: (reply: Reply) => void;
  onCancel: () => void;
}
