import { User } from "@domain/user";

export const CommentText = ({
  text,
  mentionables,
}: CommentTextProps): JSX.Element => {
  const mentionPattern = buildMentionPattern(mentionables);

  if (!mentionPattern) return <p>{text}</p>;

  const parts = text.split(mentionPattern);

  return (
    <p>
      {parts.map((part, index) =>
        part.startsWith("@") && isMention(part, mentionables) ? (
          <span key={index} className="font-primary-bold text-font-brand">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  );
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildMentionPattern = (mentionables: User[]): RegExp | null => {
  if (mentionables.length === 0) return null;
  const names = mentionables
    .map((mentionable) => escapeRegExp(mentionable.name))
    .sort((a, b) => b.length - a.length)
    .join("|");
  return new RegExp(`(@(?:${names}))(?![\\w])`, "g");
};

const isMention = (part: string, mentionables: User[]): boolean =>
  mentionables.some((mentionable) => part === `@${mentionable.name}`);

interface CommentTextProps {
  text: string;
  mentionables: User[];
}
