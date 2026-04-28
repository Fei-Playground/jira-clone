import { useState } from "react";
import { cx } from "classix";
import { LinkedIssue, RelationType } from "@domain/issue";

const relationTypeLabel: Record<RelationType, string> = {
  blocks: "Blocks",
  blocked_by: "Blocked by",
  relates_to: "Relates to",
  duplicates: "Duplicates",
};

const relationTypeIcon: Record<RelationType, string> = {
  blocks: "🔗",
  blocked_by: "⛔",
  relates_to: "🔄",
  duplicates: "📋",
};

export const LinkedIssues = ({
  linkedIssues = [],
  onAddLink,
}: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (linkedIssues.length === 0 && !onAddLink) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cx(
            "flex w-full items-center gap-2 rounded-md p-2",
            "font-primary text-sm font-primary-bold text-font",
            "hover:bg-background-neutral"
          )}
          aria-label="Toggle linked issues section"
        >
          <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
          <span>Linked Issues (0)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cx(
          "flex w-full items-center gap-2 rounded-md p-2",
          "font-primary text-sm font-primary-bold text-font",
          "hover:bg-background-neutral"
        )}
        aria-label="Toggle linked issues section"
      >
        <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
        <span>Linked Issues ({linkedIssues.length})</span>
      </button>

      {isExpanded && (
        <div className="space-y-2 pl-4">
          {linkedIssues.map((link, index) => (
            <div
              key={`${link.issueId}-${index}`}
              className="flex items-center gap-2 rounded-md bg-background-neutral px-3 py-2"
            >
              <span className="text-lg">
                {relationTypeIcon[link.relationType]}
              </span>
              <div className="flex-1">
                <p className="text-xs text-font-subtle">
                  {relationTypeLabel[link.relationType]}
                </p>
                <p className="font-primary text-sm text-font">
                  {link.issueId}
                </p>
                <p className="text-xs text-font-subtle">{link.issueName}</p>
              </div>
            </div>
          ))}

          {onAddLink && (
            <button
              onClick={onAddLink}
              className={cx(
                "w-full rounded-md border-2 border-dashed border-border-neutral",
                "px-3 py-2 text-center font-primary text-sm text-font-subtle",
                "hover:bg-background-neutral-hovered hover:text-font"
              )}
              aria-label="Add linked issue"
            >
              + Add linked issue
            </button>
          )}
        </div>
      )}

      {/* Hidden input for form submission if needed */}
      <input
        type="hidden"
        name="linkedIssues"
        value={JSON.stringify(linkedIssues)}
      />
    </div>
  );
};

interface Props {
  linkedIssues?: LinkedIssue[];
  onAddLink?: () => void;
}
