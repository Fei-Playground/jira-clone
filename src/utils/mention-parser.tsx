/**
 * Parse text and render @mentions with highlighted styling.
 * Mentions are identified as @username where username contains no whitespace.
 */
export const parseMentions = (text: string): JSX.Element[] => {
  const mentionRegex = /@(\S+)/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    // Add highlighted mention
    parts.push(
      <span
        key={`mention-${key++}`}
        className="rounded bg-background-brand-subtlest px-1 font-primary-bold text-font-brand"
      >
        @{match[1]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last mention
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key="default">{text}</span>];
};

/**
 * Extract all @username mentions from text as an array of usernames.
 */
export const extractMentionedUsernames = (text: string): string[] => {
  const mentionRegex = /@(\S+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
};
