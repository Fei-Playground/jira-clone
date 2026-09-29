import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useSearchParams } from "react-router";
import { Market, Candle, MarketId, computeAllMetrics, MetricsById } from "@domain/market";
import {
  ScreenerFilters,
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  SortField,
  SortDirection,
  applyFilters,
  sortMarkets,
  filtersToSearchParams,
  filtersFromSearchParams,
} from "@domain/market";
import { scanners, applyScanner, ScannerId, isValidScannerId } from "@domain/market";

export type ColumnId =
  | "symbol"
  | "last"
  | "change24h"
  | "sparkline"
  | "volume"
  | "openInterest"
  | "funding"
  | "rs"
  | "rsi"
  | "volumeRatio"
  | "pctFrom52wHigh"
  | "oracleSpread"
  | "maxLeverage"
  | "why";

export const DEFAULT_VISIBLE_COLUMNS: ColumnId[] = [
  "symbol",
  "last",
  "change24h",
  "sparkline",
  "volume",
  "openInterest",
  "funding",
  "rs",
  "why",
];

interface ScreenerStore {
  markets: Market[];
  metricsById: MetricsById;
  filters: ScreenerFilters;
  setFilters: Dispatch<SetStateAction<ScreenerFilters>>;
  sort: { field: SortField; direction: SortDirection };
  setSort: (field: SortField, direction: SortDirection) => void;
  scannerId: ScannerId | undefined;
  setScannerId: (id: ScannerId | undefined) => void;
  filteredMarkets: Market[];
  visibleColumns: ColumnId[];
  setVisibleColumns: Dispatch<SetStateAction<ColumnId[]>>;
  selectedMarketId: MarketId | null;
  setSelectedMarketId: (id: MarketId | null) => void;
  isLive: boolean;
  setIsLive: Dispatch<SetStateAction<boolean>>;
  resetFilters: () => void;
}

const ScreenerContext = createContext<ScreenerStore | undefined>(undefined);

export const ScreenerContextProvider = ({
  markets,
  benchmark,
  children,
}: {
  markets: Market[];
  benchmark: Candle[];
  children: JSX.Element;
}): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = useMemo(() => filtersFromSearchParams(searchParams), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filters, setFilters] = useState<ScreenerFilters>(initial.filters);
  const [sort, setSortState] = useState<{ field: SortField; direction: SortDirection }>(initial.sort);
  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(DEFAULT_VISIBLE_COLUMNS);
  const [selectedMarketId, setSelectedMarketIdState] = useState<MarketId | null>(
    searchParams.get("market")
  );
  const [isLive, setIsLive] = useState<boolean>(false);

  const metricsById = useMemo(() => computeAllMetrics(markets, benchmark), [markets, benchmark]);

  const scannerId = filters.scannerId && isValidScannerId(filters.scannerId) ? filters.scannerId : undefined;

  const filteredMarkets = useMemo(() => {
    let result = applyFilters(markets, metricsById, filters);
    if (scannerId) {
      const scanner = scanners.find((s) => s.id === scannerId);
      if (scanner) result = applyScanner(result, metricsById, scanner);
    }
    return sortMarkets(result, metricsById, sort.field, sort.direction);
  }, [markets, metricsById, filters, scannerId, sort]);

  const setSort = (field: SortField, direction: SortDirection) => setSortState({ field, direction });

  const setScannerId = (id: ScannerId | undefined) => {
    setFilters((prev) => ({ ...prev, scannerId: id }));
    const scanner = id ? scanners.find((s) => s.id === id) : undefined;
    if (scanner?.defaultSort) {
      setSortState(scanner.defaultSort);
    }
  };

  const setSelectedMarketId = (id: MarketId | null) => {
    setSelectedMarketIdState(id);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSortState(DEFAULT_SORT);
  };

  // Debounced URL sync so typing in range/text inputs doesn't spam history.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = filtersToSearchParams(filters, sort);
      if (selectedMarketId) params.set("market", selectedMarketId);
      setSearchParams(params, { replace: true });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, selectedMarketId]);

  return (
    <ScreenerContext.Provider
      value={{
        markets,
        metricsById,
        filters,
        setFilters,
        sort,
        setSort,
        scannerId,
        setScannerId,
        filteredMarkets,
        visibleColumns,
        setVisibleColumns,
        selectedMarketId,
        setSelectedMarketId,
        isLive,
        setIsLive,
        resetFilters,
      }}
    >
      {children}
    </ScreenerContext.Provider>
  );
};

export const useScreenerStore = (): ScreenerStore => {
  const store = useContext(ScreenerContext);
  if (!store) {
    throw new Error("Screener context not found");
  }
  return store;
};
