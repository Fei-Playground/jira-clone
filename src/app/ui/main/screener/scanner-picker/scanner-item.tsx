import cx from "classix";
import { Scanner } from "@domain/market";

export const ScannerItem = ({ scanner, matchCount, isActive, onSelect }: ScannerItemProps): JSX.Element => (
  <button
    type="button"
    onClick={onSelect}
    role="radio"
    aria-checked={isActive}
    className={cx(
      "flex w-full items-center justify-between gap-3 rounded border-none px-3 py-2 text-left",
      isActive ? "bg-background-brand-subtlest" : "hover:bg-background-neutral"
    )}
  >
    <span>
      <p className={cx("text-sm", isActive ? "text-font-brand" : "text-font")}>{scanner.label}</p>
      <p className="text-xs text-font-subtlest">{scanner.description}</p>
    </span>
    <span className="whitespace-nowrap text-2xs text-font-subtlest">{matchCount} match</span>
  </button>
);

interface ScannerItemProps {
  scanner: Scanner;
  matchCount: number;
  isActive: boolean;
  onSelect: () => void;
}
