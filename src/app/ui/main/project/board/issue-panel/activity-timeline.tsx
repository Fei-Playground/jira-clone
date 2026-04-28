import { useState } from "react";
import { cx } from "classix";
import { ActivityEntry } from "@domain/issue";
import { UserAvatar } from "@app/components/user-avatar";

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const ActivityTimeline = ({
  activityHistory = [],
}: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (activityHistory.length === 0) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cx(
            "flex w-full items-center gap-2 rounded-md p-2",
            "font-primary text-sm font-primary-bold text-font",
            "hover:bg-background-neutral"
          )}
          aria-label="Toggle activity timeline section"
        >
          <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
          <span>Activity (0)</span>
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
        aria-label="Toggle activity timeline section"
      >
        <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
        <span>Activity ({activityHistory.length})</span>
      </button>

      {isExpanded && (
        <div className="space-y-3 pl-4">
          {activityHistory.map((entry, index) => (
            <div
              key={entry.id || index}
              className="flex gap-3 rounded-md bg-background-neutral px-3 py-2"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={cx(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    "bg-elevation-surface-raised border-2 border-border-neutral",
                    "text-lg"
                  )}
                >
                  {entry.userImage ? "👤" : "📝"}
                </div>
                {index !== activityHistory.length - 1 && (
                  <div className="h-6 w-0.5 bg-border-neutral" />
                )}
              </div>

              {/* Activity content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="font-primary-bold text-sm text-font">
                    {entry.userName}
                  </p>
                  <p className="text-xs text-font-subtle">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
                <p className="text-sm text-font-subtle">{entry.action}</p>
                {entry.changeDetails && (
                  <div className="mt-1 space-y-1 text-xs text-font-subtle">
                    <p>
                      <span className="font-primary-bold">Field:</span>{" "}
                      {entry.changeDetails.field}
                    </p>
                    {entry.changeDetails.oldValue && (
                      <p>
                        <span className="text-danger">
                          - {entry.changeDetails.oldValue}
                        </span>
                      </p>
                    )}
                    {entry.changeDetails.newValue && (
                      <p>
                        <span className="text-success">
                          + {entry.changeDetails.newValue}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Props {
  activityHistory?: ActivityEntry[];
}
