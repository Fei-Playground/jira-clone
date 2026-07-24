import { useState } from "react";
import { OutcomeTagSelector } from "@olga/components/outcome-selector";
import { OlgaButton } from "@olga/components/button";
import type { OutcomeValue } from "@olga/domain/types";

export const OutcomeCaptureScreen = ({
  matchName = "Priya Sharma",
  onConfirm,
  onSkip,
}: OutcomeCaptureScreenProps): JSX.Element => {
  const [outcome, setOutcome] = useState<OutcomeValue | undefined>(undefined);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!outcome) return;
    setConfirmed(true);
    onConfirm?.(outcome);
    // Auto-dismiss after 1.5s
    setTimeout(() => {
      // Parent handles navigation
    }, 1500);
  };

  if (confirmed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center bg-olga-surface px-5">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olga-approved-bg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E5A45"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-olga-ink">
            Outcome recorded
          </h2>
          <p className="mt-1 text-sm text-olga-slate">
            Thank you. This helps improve future matches.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Header */}
      <div className="border-b border-olga-rule bg-white px-5 pb-6 pt-12">
        <h1 className="font-display text-2xl font-bold text-olga-ink">
          How did it go?
        </h1>
        <p className="mt-1 text-sm text-olga-slate">
          Your meeting with{" "}
          <span className="font-medium text-olga-ink">{matchName}</span>
        </p>
      </div>

      {/* Outcome selector */}
      <div className="flex-1 px-5 py-6">
        <OutcomeTagSelector value={outcome} onChange={setOutcome} />
        <p className="mt-3 text-xs text-olga-slate-lt">
          No free text — structured outcomes only. Your response is never shared
          with {matchName}.
        </p>
      </div>

      {/* Footer */}
      <div className="space-y-2 border-t border-olga-rule bg-white px-5 py-4">
        <OlgaButton
          variant="primary"
          fullWidth
          disabled={!outcome}
          onClick={handleConfirm}
        >
          Confirm outcome
        </OlgaButton>
        <OlgaButton variant="ghost" fullWidth onClick={onSkip}>
          Skip for now
        </OlgaButton>
      </div>
    </div>
  );
};

interface OutcomeCaptureScreenProps {
  matchName?: string;
  onConfirm?: (outcome: OutcomeValue) => void;
  onSkip?: () => void;
}
