import cx from "classix";

export const HighlightedText = ({
  text,
  highlights = [],
  className,
}: HighlightedTextProps): JSX.Element => {
  if (highlights.length === 0) {
    return <span className={className}>{text}</span>;
  }

  let remaining = text;
  const parts: JSX.Element[] = [];
  let partIndex = 0;

  highlights.forEach((highlight) => {
    const index = remaining.toLowerCase().indexOf(highlight.toLowerCase());

    if (index !== -1) {
      // Add the text before the highlight
      if (index > 0) {
        parts.push(
          <span key={`text-${partIndex}`}>
            {remaining.substring(0, index)}
          </span>
        );
        partIndex += 1;
      }

      // Add the highlighted text
      parts.push(
        <span
          key={`highlight-${partIndex}`}
          className="font-primary-bold text-font-brand"
        >
          {remaining.substring(index, index + highlight.length)}
        </span>
      );
      partIndex += 1;

      // Update remaining text
      remaining = remaining.substring(index + highlight.length);
    }
  });

  // Add any remaining text
  if (remaining) {
    parts.push(<span key={`text-${partIndex}`}>{remaining}</span>);
  }

  return <span className={className}>{parts}</span>;
};

export interface HighlightedTextProps {
  text: string;
  highlights?: string[];
  className?: string;
}
