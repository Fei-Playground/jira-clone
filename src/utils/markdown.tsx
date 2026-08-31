import type { ReactNode } from "react";

/**
 * Very small markdown subset for comments:
 * **bold**, *italic*, `code`, [label](url), and line breaks.
 * Text is rendered as React nodes (auto-escaped).
 */
export const renderMarkdownToNodes = (raw: string): ReactNode[] => {
  const lines = raw.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = tokenizeInline(line);
    return (
      <span key={`line-${lineIndex}`}>
        {parts}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </span>
    );
  });
};

const tokenizeInline = (line: string): ReactNode[] => {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-primary-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="font-mono rounded bg-background-neutral px-1 py-0.5 text-xs"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const href = linkMatch[2];
        const isSafe =
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("mailto:");
        if (isSafe) {
          nodes.push(
            <a
              key={key++}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-font-brand underline"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          nodes.push(token);
        }
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
};

export const MarkdownText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}): JSX.Element => (
  <div className={className}>{renderMarkdownToNodes(text)}</div>
);
