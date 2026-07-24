import { useState, useEffect, useRef } from "react";
import { PresenceIndicator } from "@olga/components/presence-indicator";
import { CheckOutSheet } from "@olga/components/checkout-sheet";
import { SpaceDiscoveryScreen } from "@olga/screens/space-discovery/space-discovery.screen";
import { SpaceDetailScreen } from "@olga/screens/space-detail/space-detail.screen";
import { CheckInScreen } from "@olga/screens/check-in/check-in.screen";
import { ProposalQueueScreen } from "@olga/screens/proposal-queue/proposal-queue.screen";
import { MatchesListScreen } from "@olga/screens/matches-list/matches-list.screen";
import { MutualUnlockScreen } from "@olga/screens/mutual-unlock/mutual-unlock.screen";
import { MessengerScreen } from "@olga/screens/messenger/messenger.screen";
import { MeetingConfirmScreen } from "@olga/screens/meeting-confirm/meeting-confirm.screen";
import { OutcomeCaptureScreen } from "@olga/screens/outcome-capture/outcome-capture.screen";
import { SessionSummaryScreen } from "@olga/screens/session-summary/session-summary.screen";
import type { Space, Match } from "@olga/domain/types";
import { mockMatches } from "@olga/domain/mock-data";
import cx from "classix";

type Tab = "spaces" | "live" | "matches";
type Screen =
  | "space-list"
  | "space-detail"
  | "check-in"
  | "proposals"
  | "matches-list"
  | "mutual-unlock"
  | "messenger"
  | "meeting-confirm"
  | "outcome-capture"
  | "session-summary";

interface OlgaAppScreenProps {
  initialTab?: Tab;
  isCheckedIn?: boolean;
}

export const OlgaAppScreen = ({
  initialTab = "spaces",
  isCheckedIn = false,
}: OlgaAppScreenProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [screen, setScreen] = useState<Screen>(
    initialTab === "matches"
      ? "matches-list"
      : initialTab === "live"
        ? "proposals"
        : "space-list"
  );
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match>(mockMatches[0]);
  const [checkedIn, setCheckedIn] = useState(isCheckedIn);
  const [matchBadge, setMatchBadge] = useState(2);
  const [liveBadge, setLiveBadge] = useState(4);
  const [unreadMatchIds] = useState<string[]>(["match-01"]);

  // ── Badge bounce animation ───────────────────────────────────
  const [matchBadgeBounce, setMatchBadgeBounce] = useState(false);
  const prevMatchBadgeRef = useRef(matchBadge);
  useEffect(() => {
    if (matchBadge > prevMatchBadgeRef.current) {
      setMatchBadgeBounce(true);
      const t = setTimeout(() => setMatchBadgeBounce(false), 320);
      prevMatchBadgeRef.current = matchBadge;
      return () => clearTimeout(t);
    }
    prevMatchBadgeRef.current = matchBadge;
  }, [matchBadge]);

  // ── Session stats (tracked loosely for the summary screen) ──
  const [proposalsReviewed, setProposalsReviewed] = useState(0);
  const [proposalsApproved, setProposalsApproved] = useState(0);

  // ── Check-out sheet ──────────────────────────────────────────
  const [showCheckOutSheet, setShowCheckOutSheet] = useState(false);

  const handleCheckOut = () => setShowCheckOutSheet(true);

  const confirmCheckOut = () => {
    setShowCheckOutSheet(false);
    // Show summary screen first; it auto-advances after 2s
    setScreen("session-summary");
  };

  const cancelCheckOut = () => setShowCheckOutSheet(false);

  const handleSessionSummaryDone = () => {
    setCheckedIn(false);
    setLiveBadge(0);
    setProposalsReviewed(0);
    setProposalsApproved(0);
    setActiveTab("spaces");
    setScreen("space-list");
  };

  // ── Navigation helpers ───────────────────────────────────────
  const goTo = (s: Screen) => setScreen(s);

  const goToTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "spaces") goTo("space-list");
    if (tab === "live") goTo("proposals");
    if (tab === "matches") goTo("matches-list");
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    goTo("mutual-unlock");
  };

  const renderScreen = () => {
    switch (screen) {
      case "space-list":
        return (
          <SpaceDiscoveryScreen
            onSelectSpace={(space) => {
              setSelectedSpace(space);
              goTo("space-detail");
            }}
          />
        );

      case "space-detail":
        return (
          <SpaceDetailScreen
            space={selectedSpace ?? undefined}
            onBack={() => goTo("space-list")}
            onCheckIn={() => goTo("check-in")}
          />
        );

      case "check-in":
        return (
          <CheckInScreen
            venueName={selectedSpace?.name ?? "Soho Works White City"}
            onBack={() => goTo("space-detail")}
            onSuccess={() => {
              setCheckedIn(true);
              setLiveBadge(4);
              setActiveTab("live");
              goTo("proposals");
            }}
          />
        );

      case "proposals":
        return (
          <ProposalQueueScreen
            venueName={selectedSpace?.name ?? "Soho Works White City"}
            secondsRemaining={3600}
            onCheckOut={handleCheckOut}
          />
        );

      case "matches-list":
        return (
          <MatchesListScreen
            matches={mockMatches}
            unreadMatchIds={unreadMatchIds}
            onSelectMatch={handleSelectMatch}
          />
        );

      case "mutual-unlock":
        return (
          <MutualUnlockScreen
            match={selectedMatch}
            onBack={() => {
              setActiveTab("matches");
              goTo("matches-list");
            }}
            onOpenMessenger={() => goTo("messenger")}
          />
        );

      case "messenger":
        return <MessengerScreen matchId={selectedMatch.id} />;

      case "meeting-confirm":
        return <MeetingConfirmScreen onBack={() => goTo("messenger")} />;

      case "outcome-capture":
        return (
          <OutcomeCaptureScreen
            matchName={selectedMatch.user.name}
            onConfirm={() => {
              setMatchBadge((n) => Math.max(0, n - 1));
              goTo("matches-list");
            }}
            onSkip={() => goTo("matches-list")}
          />
        );

      case "session-summary":
        return (
          <SessionSummaryScreen
            venueName={selectedSpace?.name ?? "Soho Works White City"}
            proposalsReviewed={proposalsReviewed}
            proposalsApproved={proposalsApproved}
            matchesMade={matchBadge}
            onDone={handleSessionSummaryDone}
          />
        );

      default:
        return null;
    }
  };

  const showNavBar = !["check-in", "mutual-unlock", "session-summary"].includes(
    screen
  );
  const showPresence =
    checkedIn && !["check-in", "proposals", "session-summary"].includes(screen);

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Persistent presence indicator (with checkout button when active) */}
      {showPresence && (
        <PresenceIndicator
          status="active"
          venueName={selectedSpace?.name ?? "Soho Works White City"}
          onCheckOut={handleCheckOut}
        />
      )}

      {/* Screen content */}
      <div className="relative flex-1 overflow-hidden">{renderScreen()}</div>

      {/* Bottom tab navigation */}
      {showNavBar && (
        <nav
          className="border-t border-olga-rule bg-white"
          aria-label="Main navigation"
        >
          <div className="flex">
            <TabButton
              label="Spaces"
              icon={<SpacesIcon />}
              active={activeTab === "spaces"}
              onClick={() => goToTab("spaces")}
            />
            <TabButton
              label="Live"
              icon={<LiveIcon />}
              active={activeTab === "live"}
              badge={liveBadge > 0 ? liveBadge : undefined}
              onClick={() => goToTab("live")}
            />
            <TabButton
              label="Matches"
              icon={<MatchesIcon />}
              active={activeTab === "matches"}
              badge={matchBadge > 0 ? matchBadge : undefined}
              badgeBounce={matchBadgeBounce}
              onClick={() => goToTab("matches")}
            />
          </div>
        </nav>
      )}

      {/* Check-out confirmation sheet (rendered as portal-like overlay) */}
      <CheckOutSheet
        venueName={selectedSpace?.name ?? "Soho Works White City"}
        isOpen={showCheckOutSheet}
        onConfirm={confirmCheckOut}
        onCancel={cancelCheckOut}
      />

      {/* Badge bounce keyframe — defined once per shell render */}
      <style>{`
        @keyframes olga-badge-bounce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes olga-badge-bounce {
            0%, 100% { transform: scale(1); }
          }
        }
      `}</style>
    </div>
  );
};

const TabButton = ({
  label,
  icon,
  active,
  badge,
  badgeBounce = false,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
  badgeBounce?: boolean;
  onClick: () => void;
}): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      "relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors",
      active ? "text-olga-navy" : "text-olga-slate-lt hover:text-olga-slate"
    )}
    aria-current={active ? "page" : undefined}
    aria-label={label}
  >
    <div className="relative">
      <span
        className={cx(
          "transition-colors",
          active ? "text-olga-navy" : "text-olga-slate-lt"
        )}
      >
        {icon}
      </span>
      {badge !== undefined && (
        <span
          className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-olga-navy px-0.5 font-mono text-[10px] text-white"
          style={{
            animation: badgeBounce
              ? "olga-badge-bounce 300ms cubic-bezier(0.34,1.56,0.64,1) forwards"
              : undefined,
          }}
        >
          {badge}
        </span>
      )}
    </div>
    <span>{label}</span>
    {active && (
      <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-olga-navy" />
    )}
  </button>
);

// Tab icons
const SpacesIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LiveIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
  </svg>
);

const MatchesIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
