import cx from "classix";
import { IntentTag } from "@olga/components/intent-tag";
import type { Space } from "@olga/domain/types";

type SpaceCardProps = Pick<
  Space,
  "name" | "distanceKm" | "density" | "intents" | "matchPotential"
> & {
  onClick?: () => void;
};

export const SpaceCard = ({
  name,
  distanceKm,
  density,
  intents,
  matchPotential,
  onClick,
}: SpaceCardProps): JSX.Element => {
  const isDensitySuppressed = density < 5;
  const displayIntents = intents.slice(0, 3);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      className={cx(
        "w-full rounded-xl bg-white p-4 text-left shadow-olga-card",
        "transition-shadow duration-[var(--olga-duration-fast)]",
        "hover:shadow-olga-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-olga-amber",
        onClick ? "cursor-pointer" : ""
      )}
      aria-label={`${name}, ${matchPotential}% match potential`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[18px] font-bold leading-tight text-olga-ink">
          {name}
        </h3>
        <span className="mt-0.5 shrink-0 font-mono text-xs text-olga-slate">
          {distanceKm.toFixed(1)} km
        </span>
      </div>

      {/* Density */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-[500] text-olga-ink">
          {isDensitySuppressed ? "—" : density}
        </span>
        <span className="text-xs text-olga-slate">
          {isDensitySuppressed ? "fewer than 5 here" : "people here"}
        </span>
      </div>

      {/* Intent mix */}
      {displayIntents.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {displayIntents.map((intent) => (
            <IntentTag key={intent} label={intent} />
          ))}
        </div>
      )}

      {/* Match potential bar */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-olga-slate">Match potential</span>
          <span className="font-mono text-xs font-[500] text-olga-navy">
            {matchPotential}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-olga-rule">
          <div
            className="h-full rounded-full bg-olga-amber transition-all"
            style={{ width: `${matchPotential}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
