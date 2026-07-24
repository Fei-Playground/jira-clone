import { ZoneBanner } from "@olga/components/zone-banner";
import { OlgaButton } from "@olga/components/button";
import { mockSpaces } from "@olga/domain/mock-data";
import type { Space } from "@olga/domain/types";

interface SpaceDetailScreenProps {
  space?: Space;
  onCheckIn?: () => void;
  onBack?: () => void;
}

export const SpaceDetailScreen = ({
  space = mockSpaces[0],
  onCheckIn,
  onBack,
}: SpaceDetailScreenProps): JSX.Element => {
  const activeZone = space.zones.find((z) => z.isActive);
  const isDensitySuppressed = space.density < 5;
  const currentHour = new Date().getHours();

  // Top-3 intent mix with fake percentages derived from order
  const intentMix = space.intents.map((intent, i) => ({
    label: intent,
    pct: [52, 31, 17][i] ?? 10,
  }));

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Header */}
      <div className="border-b border-olga-rule bg-white px-5 pb-5 pt-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-sm text-olga-slate transition-colors hover:text-olga-navy"
          aria-label="Go back to spaces"
        >
          ← Spaces
        </button>
        <h1 className="font-display text-2xl font-bold leading-tight text-olga-ink">
          {space.name}
        </h1>
        <p className="mt-1 text-sm text-olga-slate">{space.address}</p>

        {/* Quick stats */}
        <div className="mt-4 flex gap-6">
          <div>
            <span className="font-mono text-2xl font-[500] text-olga-ink">
              {isDensitySuppressed ? "—" : space.density}
            </span>
            <p className="mt-0.5 text-xs text-olga-slate">
              {isDensitySuppressed ? "< 5 here" : "people here"}
            </p>
          </div>
          <div>
            <span className="font-mono text-2xl font-[500] text-olga-navy">
              {space.matchPotential}%
            </span>
            <p className="mt-0.5 text-xs text-olga-slate">match potential</p>
          </div>
          <div>
            <span className="font-mono text-2xl font-[500] text-olga-ink">
              {space.distanceKm.toFixed(1)}
            </span>
            <p className="mt-0.5 text-xs text-olga-slate">km away</p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Active zone */}
        {activeZone && (
          <section>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
              Active zone
            </p>
            <ZoneBanner
              zoneName={activeZone.name}
              description={activeZone.description}
            />
          </section>
        )}

        {/* Intent composition */}
        <section>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
            Intent mix today
          </p>
          <div className="space-y-2.5">
            {intentMix.map(({ label, pct }) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-olga-ink">{label}</span>
                  <span className="font-mono text-xs text-olga-slate">
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-olga-rule">
                  <div
                    className="h-full rounded-full bg-olga-navy transition-all"
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Peak hours sparkline */}
        <section>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
            Typical footfall
          </p>
          <PeakSparkline
            peakHours={space.peakHours}
            currentHour={currentHour}
          />
          <p className="mt-2 text-xs text-olga-slate-lt">
            Estimated people in the space by hour of day
          </p>
        </section>

        {/* All zones */}
        {space.zones.length > 1 && (
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
              All zones
            </p>
            <div className="space-y-2">
              {space.zones.map((zone) => (
                <div
                  key={zone.name}
                  className="flex items-start gap-3 rounded-lg border border-olga-rule bg-white px-4 py-3"
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      zone.isActive ? "bg-olga-amber" : "bg-olga-rule"
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-olga-ink">
                      {zone.name}
                    </p>
                    <p className="mt-0.5 text-xs text-olga-slate">
                      {zone.description}
                    </p>
                    {!zone.isActive && (
                      <p className="mt-0.5 text-[11px] text-olga-slate-lt">
                        Not currently active
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky check-in footer */}
      <div className="border-t border-olga-rule bg-white px-5 py-4">
        <OlgaButton variant="verified" fullWidth onClick={onCheckIn}>
          Check in here
        </OlgaButton>
        <p className="mt-2 text-center text-xs text-olga-slate-lt">
          Scan the QR code at the venue to verify
        </p>
      </div>
    </div>
  );
};

/** Mini bar-chart sparkline for 24-hour peak hours data */
const PeakSparkline = ({
  peakHours,
  currentHour,
}: {
  peakHours: number[];
  currentHour: number;
}): JSX.Element => {
  const max = Math.max(...peakHours, 1);
  return (
    <div
      className="flex h-12 items-end gap-0.5"
      role="img"
      aria-label="Hourly footfall chart"
    >
      {peakHours.map((count, hour) => {
        const height = Math.max((count / max) * 100, 2);
        const isCurrent = hour === currentHour;
        return (
          <div
            key={hour}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${height}%`,
              backgroundColor: isCurrent
                ? "var(--olga-amber)"
                : "var(--olga-rule)",
            }}
            title={`${hour}:00 — ~${count} people`}
          />
        );
      })}
    </div>
  );
};
