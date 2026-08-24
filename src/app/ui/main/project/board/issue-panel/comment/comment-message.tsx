import { User } from "@domain/user";
import { splitMessageWithMentions } from "./mention-utils";

export const CommentMessage = ({
  message,
  users,
}: CommentMessageProps): JSX.Element => {
  const parts = splitMessageWithMentions(message, users);

  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (part.type === "mention") {
          return (
            <span
              key={`${part.user.id}-${index}`}
              className="inline-block rounded-sm bg-background-brand-subtlest px-1.5 py-0.5 font-primary text-font-brand"
              title={part.user.name}
              data-mention={part.user.id}
            >
              @{part.user.name}
            </span>
          );
        }
        return <span key={`text-${index}`}>{part.text}</span>;
      })}
    </p>
  );
};

interface CommentMessageProps {
  message: string;
  users: User[];
}
