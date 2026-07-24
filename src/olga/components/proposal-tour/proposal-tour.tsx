import { useState } from "react";
import { OlgaButton } from "@olga/components/button";

const STORAGE_KEY = "olga-proposal-tour-dismissed";

interface TourStep {
  id: string;
  title: string;
  body: string;
  /** Which element region to highlight — approximated with a fixed-position rect */
  highlight: "card-stack" | "kbd-hints" | "checkout-btn";
  position: "top" | "bottom";
}

const STEPS: TourStep[] = [
  {
    id: "card-stack",
    title: "Proposals queue up behind",
    body: "The card stack shows how many proposals are waiting. Swipe or use arrow keys to work through them.",
    highlight: "card-stack",
    position: "bottom",
  },
  {
    id: "kbd-hints",
    title: "Keyboard shortcuts",
    body: "Press ← to decline or → to approve — the card flies off in that direction with a satisfying whoosh.",
    highlight: "kbd-hints",
    position: "top",
  },
  {
    id: "checkout-btn",
    title: "End your session",
    body: "Tap Check out in the amber bar when you're done. You'll get a session summary before returning to Spaces.",
    highlight: "checkout-btn",
    position: "bottom",
  },
];

interface ProposalQueueTourProps {
  /** Set to false to prevent the tour from showing (e.g. in Storybook) */
  enabled?: boolean;
}

export const ProposalQueueTour = ({
  enabled = true,
}: ProposalQueueTourProps): JSX.Element => {
  const [step, setStep] = useState(0);
  // Initialize directly from localStorage so we avoid setState-in-effect
  const [visible, setVisible] = useState(() => {
    if (!enabled) return false;
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false; // localStorage unavailable (SSR / private mode)
    }
  });

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return <></>;

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Highlight positions (approximate, relative to viewport)
  const highlightStyles: Record<TourStep["highlight"], React.CSSProperties> = {
    "card-stack": {
      top: "30%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(320px, 90vw)",
      height: "220px",
    },
    "kbd-hints": {
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(260px, 80vw)",
      height: "44px",
    },
    "checkout-btn": {
      top: "36px",
      right: "16px",
      width: "96px",
      height: "28px",
    },
  };

  const tooltipPosition: Record<TourStep["position"], string> = {
    top: "bottom-full mb-3",
    bottom: "top-full mt-3",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Highlight ring */}
      <div
        className="z-51 pointer-events-none fixed rounded-xl ring-2 ring-white ring-offset-2 ring-offset-transparent"
        style={{
          ...highlightStyles[currentStep.highlight],
          position: "fixed",
        }}
        aria-hidden="true"
      />

      {/* Tooltip */}
      <div
        className="fixed z-[52]"
        style={highlightStyles[currentStep.highlight]}
        role="dialog"
        aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${currentStep.title}`}
        aria-live="polite"
      >
        <div
          className={`absolute left-0 right-0 ${tooltipPosition[currentStep.position]} mx-2`}
        >
          <div className="rounded-xl bg-olga-navy p-4 text-white shadow-olga-modal">
            {/* Step dots */}
            <div className="mb-3 flex gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-[var(--olga-duration-fast)] ${
                    i === step ? "w-4 bg-olga-amber" : "w-1.5 bg-white/30"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <h3 className="font-display text-base font-bold text-white">
              {currentStep.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {currentStep.body}
            </p>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={dismiss}
                className="text-xs text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
                aria-label="Skip tour"
              >
                Skip tour
              </button>
              <OlgaButton
                variant="verified"
                onClick={next}
                className="h-9 px-5 text-xs"
              >
                {isLast ? "Got it" : "Next →"}
              </OlgaButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
