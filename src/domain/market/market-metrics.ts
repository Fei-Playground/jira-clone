import { Candle, Market, change24hPct } from "./market";
import {
  sma,
  smaSeries,
  rsi,
  adx,
  atr,
  high52w,
  low52w,
  avgVolume,
  pivotLevel,
  baseOf,
  gapPct,
  mansfieldRS,
  mansfieldRSSeries,
  weightedReturn,
  rsRating as rsRatingFromReturns,
  stage,
  isMorningStar,
  isBullishEngulfing,
  isHammer,
  Stage,
} from "./indicators";

export type CandlePattern = "morning-star" | "bullish-engulfing" | "hammer";

export interface MarketMetrics {
  change24hPct: number;
  sma50: number;
  sma150: number;
  sma200: number;
  sma200RisingDays: number;
  pctFrom52wHigh: number;
  pctAbove52wLow: number;
  rsRating: number;
  rsVsBtcPct: number;
  mansfieldRS: number;
  mansfieldRSRising: boolean;
  rsLineAt20dHigh: boolean;
  rsi14: number;
  adx14: number;
  plusDI: number;
  minusDI: number;
  atrPct: number;
  volumeRatio: number;
  pivot: number;
  pctFromPivot: number;
  daysSinceBreakout: number | null;
  gapPct: number;
  stage: Stage;
  trendTemplateScore: number;
  failedTrendCriteria: string[];
  patterns: CandlePattern[];
  baseDepthPct: number;
  baseLengthDays: number;
}

const closesOf = (candles: Candle[]): number[] => candles.map((c) => c.c);

// Consecutive most-recent days the 200 SMA has been rising.
const sma200RisingStreak = (closes: number[]): number => {
  const series = smaSeries(closes, 200);
  let streak = 0;
  for (let i = series.length - 1; i > 0; i--) {
    if (Number.isNaN(series[i]) || Number.isNaN(series[i - 1])) break;
    if (series[i] > series[i - 1]) streak++;
    else break;
  }
  return streak;
};

const rsLineAt20dHigh = (closes: number[], benchmarkCloses: number[]): boolean => {
  const len = Math.min(closes.length, benchmarkCloses.length);
  if (len < 20) return false;
  const ratio: number[] = [];
  for (let i = 0; i < len; i++) ratio.push(closes[i] / benchmarkCloses[i]);
  const last20 = ratio.slice(-20);
  return ratio[ratio.length - 1] >= Math.max(...last20);
};

const daysSincePivotCross = (candles: Candle[], pivot: number): number | null => {
  for (let i = candles.length - 1; i >= 1; i--) {
    const wasBelow = candles[i - 1].c <= pivot;
    const isAbove = candles[i].c > pivot;
    if (wasBelow && isAbove) return candles.length - 1 - i;
  }
  return null;
};

/**
 * Computes every scanner/table metric for a single market, once, from its
 * OHLC history plus the benchmark composite. Pure - no memoisation here;
 * callers (the store) are responsible for memoising across the dataset.
 */
export const computeMetrics = (
  market: Market,
  benchmark: Candle[],
  universeWeightedReturns: { marketId: string; weightedReturn: number }[]
): MarketMetrics => {
  const candles = market.history;
  const closes = closesOf(candles);
  const benchmarkCloses = closesOf(benchmark);

  const sma50 = sma(closes, 50);
  const sma150 = sma(closes, 150);
  const sma200 = sma(closes, 200);
  const currentPrice = closes[closes.length - 1];

  const hi52 = high52w(candles);
  const lo52 = low52w(candles);
  const pctFrom52wHigh = hi52 === 0 ? 0 : ((currentPrice - hi52) / hi52) * 100;
  const pctAbove52wLow = lo52 === 0 ? 0 : ((currentPrice - lo52) / lo52) * 100;

  const targetIndex = universeWeightedReturns.findIndex((r) => r.marketId === market.id);
  const rsRatingValue = rsRatingFromReturns(
    universeWeightedReturns.map((r) => r.weightedReturn),
    targetIndex === -1 ? 0 : targetIndex
  );

  const btcIndex = 0; // BTC weighted return acts as the "vs BTC" comparator when present
  const rsVsBtcPct = weightedReturn(closes) * 100 - (universeWeightedReturns[btcIndex]?.weightedReturn ?? 0) * 100;

  const mansfield = mansfieldRS(closes, benchmarkCloses);
  const mansfieldSeries = mansfieldRSSeries(closes, benchmarkCloses);
  const mansfieldPrev = mansfieldSeries[Math.max(0, mansfieldSeries.length - 6)];
  const mansfieldRSRising = !Number.isNaN(mansfield) && !Number.isNaN(mansfieldPrev) && mansfield > mansfieldPrev;

  const rsi14 = rsi(candles, 14);
  const { adx: adx14, plusDI, minusDI } = adx(candles, 14);
  const atrValue = atr(candles, 14);
  const atrPct = currentPrice === 0 ? 0 : (atrValue / currentPrice) * 100;

  const avgVol20 = avgVolume(candles, 20);
  const todayVolume = candles[candles.length - 1]?.v ?? 0;
  const volumeRatio = avgVol20 === 0 || Number.isNaN(avgVol20) ? 0 : todayVolume / avgVol20;

  const pivot = pivotLevel(candles);
  const pctFromPivot = pivot === 0 ? 0 : ((currentPrice - pivot) / pivot) * 100;
  const daysSinceBreakout = daysSincePivotCross(candles, pivot);

  const gap = candles.length >= 2 ? gapPct(candles[candles.length - 2], candles[candles.length - 1]) : 0;

  const marketStage = stage(candles);

  const base = baseOf(candles);

  const patterns: CandlePattern[] = [];
  if (isMorningStar(candles)) patterns.push("morning-star");
  if (isBullishEngulfing(candles)) patterns.push("bullish-engulfing");
  if (isHammer(candles)) patterns.push("hammer");

  // 8-point Trend Template criteria.
  const criteria: { name: string; pass: boolean }[] = [
    { name: "Price above 150 SMA", pass: currentPrice > sma150 },
    { name: "Price above 200 SMA", pass: currentPrice > sma200 },
    { name: "150 SMA above 200 SMA", pass: sma150 > sma200 },
    { name: "200 SMA rising ~1 month", pass: sma200RisingStreak(closes) >= 21 },
    { name: "50 SMA above 150 & 200 SMA", pass: sma50 > sma150 && sma50 > sma200 },
    { name: "Price above 50 SMA", pass: currentPrice > sma50 },
    { name: "30%+ above 52-week low", pass: pctAbove52wLow >= 30 },
    { name: "Within 25% of 52-week high", pass: pctFrom52wHigh >= -25 },
  ];
  const trendTemplateScore = criteria.filter((c) => c.pass).length;
  const failedTrendCriteria = criteria.filter((c) => !c.pass).map((c) => c.name);

  return {
    change24hPct: change24hPct(market),
    sma50,
    sma150,
    sma200,
    sma200RisingDays: sma200RisingStreak(closes),
    pctFrom52wHigh,
    pctAbove52wLow,
    rsRating: rsRatingValue,
    rsVsBtcPct,
    mansfieldRS: mansfield,
    mansfieldRSRising,
    rsLineAt20dHigh: rsLineAt20dHigh(closes, benchmarkCloses),
    rsi14,
    adx14,
    plusDI,
    minusDI,
    atrPct,
    volumeRatio,
    pivot,
    pctFromPivot,
    daysSinceBreakout,
    gapPct: gap,
    stage: marketStage,
    trendTemplateScore,
    failedTrendCriteria,
    patterns,
    baseDepthPct: base.depthPct,
    baseLengthDays: base.lengthDays,
  };
};

export type MetricsById = Record<string, MarketMetrics>;

/**
 * Computes metrics for the entire market universe in one pass. Weighted
 * returns are computed for every market first (RS Rating needs the whole
 * universe's distribution before it can rank any single market).
 */
export const computeAllMetrics = (markets: Market[], benchmark: Candle[]): MetricsById => {
  const universeWeightedReturns = markets.map((m) => ({
    marketId: m.id,
    weightedReturn: weightedReturn(closesOf(m.history)),
  }));

  const result: MetricsById = {};
  for (const market of markets) {
    result[market.id] = computeMetrics(market, benchmark, universeWeightedReturns);
  }
  return result;
};
