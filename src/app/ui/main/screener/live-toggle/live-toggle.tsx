import cx from "classix";

export const LiveToggle = ({ isLive, onChange }: LiveToggleProps): JSX.Element => (
  <button
    type="button"
    onClick={() => onChange(!isLive)}
    aria-pressed={isLive}
    aria-label={isLive ? "Turn off live prices" : "Turn on live prices"}
    className={cx(
      "flex items-center gap-2 rounded border-none px-3 py-1.5 text-xs uppercase",
      isLive
        ? "bg-background-success text-font-success hover:bg-background-success-hovered"
        : "bg-background-neutral text-font-subtlest hover:bg-background-neutral-hovered"
    )}
  >
    <span
      className={cx(
        "h-2 w-2 rounded-full",
        isLive ? "bg-icon-accent-green animate-pulse" : "bg-font-disabled"
      )}
    />
    Live
  </button>
);

interface LiveToggleProps {
  isLive: boolean;
  onChange: (value: boolean) => void;
}
