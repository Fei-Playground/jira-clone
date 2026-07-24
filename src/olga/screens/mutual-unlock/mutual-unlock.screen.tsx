import { useState } from "react";
import { MatchScoreDisplay } from "@olga/components/match-score";
import { OlgaButton } from "@olga/components/button";
import { mockMatches } from "@olga/domain/mock-data";
import type { Match } from "@olga/domain/types";

interface MutualUnlockScreenProps {
  match?: Match;
  onOpenMessenger?: () => void;
  onBack?: () => void;
}

// ── Confetti dot configuration ────────────────────────────────
const CONFETTI_DOTS = [
  // [x%, rotation, color, size, delay]
  [10, 30, "#C8963E", 6, 0],
  [20, -20, "#0A192F", 5, 60],
  [30, 45, "#C8963E", 7, 120],
  [40, -35, "#0A192F", 5, 30],
  [50, 60, "#C8963E", 6, 90],
  [60, -50, "#0A192F", 7, 15],
  [70, 25, "#C8963E", 5, 75],
  [80, -15, "#0A192F", 6, 45],
  [88, 40, "#C8963E", 5, 105],
  [15, -60, "#0A192F", 6, 150],
  [55, 15, "#C8963E", 7, 0],
  [75, -40, "#0A192F", 5, 60],
] as const;

export const MutualUnlockScreen = ({
  match = mockMatches[0],
  onOpenMessenger,
  onBack,
}: MutualUnlockScreenProps): JSX.Element => {
  const [isRevealed, setIsRevealed] = useState(false);

  const reveal = () => {
    if (!isRevealed) setIsRevealed(true);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-between bg-olga-navy px-5 py-12">
      {/* Back */}
      <div className="w-full">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-olga-slate-lt transition-colors hover:text-white"
          aria-label="Go back"
        >
          ← Live
        </button>
      </div>

      {/* Headline */}
      <div className="mt-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-olga-amber">
          Mutual consent
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold leading-snug text-white">
          {isRevealed ? "Identity revealed" : "You both said yes"}
        </h1>
        <p className="mx-auto mt-1 max-w-[260px] text-sm text-olga-slate-lt">
          {isRevealed
            ? `Matched at ${match.space.name}`
            : "Tap the card to reveal who you matched with"}
        </p>
      </div>

      {/* Flipping card + confetti */}
      <div className="relative mx-auto my-8 w-full max-w-xs">
        {/* Confetti burst — fires when isRevealed becomes true */}
        {isRevealed && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20"
            aria-hidden="true"
          >
            {CONFETTI_DOTS.map(([x, rot, color, size, delay], i) => (
              <ConfettiDot
                key={i}
                x={x as number}
                rotation={rot as number}
                color={color as string}
                size={size as number}
                delay={delay as number}
              />
            ))}
          </div>
        )}

        <div style={{ perspective: "1000px" }} className="w-full">
          <div
            className="relative w-full cursor-pointer"
            style={{
              height: "360px",
              transformStyle: "preserve-3d",
              transition: `transform var(--olga-duration-reveal) ease-in-out`,
              transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
            onClick={reveal}
            role="button"
            tabIndex={0}
            aria-label={
              isRevealed ? "Identity revealed" : "Tap to reveal identity"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") reveal();
            }}
          >
            {/* Front face — anonymous */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-olga-navy-soft p-6"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <p className="text-center text-sm text-white/60">Tap to reveal</p>
              <div className="mt-6 w-full">
                <MatchScoreDisplay
                  score={match.score}
                  explanation={match.explanation}
                />
              </div>
            </div>

            {/* Back face — revealed identity */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-6"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Avatar initials */}
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-olga-navy">
                <span className="font-mono text-xl font-[500] text-white">
                  {match.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>

              <h2 className="text-center font-display text-xl font-bold text-olga-ink">
                {match.user.name}
              </h2>
              <p className="mt-1 text-center text-sm text-olga-slate">
                {match.user.employer}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-olga-amber" />
                <p className="text-xs text-olga-slate">{match.space.name}</p>
              </div>

              <div className="mt-5 w-full border-t border-olga-rule pt-4">
                <div className="text-center">
                  <span className="font-mono text-2xl font-[500] text-olga-navy">
                    {match.score}%
                  </span>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-olga-slate">
                    Mutual fit
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-olga-slate">
                    {match.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full space-y-3">
        {isRevealed ? (
          <OlgaButton variant="secondary" fullWidth onClick={onOpenMessenger}>
            Open messenger
          </OlgaButton>
        ) : (
          <OlgaButton
            variant="ghost"
            fullWidth
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={reveal}
          >
            Reveal identity
          </OlgaButton>
        )}
      </div>

      {/* Confetti keyframes — inlined so they don't need a build step */}
      <style>{`
        @keyframes olga-confetti-rise {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          60%  { opacity: 0.8; }
          100% { transform: translateY(-160px) rotate(var(--rot)) scale(0.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .olga-confetti { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
};

/** A single animated confetti dot */
const ConfettiDot = ({
  x,
  rotation,
  color,
  size,
  delay,
}: {
  x: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}): JSX.Element => (
  <div
    className="olga-confetti absolute bottom-0 rounded-full"
    style={{
      left: `${x}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ["--rot" as any]: `${rotation}deg`,
      animation: `olga-confetti-rise 600ms ease-out ${delay}ms both`,
    }}
    aria-hidden="true"
  />
);
