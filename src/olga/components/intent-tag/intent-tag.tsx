import cx from "classix";

export const IntentTag = ({
  label,
  selected = false,
  onSelect,
  onRemove,
}: IntentTagProps): JSX.Element => {
  const isRemovable = selected && Boolean(onRemove);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "inline-flex h-9 select-none items-center gap-1.5 rounded-full px-3 text-sm transition-all duration-[var(--olga-duration-fast)]",
        selected
          ? "bg-olga-navy text-white"
          : "border border-olga-rule bg-olga-surface text-olga-ink hover:border-olga-slate",
        !onSelect && "pointer-events-none"
      )}
      aria-pressed={selected}
    >
      <span>{label}</span>
      {isRemovable && (
        <span
          role="button"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="flex h-4 w-4 items-center justify-center rounded-full text-xs leading-none hover:bg-white/20"
        >
          ×
        </span>
      )}
    </button>
  );
};

interface IntentTagProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}
