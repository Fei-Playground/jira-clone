import cx from "classix";
import {
  Market,
  MarketMetrics,
  formatPrice,
  formatCompactUsd,
  change24hPct,
  openInterestUsd,
  fundingAnnualisedPct,
  sparklineOf,
  Scanner,
} from "@domain/market";
import { ColumnId } from "../screener.store";
import { ChangeBadge } from "./change-badge";
import { FundingBadge } from "./funding-badge";
import { Sparkline } from "./sparkline";
import { MetricCell } from "./metric-cell";
import { ScannerReasonChip } from "./scanner-reason-chip";

export const MarketRow = ({ market, metrics, visibleColumns, activeScanner, onSelect }: MarketRowProps): JSX.Element => {
  const oracleSpreadBps = market.oraclePx === 0 ? 0 : ((market.markPx - market.oraclePx) / market.oraclePx) * 10_000;

  const cellFor = (col: ColumnId): JSX.Element => {
    switch (col) {
      case "symbol":
        return (
          <td key={col} className="px-2 py-2 text-left">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-bold text-font">{market.symbol}</p>
                <p className="text-2xs text-font-subtlest">{market.name}</p>
              </div>
              <span className="rounded bg-background-accent-grey-subtler px-1 py-0.5 text-2xs uppercase text-font-subtle">
                {market.type}
              </span>
            </div>
          </td>
        );
      case "last":
        return (
          <td key={col} className="px-2 py-2 text-right tabular-nums text-sm text-font">
            {formatPrice(market)}
          </td>
        );
      case "change24h":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="flex justify-end">
              <ChangeBadge pct={change24hPct(market)} />
            </span>
          </td>
        );
      case "sparkline":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="flex justify-end">
              <Sparkline values={sparklineOf(market, 30)} />
            </span>
          </td>
        );
      case "volume":
        return (
          <td key={col} className="px-2 py-2 text-right tabular-nums text-xs text-font-subtle">
            {formatCompactUsd(market.dayNtlVlm)}
          </td>
        );
      case "openInterest":
        return (
          <td key={col} className="px-2 py-2 text-right tabular-nums text-xs text-font-subtle">
            {formatCompactUsd(openInterestUsd(market))}
          </td>
        );
      case "funding":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="flex justify-end">
              <FundingBadge hourlyPct={market.funding * 100} annualisedPct={fundingAnnualisedPct(market)} />
            </span>
          </td>
        );
      case "rs":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="flex justify-end">
              <MetricCell value={metrics.rsRating} kind="rs" />
            </span>
          </td>
        );
      case "rsi":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="flex justify-end">
              <MetricCell value={metrics.rsi14} kind="rsi" />
            </span>
          </td>
        );
      case "volumeRatio":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="flex justify-end">
              <MetricCell value={metrics.volumeRatio} kind="volumeRatio" />
            </span>
          </td>
        );
      case "pctFrom52wHigh":
        return (
          <td key={col} className="px-2 py-2 text-right tabular-nums text-xs text-font-subtle">
            {metrics.pctFrom52wHigh.toFixed(1)}%
          </td>
        );
      case "oracleSpread":
        return (
          <td key={col} className="px-2 py-2 text-right tabular-nums text-2xs text-font-subtlest">
            {oracleSpreadBps.toFixed(1)}bps
          </td>
        );
      case "maxLeverage":
        return (
          <td key={col} className="px-2 py-2 text-right">
            <span className="rounded bg-background-neutral px-1.5 py-0.5 text-2xs text-font-subtle">
              {market.maxLeverage}x
            </span>
          </td>
        );
      case "why":
        return (
          <td key={col} className="px-2 py-2 text-left">
            <ScannerReasonChip reason={activeScanner?.reason?.(market, metrics)} />
          </td>
        );
      default:
        return <td key={col} />;
    }
  };

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect();
      }}
      className={cx(
        "cursor-pointer border-b border-border hover:bg-elevation-surface-hovered active:bg-elevation-surface-pressed"
      )}
    >
      {visibleColumns.map((col) => cellFor(col))}
    </tr>
  );
};

interface MarketRowProps {
  market: Market;
  metrics: MarketMetrics;
  visibleColumns: ColumnId[];
  activeScanner: Scanner | undefined;
  onSelect: () => void;
}
