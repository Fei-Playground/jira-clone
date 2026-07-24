import { useState } from "react";
import cx from "classix";
import { OlgaButton } from "@olga/components/button";

export const OnboardingScreen = ({
  onContinue,
}: OnboardingScreenProps): JSX.Element => {
  const [showCovenant, setShowCovenant] = useState(false);

  if (showCovenant) {
    return (
      <DataCovenant
        onAccept={onContinue}
        onBack={() => setShowCovenant(false)}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-between bg-olga-navy px-5 py-16">
      {/* Branding */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-olga-slate-lt">
            OL · GA
          </span>
        </div>
        <h1 className="mt-2 font-display text-[32px] font-bold leading-tight text-white">
          The Global Professional
          <br />
          Presence Protocol
        </h1>
        <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-olga-slate-lt">
          Anonymous, consent-based introductions at the venues where
          professionals actually work.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          type="button"
          onClick={() => setShowCovenant(true)}
          className={cx(
            "flex h-12 w-full items-center justify-center gap-3 rounded-lg",
            "bg-white text-sm font-semibold text-olga-navy",
            "transition-colors duration-[var(--olga-duration-fast)] hover:bg-olga-surface",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-olga-amber"
          )}
          aria-label="Continue with LinkedIn"
        >
          <LinkedInIcon />
          Continue with LinkedIn
        </button>
        <p className="text-center text-[11px] text-olga-slate">
          Professional networks only &middot; No personal data sold &middot;
          Ever
        </p>
      </div>
    </div>
  );
};

const DataCovenant = ({
  onAccept,
  onBack,
}: {
  onAccept?: () => void;
  onBack: () => void;
}): JSX.Element => (
  <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-navy px-5 py-16">
    <button
      onClick={onBack}
      className="mb-8 text-left text-sm text-olga-slate-lt transition-colors hover:text-white"
      aria-label="Go back"
    >
      ← Back
    </button>

    <h2 className="font-display text-2xl font-bold text-white">
      Our data covenant
    </h2>
    <p className="mt-2 text-sm text-olga-slate-lt">
      Before you continue, understand exactly what we do &mdash; and don&apos;t
      &mdash; do with your data.
    </p>

    <div className="mt-8 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
        We always do
      </p>
      {[
        "Keep your identity anonymous until both parties consent",
        "Encrypt all data in transit and at rest",
        "Delete your data within 30 days of account closure",
        "Give you full export of your data on request",
      ].map((item) => (
        <div key={item} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-olga-amber" aria-hidden="true">
            ✓
          </span>
          <p className="text-sm leading-snug text-white">{item}</p>
        </div>
      ))}
    </div>

    <div className="mt-8 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
        We never do
      </p>
      {[
        "Sell your data to third parties",
        "Share your identity without mutual consent",
        "Use your data for advertising or profiling",
        "Retain location data beyond session end",
      ].map((item) => (
        <div key={item} className="flex items-start gap-3">
          <span
            className="mt-0.5 shrink-0 text-olga-declined"
            aria-hidden="true"
          >
            ✕
          </span>
          <p className="text-sm leading-snug text-olga-slate-lt">{item}</p>
        </div>
      ))}
    </div>

    <div className="mt-auto pt-10">
      <OlgaButton variant="verified" fullWidth onClick={onAccept}>
        I understand — continue
      </OlgaButton>
    </div>
  </div>
);

const LinkedInIcon = (): JSX.Element => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#0A66C2"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface OnboardingScreenProps {
  onContinue?: () => void;
}
