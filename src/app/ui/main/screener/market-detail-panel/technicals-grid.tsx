import { Market, MarketMetrics, formatPrice } from "@domain/market";

const stageLabels: Record<1 | 2 | 3 | 4, string> = {
  1: "Stage 1 — Basing",
  2: "Stage 2 — Advancing",
  3: "Stage 3 — Topping",
  4: "Stage 4 — Declining",
};

export const TechnicalsGrid = ({ market, metrics }: TechnicalsGridProps): JSX.Element => {
  const rows: { label: string; value: string }[] = [
    { label: "RS Rating", value: `${metrics.rsRating}` },
    { label: "RS vs BTC (3mo)", value: `${metrics.rsVsBtcPct >= 0 ? "+" : ""}${metrics.rsVsBtcPct.toFixed(1)}%` },
    { label: "Mansfield RS", value: metrics.mansfieldRS.toFixed(1) },
    { label: "Stage", value: stageLabels[metrics.stage] },
    { label: "RSI (14)", value: metrics.rsi14.toFixed(1) },
    { label: "ADX (14)", value: metrics.adx14.toFixed(1) },
    { label: "+DI / -DI", value: `${metrics.plusDI.toFixed(1)} / ${metrics.minusDI.toFixed(1)}` },
    { label: "ATR %", value: `${metrics.atrPct.toFixed(2)}%` },
    { label: "50 SMA", value: `$${metrics.sma50.toFixed(2)}` },
    { label: "150 SMA", value: `$${metrics.sma150.toFixed(2)}` },
    { label: "200 SMA", value: `$${metrics.sma200.toFixed(2)}` },
    { label: "% from 52W high", value: `${metrics.pctFrom52wHigh.toFixed(1)}%` },
    { label: "% above 52W low", value: `${metrics.pctAbove52wLow.toFixed(1)}%` },
    { label: "Pivot", value: `$${metrics.pivot.toFixed(2)}` },
    { label: "% from pivot", value: `${metrics.pctFromPivot.toFixed(1)}%` },
    { label: "Volume ratio", value: `${metrics.volumeRatio.toFixed(1)}x` },
    { label: "Mark price", value: formatPrice(market) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-2xs uppercase text-font-subtlest">{row.label}</dt>
          <dd className="text-sm tabular-nums text-font">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

interface TechnicalsGridProps {
  market: Market;
  metrics: MarketMetrics;
}
