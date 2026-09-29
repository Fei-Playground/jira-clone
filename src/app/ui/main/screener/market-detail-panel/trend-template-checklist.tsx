import { BsCheckCircleFill, BsXCircle } from "react-icons/bs";
import { MarketMetrics } from "@domain/market";

const allCriteria = [
  "Price above 150 SMA",
  "Price above 200 SMA",
  "150 SMA above 200 SMA",
  "200 SMA rising ~1 month",
  "50 SMA above 150 & 200 SMA",
  "Price above 50 SMA",
  "30%+ above 52-week low",
  "Within 25% of 52-week high",
];

export const TrendTemplateChecklist = ({ metrics }: TrendTemplateChecklistProps): JSX.Element => (
  <div>
    <p className="mb-2 flex items-center justify-between text-sm text-font">
      <span>Trend Template</span>
      <span className="font-bold">{metrics.trendTemplateScore} / 8</span>
    </p>
    <ul className="space-y-1">
      {allCriteria.map((criterion) => {
        const failed = metrics.failedTrendCriteria.includes(criterion);
        return (
          <li key={criterion} className="flex items-center gap-2 text-xs">
            {failed ? (
              <BsXCircle size={14} className="text-icon-danger" />
            ) : (
              <BsCheckCircleFill size={14} className="text-icon-accent-green" />
            )}
            <span className={failed ? "text-font-subtlest" : "text-font"}>{criterion}</span>
          </li>
        );
      })}
    </ul>
  </div>
);

interface TrendTemplateChecklistProps {
  metrics: MarketMetrics;
}
