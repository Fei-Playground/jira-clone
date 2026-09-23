import { User } from "@domain/user";

export interface MentionToken {
  /** Index of the "@" that opens the mention being typed. */
  start: number;
  /** What has been typed after that "@" so far. */
  query: string;
}

export interface MessagePart {
  text: string;
  isMention: boolean;
}

/**
 * The mention being typed at the caret, or null when the caret is not
 * inside one. A mention cannot span a line or another "@", and the "@"
 * has to start a word.
 */
export const getMentionToken = (message: string, caret: number): MentionToken | null => {
  const beforeCaret = message.slice(0, caret);
  const start = beforeCaret.lastIndexOf("@");

  if (start === -1) return null;

  const query = beforeCaret.slice(start + 1);

  if (query.includes("@") || query.includes("\n")) return null;
  if (start > 0 && !/\s/.test(beforeCaret[start - 1])) return null;

  return { start, query };
};

/** Project members whose name matches what has been typed after the "@". */
export const matchUsers = (users: User[], query: string): User[] =>
  users.filter((user) => user.name.toLowerCase().startsWith(query.toLowerCase()));

/** Replaces the mention being typed with the picked member's name. */
export const insertMention = (message: string, mention: MentionToken, name: string): string =>
  `${message.slice(0, mention.start)}@${name} ${message.slice(
    mention.start + mention.query.length + 1
  )}`;

/** Splits a message into plain text and the "@Full Name" mentions it contains. */
export const splitMentions = (message: string, users: User[]): MessagePart[] => {
  if (users.length === 0) return [{ text: message, isMention: false }];

  const pattern = mentionPattern(users);
  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match = pattern.exec(message);

  while (match) {
    if (match.index > lastIndex) {
      parts.push({ text: message.slice(lastIndex, match.index), isMention: false });
    }

    parts.push({ text: match[0], isMention: true });
    lastIndex = match.index + match[0].length;
    match = pattern.exec(message);
  }

  if (lastIndex < message.length) {
    parts.push({ text: message.slice(lastIndex), isMention: false });
  }

  return parts;
};

const mentionPattern = (users: User[]): RegExp => {
  // Longest name first, so "@Little Green Men" is not cut short by a shorter match.
  const names = users
    .map((user) => user.name)
    .sort((a, b) => b.length - a.length)
    .map(escapeForRegex)
    .join("|");

  return new RegExp(`@(?:${names})(?![\\w])`, "gi");
};

const escapeForRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
