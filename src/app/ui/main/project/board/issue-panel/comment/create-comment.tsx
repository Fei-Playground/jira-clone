import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { v4 as uuid } from "uuid";
import cx from "classix";
import { Comment } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { TextareaAutosize } from "@app/components/textarea-autosize";
import { Button } from "@app/components/button";
import { textAreOnlySpaces } from "@utils/text-are-only-spaces";

export interface CreateCommentHandle {
  focus: () => void;
}

export const CreateComment = forwardRef<
  CreateCommentHandle,
  CreateCommentProps
>(({ addComment, replyText, clearReply }, ref) => {
  const { user } = useUserStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [initError, setInitError] = useState(false);

  // Pre-fill input with @mention when replying (e.g., "@Mom ")
  useEffect(() => {
    if (replyText) {
      setMessage(replyText);
      setIsEditing(true);
      // Defer focus to next tick to ensure DOM update
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [replyText]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    },
  }));

  const messageIsValid = () =>
    message.length > 0 && !textAreOnlySpaces(message);

  const resetValues = () => {
    setMessage("");
    setInitError(false);
    setIsEditing(false);
    if (clearReply) clearReply();
  };

  const onSave = () => {
    if (messageIsValid()) {
      addComment({
        id: "temp-" + uuid(),
        user,
        message,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      resetValues();
    } else {
      setInitError(true);
    }
  };

  const isError = initError && !messageIsValid();
  const placeholder = isError
    ? "Message cannot be empty"
    : "Add a note or message...";

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} />
      <div className="w-full">
        <TextareaAutosize
          ref={textareaRef}
          name="comment"
          value={message}
          setValue={setMessage}
          placeholder={placeholder}
          onFocus={() => setIsEditing(true)}
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
            onClick={resetValues}
            aria-label="Cancel comment"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
});

CreateComment.displayName = "CreateComment";

interface CreateCommentProps {
  addComment: (comment: Comment) => void;
  replyText?: string;
  clearReply?: () => void;
}
