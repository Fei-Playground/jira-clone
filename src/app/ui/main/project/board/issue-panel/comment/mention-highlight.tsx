import { User } from "@domain/user";

export const MentionHighlight = ({
  message,
  users,
}: MentionHighlightProps): JSX.Element => {
  const parsedContent = parseMessageForMentions(message, users);

  return (
    <p>
      {parsedContent.map((segment, index) => {
        if (segment.type === "mention") {
          return (
            <span
              key={index}
              className="font-primary-bold text-font-brand"
              aria-label={`Mentioned user: ${segment.text}`}
            >
              {segment.text}
            </span>
          );
        }
        return <span key={index}>{segment.text}</span>;
      })}
    </p>
  );
};

interface ParsedSegment {
  type: "text" | "mention";
  text: string;
}

const parseMessageForMentions = (
  message: string,
  users: User[]
): ParsedSegment[] => {
  const segments: ParsedSegment[] = [];

  // Sort users by name length (longest first) to match longer names first
  // Prevents "@Mr Potato" from being incorrectly parsed as "@Mr" + " Potato"
  const sortedUsers = [...users].sort((a, b) => b.name.length - a.name.length);

  let remainingText = message;
  let currentIndex = 0;

  while (currentIndex < message.length) {
    // Look for @ symbol
    const atIndex = remainingText.indexOf(
      "@",
      currentIndex - (message.length - remainingText.length)
    );

    if (atIndex === -1) {
      // No more @ symbols, add remaining text
      if (remainingText) {
        segments.push({ type: "text", text: remainingText });
      }
      break;
    }

    // Add text before @
    const beforeAt = message.substring(currentIndex, atIndex);
    if (beforeAt) {
      segments.push({ type: "text", text: beforeAt });
    }

    // Try to match a username after @
    let matched = false;
    const textAfterAt = message.substring(atIndex + 1);

    for (const user of sortedUsers) {
      if (textAfterAt.startsWith(user.name)) {
        // Match found — highlight as mention and advance cursor past it
        segments.push({
          type: "mention",
          text: `@${user.name}`,
        });
        currentIndex = atIndex + 1 + user.name.length;
        remainingText = message.substring(currentIndex);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // No user matched — treat @ as regular text
      segments.push({ type: "text", text: "@" });
      currentIndex = atIndex + 1;
      remainingText = message.substring(currentIndex);
    }
  }

  return segments;
};

interface MentionHighlightProps {
  message: string;
  users: User[];
}
