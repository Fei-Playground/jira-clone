import { useState, useRef, useEffect } from "react";
import cx from "classix";
import { IntentTag } from "@olga/components/intent-tag";
import { OlgaButton } from "@olga/components/button";
import type { CardState } from "@olga/domain/types";
import { playWhoosh } from "@olga/utils/whoosh-sound";

/** Threshold in px before a swipe is registered as approve/decline */
const SWIPE_THRESHOLD = 80;

export const AnonymousProfileCard = ({
  category,
  score,
  explanation,
  intentSummary,
  state = "default",
  onApprove,
  onDecline,
  keyboardFireCount = 0,
  keyboardDirection = "right",
}: AnonymousProfileCardProps): JSX.Element => {
  // Drag / swipe state
  const [dragX, setDragX] = useState(0);
  const [isFlyingOff, setIsFlyingOff] = useState<"left" | "right" | null>(null);
  const [isShaking, setIsShaking] = useState<"left" | "right" | null>(null);
  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Derived values from drag position
  const rotation = dragX * 0.08; // subtle tilt
  const approveOpacity = Math.min(dragX / SWIPE_THRESHOLD, 1);
  const declineOpacity = Math.min(-dragX / SWIPE_THRESHOLD, 1);

  const triggerFlyOff = (direction: "left" | "right") => {
    setIsFlyingOff(direction);
    // Whoosh sound fires at flyoff start (prefers-reduced-motion aware)
    playWhoosh(direction);
    setTimeout(() => {
      setIsFlyingOff(null);
      setDragX(0);
      if (direction === "right") onApprove?.();
      else onDecline?.();
    }, 280); // base 260ms + tiny buffer
  };

  /** Triggered by keyboard shortcuts — shake briefly (100ms) then fly off */
  const shakeThenFlyOff = (direction: "left" | "right") => {
    setIsShaking(direction);
    setTimeout(() => {
      setIsShaking(null);
      triggerFlyOff(direction);
    }, 100); // instant 100ms shake
  };

  // Watch keyboardFireCount: when it increments, trigger shake (deferred to avoid sync setState in effect)
  const prevFireCountRef = useRef(keyboardFireCount);
  useEffect(() => {
    if (
      keyboardFireCount !== prevFireCountRef.current &&
      keyboardFireCount > 0
    ) {
      prevFireCountRef.current = keyboardFireCount;
      // Defer one tick so React batch-flushes before the shake sequence begins
      const t = setTimeout(() => shakeThenFlyOff(keyboardDirection), 0);
      return () => clearTimeout(t);
    }
    // shakeThenFlyOff is defined in render scope but stable across renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardFireCount, keyboardDirection]);

  // ── Mouse handlers ───────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    setDragX(e.clientX - startXRef.current);
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
    if (dragX > SWIPE_THRESHOLD) triggerFlyOff("right");
    else if (dragX < -SWIPE_THRESHOLD) triggerFlyOff("left");
    else setDragX(0);
    startXRef.current = null;
  };

  // ── Touch handlers ───────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    setDragX(e.touches[0].clientX - startXRef.current);
  };

  const onTouchEnd = () => {
    if (dragX > SWIPE_THRESHOLD) triggerFlyOff("right");
    else if (dragX < -SWIPE_THRESHOLD) triggerFlyOff("left");
    else setDragX(0);
    startXRef.current = null;
  };

  if (state === "declined-collapse") {
    return (
      <div
        className="overflow-hidden transition-all duration-[var(--olga-duration-base)]"
        style={{ height: 0 }}
        aria-hidden="true"
      />
    );
  }

  const isBeingDragged = dragX !== 0 && !isFlyingOff;
  const flyStyle: React.CSSProperties = isFlyingOff
    ? {
        transform: `translateX(${isFlyingOff === "right" ? "120vw" : "-120vw"}) rotate(${isFlyingOff === "right" ? 20 : -20}deg)`,
        transition: "transform 260ms cubic-bezier(0.4,0,0.6,1)",
        opacity: 0,
      }
    : isShaking
      ? {
          // Brief pre-flyoff tilt — snaps back in 100ms then flies off
          transform: `translateX(${isShaking === "right" ? "12px" : "-12px"}) rotate(${isShaking === "right" ? 4 : -4}deg)`,
          transition: "transform 100ms ease-in",
        }
      : isBeingDragged
        ? {
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            transition: "none",
            cursor: "grabbing",
          }
        : {
            transform: "translateX(0) rotate(0deg)",
            transition:
              "transform 260ms cubic-bezier(0.34,1.56,0.64,1), opacity 260ms ease",
          };

  return (
    <div
      className={cx(
        "relative w-full select-none",
        state === "approved-waiting" && "pointer-events-none opacity-60",
        state === "expired" && "pointer-events-none opacity-50"
      )}
      style={flyStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Approve tint overlay (swipe right) */}
      {approveOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-start rounded-xl pl-6"
          style={{
            backgroundColor: `rgba(46,90,69,${approveOpacity * 0.18})`,
            borderRadius: "12px",
          }}
          aria-hidden="true"
        >
          <span
            className="rounded-full border-2 border-olga-approved px-3 py-1 text-sm font-semibold text-olga-approved"
            style={{ opacity: approveOpacity }}
          >
            APPROVE
          </span>
        </div>
      )}

      {/* Decline tint overlay (swipe left) */}
      {declineOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end rounded-xl pr-6"
          style={{
            backgroundColor: `rgba(139,58,58,${declineOpacity * 0.18})`,
            borderRadius: "12px",
          }}
          aria-hidden="true"
        >
          <span
            className="rounded-full border-2 border-olga-declined px-3 py-1 text-sm font-semibold text-olga-declined"
            style={{ opacity: declineOpacity }}
          >
            DECLINE
          </span>
        </div>
      )}

      {/* Card body */}
      <div
        className={cx(
          "w-full rounded-xl bg-white p-5 shadow-olga-raised",
          "relative"
        )}
        role="article"
        aria-label={`Proposal: ${category}, ${score}% match`}
      >
        {/* Expired overlay */}
        {state === "expired" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80">
            <p className="text-sm font-medium text-olga-slate">
              Session expired
            </p>
          </div>
        )}

        {/* Category tag */}
        <div>
          <IntentTag label={category} selected />
        </div>

        {/* Score */}
        <div className="mt-4">
          <span className="font-mono text-[40px] font-[500] leading-none text-olga-navy">
            {score}%
          </span>
        </div>

        {/* Explanation */}
        <p className="mt-2 text-sm italic leading-relaxed text-olga-slate">
          {explanation}
        </p>

        {/* Intent summary */}
        <p className="mt-2 text-xs leading-relaxed text-olga-slate-lt">
          {intentSummary}
        </p>

        {/* Swipe hint */}
        {state === "default" && dragX === 0 && (
          <p className="mt-3 text-center text-[11px] text-olga-slate-lt">
            ← swipe to decline &nbsp;·&nbsp; swipe to approve →
          </p>
        )}

        {/* Button actions */}
        <div className="mt-4 flex gap-3">
          <OlgaButton
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              triggerFlyOff("right");
            }}
            disabled={state === "approved-waiting"}
            aria-label="Approve proposal"
          >
            {state === "approved-waiting" ? "Waiting…" : "Approve"}
          </OlgaButton>
          <OlgaButton
            variant="destructive"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              triggerFlyOff("left");
            }}
            aria-label="Decline proposal"
          >
            Decline
          </OlgaButton>
        </div>
      </div>
    </div>
  );
};

interface AnonymousProfileCardProps {
  category: string;
  score: number;
  explanation: string;
  intentSummary: string;
  state?: CardState;
  onApprove?: () => void;
  onDecline?: () => void;
  /**
   * When set, triggers the shake-then-flyoff micro-animation.
   * Increment this counter from outside (keyboard shortcut handler) and the
   * card will shake in `keyboardDirection` then fly off.
   */
  keyboardFireCount?: number;
  keyboardDirection?: "left" | "right";
}
