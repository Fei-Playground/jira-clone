import { User } from "@domain/user";

export type MessagePart =
  { type: "text"; text: string } | { type: "mention"; user: User; text: string };

export type ActiveMention = {
  /** Index of the `@` in the full message. */
  start: number;
  /** Text after `@` up to the cursor (may include spaces while filtering). */
  query: string;
};

/** Users whose name matches the query (case-insensitive prefix on full name). */
export const filterUsersByMentionQuery = (users: User[], query: string): User[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return users;

  return users.filter((user) => user.name.toLowerCase().startsWith(normalized));
};

/**
 * If the cursor sits inside an in-progress @mention, return its range + query.
 * A mention starts at `@` that is at the start of the text or after whitespace.
 */
export const getActiveMentionAt = (text: string, cursor: number): ActiveMention | null => {
  if (cursor < 0 || cursor > text.length) return null;

  const before = text.slice(0, cursor);
  // Allow letters, digits, spaces, dots, hyphens while typing multi-word names.
  const match = before.match(/(?:^|[\s\n])@([\w .-]*)$/);
  if (!match) return null;

  const query = match[1] ?? "";
  const start = before.length - query.length - 1; // index of '@'
  return { start, query };
};

/** Replace the active `@query` with `@User Name ` and return the new text + cursor. */
export const insertMention = (
  text: string,
  cursor: number,
  user: User
): { text: string; cursor: number } | null => {
  const active = getActiveMentionAt(text, cursor);
  if (!active) return null;

  const mentionText = `@${user.name} `;
  const next = text.slice(0, active.start) + mentionText + text.slice(cursor);
  const nextCursor = active.start + mentionText.length;
  return { text: next, cursor: nextCursor };
};

/**
 * Split a comment message into plain text and mention segments.
 * Longer user names win so "Little Green Men" is preferred over partial matches.
 */
export const splitMessageWithMentions = (message: string, users: User[]): MessagePart[] => {
  if (!message) return [{ type: "text", text: "" }];

  const sorted = [...users].sort((a, b) => b.name.length - a.name.length);
  const parts: MessagePart[] = [];
  let i = 0;

  while (i < message.length) {
    if (message[i] === "@") {
      const rest = message.slice(i + 1);
      const matched = sorted.find((u) => {
        if (!rest.startsWith(u.name)) return false;
        const next = rest[u.name.length];
        return next === undefined || isMentionBoundary(next);
      });

      if (matched) {
        parts.push({
          type: "mention",
          user: matched,
          text: `@${matched.name}`,
        });
        i += matched.name.length + 1;
        continue;
      }
    }

    // Accumulate plain text until the next '@' or end
    let j = i + 1;
    while (j < message.length && message[j] !== "@") j += 1;
    // If this '@' didn't match a user, include it as text up to the next '@'
    if (message[i] === "@") {
      const nextAt = message.indexOf("@", i + 1);
      const end = nextAt === -1 ? message.length : nextAt;
      parts.push({ type: "text", text: message.slice(i, end) });
      i = end;
    } else {
      parts.push({ type: "text", text: message.slice(i, j) });
      i = j;
    }
  }

  return mergeAdjacentText(parts);
};

/** Characters that can end a mention without being part of the name. */
const isMentionBoundary = (ch: string): boolean => /[\s,.:;!?()[\]{}"'…—–-]/.test(ch);

const mergeAdjacentText = (parts: MessagePart[]): MessagePart[] => {
  const merged: MessagePart[] = [];
  for (const part of parts) {
    const last = merged[merged.length - 1];
    if (part.type === "text" && last?.type === "text") {
      last.text += part.text;
    } else {
      merged.push(part.type === "text" ? { type: "text", text: part.text } : part);
    }
  }
  return merged.length > 0 ? merged : [{ type: "text", text: "" }];
};
