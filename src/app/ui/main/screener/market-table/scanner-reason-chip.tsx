export const ScannerReasonChip = ({ reason }: ScannerReasonChipProps): JSX.Element => {
  if (!reason) return <span className="text-2xs text-font-subtlest">—</span>;

  return (
    <span className="rounded bg-background-accent-grey-subtler px-1.5 py-0.5 text-2xs text-font-subtle">
      {reason}
    </span>
  );
};

interface ScannerReasonChipProps {
  reason?: string;
}
