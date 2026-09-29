import { Candle } from "./market";

// Tiny deterministic PRNG (mulberry32) so the same seed produces the same
// series on every reload and in every Storybook story. No dependency.
const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const seedFromSymbol = (symbol: string): number => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash << 5) - hash + symbol.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

export type PriceRegime =
  | "stage2-uptrend"
  | "stage2-near-miss"
  | "breakout-today"
  | "gap-up-today"
  | "post-breakout-tight"
  | "post-breakout-extended"
  | "stage1-basing"
  | "stage4-downtrend"
  | "choppy"
  | "pattern-morning-star"
  | "pattern-bullish-engulfing"
  | "pattern-hammer";

const DAYS = 260;

// Drift + volatility shaping per regime. These are deliberately simple:
// a random walk with a drift bias, occasionally punctuated by a scripted
// event near the end of the series so scanners have something to find.
const regimeDrift: Record<PriceRegime, number> = {
  "stage2-uptrend": 0.0032,
  "stage2-near-miss": 0.0022,
  "breakout-today": 0.0028,
  "gap-up-today": 0.0018,
  "post-breakout-tight": 0.0016,
  "post-breakout-extended": 0.0038,
  "stage1-basing": 0.0004,
  "stage4-downtrend": -0.0026,
  choppy: 0.0002,
  "pattern-morning-star": -0.0006,
  "pattern-bullish-engulfing": -0.0004,
  "pattern-hammer": -0.0005,
};

const regimeVolatility: Record<PriceRegime, number> = {
  "stage2-uptrend": 0.018,
  "stage2-near-miss": 0.018,
  "breakout-today": 0.02,
  "gap-up-today": 0.022,
  "post-breakout-tight": 0.01,
  "post-breakout-extended": 0.024,
  "stage1-basing": 0.012,
  "stage4-downtrend": 0.02,
  choppy: 0.02,
  "pattern-morning-star": 0.019,
  "pattern-bullish-engulfing": 0.019,
  "pattern-hammer": 0.017,
};

/**
 * Generates ~260 synthetic daily OHLC bars for a market, seeded from its
 * symbol so the series is deterministic. Generated forward, then rescaled
 * so the final close equals `endPrice` - the table and the history never
 * disagree on "today's" price.
 */
export const generateHistory = (
  symbol: string,
  endPrice: number,
  dayNtlVlm: number,
  regime: PriceRegime = "choppy",
  days: number = DAYS
): Candle[] => {
  const rand = mulberry32(seedFromSymbol(symbol));
  const drift = regimeDrift[regime];
  const vol = regimeVolatility[regime];

  // Start from an arbitrary base of 1.0 and random-walk forward; rescale at
  // the end so candle[days - 1].c === endPrice exactly.
  const closes: number[] = [1];
  const opens: number[] = [1];
  const highs: number[] = [1];
  const lows: number[] = [1];
  const volumes: number[] = [];

  for (let i = 1; i < days; i++) {
    const prevClose = closes[i - 1];
    // Box-Muller-ish noise from two uniform draws for a roughly normal step
    const u1 = Math.max(rand(), 1e-6);
    const u2 = rand();
    const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const step = drift + vol * gaussian;

    const open = prevClose * (1 + (rand() - 0.5) * vol * 0.3);
    let close = open * (1 + step);
    close = Math.max(close, prevClose * 0.5); // guard against runaway negative walks

    const intradayRange = Math.abs(close - open) + open * vol * 0.6 * rand();
    const high = Math.max(open, close) + intradayRange * rand() * 0.6;
    const low = Math.min(open, close) - intradayRange * rand() * 0.6;

    opens.push(open);
    closes.push(close);
    highs.push(Math.max(high, open, close));
    lows.push(Math.min(Math.max(low, 0.0001), open, close));
  }

  for (let i = 0; i < days; i++) {
    const surge = rand() < 0.06 ? 3 + rand() * 2 : 1; // occasional 3-5x volume day
    const lognormalNoise = Math.exp((rand() - 0.5) * 0.6);
    volumes.push(dayNtlVlm * lognormalNoise * surge * (0.5 + rand() * 0.5));
  }

  // Script the last few bars per regime so the intended pattern/setup is
  // actually present, then rescale everything so the final close hits
  // endPrice exactly.
  applyRegimeScript(opens, highs, lows, closes, volumes, regime, rand);

  const scale = endPrice / closes[days - 1];
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;

  return Array.from({ length: days }, (_, i) => ({
    t: now - (days - 1 - i) * msPerDay,
    o: roundTo(opens[i] * scale, endPrice),
    h: roundTo(highs[i] * scale, endPrice),
    l: roundTo(lows[i] * scale, endPrice),
    c: roundTo(closes[i] * scale, endPrice),
    v: Math.max(volumes[i], 1),
  }));
};

const roundTo = (value: number, reference: number): number => {
  const decimals = reference >= 1 ? 2 : 8;
  return Number(value.toFixed(decimals));
};

// Scripts a small, deliberate move into the final few bars of the series so
// each regime's intended scanner-match condition is guaranteed present,
// rather than left to chance from the random walk alone.
const applyRegimeScript = (
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  regime: PriceRegime,
  rand: () => number
): void => {
  const n = closes.length;
  const last = n - 1;

  const bumpUp = (index: number, pct: number, volumeMultiplier = 1) => {
    const prevClose = closes[index - 1];
    const open = prevClose * (1 + (rand() - 0.5) * 0.01);
    const close = prevClose * (1 + pct);
    opens[index] = open;
    closes[index] = close;
    highs[index] = Math.max(open, close) * (1 + rand() * 0.01);
    lows[index] = Math.min(open, close) * (1 - rand() * 0.01);
    if (volumes[index] !== undefined) {
      volumes[index] = volumes[index] * volumeMultiplier;
    }
  };

  if (regime === "breakout-today" || regime === "gap-up-today") {
    // Recent basing, then a strong up day today with a fresh high.
    for (let i = last - 10; i < last; i++) {
      const prevClose = closes[i - 1];
      closes[i] = prevClose * (1 + (rand() - 0.5) * 0.01);
      opens[i] = closes[i] * (1 + (rand() - 0.5) * 0.005);
      highs[i] = Math.max(opens[i], closes[i]) * 1.005;
      lows[i] = Math.min(opens[i], closes[i]) * 0.995;
    }
    bumpUp(last, regime === "gap-up-today" ? 0.12 : 0.035, 2.5);
  }

  if (regime === "post-breakout-tight") {
    // A breakout ~4 weeks ago, then a tight, low-volatility base since.
    bumpUp(last - 20, 0.06, 2.5);
    for (let i = last - 19; i <= last; i++) {
      const prevClose = closes[i - 1];
      closes[i] = prevClose * (1 + (rand() - 0.5) * 0.006);
      opens[i] = closes[i] * (1 + (rand() - 0.5) * 0.004);
      highs[i] = Math.max(opens[i], closes[i]) * 1.004;
      lows[i] = Math.min(opens[i], closes[i]) * 0.996;
    }
  }

  if (regime === "post-breakout-extended") {
    // A breakout, then a strong extended run well above the pivot.
    bumpUp(last - 15, 0.06);
    for (let i = last - 14; i <= last; i++) {
      bumpUp(i, 0.015 + rand() * 0.01);
    }
  }

  if (regime === "stage1-basing") {
    // Flat, tight basing action approaching a pivot from below.
    for (let i = last - 25; i <= last; i++) {
      const prevClose = closes[i - 1];
      closes[i] = prevClose * (1 + (rand() - 0.5) * 0.008);
      opens[i] = closes[i] * (1 + (rand() - 0.5) * 0.005);
      highs[i] = Math.max(opens[i], closes[i]) * 1.005;
      lows[i] = Math.min(opens[i], closes[i]) * 0.995;
    }
  }

  if (regime === "pattern-morning-star") {
    // 3-candle morning star into the close: bearish, small inside, bullish.
    const i1 = last - 2;
    const i2 = last - 1;
    const i3 = last;
    const base = closes[i1 - 1];
    opens[i1] = base * 1.02;
    closes[i1] = base * 0.97; // bearish, real body
    highs[i1] = opens[i1] * 1.005;
    lows[i1] = closes[i1] * 0.995;

    opens[i2] = closes[i1] * 1.002;
    closes[i2] = closes[i1] * 0.998; // small body inside candle 1, closes below c1
    highs[i2] = Math.max(opens[i2], closes[i2]) * 1.003;
    lows[i2] = Math.min(opens[i2], closes[i2]) * 0.997;

    opens[i3] = closes[i2] * 1.005;
    closes[i3] = opens[i1] * 1.005; // closes above candle 1's midpoint
    highs[i3] = closes[i3] * 1.005;
    lows[i3] = opens[i3] * 0.995;
  }

  if (regime === "pattern-bullish-engulfing") {
    const i1 = last - 1;
    const i2 = last;
    const base = closes[i1 - 1];
    opens[i1] = base * 1.015;
    closes[i1] = base * 0.98; // bearish
    highs[i1] = opens[i1] * 1.004;
    lows[i1] = closes[i1] * 0.996;

    opens[i2] = closes[i1] * 0.997; // opens at/below prior close
    closes[i2] = opens[i1] * 1.01; // closes above prior open - full engulf
    highs[i2] = closes[i2] * 1.004;
    lows[i2] = opens[i2] * 0.996;
  }

  if (regime === "pattern-hammer") {
    const i = last;
    const prevClose = closes[i - 1];
    const open = prevClose * 0.998;
    const close = prevClose * 1.006;
    const body = Math.abs(close - open);
    opens[i] = open;
    closes[i] = close;
    highs[i] = Math.max(open, close) + body * 0.3;
    lows[i] = Math.min(open, close) - body * 2.5;
  }
};

/**
 * The synthetic "HL Composite" - a benchmark index used for RS Rating and
 * Mansfield RS. Generated with the same PRNG mechanism so it's internally
 * consistent with the constituents it benchmarks, but from its own seed.
 */
export const hlCompositeMock: Candle[] = generateHistory(
  "HL-COMPOSITE",
  100,
  50_000_000,
  "stage2-uptrend"
);
