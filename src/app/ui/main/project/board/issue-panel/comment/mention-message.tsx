import { User } from "@domain/user";

const escapeRegExp = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const MentionMessage = ({
  message,
  users,
}: MentionMessageProps): JSX.Element => {
  const names = users.map((user) => user.name).filter(Boolean);
  if (names.length === 0) return <p>{message}</p>;

  const pattern = new RegExp(
    `(@(?:${names
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join("|")}))`,
    "g"
  );
  const parts = message.split(pattern);

  return (
    <p>
      {parts.map((part, index) =>
        part.startsWith("@") && names.includes(part.slice(1)) ? (
          <span
            key={index}
            className="font-primary-bold text-font-brand"
            aria-label={`Mention of ${part.slice(1)}`}
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  );
};

interface MentionMessageProps {
  message: string;
  users: User[];
}
