import { User } from "@domain/user";

export type CommentMessageSegment =
  { type: "text"; text: string } | { type: "mention"; text: string; user: User };

export type MentionQuery = {
  query: string;
  startIndex: number;
  endIndex: number;
};

/** Longest-name-first so multi-word users match before shorter prefixes. */
const sortUsersByNameLength = (users: User[]): User[] =>
  [...users].sort((a, b) => b.name.length - a.name.length);

const isMentionBoundary = (char: string | undefined): boolean =>
  char === undefined || /[\s.,!?;:)'"]/.test(char);

export const parseCommentMessage = (message: string, users: User[]): CommentMessageSegment[] => {
  if (!message) {
    return [];
  }

  const sortedUsers = sortUsersByNameLength(users);
  const segments: CommentMessageSegment[] = [];
  let index = 0;
  let textBuffer = "";

  const flushText = () => {
    if (textBuffer) {
      segments.push({ type: "text", text: textBuffer });
      textBuffer = "";
    }
  };

  while (index < message.length) {
    if (message[index] === "@") {
      const matchedUser = sortedUsers.find((user) => {
        const token = `@${user.name}`;
        if (!message.startsWith(token, index)) {
          return false;
        }
        return isMentionBoundary(message[index + token.length]);
      });

      if (matchedUser) {
        flushText();
        const text = `@${matchedUser.name}`;
        segments.push({ type: "mention", text, user: matchedUser });
        index += text.length;
        continue;
      }
    }

    textBuffer += message[index];
    index += 1;
  }

  flushText();
  return segments;
};

export const findMentionQuery = (message: string, cursorIndex: number): MentionQuery | null => {
  const textBeforeCursor = message.slice(0, cursorIndex);
  const match = textBeforeCursor.match(/@([^@\n]*)$/);

  if (!match || match.index === undefined) {
    return null;
  }

  // A completed mention followed only by spaces is not an active query.
  if (match[1].endsWith(" ") && match[1].trim().length > 0) {
    return null;
  }

  return {
    query: match[1],
    startIndex: match.index,
    endIndex: cursorIndex,
  };
};

export const filterUsersByMentionQuery = (users: User[], query: string): User[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return users;
  }

  return users.filter((user) => user.name.toLowerCase().includes(normalized));
};

export const insertMention = (
  message: string,
  mention: MentionQuery,
  user: User
): { message: string; cursorIndex: number } => {
  const mentionText = `@${user.name} `;
  const nextMessage =
    message.slice(0, mention.startIndex) + mentionText + message.slice(mention.endIndex);
  const cursorIndex = mention.startIndex + mentionText.length;

  return { message: nextMessage, cursorIndex };
};
