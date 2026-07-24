import { useState, useEffect } from "react";
import cx from "classix";
import type { PresenceStatus } from "@olga/domain/types";

export const PresenceIndicator = ({
  status: statusProp,
  venueName,
  minutesLeft,
  secondsRemaining,
  onCheckOut,
}: PresenceIndicatorProps): JSX.Element => {
  // Live countdown tick — only when secondsRemaining is provided
  const [liveSeconds, setLiveSeconds] = useState<number | undefined>(
    secondsRemaining
  );

  useEffect(() => {
    if (secondsRemaining === undefined) return;
    // Start the countdown interval (initialised from prop)
    const interval = setInterval(() => {
      setLiveSeconds((s) => (s !== undefined && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
    // intentionally only re-run when secondsRemaining prop itself changes (e.g. a new session)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-switch to expiring when fewer than 10 minutes remain
  const effectiveStatus: PresenceStatus =
    liveSeconds !== undefined && liveSeconds <= 600 && statusProp === "active"
      ? "expiring"
      : statusProp;

  const effectiveMinutesLeft =
    liveSeconds !== undefined ? Math.ceil(liveSeconds / 60) : minutesLeft;

  const configs: Record<
    PresenceStatus,
    { bg: string; dot: string; text: string; message: string }
  > = {
    active: {
      bg: "bg-olga-amber-bg",
      dot: "bg-olga-amber",
      text: "text-olga-amber-ink",
      message: venueName ? `Checked in · ${venueName}` : "Checked in",
    },
    expiring: {
      bg: "bg-olga-declined-bg",
      dot: "bg-olga-declined",
      text: "text-olga-declined",
      message:
        effectiveMinutesLeft !== undefined
          ? `Session ends in ${effectiveMinutesLeft} min`
          : "Session expiring",
    },
    inactive: {
      bg: "bg-olga-surface",
      dot: "bg-olga-slate-lt",
      text: "text-olga-slate",
      message: "Not checked in",
    },
  };

  const config = configs[effectiveStatus];

  return (
    <div
      className={cx(
        "flex h-9 items-center gap-2 px-5 text-sm transition-colors duration-[var(--olga-duration-base)]",
        config.bg,
        config.text
      )}
      aria-label={`Presence status: ${config.message}`}
      aria-live="polite"
    >
      <span
        className={cx(
          "inline-block h-2 w-2 shrink-0 rounded-full transition-colors duration-[var(--olga-duration-base)]",
          config.dot,
          // Pulse the dot when expiring
          effectiveStatus === "expiring" && "animate-pulse"
        )}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate font-medium">
        {config.message}
      </span>

      {/* Live countdown display when expiring */}
      {effectiveStatus === "expiring" && liveSeconds !== undefined && (
        <span
          className="shrink-0 font-mono text-xs font-[500] tabular-nums text-olga-declined"
          aria-hidden="true"
        >
          {formatCountdown(liveSeconds)}
        </span>
      )}

      {/* Check-out button — shown on active or expiring when handler provided */}
      {(effectiveStatus === "active" || effectiveStatus === "expiring") &&
        onCheckOut && (
          <button
            type="button"
            onClick={onCheckOut}
            className={cx(
              "shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-olga-amber",
              effectiveStatus === "expiring"
                ? "text-olga-declined"
                : "text-olga-amber-ink"
            )}
            aria-label="Check out of venue"
          >
            Check out
          </button>
        )}
    </div>
  );
};

const formatCountdown = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

interface PresenceIndicatorProps {
  status: PresenceStatus;
  venueName?: string;
  minutesLeft?: number;
  /** When provided, enables a live countdown and auto-switches to 'expiring' at ≤10 min */
  secondsRemaining?: number;
  /** When provided, shows a Check-out button */
  onCheckOut?: () => void;
}
