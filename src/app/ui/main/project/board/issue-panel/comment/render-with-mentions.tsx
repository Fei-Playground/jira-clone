import { User } from "@domain/user";

/**
 * Splits `message` into plain text and @mention tokens, returning an array of
 * React nodes.  Tokens matching an actual project user are highlighted; unknown
 * @words are left as plain text so stray @ signs don't break the layout.
 */
export const renderWithMentions = (
  message: string,
  users: User[]
): React.ReactNode[] => {
  const userNames = new Set(users.map((u) => u.name));
  // Match @Word (supports multi-word names like "Little Green Men")
  // Strategy: greedily try longest match first by sorting names descending by length
  const sortedNames = [...userNames].sort((a, b) => b.length - a.length);
  const escapedNames = sortedNames.map((n) =>
    n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  if (escapedNames.length === 0) {
    return [message];
  }

  const pattern = new RegExp(`@(${escapedNames.join("|")})`, "g");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index));
    }
    parts.push(
      <span
        key={match.index}
        className="inline-block rounded bg-background-brand-subtlest px-1 font-primary text-font-brand"
      >
        @{match[1]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [message];
};
