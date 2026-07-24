import { useEffect } from "react";

interface MatchToastProps {
  category: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export const MatchToast = ({
  category,
  isVisible,
  onDismiss,
}: MatchToastProps): JSX.Element => {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => onDismiss(), 3000);
    return () => clearTimeout(t);
  }, [isVisible, onDismiss]);

  if (!isVisible) return <></>;

  return (
    <>
      <div
        role="alert"
        aria-live="assertive"
        className="pointer-events-none fixed left-1/2 top-4 z-[100] -translate-x-1/2"
        style={{
          animation:
            "olga-toast-slide-in 260ms cubic-bezier(0.34,1.56,0.64,1) forwards",
          maxWidth: "340px",
          width: "calc(100vw - 40px)",
        }}
      >
        <div className="flex items-center gap-3 rounded-xl bg-olga-amber px-4 py-3 shadow-olga-raised">
          <span className="text-lg" aria-hidden="true">
            ⚡
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-olga-amber-ink">
              New match!
            </p>
            <p className="truncate text-xs text-olga-amber-ink opacity-80">
              {category}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="pointer-events-auto shrink-0 text-lg leading-none text-olga-amber-ink opacity-60 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      </div>

      <style>{`
        @keyframes olga-toast-slide-in {
          from { transform: translateX(-50%) translateY(-120%); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes olga-toast-slide-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </>
  );
};
