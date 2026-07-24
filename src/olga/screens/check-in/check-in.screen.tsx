import { useState } from "react";
import cx from "classix";
import { OlgaButton } from "@olga/components/button";

export type CheckInState =
  | "scanning"
  | "success"
  | "error-network"
  | "error-invalid-qr"
  | "error-wrong-venue"
  | "error-already-checked-in"
  | "error-session-active"
  | "error-venue-full"
  | "error-camera-denied";

const ERROR_MESSAGES: Record<string, { title: string; body: string }> = {
  "error-network": {
    title: "Connection lost",
    body: "Check your internet connection and try again.",
  },
  "error-invalid-qr": {
    title: "Unrecognised code",
    body: "This QR code isn't an OLGA venue code. Try scanning a different code.",
  },
  "error-wrong-venue": {
    title: "Different venue",
    body: "This code is for a different location. Make sure you're scanning the OLGA code at this venue.",
  },
  "error-already-checked-in": {
    title: "Already checked in",
    body: "You're already checked in here. Your session is active.",
  },
  "error-session-active": {
    title: "Session active elsewhere",
    body: "You have an active check-in at another venue. End that session first.",
  },
  "error-venue-full": {
    title: "Venue at capacity",
    body: "This venue has reached its OLGA session limit. Try again shortly.",
  },
  "error-camera-denied": {
    title: "Camera access needed",
    body: "Allow camera access in your browser settings to scan the check-in code.",
  },
};

interface CheckInScreenProps {
  venueName?: string;
  checkInState?: CheckInState;
  onSuccess?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
}

export const CheckInScreen = ({
  venueName = "Soho Works White City",
  checkInState = "scanning",
  onSuccess,
  onBack,
  onRetry,
}: CheckInScreenProps): JSX.Element => {
  const [state, setState] = useState<CheckInState>(checkInState);

  // Simulate a scan for demo purposes
  const simulateScan = () => setState("success");

  if (state === "success") {
    return <CheckInSuccess venueName={venueName} onContinue={onSuccess} />;
  }

  if (state !== "scanning") {
    const err = ERROR_MESSAGES[state];
    return (
      <CheckInError
        title={err.title}
        body={err.body}
        onRetry={() => {
          setState("scanning");
          onRetry?.();
        }}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[560px] flex-col overflow-hidden bg-black">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-5 top-10 z-20 text-sm text-white opacity-80 hover:opacity-100"
        aria-label="Go back"
      >
        ← Back
      </button>

      {/* Venue label */}
      <div className="absolute right-5 top-10 z-20 text-right">
        <p className="text-[11px] uppercase tracking-wider text-white/60">
          Checking in to
        </p>
        <p className="text-sm font-medium text-white">{venueName}</p>
      </div>

      {/* Camera viewfinder */}
      <div className="flex flex-1 items-center justify-center">
        {/* Simulated camera feed */}
        <div className="relative h-72 w-72">
          {/* Dark overlay with cutout */}
          <div className="absolute inset-0 rounded-2xl bg-white/5" />

          {/* Amber reticle corners */}
          <ReticleCorner position="top-left" />
          <ReticleCorner position="top-right" />
          <ReticleCorner position="bottom-left" />
          <ReticleCorner position="bottom-right" />

          {/* Scan line animation */}
          <div
            className="absolute left-4 right-4 h-0.5 rounded-full bg-olga-amber opacity-80"
            style={{
              animation: "olga-scan-line 2s ease-in-out infinite",
              top: "50%",
            }}
          />

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="px-8 text-center text-sm text-white/60">
              Point at the OLGA QR code
            </p>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="space-y-3 px-5 py-8">
        {/* Demo trigger — simulates a successful scan */}
        <OlgaButton variant="verified" fullWidth onClick={simulateScan}>
          Simulate scan ✓
        </OlgaButton>
        <OlgaButton
          variant="ghost"
          fullWidth
          className="text-white hover:bg-white/10 hover:text-white"
          onClick={() => setState("error-invalid-qr")}
        >
          Simulate error
        </OlgaButton>
      </div>

      <style>{`
        @keyframes olga-scan-line {
          0%, 100% { transform: translateY(-40px); opacity: 0.4; }
          50% { transform: translateY(40px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

/** Corner reticle element for the QR viewfinder */
const ReticleCorner = ({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}): JSX.Element => {
  const posClass = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  }[position];

  const borderClass = {
    "top-left": "border-t-2 border-l-2 rounded-tl-xl",
    "top-right": "border-t-2 border-r-2 rounded-tr-xl",
    "bottom-left": "border-b-2 border-l-2 rounded-bl-xl",
    "bottom-right": "border-b-2 border-r-2 rounded-br-xl",
  }[position];

  return (
    <div
      className={cx(
        "absolute h-8 w-8 border-olga-amber",
        posClass,
        borderClass
      )}
      aria-hidden="true"
    />
  );
};

/** Success state after QR verification */
const CheckInSuccess = ({
  venueName,
  onContinue,
}: {
  venueName: string;
  onContinue?: () => void;
}): JSX.Element => (
  <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center bg-olga-navy px-5">
    <div className="flex flex-col items-center text-center">
      {/* Amber checkmark circle */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-olga-amber">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke={`var(--olga-amber-ink)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-wider text-olga-amber">
        Verified
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold text-white">
        You&apos;re checked in
      </h2>
      <p className="mt-2 max-w-[240px] text-sm text-olga-slate-lt">
        {venueName} · Session active
      </p>
      <p className="mt-1 text-xs text-olga-slate">
        Anonymous proposals will appear in your Live tab
      </p>
    </div>

    <div className="mt-12 w-full">
      <OlgaButton variant="secondary" fullWidth onClick={onContinue}>
        Go to proposals
      </OlgaButton>
    </div>
  </div>
);

/** Error state for any of the 7 failure modes */
const CheckInError = ({
  title,
  body,
  onRetry,
  onBack,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
  onBack?: () => void;
}): JSX.Element => (
  <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center bg-olga-surface px-5">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olga-declined-bg">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--olga-declined)"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-bold text-olga-ink">{title}</h2>
      <p className="mt-2 max-w-[260px] text-sm text-olga-slate">{body}</p>
    </div>

    <div className="mt-10 w-full space-y-3">
      <OlgaButton variant="primary" fullWidth onClick={onRetry}>
        Try again
      </OlgaButton>
      <OlgaButton variant="ghost" fullWidth onClick={onBack}>
        Back to spaces
      </OlgaButton>
    </div>
  </div>
);
