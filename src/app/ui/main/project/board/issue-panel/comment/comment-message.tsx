import { User, usersMock } from "@domain/user";

/**
 * Renders a comment's text with "@Name" mentions highlighted.
 * A mention is any "@<user name>" matching a known user, longest names first.
 */
export const CommentMessage = ({
  message,
  users = usersMock,
}: CommentMessageProps): JSX.Element => {
  const parts = splitByMentions(message, users);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) =>
        part.user ? (
          <span
            key={index}
            className="rounded-sm bg-background-brand-subtlest px-0.5 font-primary-bold text-font-brand"
            aria-label={`Mention of ${part.user.name}`}
          >
            @{part.user.name}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </p>
  );
};

interface Part {
  text: string;
  user?: User;
}

const splitByMentions = (message: string, users: User[]): Part[] => {
  // Longest names first so "Ms Potato" wins over "Potato"-like prefixes.
  const sortedUsers = [...users].sort((a, b) => b.name.length - a.name.length);

  const parts: Part[] = [];
  let rest = message;

  while (rest.length > 0) {
    const atIndex = rest.indexOf("@");
    if (atIndex === -1) {
      parts.push({ text: rest });
      break;
    }
    if (atIndex > 0) {
      parts.push({ text: rest.slice(0, atIndex) });
      rest = rest.slice(atIndex);
    }
    const match = sortedUsers.find((user) =>
      rest.slice(1).startsWith(user.name)
    );
    if (match) {
      parts.push({ text: `@${match.name}`, user: match });
      rest = rest.slice(1 + match.name.length);
    } else {
      parts.push({ text: "@" });
      rest = rest.slice(1);
    }
  }

  return parts;
};

interface CommentMessageProps {
  message: string;
  users?: User[];
}
