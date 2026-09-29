import { RxValueNone } from "react-icons/rx";
import { Button } from "@app/components/button";

export const MarketTableEmpty = ({
  activeFilterCount,
  searchTerm,
  scannerLabel,
  onReset,
  onClearScanner,
}: MarketTableEmptyProps): JSX.Element => {
  if (scannerLabel) {
    return (
      <EmptyShell
        title={`No markets match "${scannerLabel}"`}
        description="This is a legitimate market state — a scanner returning zero results just means nothing currently fits that rule."
      >
        <div className="flex gap-2">
          {onClearScanner && (
            <Button color="neutral" variant="subtlest" onClick={onClearScanner} aria-label="Clear scanner">
              Clear scanner
            </Button>
          )}
          {activeFilterCount > 0 && (
            <Button color="neutral" variant="text" onClick={onReset} aria-label="Clear the other filters">
              Clear the other filters
            </Button>
          )}
        </div>
      </EmptyShell>
    );
  }

  return (
    <EmptyShell
      title="No markets match these filters"
      description={
        searchTerm
          ? `Nothing matched "${searchTerm}" with the current filters.`
          : `${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"} narrowed this down to nothing.`
      }
    >
      <Button color="neutral" variant="subtlest" onClick={onReset} aria-label="Reset filters">
        Reset filters
      </Button>
    </EmptyShell>
  );
};

const EmptyShell = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-font-subtlest">
    <RxValueNone size={36} />
    <p className="font-primary-bold text-sm text-font">{title}</p>
    <p className="max-w-[360px] text-xs">{description}</p>
    {children}
  </div>
);

interface MarketTableEmptyProps {
  activeFilterCount: number;
  searchTerm: string;
  scannerLabel?: string;
  onReset: () => void;
  onClearScanner?: () => void;
}
