import { Candle } from "./market";

const closesOf = (candles: Candle[]): number[] => candles.map((c) => c.c);

export const sma = (closes: number[], n: number): number => {
  if (closes.length < n) return NaN;
  const slice = closes.slice(-n);
  return slice.reduce((sum, v) => sum + v, 0) / n;
};

export const smaSeries = (closes: number[], n: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i + 1 < n) {
      out.push(NaN);
      continue;
    }
    const slice = closes.slice(i + 1 - n, i + 1);
    out.push(slice.reduce((sum, v) => sum + v, 0) / n);
  }
  return out;
};

export const ema = (closes: number[], n: number): number => {
  if (closes.length === 0) return NaN;
  const k = 2 / (n + 1);
  let value = closes[0];
  for (let i = 1; i < closes.length; i++) {
    value = closes[i] * k + value * (1 - k);
  }
  return value;
};

export const emaSeries = (closes: number[], n: number): number[] => {
  if (closes.length === 0) return [];
  const k = 2 / (n + 1);
  const out: number[] = [closes[0]];
  for (let i = 1; i < closes.length; i++) {
    out.push(closes[i] * k + out[i - 1] * (1 - k));
  }
  return out;
};

// Wilder's RSI(14)
export const rsi = (candles: Candle[], n = 14): number => {
  const closes = closesOf(candles);
  if (closes.length < n + 1) return NaN;

  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= n; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gainSum += diff;
    else lossSum -= diff;
  }
  let avgGain = gainSum / n;
  let avgLoss = lossSum / n;

  for (let i = n + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (n - 1) + gain) / n;
    avgLoss = (avgLoss * (n - 1) + loss) / n;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

// Wilder's ADX/DI(14)
export const adx = (candles: Candle[], n = 14): { adx: number; plusDI: number; minusDI: number } => {
  if (candles.length < n * 2) return { adx: NaN, plusDI: NaN, minusDI: NaN };

  const plusDMs: number[] = [];
  const minusDMs: number[] = [];
  const trs: number[] = [];

  for (let i = 1; i < candles.length; i++) {
    const up = candles[i].h - candles[i - 1].h;
    const down = candles[i - 1].l - candles[i].l;
    plusDMs.push(up > down && up > 0 ? up : 0);
    minusDMs.push(down > up && down > 0 ? down : 0);

    const tr = Math.max(
      candles[i].h - candles[i].l,
      Math.abs(candles[i].h - candles[i - 1].c),
      Math.abs(candles[i].l - candles[i - 1].c)
    );
    trs.push(tr);
  }

  const wilderSmooth = (values: number[], period: number): number[] => {
    const out: number[] = [];
    let sum = values.slice(0, period).reduce((s, v) => s + v, 0);
    out.push(sum);
    for (let i = period; i < values.length; i++) {
      sum = sum - sum / period + values[i];
      out.push(sum);
    }
    return out;
  };

  const smoothedTR = wilderSmooth(trs, n);
  const smoothedPlusDM = wilderSmooth(plusDMs, n);
  const smoothedMinusDM = wilderSmooth(minusDMs, n);

  const plusDIs: number[] = [];
  const minusDIs: number[] = [];
  const dxs: number[] = [];

  for (let i = 0; i < smoothedTR.length; i++) {
    const plusDI = smoothedTR[i] === 0 ? 0 : (100 * smoothedPlusDM[i]) / smoothedTR[i];
    const minusDI = smoothedTR[i] === 0 ? 0 : (100 * smoothedMinusDM[i]) / smoothedTR[i];
    plusDIs.push(plusDI);
    minusDIs.push(minusDI);
    const sum = plusDI + minusDI;
    dxs.push(sum === 0 ? 0 : (100 * Math.abs(plusDI - minusDI)) / sum);
  }

  const adxValue = sma(dxs, n);
  return {
    adx: Number.isNaN(adxValue) ? dxs.slice(-n).reduce((s, v) => s + v, 0) / n : adxValue,
    plusDI: plusDIs[plusDIs.length - 1],
    minusDI: minusDIs[minusDIs.length - 1],
  };
};

export const atr = (candles: Candle[], n = 14): number => {
  if (candles.length < n + 1) return NaN;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].h - candles[i].l,
      Math.abs(candles[i].h - candles[i - 1].c),
      Math.abs(candles[i].l - candles[i - 1].c)
    );
    trs.push(tr);
  }
  return sma(trs, n);
};

export const high52w = (candles: Candle[]): number => {
  const window = candles.slice(-252);
  return Math.max(...window.map((c) => c.h));
};

export const low52w = (candles: Candle[]): number => {
  const window = candles.slice(-252);
  return Math.min(...window.map((c) => c.l));
};

export const allTimeHigh = (candles: Candle[]): number => Math.max(...candles.map((c) => c.h));

export const allTimeLow = (candles: Candle[]): number => Math.min(...candles.map((c) => c.l));

export const avgVolume = (candles: Candle[], n = 20): number => {
  const window = candles.slice(-n);
  if (window.length === 0) return NaN;
  return window.reduce((sum, c) => sum + c.v, 0) / window.length;
};

// 7-day buckets. Crypto has no trading week, so this is a fixed calendar
// bucketing of the daily bars rather than a Mon-Fri aggregate.
export const toWeekly = (candles: Candle[]): Candle[] => {
  const weekly: Candle[] = [];
  for (let i = 0; i < candles.length; i += 7) {
    const bucket = candles.slice(i, i + 7);
    if (bucket.length === 0) continue;
    weekly.push({
      t: bucket[bucket.length - 1].t,
      o: bucket[0].o,
      c: bucket[bucket.length - 1].c,
      h: Math.max(...bucket.map((c) => c.h)),
      l: Math.min(...bucket.map((c) => c.l)),
      v: bucket.reduce((sum, c) => sum + c.v, 0),
    });
  }
  return weekly;
};

// The highest high of the most recent consolidation, used as the breakout
// pivot level. Looks back over the last `lookback` bars (default ~7 weeks).
export const pivotLevel = (candles: Candle[], lookback = 35): number => {
  const window = candles.slice(-lookback - 1, -1); // exclude the current bar
  if (window.length === 0) return candles[candles.length - 1]?.h ?? NaN;
  return Math.max(...window.map((c) => c.h));
};

export interface Base {
  depthPct: number;
  lengthDays: number;
  pivot: number;
}

// Describes the most recent base: how deep it went and how long it's been
// forming, relative to the pivot (the base's own high).
export const baseOf = (candles: Candle[], lookback = 35): Base => {
  const window = candles.slice(-lookback);
  if (window.length === 0) return { depthPct: 0, lengthDays: 0, pivot: NaN };
  const pivot = Math.max(...window.map((c) => c.h));
  const low = Math.min(...window.map((c) => c.l));
  const depthPct = pivot === 0 ? 0 : ((pivot - low) / pivot) * 100;
  return { depthPct, lengthDays: window.length, pivot };
};

export const gapPct = (prev: Candle, curr: Candle): number =>
  prev.c === 0 ? 0 : ((curr.o - prev.c) / prev.c) * 100;

// Mansfield RS: (security/benchmark ratio) / SMA(ratio) - 1. Positive = the
// security is outperforming the benchmark; the slope of this over time is
// what "rising" means.
export const mansfieldRSSeries = (closes: number[], benchmarkCloses: number[], n = 52): number[] => {
  const len = Math.min(closes.length, benchmarkCloses.length);
  const ratio: number[] = [];
  for (let i = 0; i < len; i++) {
    ratio.push(closes[i] / benchmarkCloses[i]);
  }
  const ratioSma = smaSeries(ratio, n);
  return ratio.map((r, i) => (Number.isNaN(ratioSma[i]) || ratioSma[i] === 0 ? NaN : (r / ratioSma[i] - 1) * 100));
};

export const mansfieldRS = (closes: number[], benchmarkCloses: number[], n = 52): number => {
  const series = mansfieldRSSeries(closes, benchmarkCloses, n);
  return series[series.length - 1];
};

// IBD-style RS Rating: a market's weighted 3/6/12-month return,
// percentile-ranked 1-99 within the given universe of markets' own returns.
export const weightedReturn = (closes: number[]): number => {
  const ret = (months: number): number => {
    const daysBack = Math.min(closes.length - 1, months * 21);
    if (daysBack <= 0) return 0;
    const past = closes[closes.length - 1 - daysBack];
    const current = closes[closes.length - 1];
    return past === 0 ? 0 : (current - past) / past;
  };
  // IBD weighting: most recent quarter counted twice.
  return ret(3) * 2 + ret(6) + ret(12);
};

export const rsRating = (weightedReturns: number[], targetIndex: number): number => {
  const target = weightedReturns[targetIndex];
  const below = weightedReturns.filter((r) => r < target).length;
  const percentile = (below / (weightedReturns.length - 1 || 1)) * 98 + 1;
  return Math.round(Math.min(99, Math.max(1, percentile)));
};

export type Stage = 1 | 2 | 3 | 4;

// Weinstein staging from the 150-day (30-week) SMA slope + price position.
export const stage = (candles: Candle[]): Stage => {
  const closes = closesOf(candles);
  const sma150Series = smaSeries(closes, 150);
  const current = closes[closes.length - 1];
  const sma150 = sma150Series[sma150Series.length - 1];
  const sma150Prev = sma150Series[Math.max(0, sma150Series.length - 21)];

  if (Number.isNaN(sma150) || Number.isNaN(sma150Prev)) return 1;

  const slopeRising = sma150 > sma150Prev;
  const priceAbove = current > sma150;

  if (priceAbove && slopeRising) return 2;
  if (!priceAbove && !slopeRising) return 4;
  if (priceAbove && !slopeRising) return 3;
  return 1;
};

export interface CandlePatternInputs {
  bodyPct: (candle: Candle) => number;
}

const realBodyPct = (candle: Candle): number =>
  candle.o === 0 ? 0 : (Math.abs(candle.c - candle.o) / candle.o) * 100;

export const isMorningStar = (candles: Candle[]): boolean => {
  if (candles.length < 3) return false;
  const [c1, c2, c3] = candles.slice(-3);
  const c1Bearish = c1.c < c1.o && realBodyPct(c1) >= 1;
  const c2SmallInside = realBodyPct(c2) <= realBodyPct(c1) * 0.4 && c2.c < c1.c;
  const c3Bullish = c3.c > c3.o && c3.c > (c1.o + c1.c) / 2;
  return c1Bearish && c2SmallInside && c3Bullish;
};

export const isBullishEngulfing = (candles: Candle[]): boolean => {
  if (candles.length < 2) return false;
  const [c1, c2] = candles.slice(-2);
  const c1Bearish = c1.c < c1.o;
  const c2Bullish = c2.c > c2.o;
  const engulfs = c2.o <= c1.c && c2.c >= c1.o;
  return c1Bearish && c2Bullish && engulfs;
};

export const isHammer = (candles: Candle[]): boolean => {
  if (candles.length < 1) return false;
  const candle = candles[candles.length - 1];
  const body = Math.abs(candle.c - candle.o);
  const upperWick = candle.h - Math.max(candle.o, candle.c);
  const lowerWick = Math.min(candle.o, candle.c) - candle.l;
  if (body === 0) return false;
  const range = candle.h - candle.l;
  const closeInTopThird = range > 0 && candle.c >= candle.l + range * 0.66;
  return lowerWick >= body * 2 && upperWick <= body && closeInTopThird;
};
