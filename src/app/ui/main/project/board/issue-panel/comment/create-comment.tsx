import { useRef, useEffect, forwardRef } from "react";
import { v4 as uuid } from "uuid";
import { Comment } from "@domain/comment";
import { useUserStore } from "@app/store/user.store";
import { UserAvatar } from "@app/components/user-avatar";
import { EditBox } from "./edit-box";

export const CreateComment = forwardRef<
  HTMLTextAreaElement,
  CreateCommentProps
>(({ addComment, message, setMessage }, ref) => {
  const { user } = useUserStore();
  const editBoxRef = useRef<HTMLTextAreaElement>(null);

  // If parent provides a ref, sync it to our internal editBoxRef
  useEffect(() => {
    if (ref && editBoxRef.current) {
      if (typeof ref === "function") {
        ref(editBoxRef.current);
      } else {
        ref.current = editBoxRef.current;
      }
    }
  }, [ref]);

  const save = (messageText: string) => {
    addComment({
      id: "temp-" + uuid(),
      user,
      message: messageText,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setMessage("");
  };

  return (
    <div className="mt-4 flex items-start gap-6">
      <UserAvatar {...user} />
      <EditBox ref={editBoxRef} defaultMessage={message} save={save} />
    </div>
  );
});

CreateComment.displayName = "CreateComment";

interface CreateCommentProps {
  addComment: (comment: Comment) => void;
  message: string;
  setMessage: (message: string) => void;
}
