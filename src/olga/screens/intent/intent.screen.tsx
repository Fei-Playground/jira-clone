import { useState } from "react";
import { IntentTag } from "@olga/components/intent-tag";
import { OlgaButton } from "@olga/components/button";
import { OlgaTextInput } from "@olga/components/text-input";

const INTENT_CATEGORIES = {
  Investing: [
    "Angel investing",
    "Seed funding",
    "Series A+ funding",
    "LP introductions",
  ],
  Building: [
    "Technical co-founders",
    "Product feedback",
    "Design partnerships",
    "Engineering hires",
  ],
  Partnerships: [
    "Strategic partnerships",
    "BD conversations",
    "Channel partners",
    "Pilot customers",
  ],
  Advisory: [
    "Advisor roles",
    "Board positions",
    "Mentorship",
    "Due diligence support",
  ],
  Community: [
    "Peer networking",
    "Industry knowledge",
    "Cross-sector learning",
    "Event collaboration",
  ],
};

export const IntentScreen = ({ onSave }: IntentScreenProps): JSX.Element => {
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const MIN_SELECTIONS = 3;
  const MAX_SELECTIONS = 5;
  const canSave = selected.length >= MIN_SELECTIONS;

  const toggle = (tag: string) => {
    setSelected((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= MAX_SELECTIONS) return prev;
      return [...prev, tag];
    });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-olga-surface">
      {/* Header */}
      <div className="border-b border-olga-rule bg-white px-5 pb-6 pt-12">
        <h1 className="font-display text-2xl font-bold text-olga-ink">
          What brings you here?
        </h1>
        <p className="mt-1 text-sm text-olga-slate">
          Choose {MIN_SELECTIONS}–{MAX_SELECTIONS} intents that describe your
          current focus.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-olga-rule">
            <div
              className="h-full rounded-full bg-olga-navy transition-all duration-[var(--olga-duration-fast)]"
              style={{
                width: `${Math.min((selected.length / MAX_SELECTIONS) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="font-mono text-xs text-olga-slate">
            {selected.length}/{MAX_SELECTIONS}
          </span>
        </div>
      </div>

      {/* Tag groups */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        {Object.entries(INTENT_CATEGORIES).map(([category, tags]) => (
          <div key={category}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <IntentTag
                  key={tag}
                  label={tag}
                  selected={selected.includes(tag)}
                  onSelect={() => toggle(tag)}
                  onRemove={
                    selected.includes(tag) ? () => toggle(tag) : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}

        {/* Free text note */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
            Add context (optional)
          </p>
          <OlgaTextInput
            id="intent-note"
            placeholder="e.g. Specifically looking for B2B SaaS operators in fintech…"
            value={note}
            onChange={setNote}
            maxLength={140}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-olga-rule bg-white px-5 py-4">
        {selected.length < MIN_SELECTIONS && (
          <p className="mb-3 text-center text-xs text-olga-slate">
            Select {MIN_SELECTIONS - selected.length} more to continue
          </p>
        )}
        <OlgaButton
          variant="primary"
          fullWidth
          disabled={!canSave}
          onClick={() => onSave?.(selected, note)}
        >
          Save intent
        </OlgaButton>
      </div>
    </div>
  );
};

interface IntentScreenProps {
  onSave?: (intents: string[], note: string) => void;
}
