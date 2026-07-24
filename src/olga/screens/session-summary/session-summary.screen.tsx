import { useEffect, useState, useRef } from "react";

interface SessionSummaryScreenProps {
  venueName?: string;
  proposalsReviewed?: number;
  proposalsApproved?: number;
  matchesMade?: number;
  onDone?: () => void;
}

/** Ease-out cubic: t goes 0→1, output goes 0→1 but decelerates */
const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Hook: animates a number from 0 to `target` over `duration`ms using
 * requestAnimationFrame with an ease-out curve.
 * When prefers-reduced-motion is set, skips animation and returns target immediately.
 */
const useCountUp = (target: number, duration = 800): number => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initialize directly to target when reduced motion is preferred
  const [count, setCount] = useState(() => (prefersReducedMotion ? target : 0));
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip animation for reduced-motion users
    if (prefersReducedMotion) return;

    startTimeRef.current = null;

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOut(progress) * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, prefersReducedMotion]);

  return count;
};

export const SessionSummaryScreen = ({
  venueName = "Soho Works White City",
  proposalsReviewed = 4,
  proposalsApproved = 2,
  matchesMade = 1,
  onDone,
}: SessionSummaryScreenProps): JSX.Element => {
  // Auto-advance after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  // Animated counts — each runs independently
  const animReviewed = useCountUp(proposalsReviewed);
  const animApproved = useCountUp(proposalsApproved);
  const animMatches = useCountUp(matchesMade);

  const stats = [
    {
      count: animReviewed,
      label: "Proposals\nreviewed",
      accent: "#94A3B8", // slate-lt
    },
    {
      count: animApproved,
      label: "Approvals\nsent",
      accent: "#C8963E", // amber
    },
    {
      count: animMatches,
      label: "Mutual\nmatches",
      accent: "#2E5A45", // approved
    },
  ];

  return (
    <div
      className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center bg-olga-navy px-8 py-16"
      aria-live="polite"
      aria-label="Session summary"
    >
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="mt-5 text-center font-display text-2xl font-bold text-white">
        Session ended
      </h1>
      <p className="mt-1 text-center text-sm text-olga-slate-lt">{venueName}</p>

      {/* Animated stats row */}
      <div className="mt-10 flex w-full items-start justify-center gap-8">
        {stats.map(({ count, label, accent }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span
              className="font-mono text-[40px] font-[500] tabular-nums leading-none"
              style={{ color: accent }}
              aria-label={`${count}`}
            >
              {count}
            </span>
            <span className="mt-2 whitespace-pre-line text-[11px] uppercase tracking-wider text-olga-slate">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Auto-dismiss hint */}
      <p className="mt-12 text-xs text-olga-slate">Returning to Spaces…</p>

      {/* Progress bar that fills over 2s */}
      <div className="mt-3 h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/30"
          style={{ animation: "olga-summary-progress 2s linear forwards" }}
          aria-hidden="true"
        />
      </div>

      <style>{`
        @keyframes olga-summary-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="olga-summary-progress"] { animation: none; width: 100%; }
        }
      `}</style>
    </div>
  );
};
