import { useState, useEffect, useCallback, useRef } from "react";
import { AnonymousProfileCard } from "@olga/components/profile-card";
import { PresenceIndicator } from "@olga/components/presence-indicator";
import { OlgaEmptyState } from "@olga/components/empty-state";
import { CountdownTimer } from "@olga/components/countdown-timer";
import { MatchToast } from "@olga/components/match-toast";
import { ProposalQueueTour } from "@olga/components/proposal-tour";
import { mockProposals } from "@olga/domain/mock-data";
import type { Proposal } from "@olga/domain/types";

interface ProposalQueueScreenProps {
  venueName?: string;
  secondsRemaining?: number;
  onCheckOut?: () => void;
}

export const ProposalQueueScreen = ({
  venueName = "Soho Works White City",
  secondsRemaining = 3600,
  onCheckOut,
}: ProposalQueueScreenProps): JSX.Element => {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [approvedId, setApprovedId] = useState<string | null>(null);
  // Track which direction the keyboard last triggered — for the hint pulse
  const [kbdHint, setKbdHint] = useState<"left" | "right" | null>(null);
  const [kbdFireCount, setKbdFireCount] = useState(0);
  const [kbdDirection, setKbdDirection] = useState<"left" | "right">("right");
  // ── Match toast ──────────────────────────────────────────────
  const [toastVisible, setToastVisible] = useState(false);
  const [toastCategory, setToastCategory] = useState("");
  const queueRef = useRef<HTMLDivElement>(null);

  const currentProposal = proposals[0] ?? null;
  const nextProposal = proposals[1] ?? null;
  const thirdProposal = proposals[2] ?? null;
  const remaining = proposals.length;

  const handleApprove = useCallback(() => {
    if (!currentProposal) return;
    setApprovedId(currentProposal.id);
    // Simulate 40% chance of mutual match
    const isMutualMatch = Math.random() < 0.4;
    setTimeout(() => {
      setApprovedId(null);
      setProposals((prev) => prev.slice(1));
      if (isMutualMatch) {
        setToastCategory(currentProposal.category);
        setToastVisible(true);
      }
    }, 300);
  }, [currentProposal]);

  const handleDecline = useCallback(() => {
    if (!currentProposal) return;
    setProposals((prev) => prev.slice(1));
  }, [currentProposal]);

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't fire when focused inside an input/textarea
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (e.key === "ArrowRight") {
        setKbdHint("right");
        setTimeout(() => setKbdHint(null), 600);
        // Trigger shake-then-flyoff via counter prop
        setKbdDirection("right");
        setKbdFireCount((n) => n + 1);
      } else if (e.key === "ArrowLeft") {
        setKbdHint("left");
        setTimeout(() => setKbdHint(null), 600);
        setKbdDirection("left");
        setKbdFireCount((n) => n + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleApprove, handleDecline]);

  return (
    <div
      className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface"
      ref={queueRef}
    >
      {/* Match toast notification */}
      <MatchToast
        category={toastCategory}
        isVisible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      {/* First-time onboarding tour (dismissed via localStorage) */}
      <ProposalQueueTour />

      {/* Presence bar — passes secondsRemaining for live countdown + auto-expiring */}
      <PresenceIndicator
        status="active"
        venueName={venueName}
        secondsRemaining={secondsRemaining}
        onCheckOut={onCheckOut}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-olga-ink">
            Live
          </h1>
          {remaining > 0 && (
            <p className="mt-0.5 text-xs text-olga-slate">
              {remaining} proposal{remaining !== 1 ? "s" : ""} in queue
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <CountdownTimer secondsRemaining={secondsRemaining} />
          <span className="mt-0.5 text-[11px] text-olga-slate-lt">session</span>
        </div>
      </div>

      {/* Card stack area */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-4">
        {currentProposal ? (
          <div className="relative w-full">
            {/* ── Stack layer 3 (furthest back) ─────────────────── */}
            {thirdProposal && (
              <div
                className="pointer-events-none absolute inset-x-8 -top-4 h-24 rounded-xl bg-white shadow-olga-card"
                style={{
                  transform: "scale(0.90)",
                  transformOrigin: "top center",
                  opacity: 0.6,
                  zIndex: 1,
                }}
                aria-hidden="true"
              />
            )}

            {/* ── Stack layer 2 (middle) ────────────────────────── */}
            {nextProposal && (
              <div
                className="pointer-events-none absolute inset-x-4 -top-2 h-24 rounded-xl bg-white shadow-olga-card"
                style={{
                  transform: "scale(0.95)",
                  transformOrigin: "top center",
                  opacity: 0.85,
                  zIndex: 2,
                }}
                aria-hidden="true"
              />
            )}

            {/* ── Top (active) card ─────────────────────────────── */}
            <div style={{ position: "relative", zIndex: 10 }}>
              <AnonymousProfileCard
                category={currentProposal.category}
                score={currentProposal.score}
                explanation={currentProposal.explanation}
                intentSummary={currentProposal.intentSummary}
                state={
                  approvedId === currentProposal.id
                    ? "approved-waiting"
                    : "default"
                }
                onApprove={handleApprove}
                onDecline={handleDecline}
                keyboardFireCount={kbdFireCount}
                keyboardDirection={kbdDirection}
              />
            </div>
          </div>
        ) : (
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            }
            headline="Queue empty"
            body="You've reviewed all available proposals. Check back as new people check in."
          />
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      {currentProposal && (
        <div className="flex items-center justify-center gap-4 pb-5 pt-1">
          <KbdHint
            label="Decline"
            keys="←"
            active={kbdHint === "left"}
            color="olga-declined"
          />
          <span className="text-xs text-olga-rule">keyboard shortcuts</span>
          <KbdHint
            label="Approve"
            keys="→"
            active={kbdHint === "right"}
            color="olga-approved"
          />
        </div>
      )}
    </div>
  );
};

/** Small keyboard shortcut badge with optional active flash */
const KbdHint = ({
  label,
  keys,
  active,
  color,
}: {
  label: string;
  keys: string;
  active: boolean;
  color: string;
}): JSX.Element => (
  <div
    className="flex items-center gap-1.5"
    aria-label={`Press ${keys} to ${label}`}
  >
    <kbd
      className="flex h-6 min-w-[24px] items-center justify-center rounded border border-olga-rule bg-white px-1.5 font-mono text-xs text-olga-slate shadow-sm transition-all duration-[var(--olga-duration-fast)]"
      style={{
        borderColor: active ? `var(--${color})` : undefined,
        color: active ? `var(--${color})` : undefined,
        transform: active ? "scale(1.15)" : "scale(1)",
      }}
    >
      {keys}
    </kbd>
    <span className="text-[11px] text-olga-slate-lt">{label}</span>
  </div>
);
