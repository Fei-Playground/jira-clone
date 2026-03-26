import { Mention } from "@domain/comment";
import { User } from "@domain/user";

export interface TextSegment {
  type: "text" | "mention";
  content: string;
  user?: User;
}

export const parseMentions = (
  text: string,
  mentions: Mention[] | undefined,
  users: User[]
): TextSegment[] => {
  if (!mentions || mentions.length === 0) {
    return [{ type: "text", content: text }];
  }

  // Sort mentions by startIndex to process them in order
  const sortedMentions = [...mentions].sort((a, b) => a.startIndex - b.startIndex);

  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const mention of sortedMentions) {
    // Add text before mention
    if (mention.startIndex > lastIndex) {
      segments.push({
        type: "text",
        content: text.substring(lastIndex, mention.startIndex),
      });
    }

    // Add mention
    const user = users.find((u) => u.id === mention.id);
    segments.push({
      type: "mention",
      content: text.substring(mention.startIndex, mention.endIndex),
      user: user,
    });

    lastIndex = mention.endIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }

  return segments;
};
