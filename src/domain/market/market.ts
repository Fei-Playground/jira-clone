export type MarketId = string; // e.g. "BTC-PERP"
export type MarketType = "perp" | "spot";

export interface Candle {
  t: number; // ms epoch, daily close
  o: number;
  h: number;
  l: number;
  c: number;
  v: number; // notional volume for that day (USD)
}

export interface Market {
  id: MarketId;
  symbol: string; // "BTC"
  name: string; // "Bitcoin"
  type: MarketType;
  markPx: number; // mark price
  oraclePx: number; // oracle price
  midPx: number;
  prevDayPx: number; // -> 24h change % is derived
  funding: number; // hourly funding rate, e.g. 0.0000125
  openInterest: number; // in base units
  dayNtlVlm: number; // 24h notional volume (USD)
  maxLeverage: number; // 3 | 5 | 10 | 20 | 25 | 40 | 50
  szDecimals: number;
  listedDaysAgo: number; // how much history exists - gates scanners needing 200+ bars
  history: Candle[]; // ~260 synthetic daily bars, oldest -> newest
}

export const change24hPct = (m: Market): number =>
  ((m.markPx - m.prevDayPx) / m.prevDayPx) * 100;

export const fundingAnnualisedPct = (m: Market): number => m.funding * 24 * 365 * 100;

export const openInterestUsd = (m: Market): number => m.openInterest * m.markPx;

export const formatPrice = (m: Market): string => {
  const decimals = m.markPx >= 1 ? Math.min(m.szDecimals, 2) : Math.min(m.szDecimals + 2, 8);
  return `$${m.markPx.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatCompactUsd = (n: number): string => {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
};

export const sparklineOf = (m: Market, days = 30): number[] =>
  m.history.slice(-days).map((candle) => candle.c);
