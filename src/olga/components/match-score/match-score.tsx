export const MatchScoreDisplay = ({
  score,
  explanation,
}: MatchScoreDisplayProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-mono text-[40px] font-[500] leading-none text-olga-navy">
        {score}%
      </span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-olga-slate">
        Mutual fit
      </span>
      <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-olga-slate">
        {explanation}
      </p>
    </div>
  );
};

interface MatchScoreDisplayProps {
  score: number;
  explanation: string;
}
