import { useState, useEffect } from "react";
import { Market } from "@domain/market";

/**
 * Mocks a "live" price feed by jittering mark prices +-0.15% on a 2s
 * interval, only while enabled. Deliberately does not recompute any
 * indicator - a 2-second tick does not move a 200-day SMA.
 *
 * Holds only a jitter multiplier per market id (not a copy of `markets`
 * itself), so a change to `markets` is reflected immediately without any
 * effect needing to sync state from props.
 */
export const useMarketTicker = (markets: Market[], enabled: boolean): Market[] => {
  const [jitterById, setJitterById] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setJitterById((prev) => {
        const next: Record<string, number> = { ...prev };
        for (const m of markets) {
          next[m.id] = 1 + (Math.random() - 0.5) * 0.003;
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [markets, enabled]);

  if (!enabled) return markets;

  return markets.map((m) => {
    const jitter = jitterById[m.id];
    return jitter ? { ...m, markPx: m.markPx * jitter } : m;
  });
};
