import { OlgaButton } from "@olga/components/button";

export const OlgaEmptyState = ({
  icon,
  headline,
  body,
  action,
}: OlgaEmptyStateProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center text-olga-slate-lt"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-olga-ink">
        {headline}
      </h3>
      <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-olga-slate">
        {body}
      </p>
      {action && (
        <div className="mt-6">
          <OlgaButton variant="primary" onClick={action.onClick}>
            {action.label}
          </OlgaButton>
        </div>
      )}
    </div>
  );
};

interface OlgaEmptyStateProps {
  icon: React.ReactNode;
  headline: string;
  body: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
