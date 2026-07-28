import cx from "classix";

export const DiffStat = ({
  additions,
  deletions,
}: DiffStatProps): JSX.Element => (
  <span className="flex items-center gap-2 font-primary-bold text-2xs">
    <span className="text-font-success">+{additions}</span>
    <span className="text-font-danger">-{deletions}</span>
  </span>
);

interface DiffStatProps {
  additions: number;
  deletions: number;
}

export const ViewDetailButton = ({
  label,
  onClick,
}: ViewDetailButtonProps): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      "w-fit cursor-pointer rounded border-none px-2 py-1 text-xs",
      "bg-background-brand-subtlest text-font-brand",
      "hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
    )}
  >
    {label}
  </button>
);

interface ViewDetailButtonProps {
  label: string;
  onClick: () => void;
}

export const MetaRow = ({ children }: MetaRowProps): JSX.Element => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-font-subtlest">
    {children}
  </div>
);

interface MetaRowProps {
  children: React.ReactNode;
}
