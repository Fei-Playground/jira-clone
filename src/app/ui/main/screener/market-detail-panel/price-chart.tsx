import { Market, MarketMetrics } from "@domain/market";
import { smaSeries, high52w } from "@domain/market/indicators";

const WIDTH = 480;
const HEIGHT = 160;

export const PriceChart = ({ market, metrics }: PriceChartProps): JSX.Element => {
  const closes = market.history.map((c) => c.c);
  const sma50Series = smaSeries(closes, 50);
  const sma150Series = smaSeries(closes, 150);
  const sma200Series = smaSeries(closes, 200);
  const hi52 = high52w(market.history);

  const allValues = [...closes, hi52].filter((v) => !Number.isNaN(v));
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const toPoints = (series: number[]): string =>
    series
      .map((v, i) => {
        if (Number.isNaN(v)) return null;
        const x = (i / (closes.length - 1)) * WIDTH;
        const y = HEIGHT - ((v - min) / range) * HEIGHT;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .filter(Boolean)
      .join(" ");

  const hi52Y = HEIGHT - ((hi52 - min) / range) * HEIGHT;

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" aria-label="Price chart">
      <line
        x1={0}
        y1={hi52Y}
        x2={WIDTH}
        y2={hi52Y}
        strokeDasharray="4 4"
        className="stroke-border-bold"
        strokeWidth={1}
      />
      <polyline points={toPoints(sma200Series)} fill="none" strokeWidth={1} className="stroke-icon-accent-red" />
      <polyline points={toPoints(sma150Series)} fill="none" strokeWidth={1} className="stroke-icon-accent-yellow" />
      <polyline points={toPoints(sma50Series)} fill="none" strokeWidth={1} className="stroke-icon-brand" />
      <polyline points={toPoints(closes)} fill="none" strokeWidth={1.5} className="stroke-font" />
      <text x={4} y={12} className="fill-font-subtlest text-2xs">
        {metrics.trendTemplateScore}/8 trend template
      </text>
    </svg>
  );
};

interface PriceChartProps {
  market: Market;
  metrics: MarketMetrics;
}
