export const ZoneBanner = ({
  zoneName,
  description,
}: ZoneBannerProps): JSX.Element => {
  return (
    <div
      className="rounded-lg border border-olga-amber bg-olga-amber-bg px-4 py-3"
      role="note"
      aria-label={`Active zone: ${zoneName}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-olga-amber-ink">
        {zoneName}
      </p>
      <p className="mt-0.5 text-sm leading-snug text-olga-ink">{description}</p>
    </div>
  );
};

interface ZoneBannerProps {
  zoneName: string;
  description: string;
}
