import { useState } from "react";
import { SpaceCard } from "@olga/components/space-card";
import { OlgaEmptyState } from "@olga/components/empty-state";
import { mockSpaces } from "@olga/domain/mock-data";
import type { Space } from "@olga/domain/types";

const CITIES = ["London", "New York", "Berlin", "Amsterdam", "Paris"];

export const SpaceDiscoveryScreen = ({
  onSelectSpace,
}: SpaceDiscoveryScreenProps): JSX.Element => {
  const [city, setCity] = useState("London");

  const spaces = mockSpaces
    .filter((s) => s.city === city)
    .sort((a, b) => b.matchPotential - a.matchPotential); // sorted by match, not distance

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Header */}
      <div className="border-b border-olga-rule bg-white px-5 pb-4 pt-12">
        <h1 className="font-display text-2xl font-bold text-olga-ink">
          Spaces
        </h1>
        <p className="mt-0.5 text-sm text-olga-slate">
          Sorted by match potential, not distance
        </p>

        {/* City selector */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={
                c === city
                  ? "h-8 shrink-0 rounded-full bg-olga-navy px-4 text-sm font-medium text-white"
                  : "h-8 shrink-0 rounded-full border border-olga-rule bg-white px-4 text-sm text-olga-slate hover:bg-olga-surface"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Space list */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {spaces.length === 0 ? (
          <OlgaEmptyState
            icon={
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
            headline="No spaces in this city yet"
            body="We're expanding. Check back soon or try a different city."
          />
        ) : (
          spaces.map((space) => (
            <SpaceCard
              key={space.id}
              name={space.name}
              distanceKm={space.distanceKm}
              density={space.density}
              intents={space.intents}
              matchPotential={space.matchPotential}
              onClick={() => onSelectSpace?.(space)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface SpaceDiscoveryScreenProps {
  onSelectSpace?: (space: Space) => void;
}
