import { IoCloseOutline } from "react-icons/io5";
import { Scanner } from "@domain/market";

export const ActiveScannerBar = ({ scanner, eligibleCount, totalCount, onClear }: ActiveScannerBarProps): JSX.Element => (
  <div className="flex items-center justify-between gap-4 rounded bg-background-brand-subtlest px-3 py-2">
    <div>
      <p className="text-sm text-font-brand">{scanner.label}</p>
      <p className="text-xs text-font-brand">{scanner.rule}</p>
      {eligibleCount < totalCount && (
        <p className="mt-1 text-2xs text-font-subtlest">
          {eligibleCount} of {totalCount} markets have enough history for this scan.
        </p>
      )}
    </div>
    <button
      type="button"
      onClick={onClear}
      aria-label="Clear scanner"
      className="flex items-center gap-1 rounded border-none bg-transparent px-2 py-1 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered"
    >
      <IoCloseOutline size={16} />
      Clear scanner
    </button>
  </div>
);

interface ActiveScannerBarProps {
  scanner: Scanner;
  eligibleCount: number;
  totalCount: number;
  onClear: () => void;
}
