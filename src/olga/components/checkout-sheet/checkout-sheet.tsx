import { OlgaButton } from "@olga/components/button";

interface CheckOutSheetProps {
  venueName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CheckOutSheet = ({
  venueName,
  isOpen,
  onConfirm,
  onCancel,
}: CheckOutSheetProps): JSX.Element => {
  if (!isOpen) return <></>;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
        style={{ animation: "olga-fade-in var(--olga-duration-fast) ease" }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[560px] -translate-x-1/2 rounded-t-2xl bg-white px-6 pb-8 pt-5 shadow-olga-modal"
        style={{
          animation:
            "olga-slide-up-sheet var(--olga-duration-base) cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Handle */}
        <div
          className="mx-auto mb-5 h-1 w-10 rounded-full bg-olga-rule"
          aria-hidden="true"
        />

        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-olga-declined-bg">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--olga-declined)"
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
        </div>

        {/* Copy */}
        <h2
          id="checkout-title"
          className="mt-4 text-center font-display text-xl font-bold text-olga-ink"
        >
          End your session?
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-olga-slate">
          You will be checked out of{" "}
          <span className="font-medium text-olga-ink">{venueName}</span>. Active
          proposals will expire and you won&apos;t receive new ones.
        </p>

        {/* Actions */}
        <div className="mt-7 space-y-2.5">
          <OlgaButton
            variant="destructive"
            fullWidth
            onClick={onConfirm}
            aria-label="Confirm check out"
          >
            Yes, check out
          </OlgaButton>
          <OlgaButton
            variant="ghost"
            fullWidth
            onClick={onCancel}
            aria-label="Cancel check out"
          >
            Keep my session
          </OlgaButton>
        </div>
      </div>

      <style>{`
        @keyframes olga-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes olga-slide-up-sheet {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .olga-sheet { animation: none !important; }
        }
      `}</style>
    </>
  );
};
