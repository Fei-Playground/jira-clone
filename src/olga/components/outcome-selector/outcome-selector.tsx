import cx from "classix";
import type { OutcomeValue } from "@olga/domain/types";

const OUTCOME_OPTIONS: { value: OutcomeValue; label: string }[] = [
  { value: "meaningful-conversation", label: "Had a meaningful conversation" },
  { value: "exchanged-contacts", label: "Exchanged contacts" },
  { value: "follow-up-planned", label: "Follow-up planned" },
  { value: "not-relevant", label: "Not relevant — useful to know" },
];

export const OutcomeTagSelector = ({
  value,
  onChange,
}: OutcomeTagSelectorProps): JSX.Element => {
  return (
    <div
      className="w-full overflow-hidden rounded-lg border border-olga-rule"
      role="radiogroup"
      aria-label="Select outcome"
    >
      {OUTCOME_OPTIONS.map((option, i) => {
        const isSelected = value === option.value;
        const isLast = i === OUTCOME_OPTIONS.length - 1;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cx(
              "flex h-14 w-full items-center justify-between px-4 text-left text-sm transition-colors duration-[var(--olga-duration-instant)]",
              !isLast && "border-b border-olga-rule",
              isSelected
                ? "border-l-[3px] border-l-olga-approved bg-olga-approved-bg font-medium text-olga-approved"
                : "text-olga-ink hover:bg-olga-surface"
            )}
          >
            <span>{option.label}</span>
            {isSelected && (
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-olga-approved"
                aria-hidden="true"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-olga-approved" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

interface OutcomeTagSelectorProps {
  value?: OutcomeValue;
  onChange: (value: OutcomeValue) => void;
}
