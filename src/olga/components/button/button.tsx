import cx from "classix";

export const OlgaButton = ({
  variant = "primary",
  fullWidth = false,
  disabled = false,
  children,
  className,
  ...rest
}: OlgaButtonProps): JSX.Element => {
  const base =
    "inline-flex items-center justify-center h-12 px-6 rounded-lg text-sm font-semibold transition-all duration-[var(--olga-duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-olga-amber select-none";

  const variants: Record<OlgaButtonVariant, string> = {
    primary:
      "bg-olga-navy text-white hover:bg-olga-navy-soft active:opacity-90",
    secondary:
      "bg-white text-olga-navy border border-olga-rule hover:bg-olga-surface active:opacity-90",
    verified:
      "bg-olga-amber text-olga-amber-ink hover:opacity-90 active:opacity-80",
    destructive:
      "bg-transparent text-olga-declined border border-olga-declined hover:bg-olga-declined-bg active:opacity-90",
    ghost:
      "bg-transparent text-olga-navy hover:bg-olga-surface active:opacity-90",
  };

  return (
    <button
      className={cx(
        base,
        variants[variant],
        fullWidth && "w-full",
        disabled && "pointer-events-none cursor-not-allowed opacity-40",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export type OlgaButtonVariant =
  | "primary"
  | "secondary"
  | "verified"
  | "destructive"
  | "ghost";

interface OlgaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: OlgaButtonVariant;
  fullWidth?: boolean;
}
