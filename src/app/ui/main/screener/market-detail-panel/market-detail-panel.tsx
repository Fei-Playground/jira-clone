import * as Dialog from "@app/components/dialog";
import { Tooltip } from "@app/components/tooltip";
import {
  Market,
  MarketMetrics,
  formatPrice,
  formatCompactUsd,
  change24hPct,
  openInterestUsd,
  fundingAnnualisedPct,
} from "@domain/market";
import { ChangeBadge } from "../market-table/change-badge";
import { PriceChart } from "./price-chart";
import { TechnicalsGrid } from "./technicals-grid";
import { TrendTemplateChecklist } from "./trend-template-checklist";

const patternLabels: Record<string, string> = {
  "morning-star": "Morning Star",
  "bullish-engulfing": "Bullish Engulfing",
  hammer: "Hammer",
};

export const MarketDetailPanel = ({ market, metrics, onClose }: MarketDetailPanelProps): JSX.Element => {
  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="justify-end px-0 py-0">
          <Dialog.Content
            onEscapeKeyDown={onClose}
            onPointerDownOutside={onClose}
            className="ml-auto h-full max-w-[520px] overflow-y-auto rounded-none px-6 py-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Dialog.Title className="mb-0 flex items-center gap-2 font-primary-black text-2xl">
                  {market.symbol}
                  <span className="rounded bg-background-accent-grey-subtler px-1.5 py-0.5 text-2xs uppercase text-font-subtle">
                    {market.type}
                  </span>
                </Dialog.Title>
                <p className="text-sm text-font-subtlest">{market.name}</p>
                <Dialog.Description className="sr-only">
                  Detailed stats and technicals for {market.name}.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close market detail"
                className="flex cursor-pointer items-center rounded border-none p-1 text-icon hover:bg-background-neutral"
              >
                ✕
              </Dialog.Close>
            </div>

            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-2xl tabular-nums text-font">{formatPrice(market)}</span>
              <ChangeBadge pct={change24hPct(market)} />
            </div>

            <div className="mb-6">
              <PriceChart market={market} metrics={metrics} />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Oracle price" value={`$${market.oraclePx.toFixed(2)}`} />
              <Stat label="Mid price" value={`$${market.midPx.toFixed(2)}`} />
              <Stat label="Prev day price" value={`$${market.prevDayPx.toFixed(2)}`} />
              <Stat label="24h volume" value={formatCompactUsd(market.dayNtlVlm)} />
              <Stat label="Open interest" value={`${formatCompactUsd(openInterestUsd(market))} (${market.openInterest.toLocaleString()} units)`} />
              <Stat label="Funding (1h / APR)" value={`${(market.funding * 100).toFixed(4)}% / ${fundingAnnualisedPct(market).toFixed(1)}%`} />
              <Stat label="Max leverage" value={`${market.maxLeverage}x`} />
              <Stat label="Size decimals" value={String(market.szDecimals)} />
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm text-font">Technicals</p>
              <TechnicalsGrid market={market} metrics={metrics} />
            </div>

            <div className="mb-6">
              <TrendTemplateChecklist metrics={metrics} />
            </div>

            {metrics.patterns.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-sm text-font">Detected patterns</p>
                <div className="flex gap-2">
                  {metrics.patterns.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-background-accent-green-subtler px-2 py-1 text-xs text-font-accent-green"
                    >
                      {patternLabels[p] ?? p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded border-none bg-background-neutral px-4 py-2 text-sm text-font hover:bg-background-neutral-hovered"
                >
                  Close
                </button>
              </Dialog.Close>
              <Tooltip title="Not implemented in this demo">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded border-none bg-background-disabled px-4 py-2 text-sm text-font-disabled"
                >
                  Trade on Hyperliquid
                </button>
              </Tooltip>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Stat = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div>
    <p className="text-2xs uppercase text-font-subtlest">{label}</p>
    <p className="tabular-nums text-font">{value}</p>
  </div>
);

interface MarketDetailPanelProps {
  market: Market;
  metrics: MarketMetrics;
  onClose: () => void;
}
