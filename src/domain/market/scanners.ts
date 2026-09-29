import { Market, change24hPct, openInterestUsd, fundingAnnualisedPct } from "./market";
import { MarketMetrics } from "./market-metrics";
import { toWeekly } from "./indicators";
import { SortDirection, SortField } from "./screener-filter";

export type ScannerCategory = "quick" | "leading" | "momentum" | "breakout" | "gap" | "trend" | "pattern";

export type ScannerId =
  | "top-gainers"
  | "top-losers"
  | "high-volume"
  | "negative-funding"
  | "high-oi"
  | "high-leverage"
  | "rs-rating-leaders"
  | "rs-rising"
  | "power-trend"
  | "stage2-early"
  | "adx-di-momentum"
  | "rsi-momentum"
  | "volume-momentum"
  | "funding-momentum"
  | "volume-breakout"
  | "52w-high-breakout"
  | "pivot-breakout"
  | "fresh-breakout"
  | "fresh-breakout-weekly"
  | "all-time-high-breakout"
  | "all-time-high-soon"
  | "weekly-breakout"
  | "fresh-gap-breakout-weekly"
  | "post-breakout-tight-base-weekly"
  | "post-breakout-consolidation-weekly"
  | "post-breakout-extended-weekly"
  | "trend-screen"
  | "trend-7"
  | "weinstein-tier"
  | "weinstein-tier-up"
  | "morning-star"
  | "bullish-engulfing"
  | "hammer";

export interface ScannerContext {
  metrics: MarketMetrics;
}

export interface Scanner {
  id: ScannerId;
  category: ScannerCategory;
  label: string;
  description: string;
  rule: string;
  minHistoryDays: number;
  match: (m: Market, k: MarketMetrics) => boolean;
  reason?: (m: Market, k: MarketMetrics) => string;
  defaultSort?: { field: SortField; direction: SortDirection };
}

export const categoryDict: Record<ScannerCategory, { label: string; icon: string }> = {
  quick: { label: "Quick screens", icon: "⚡️" },
  leading: { label: "Leading", icon: "🏆" },
  momentum: { label: "Momentum", icon: "⚡" },
  breakout: { label: "Breakout", icon: "🚀" },
  gap: { label: "Gap", icon: "📈" },
  trend: { label: "Trend", icon: "📊" },
  pattern: { label: "Chart Pattern", icon: "🕯" },
};

const pct = (n: number, decimals = 1): string => `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;

export const scanners: Scanner[] = [
  // ---- Quick screens (kept from v1) ----
  {
    id: "top-gainers",
    category: "quick",
    label: "Top Gainers",
    description: "24h change ≥ +5%",
    rule: "24h change ≥ +5%, sorted by change descending.",
    minHistoryDays: 0,
    match: (m) => change24hPct(m) >= 5,
    reason: (m) => `${pct(change24hPct(m))} today`,
    defaultSort: { field: "change24hPct", direction: "desc" },
  },
  {
    id: "top-losers",
    category: "quick",
    label: "Top Losers",
    description: "24h change ≤ -5%",
    rule: "24h change ≤ -5%, sorted by change ascending.",
    minHistoryDays: 0,
    match: (m) => change24hPct(m) <= -5,
    reason: (m) => `${pct(change24hPct(m))} today`,
    defaultSort: { field: "change24hPct", direction: "asc" },
  },
  {
    id: "high-volume",
    category: "quick",
    label: "High Volume",
    description: "24h volume ≥ $50M",
    rule: "24h notional volume ≥ $50M, sorted by volume descending.",
    minHistoryDays: 0,
    match: (m) => m.dayNtlVlm >= 50_000_000,
    defaultSort: { field: "dayNtlVlm", direction: "desc" },
  },
  {
    id: "negative-funding",
    category: "quick",
    label: "Negative Funding",
    description: "Longs are being paid",
    rule: "Funding rate below zero (longs paid), sorted ascending.",
    minHistoryDays: 0,
    match: (m) => m.funding < 0,
    reason: (m) => `${pct(fundingAnnualisedPct(m))} APR`,
    defaultSort: { field: "fundingAnnualisedPct", direction: "asc" },
  },
  {
    id: "high-oi",
    category: "quick",
    label: "High Open Interest",
    description: "OI ≥ $10M",
    rule: "Open interest ≥ $10M, sorted descending.",
    minHistoryDays: 0,
    match: (m) => openInterestUsd(m) >= 10_000_000,
    defaultSort: { field: "openInterestUsd", direction: "desc" },
  },
  {
    id: "high-leverage",
    category: "quick",
    label: "High Leverage",
    description: "Max leverage ≥ 25x",
    rule: "Max leverage ≥ 25x.",
    minHistoryDays: 0,
    match: (m) => m.maxLeverage >= 25,
    defaultSort: { field: "maxLeverage", direction: "desc" },
  },

  // ---- Leading ----
  {
    id: "rs-rating-leaders",
    category: "leading",
    label: "RS Rating Leaders",
    description: "RS Rating ≥ 90 — top decile of the universe",
    rule: "RS Rating ≥ 90 — top decile of weighted 3/6/12-month return within the HL universe.",
    minHistoryDays: 260,
    match: (_m, k) => k.rsRating >= 90,
    reason: (_m, k) => `RS ${k.rsRating}`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },
  {
    id: "rs-rising",
    category: "leading",
    label: "RS Rising",
    description: "Strong RS and the RS line just hit a 20-day high",
    rule: "RS Rating ≥ 70 and the RS line (price ÷ HL Composite) is at a 20-day high.",
    minHistoryDays: 30,
    match: (_m, k) => k.rsRating >= 70 && k.rsLineAt20dHigh,
    reason: (_m, k) => `RS ${k.rsRating} · RS line at 20d high`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },
  {
    id: "power-trend",
    category: "leading",
    label: "Power Trend",
    description: "Strong uptrend with a rising 50 SMA and top-decile RS",
    rule: "Price above the 50 SMA · 50 SMA rising · RS Rating ≥ 80. (Adapted per-market from IBD's market-level Power Trend state.)",
    minHistoryDays: 260,
    match: (m, k) => {
      const closes = m.history.map((c) => c.c);
      const currentPrice = closes[closes.length - 1];
      return currentPrice > k.sma50 && k.sma200RisingDays > 0 && k.rsRating >= 80;
    },
    reason: (_m, k) => `RS ${k.rsRating}`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },
  {
    id: "stage2-early",
    category: "leading",
    label: "Stage 2 Early",
    description: "Stage 2 uptrend, 150 SMA just turned up",
    rule: "Currently in Stage 2 · the 150-day SMA turned up within the last 15 days · within 15% of the 52-week high.",
    minHistoryDays: 170,
    match: (_m, k) => k.stage === 2 && k.sma200RisingDays > 0 && k.sma200RisingDays <= 15 && k.pctFrom52wHigh > -15,
    reason: (_m, k) => `Stage 2 · ${pct(k.pctFrom52wHigh)} from 52W high`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },

  // ---- Momentum ----
  {
    id: "adx-di-momentum",
    category: "momentum",
    label: "ADX/DI Momentum",
    description: "Strong, strengthening trend with bulls in control",
    rule: "ADX(14) > 25 · +DI > -DI.",
    minHistoryDays: 30,
    match: (_m, k) => k.adx14 > 25 && k.plusDI > k.minusDI,
    reason: (_m, k) => `ADX ${k.adx14.toFixed(0)}`,
    defaultSort: { field: "adx14", direction: "desc" },
  },
  {
    id: "rsi-momentum",
    category: "momentum",
    label: "RSI Momentum",
    description: "Strong but not yet overbought, above its 50 SMA",
    rule: "RSI(14) between 55 and 80 · price above the 50 SMA.",
    minHistoryDays: 50,
    match: (m, k) => {
      const closes = m.history.map((c) => c.c);
      const currentPrice = closes[closes.length - 1];
      return k.rsi14 >= 55 && k.rsi14 <= 80 && currentPrice > k.sma50;
    },
    reason: (_m, k) => `RSI ${k.rsi14.toFixed(0)}`,
    defaultSort: { field: "rsi14", direction: "desc" },
  },
  {
    id: "volume-momentum",
    category: "momentum",
    label: "Volume Momentum",
    description: "Trading 2x+ its average volume, up on the day",
    rule: "Volume ratio ≥ 2 (today vs the 20-day average) · 24h change > 0.",
    minHistoryDays: 20,
    match: (m, k) => k.volumeRatio >= 2 && change24hPct(m) > 0,
    reason: (_m, k) => `${k.volumeRatio.toFixed(1)}× volume`,
    defaultSort: { field: "volumeRatio", direction: "desc" },
  },
  {
    id: "funding-momentum",
    category: "momentum",
    label: "Funding Momentum",
    description: "Crowded long build-up: volume + OI + funding all rising",
    rule: "Volume ratio ≥ 1.5 · funding positive. (Perp-native addition, not from equity screeners — flag if you'd rather drop it.)",
    minHistoryDays: 20,
    match: (m, k) => k.volumeRatio >= 1.5 && m.funding > 0,
    reason: (m, k) => `${k.volumeRatio.toFixed(1)}× volume · ${pct(fundingAnnualisedPct(m))} funding`,
    defaultSort: { field: "volumeRatio", direction: "desc" },
  },

  // ---- Breakout ----
  {
    id: "volume-breakout",
    category: "breakout",
    label: "Volume Breakout",
    description: "Closed above its pivot on 1.5x+ volume",
    rule: "Close above the pivot (recent consolidation high) · volume ratio ≥ 1.5.",
    minHistoryDays: 40,
    match: (m, k) => {
      const closes = m.history.map((c) => c.c);
      const currentPrice = closes[closes.length - 1];
      return currentPrice > k.pivot && k.volumeRatio >= 1.5;
    },
    reason: (_m, k) => `${k.volumeRatio.toFixed(1)}× volume above pivot`,
    defaultSort: { field: "volumeRatio", direction: "desc" },
  },
  {
    id: "52w-high-breakout",
    category: "breakout",
    label: "52W High Breakout",
    description: "At or within 0.5% of its 52-week high",
    rule: "Close ≥ the 52-week high, or within 0.5% of it, today.",
    minHistoryDays: 40,
    match: (_m, k) => k.pctFrom52wHigh >= -0.5,
    reason: (_m, k) => `${pct(k.pctFrom52wHigh)} from 52W high`,
    defaultSort: { field: "pctFrom52wHigh", direction: "desc" },
  },
  {
    id: "pivot-breakout",
    category: "breakout",
    label: "Pivot Breakout",
    description: "Crossed above its pivot today",
    rule: "Close crossed above the pivot today, having been below it yesterday.",
    minHistoryDays: 40,
    match: (_m, k) => k.daysSinceBreakout === 0,
    reason: (_m, k) => `${pct(k.pctFromPivot)} above pivot`,
    defaultSort: { field: "pctFromPivot", direction: "desc" },
  },
  {
    id: "fresh-breakout",
    category: "breakout",
    label: "Fresh Breakout",
    description: "Broke out within the last 3 sessions, still near the pivot",
    rule: "Pivot cross within the last 3 sessions · price within 5% above the pivot.",
    minHistoryDays: 40,
    match: (_m, k) => k.daysSinceBreakout !== null && k.daysSinceBreakout <= 3 && k.pctFromPivot <= 5,
    reason: (_m, k) => `Broke out ${k.daysSinceBreakout}d ago`,
    defaultSort: { field: "pctFromPivot", direction: "asc" },
  },
  {
    id: "fresh-breakout-weekly",
    category: "breakout",
    label: "Fresh Breakout (Weekly)",
    description: "Same rule on weekly bars",
    rule: "Weekly pivot cross within the last 2 weekly bars.",
    minHistoryDays: 70,
    match: (m) => {
      const weekly = toWeekly(m.history);
      if (weekly.length < 12) return false;
      const window = weekly.slice(-12, -1);
      const pivot = Math.max(...window.map((c) => c.h));
      const lastTwo = weekly.slice(-2);
      return lastTwo.some((c) => c.c > pivot);
    },
    defaultSort: { field: "pctFromPivot", direction: "asc" },
  },
  {
    id: "all-time-high-breakout",
    category: "breakout",
    label: "All-Time High Breakout",
    description: "At its highest price in the available history",
    rule: "Close ≥ the all-time high over the whole available series. (Renamed from \"Multiyear High\" — our synthetic history is ~1 year, so \"multiyear\" would be a false claim.)",
    minHistoryDays: 200,
    match: (m) => {
      const closes = m.history.map((c) => c.c);
      const highs = m.history.map((c) => c.h);
      return closes[closes.length - 1] >= Math.max(...highs);
    },
    defaultSort: { field: "change24hPct", direction: "desc" },
  },
  {
    id: "all-time-high-soon",
    category: "breakout",
    label: "All-Time High Soon",
    description: "Within 8% of its all-time high, still in Stage 2",
    rule: "Within -8% to 0% of the 52-week high · currently in Stage 2. (Renamed from \"Multiyear High soon\".)",
    minHistoryDays: 200,
    match: (_m, k) => k.pctFrom52wHigh >= -8 && k.pctFrom52wHigh <= 0 && k.stage === 2,
    reason: (_m, k) => `${pct(k.pctFrom52wHigh)} from high`,
    defaultSort: { field: "pctFrom52wHigh", direction: "desc" },
  },
  {
    id: "weekly-breakout",
    category: "breakout",
    label: "Weekly Breakout",
    description: "Weekly close above the last 10 weeks' high",
    rule: "Weekly close above the highest weekly high of the prior 10 weekly bars.",
    minHistoryDays: 80,
    match: (m) => {
      const weekly = toWeekly(m.history);
      if (weekly.length < 11) return false;
      const window = weekly.slice(-11, -1);
      const pivot = Math.max(...window.map((c) => c.h));
      return weekly[weekly.length - 1].c > pivot;
    },
    defaultSort: { field: "change24hPct", direction: "desc" },
  },

  // ---- Gap ----
  {
    id: "fresh-gap-breakout-weekly",
    category: "gap",
    label: "Fresh Gap Breakout (Weekly)",
    description: "Weekly bar jumped 5%+ and broke to a new 10-week high",
    rule: "Weekly close-to-close jump ≥ +5% · weekly close above the prior 10-week high. (Crypto trades 24/7 — \"gap\" here means a bar-to-bar jump, not an overnight session gap.)",
    minHistoryDays: 80,
    match: (m) => {
      const weekly = toWeekly(m.history);
      if (weekly.length < 12) return false;
      const last = weekly[weekly.length - 1];
      const prev = weekly[weekly.length - 2];
      const jumpPct = prev.c === 0 ? 0 : ((last.c - prev.c) / prev.c) * 100;
      const window = weekly.slice(-11, -1);
      const pivot = Math.max(...window.map((c) => c.h));
      return jumpPct >= 5 && last.c > pivot;
    },
    reason: (m) => {
      const weekly = toWeekly(m.history);
      const last = weekly[weekly.length - 1];
      const prev = weekly[weekly.length - 2];
      const jumpPct = prev.c === 0 ? 0 : ((last.c - prev.c) / prev.c) * 100;
      return `${pct(jumpPct)} weekly jump`;
    },
    defaultSort: { field: "change24hPct", direction: "desc" },
  },
  {
    id: "post-breakout-tight-base-weekly",
    category: "gap",
    label: "Post Breakout Tight Base (Weekly)",
    description: "Broke out 2-8 weeks ago, holding in a tight, low-volatility base",
    rule: "Held above the pivot in a low-volatility base · base depth ≤ 12% · price within 8% of the pivot.",
    minHistoryDays: 80,
    match: (_m, k) => k.baseDepthPct <= 12 && k.pctFromPivot >= -3 && k.pctFromPivot <= 8,
    reason: (_m, k) => `Base depth ${k.baseDepthPct.toFixed(1)}%`,
    defaultSort: { field: "pctFromPivot", direction: "asc" },
  },
  {
    id: "post-breakout-consolidation-weekly",
    category: "gap",
    label: "Post Breakout Consolidation (Weekly)",
    description: "Broke out 2-12 weeks ago, consolidating near the pivot",
    rule: "Price within ±8% of the pivot · base length ≥ 14 days.",
    minHistoryDays: 80,
    match: (_m, k) => Math.abs(k.pctFromPivot) <= 8 && k.baseLengthDays >= 14,
    reason: (_m, k) => `${pct(k.pctFromPivot)} from pivot`,
    defaultSort: { field: "pctFromPivot", direction: "asc" },
  },
  {
    id: "post-breakout-extended-weekly",
    category: "gap",
    label: "Post Breakout Extended (Weekly)",
    description: "Broke out and ran hard — late-stage chase risk",
    rule: "Broke out and is now ≥25% above the pivot, or ≥20% above the 50 SMA.",
    minHistoryDays: 80,
    match: (m, k) => {
      const closes = m.history.map((c) => c.c);
      const currentPrice = closes[closes.length - 1];
      const aboveSma50Pct = k.sma50 === 0 ? 0 : ((currentPrice - k.sma50) / k.sma50) * 100;
      return k.pctFromPivot >= 25 || aboveSma50Pct >= 20;
    },
    reason: (_m, k) => `${pct(k.pctFromPivot)} above pivot`,
    defaultSort: { field: "pctFromPivot", direction: "desc" },
  },

  // ---- Trend ----
  {
    id: "trend-screen",
    category: "trend",
    label: "Trend Screen",
    description: "Meets all 8 Trend Template criteria — classic Stage 2 uptrend",
    rule: "All 8 Trend Template criteria: price > 150 & 200 SMA · 150 SMA > 200 SMA · 200 SMA rising ~1mo · 50 SMA above 150/200 and price above 50 SMA · 30%+ above 52W low · within 25% of 52W high · RS Rating ≥ 70.",
    minHistoryDays: 260,
    match: (_m, k) => k.trendTemplateScore === 8 && k.rsRating >= 70,
    reason: (_m, k) => `${k.trendTemplateScore}/8 · RS ${k.rsRating}`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },
  {
    id: "trend-7",
    category: "trend",
    label: "Trend 7",
    description: "Meets exactly 7 of 8 Trend Template criteria — near miss",
    rule: "Trend Template score exactly 7 of 8, with the failing criterion named.",
    minHistoryDays: 260,
    match: (_m, k) => k.trendTemplateScore === 7,
    reason: (_m, k) => `Missing: ${k.failedTrendCriteria[0] ?? "—"}`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },
  {
    id: "weinstein-tier",
    category: "trend",
    label: "Weinstein Tier",
    description: "Confirmed Stage 2 advance with strong, improving RS",
    rule: "150-day SMA rising · Mansfield RS positive and rising · RS Rating ≥ 70 · currently Stage 2.",
    minHistoryDays: 170,
    match: (_m, k) => k.sma200RisingDays > 0 && k.mansfieldRS > 0 && k.mansfieldRSRising && k.rsRating >= 70 && k.stage === 2,
    reason: (_m, k) => `RS ${k.rsRating} · Mansfield RS ${k.mansfieldRS.toFixed(1)}`,
    defaultSort: { field: "rsRating", direction: "desc" },
  },
  {
    id: "weinstein-tier-up",
    category: "trend",
    label: "Weinstein Tier Up",
    description: "Stage 1/2 names near a breakout — watchlist",
    rule: "Stage 1 or 2 · price between 8% below and 2% above the pivot · RS Rating ≥ 60.",
    minHistoryDays: 40,
    match: (_m, k) => (k.stage === 1 || k.stage === 2) && k.pctFromPivot >= -8 && k.pctFromPivot <= 2 && k.rsRating >= 60,
    reason: (_m, k) => `${pct(k.pctFromPivot)} from pivot · RS ${k.rsRating}`,
    defaultSort: { field: "pctFromPivot", direction: "asc" },
  },

  // ---- Chart Pattern ----
  {
    id: "morning-star",
    category: "pattern",
    label: "Morning Star",
    description: "3-candle bottoming reversal pattern",
    rule: "Bearish candle, then a small inside candle, then a bullish candle closing above the first candle's midpoint.",
    minHistoryDays: 3,
    match: (_m, k) => k.patterns.includes("morning-star"),
    reason: () => "Morning Star on the last 3 bars",
    defaultSort: { field: "change24hPct", direction: "desc" },
  },
  {
    id: "bullish-engulfing",
    category: "pattern",
    label: "Bullish Engulfing",
    description: "A down candle fully engulfed by the next up candle",
    rule: "Bearish candle followed by a bullish candle whose body fully covers the first.",
    minHistoryDays: 2,
    match: (_m, k) => k.patterns.includes("bullish-engulfing"),
    reason: () => "Bullish Engulfing on the last 2 bars",
    defaultSort: { field: "change24hPct", direction: "desc" },
  },
  {
    id: "hammer",
    category: "pattern",
    label: "Hammer",
    description: "Small body, long lower wick — buyers stepping in",
    rule: "Lower wick ≥ 2× the real body · upper wick ≤ the real body · closes in the top third of the range.",
    minHistoryDays: 1,
    match: (_m, k) => k.patterns.includes("hammer"),
    reason: () => "Hammer on the latest bar",
    defaultSort: { field: "change24hPct", direction: "desc" },
  },
];

export const scannersByCategory: Record<ScannerCategory, Scanner[]> = scanners.reduce(
  (acc, scanner) => {
    acc[scanner.category] = [...(acc[scanner.category] ?? []), scanner];
    return acc;
  },
  {} as Record<ScannerCategory, Scanner[]>
);

export const isValidScannerId = (v: string): v is ScannerId => scanners.some((s) => s.id === v);

export const applyScanner = (
  markets: Market[],
  metricsById: Record<string, MarketMetrics>,
  scanner: Scanner
): Market[] =>
  markets.filter((m) => m.listedDaysAgo >= scanner.minHistoryDays && scanner.match(m, metricsById[m.id]));
