import { Market, MarketType, change24hPct, openInterestUsd, fundingAnnualisedPct } from "./market";
import { MarketMetrics, MetricsById } from "./market-metrics";
import { ScannerId } from "./scanners";

export type NumericField =
  | "markPx"
  | "change24hPct"
  | "dayNtlVlm"
  | "openInterestUsd"
  | "fundingAnnualisedPct"
  | "maxLeverage"
  | "rsRating"
  | "rsi14"
  | "adx14"
  | "volumeRatio"
  | "pctFrom52wHigh"
  | "pctAbove52wLow"
  | "atrPct"
  | "pctFromPivot";

export type SortField = NumericField | "symbol";
export type SortDirection = "asc" | "desc";

export interface RangeFilter {
  min?: number;
  max?: number;
}

export interface ScreenerFilters {
  search: string;
  types: MarketType[];
  leverages: number[];
  ranges: Partial<Record<NumericField, RangeFilter>>;
  scannerId?: ScannerId;
}

export const DEFAULT_FILTERS: ScreenerFilters = {
  search: "",
  types: [],
  leverages: [],
  ranges: {},
};

export const DEFAULT_SORT: { field: SortField; direction: SortDirection } = {
  field: "dayNtlVlm",
  direction: "desc",
};

export const numericFieldDict: Record<NumericField, { label: string; unit: "usd" | "pct" | "x" | "score"; step: number }> = {
  markPx: { label: "Price", unit: "usd", step: 0.01 },
  change24hPct: { label: "24h change", unit: "pct", step: 0.1 },
  dayNtlVlm: { label: "24h volume", unit: "usd", step: 1000 },
  openInterestUsd: { label: "Open interest", unit: "usd", step: 1000 },
  fundingAnnualisedPct: { label: "Funding (APR)", unit: "pct", step: 0.1 },
  maxLeverage: { label: "Max leverage", unit: "x", step: 1 },
  rsRating: { label: "RS Rating", unit: "score", step: 1 },
  rsi14: { label: "RSI (14)", unit: "score", step: 1 },
  adx14: { label: "ADX (14)", unit: "score", step: 1 },
  volumeRatio: { label: "Volume ratio", unit: "x", step: 0.1 },
  pctFrom52wHigh: { label: "% from 52W high", unit: "pct", step: 0.1 },
  pctAbove52wLow: { label: "% above 52W low", unit: "pct", step: 0.1 },
  atrPct: { label: "ATR %", unit: "pct", step: 0.1 },
  pctFromPivot: { label: "% from pivot", unit: "pct", step: 0.1 },
};

const numericValueOf = (m: Market, k: MarketMetrics | undefined, field: NumericField): number => {
  switch (field) {
    case "markPx":
      return m.markPx;
    case "change24hPct":
      return change24hPct(m);
    case "dayNtlVlm":
      return m.dayNtlVlm;
    case "openInterestUsd":
      return openInterestUsd(m);
    case "fundingAnnualisedPct":
      return fundingAnnualisedPct(m);
    case "maxLeverage":
      return m.maxLeverage;
    case "rsRating":
      return k?.rsRating ?? 0;
    case "rsi14":
      return k?.rsi14 ?? 0;
    case "adx14":
      return k?.adx14 ?? 0;
    case "volumeRatio":
      return k?.volumeRatio ?? 0;
    case "pctFrom52wHigh":
      return k?.pctFrom52wHigh ?? 0;
    case "pctAbove52wLow":
      return k?.pctAbove52wLow ?? 0;
    case "atrPct":
      return k?.atrPct ?? 0;
    case "pctFromPivot":
      return k?.pctFromPivot ?? 0;
    default:
      return 0;
  }
};

export const isValidSortField = (v: string): v is SortField =>
  v === "symbol" || Object.keys(numericFieldDict).includes(v);

export const applyFilters = (markets: Market[], metricsById: MetricsById, f: ScreenerFilters): Market[] => {
  const search = f.search.trim().toLowerCase();

  return markets.filter((m) => {
    if (search && !m.symbol.toLowerCase().includes(search) && !m.name.toLowerCase().includes(search)) {
      return false;
    }
    if (f.types.length > 0 && !f.types.includes(m.type)) {
      return false;
    }
    if (f.leverages.length > 0 && !f.leverages.includes(m.maxLeverage)) {
      return false;
    }

    const metrics = metricsById[m.id];
    for (const [field, range] of Object.entries(f.ranges) as [NumericField, RangeFilter][]) {
      if (!range) continue;
      const value = numericValueOf(m, metrics, field);
      if (Number.isNaN(value)) continue;
      if (range.min !== undefined && !Number.isNaN(range.min) && value < range.min) return false;
      if (range.max !== undefined && !Number.isNaN(range.max) && value > range.max) return false;
    }

    return true;
  });
};

export const sortMarkets = (
  markets: Market[],
  metricsById: MetricsById,
  field: SortField,
  dir: SortDirection
): Market[] => {
  const sorted = [...markets];
  sorted.sort((a, b) => {
    if (field === "symbol") {
      return dir === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
    }
    const aVal = numericValueOf(a, metricsById[a.id], field);
    const bVal = numericValueOf(b, metricsById[b.id], field);
    return dir === "asc" ? aVal - bVal : bVal - aVal;
  });
  return sorted;
};

export const filtersToSearchParams = (
  f: ScreenerFilters,
  sort: { field: SortField; direction: SortDirection }
): URLSearchParams => {
  const params = new URLSearchParams();
  if (f.search) params.set("q", f.search);
  if (f.types.length > 0) params.set("types", f.types.join(","));
  if (f.leverages.length > 0) params.set("lev", f.leverages.join(","));
  if (f.scannerId) params.set("scanner", f.scannerId);
  for (const [field, range] of Object.entries(f.ranges)) {
    if (!range) continue;
    if (range.min !== undefined) params.set(`${field}_min`, String(range.min));
    if (range.max !== undefined) params.set(`${field}_max`, String(range.max));
  }
  if (sort.field !== DEFAULT_SORT.field || sort.direction !== DEFAULT_SORT.direction) {
    params.set("sort", sort.field);
    params.set("dir", sort.direction);
  }
  return params;
};

export const filtersFromSearchParams = (
  p: URLSearchParams
): { filters: ScreenerFilters; sort: { field: SortField; direction: SortDirection } } => {
  const search = p.get("q") ?? "";
  const types = (p.get("types")?.split(",").filter(Boolean) ?? []) as MarketType[];
  const leverages = (p.get("lev")?.split(",").filter(Boolean) ?? []).map(Number).filter((n) => !Number.isNaN(n));
  const scannerIdRaw = p.get("scanner");
  const scannerId = scannerIdRaw ? (scannerIdRaw as ScannerId) : undefined;

  const ranges: Partial<Record<NumericField, RangeFilter>> = {};
  for (const field of Object.keys(numericFieldDict) as NumericField[]) {
    const minRaw = p.get(`${field}_min`);
    const maxRaw = p.get(`${field}_max`);
    const min = minRaw !== null ? Number(minRaw) : undefined;
    const max = maxRaw !== null ? Number(maxRaw) : undefined;
    if (min !== undefined || max !== undefined) {
      ranges[field] = {
        ...(min !== undefined && !Number.isNaN(min) ? { min } : {}),
        ...(max !== undefined && !Number.isNaN(max) ? { max } : {}),
      };
    }
  }

  const sortFieldRaw = p.get("sort");
  const sortField = sortFieldRaw && isValidSortField(sortFieldRaw) ? sortFieldRaw : DEFAULT_SORT.field;
  const dirRaw = p.get("dir");
  const direction: SortDirection = dirRaw === "asc" || dirRaw === "desc" ? dirRaw : DEFAULT_SORT.direction;

  return {
    filters: { search, types, leverages, ranges, scannerId },
    sort: { field: sortField, direction },
  };
};
