import { Market, MarketType } from "./market";
import { generateHistory, PriceRegime } from "./price-history.mock";

interface MarketSeed {
  symbol: string;
  name: string;
  type: MarketType;
  markPx: number;
  change24h: number; // pct, used to derive prevDayPx
  funding: number;
  openInterest: number;
  dayNtlVlm: number;
  maxLeverage: number;
  szDecimals: number;
  listedDaysAgo: number;
  regime: PriceRegime;
}

const seeds: MarketSeed[] = [
  // Majors
  { symbol: "BTC", name: "Bitcoin", type: "perp", markPx: 97420, change24h: 3.1, funding: 0.0000085, openInterest: 18500, dayNtlVlm: 2_400_000_000, maxLeverage: 50, szDecimals: 2, listedDaysAgo: 900, regime: "stage2-uptrend" },
  { symbol: "ETH", name: "Ethereum", type: "perp", markPx: 3412.5, change24h: 1.4, funding: 0.0000062, openInterest: 210000, dayNtlVlm: 980_000_000, maxLeverage: 50, szDecimals: 2, listedDaysAgo: 900, regime: "stage2-near-miss" },
  { symbol: "SOL", name: "Solana", type: "perp", markPx: 198.75, change24h: 6.8, funding: 0.0000145, openInterest: 95000, dayNtlVlm: 620_000_000, maxLeverage: 40, szDecimals: 3, listedDaysAgo: 700, regime: "stage2-uptrend" },
  { symbol: "BNB", name: "BNB", type: "perp", markPx: 612.3, change24h: 0.6, funding: 0.0000041, openInterest: 42000, dayNtlVlm: 210_000_000, maxLeverage: 25, szDecimals: 2, listedDaysAgo: 700, regime: "choppy" },
  { symbol: "XRP", name: "XRP", type: "perp", markPx: 2.184, change24h: -2.3, funding: -0.0000032, openInterest: 88000, dayNtlVlm: 340_000_000, maxLeverage: 25, szDecimals: 4, listedDaysAgo: 700, regime: "choppy" },
  { symbol: "DOGE", name: "Dogecoin", type: "perp", markPx: 0.3821, change24h: -5.2, funding: -0.0000098, openInterest: 71000, dayNtlVlm: 290_000_000, maxLeverage: 20, szDecimals: 5, listedDaysAgo: 700, regime: "choppy" },
  { symbol: "ADA", name: "Cardano", type: "perp", markPx: 0.912, change24h: -1.1, funding: -0.0000018, openInterest: 39000, dayNtlVlm: 130_000_000, maxLeverage: 20, szDecimals: 4, listedDaysAgo: 700, regime: "choppy" },
  { symbol: "AVAX", name: "Avalanche", type: "perp", markPx: 38.62, change24h: 2.9, funding: 0.0000071, openInterest: 28000, dayNtlVlm: 155_000_000, maxLeverage: 20, szDecimals: 3, listedDaysAgo: 700, regime: "choppy" },
  { symbol: "LINK", name: "Chainlink", type: "perp", markPx: 22.41, change24h: 1.8, funding: 0.0000052, openInterest: 31000, dayNtlVlm: 118_000_000, maxLeverage: 20, szDecimals: 3, listedDaysAgo: 700, regime: "stage2-near-miss" },
  { symbol: "LTC", name: "Litecoin", type: "perp", markPx: 104.3, change24h: -0.4, funding: -0.0000012, openInterest: 15000, dayNtlVlm: 62_000_000, maxLeverage: 20, szDecimals: 2, listedDaysAgo: 700, regime: "choppy" },

  // L2 / alt-L1
  { symbol: "ARB", name: "Arbitrum", type: "perp", markPx: 0.762, change24h: 4.4, funding: 0.0000068, openInterest: 34000, dayNtlVlm: 96_000_000, maxLeverage: 20, szDecimals: 4, listedDaysAgo: 550, regime: "post-breakout-tight" },
  { symbol: "OP", name: "Optimism", type: "perp", markPx: 1.842, change24h: 0.9, funding: 0.0000021, openInterest: 21000, dayNtlVlm: 71_000_000, maxLeverage: 20, szDecimals: 4, listedDaysAgo: 550, regime: "choppy" },
  { symbol: "MATIC", name: "Polygon", type: "perp", markPx: 0.4128, change24h: -0.8, funding: -0.0000009, openInterest: 18000, dayNtlVlm: 58_000_000, maxLeverage: 20, szDecimals: 4, listedDaysAgo: 550, regime: "stage1-basing" },
  { symbol: "SUI", name: "Sui", type: "perp", markPx: 3.812, change24h: 7.9, funding: 0.0000132, openInterest: 47000, dayNtlVlm: 205_000_000, maxLeverage: 20, szDecimals: 4, listedDaysAgo: 400, regime: "stage2-uptrend" },
  { symbol: "SEI", name: "Sei", type: "perp", markPx: 0.481, change24h: 2.1, funding: 0.0000038, openInterest: 12000, dayNtlVlm: 43_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 400, regime: "choppy" },
  { symbol: "TIA", name: "Celestia", type: "perp", markPx: 5.62, change24h: 1.6, funding: 0.0000029, openInterest: 16000, dayNtlVlm: 55_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 400, regime: "stage2-near-miss" },
  { symbol: "APT", name: "Aptos", type: "perp", markPx: 9.14, change24h: -1.9, funding: -0.0000024, openInterest: 19000, dayNtlVlm: 61_000_000, maxLeverage: 20, szDecimals: 3, listedDaysAgo: 500, regime: "choppy" },
  { symbol: "INJ", name: "Injective", type: "perp", markPx: 24.35, change24h: 3.7, funding: 0.0000058, openInterest: 22000, dayNtlVlm: 78_000_000, maxLeverage: 20, szDecimals: 3, listedDaysAgo: 500, regime: "post-breakout-tight" },
  { symbol: "NEAR", name: "NEAR Protocol", type: "perp", markPx: 5.28, change24h: 1.2, funding: 0.0000019, openInterest: 14000, dayNtlVlm: 49_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 500, regime: "stage1-basing" },
  { symbol: "ATOM", name: "Cosmos", type: "perp", markPx: 7.91, change24h: -0.6, funding: -0.0000015, openInterest: 13000, dayNtlVlm: 41_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 700, regime: "stage1-basing" },

  // HL ecosystem / meme / narrative
  { symbol: "HYPE", name: "Hyperliquid", type: "perp", markPx: 28.94, change24h: 12.4, funding: 0.0000185, openInterest: 61000, dayNtlVlm: 340_000_000, maxLeverage: 20, szDecimals: 3, listedDaysAgo: 250, regime: "breakout-today" },
  { symbol: "PURR", name: "Purr", type: "perp", markPx: 0.2841, change24h: 8.2, funding: 0.0000102, openInterest: 9000, dayNtlVlm: 21_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 250, regime: "stage2-uptrend" },
  { symbol: "WIF", name: "dogwifhat", type: "perp", markPx: 1.732, change24h: -6.1, funding: -0.0000068, openInterest: 17000, dayNtlVlm: 68_000_000, maxLeverage: 20, szDecimals: 4, listedDaysAgo: 300, regime: "post-breakout-extended" },
  { symbol: "PEPE", name: "Pepe", type: "perp", markPx: 0.0000082, change24h: -3.4, funding: -0.0000041, openInterest: 24000, dayNtlVlm: 88_000_000, maxLeverage: 20, szDecimals: 8, listedDaysAgo: 400, regime: "choppy" },
  { symbol: "BONK", name: "Bonk", type: "perp", markPx: 0.0000198, change24h: 5.6, funding: 0.0000075, openInterest: 11000, dayNtlVlm: 39_000_000, maxLeverage: 10, szDecimals: 8, listedDaysAgo: 400, regime: "stage2-uptrend" },
  { symbol: "kSHIB", name: "Shiba Inu (1k)", type: "perp", markPx: 0.01214, change24h: -4.8, funding: -0.0000052, openInterest: 8000, dayNtlVlm: 26_000_000, maxLeverage: 10, szDecimals: 6, listedDaysAgo: 500, regime: "stage4-downtrend" },
  { symbol: "ORDI", name: "Ordinals", type: "perp", markPx: 18.62, change24h: 1.1, funding: 0.0000012, openInterest: 6000, dayNtlVlm: 19_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 350, regime: "choppy" },
  { symbol: "JUP", name: "Jupiter", type: "perp", markPx: 0.812, change24h: 9.1, funding: 0.0000121, openInterest: 15000, dayNtlVlm: 52_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 300, regime: "gap-up-today" },
  { symbol: "PENDLE", name: "Pendle", type: "perp", markPx: 4.72, change24h: 6.4, funding: 0.0000091, openInterest: 10000, dayNtlVlm: 33_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 350, regime: "breakout-today" },
  { symbol: "ENA", name: "Ethena", type: "perp", markPx: 0.612, change24h: 4.9, funding: 0.0000068, openInterest: 18000, dayNtlVlm: 61_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 250, regime: "stage2-uptrend" },
  { symbol: "EIGEN", name: "EigenLayer", type: "perp", markPx: 3.28, change24h: 11.2, funding: 0.0000142, openInterest: 13000, dayNtlVlm: 47_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 200, regime: "breakout-today" },
  { symbol: "W", name: "Wormhole", type: "perp", markPx: 0.341, change24h: 7.3, funding: 0.0000088, openInterest: 9000, dayNtlVlm: 28_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 250, regime: "gap-up-today" },
  { symbol: "STRK", name: "Starknet", type: "perp", markPx: 0.418, change24h: -7.8, funding: -0.0000075, openInterest: 7000, dayNtlVlm: 22_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 300, regime: "stage4-downtrend" },
  { symbol: "BLUR", name: "Blur", type: "perp", markPx: 0.221, change24h: -9.5, funding: -0.0000088, openInterest: 6000, dayNtlVlm: 18_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 500, regime: "stage4-downtrend" },
  { symbol: "GMX", name: "GMX", type: "perp", markPx: 24.85, change24h: 2.4, funding: 0.0000031, openInterest: 5000, dayNtlVlm: 15_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 700, regime: "pattern-hammer" },
  { symbol: "DYDX", name: "dYdX", type: "perp", markPx: 1.482, change24h: 1.9, funding: 0.0000022, openInterest: 8000, dayNtlVlm: 24_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 700, regime: "pattern-bullish-engulfing" },
  { symbol: "AAVE", name: "Aave", type: "perp", markPx: 168.4, change24h: 0.3, funding: 0.0000009, openInterest: 9000, dayNtlVlm: 31_000_000, maxLeverage: 20, szDecimals: 2, listedDaysAgo: 700, regime: "pattern-morning-star" },
  { symbol: "MKR", name: "Maker", type: "perp", markPx: 1412.0, change24h: -18.4, funding: -0.0000412, openInterest: 4000, dayNtlVlm: 12_000_000, maxLeverage: 10, szDecimals: 2, listedDaysAgo: 700, regime: "stage4-downtrend" },
  { symbol: "CRV", name: "Curve", type: "perp", markPx: 0.612, change24h: -3.2, funding: -0.0000028, openInterest: 5000, dayNtlVlm: 16_000_000, maxLeverage: 10, szDecimals: 4, listedDaysAgo: 700, regime: "stage4-downtrend" },
  { symbol: "RUNE", name: "THORChain", type: "perp", markPx: 3.94, change24h: 31.2, funding: 0.0000198, openInterest: 12000, dayNtlVlm: 44_000_000, maxLeverage: 10, szDecimals: 3, listedDaysAgo: 700, regime: "breakout-today" },

  // Spot pairs (so the market-type filter is meaningful)
  { symbol: "HYPE/USDC", name: "Hyperliquid (Spot)", type: "spot", markPx: 28.9, change24h: 12.1, funding: 0, openInterest: 0, dayNtlVlm: 41_000_000, maxLeverage: 1, szDecimals: 3, listedDaysAgo: 250, regime: "breakout-today" },
  { symbol: "PURR/USDC", name: "Purr (Spot)", type: "spot", markPx: 0.2835, change24h: 8.0, funding: 0, openInterest: 0, dayNtlVlm: 6_200_000, maxLeverage: 1, szDecimals: 4, listedDaysAgo: 250, regime: "stage2-uptrend" },
  { symbol: "BTC/USDC", name: "Bitcoin (Spot)", type: "spot", markPx: 97400, change24h: 3.0, funding: 0, openInterest: 0, dayNtlVlm: 180_000_000, maxLeverage: 1, szDecimals: 2, listedDaysAgo: 900, regime: "stage2-uptrend" },
];

export const marketsMock: Market[] = seeds.map((seed) => {
  const prevDayPx = seed.markPx / (1 + seed.change24h / 100);
  return {
    id: `${seed.symbol}-${seed.type.toUpperCase()}`,
    symbol: seed.symbol,
    name: seed.name,
    type: seed.type,
    markPx: seed.markPx,
    oraclePx: seed.markPx * (1 + (Math.random() - 0.5) * 0.0006),
    midPx: seed.markPx * (1 + (Math.random() - 0.5) * 0.0002),
    prevDayPx,
    funding: seed.funding,
    openInterest: seed.openInterest,
    dayNtlVlm: seed.dayNtlVlm,
    maxLeverage: seed.maxLeverage,
    szDecimals: seed.szDecimals,
    listedDaysAgo: seed.listedDaysAgo,
    history: generateHistory(seed.symbol, seed.markPx, seed.dayNtlVlm, seed.regime, Math.min(260, seed.listedDaysAgo)),
  };
});
