import { User } from "@domain/user";
import { parseCommentMessage } from "@utils/comment-mentions";

export const CommentMessage = ({
  message,
  users,
}: CommentMessageProps): JSX.Element => {
  const segments = parseCommentMessage(message, users);

  if (segments.length === 0) {
    return <p className="whitespace-pre-wrap">{message}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {segments.map((segment, index) =>
        segment.type === "mention" ? (
          <span
            key={`${segment.user.id}-${index}`}
            className="rounded bg-background-brand-subtlest px-0.5 font-primary text-font-brand"
            title={segment.user.name}
          >
            {segment.text}
          </span>
        ) : (
          <span key={`text-${index}`}>{segment.text}</span>
        )
      )}
    </p>
  );
};

interface CommentMessageProps {
  message: string;
  users: User[];
}
