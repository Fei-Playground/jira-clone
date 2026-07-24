import cx from "classix";
import { OlgaEmptyState } from "@olga/components/empty-state";
import { mockMatches } from "@olga/domain/mock-data";
import type { Match, MatchId } from "@olga/domain/types";
import { formatDistanceToNow } from "@olga/utils/format-time";

interface MatchesListScreenProps {
  matches?: Match[];
  /** IDs of matches that have unread messages */
  unreadMatchIds?: MatchId[];
  onSelectMatch?: (match: Match) => void;
}

export const MatchesListScreen = ({
  matches = mockMatches,
  unreadMatchIds = ["match-01"],
  onSelectMatch,
}: MatchesListScreenProps): JSX.Element => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Header */}
      <div className="border-b border-olga-rule bg-white px-5 pb-4 pt-12">
        <h1 className="font-display text-2xl font-bold text-olga-ink">
          Matches
        </h1>
        <p className="mt-0.5 text-sm text-olga-slate">
          {matches.length} mutual connection{matches.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <OlgaEmptyState
            icon={
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            headline="No matches yet"
            body="Approve proposals in the Live tab to start making connections."
          />
        ) : (
          <ul>
            {matches.map((match) => {
              const hasUnread = unreadMatchIds.includes(match.id);
              return (
                <li key={match.id}>
                  <MatchRow
                    match={match}
                    hasUnread={hasUnread}
                    onClick={() => onSelectMatch?.(match)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

const MatchRow = ({
  match,
  hasUnread,
  onClick,
}: {
  match: Match;
  hasUnread: boolean;
  onClick: () => void;
}): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      "flex w-full items-center gap-4 border-b border-olga-rule bg-white px-5 py-4",
      "transition-colors duration-[var(--olga-duration-instant)] hover:bg-olga-surface",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-olga-amber",
      "text-left"
    )}
    aria-label={`${match.user.name}, ${match.score}% match${hasUnread ? ", unread message" : ""}`}
  >
    {/* Avatar */}
    <div className="relative shrink-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olga-navy">
        <span className="font-mono text-sm font-[500] text-white">
          {match.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>
      {/* Unread dot */}
      {hasUnread && (
        <span
          className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-olga-navy"
          aria-hidden="true"
        />
      )}
    </div>

    {/* Content */}
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cx(
            "truncate text-sm",
            hasUnread
              ? "font-semibold text-olga-ink"
              : "font-medium text-olga-ink"
          )}
        >
          {match.user.name}
        </span>
        <span className="shrink-0 text-[11px] text-olga-slate-lt">
          {formatDistanceToNow(match.matchedAt)}
        </span>
      </div>

      <p className="mt-0.5 truncate text-xs text-olga-slate">
        {match.user.employer}
      </p>

      <div className="mt-1.5 flex items-center gap-3">
        {/* Match score */}
        <span className="font-mono text-xs font-[500] text-olga-navy">
          {match.score}% fit
        </span>
        <span className="text-olga-rule">·</span>
        {/* Venue */}
        <span className="truncate text-xs text-olga-slate">
          {match.space.name}
        </span>
      </div>
    </div>

    {/* Chevron */}
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--olga-slate-lt)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </button>
);
