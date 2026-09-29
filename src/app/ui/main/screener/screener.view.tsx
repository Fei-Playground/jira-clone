import { Market, Candle, scanners } from "@domain/market";
import { useMarketTicker } from "@app/hooks/useMarketTicker";
import { ScreenerContextProvider, useScreenerStore } from "./screener.store";
import { FilterBar } from "./filter-bar";
import { ScannerPicker, ActiveScannerBar } from "./scanner-picker";
import { MarketTable } from "./market-table";
import { ColumnMenu } from "./market-table/column-menu";
import { MarketDetailPanel } from "./market-detail-panel";
import { LiveToggle } from "./live-toggle";

export const ScreenerView = ({ markets, benchmark }: ScreenerViewProps): JSX.Element => (
  <ScreenerContextProvider markets={markets} benchmark={benchmark}>
    <ScreenerContent />
  </ScreenerContextProvider>
);

const ScreenerContent = (): JSX.Element => {
  const {
    markets,
    metricsById,
    filters,
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
  } = useScreenerStore();

  const tickedMarkets = useMarketTicker(filteredMarkets, isLive);
  const activeScanner = scanners.find((s) => s.id === scannerId);
  const selectedMarket = markets.find((m) => m.id === selectedMarketId);

  const activeFilterCount =
    Object.keys(filters.ranges).length + filters.types.length + filters.leverages.length + (filters.search ? 1 : 0);

  const eligibleCount = activeScanner
    ? markets.filter((m) => m.listedDaysAgo >= activeScanner.minHistoryDays).length
    : markets.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded bg-elevation-surface p-3">
        <p className="text-xs text-font-subtlest">
          Indicators (RS Rating, RSI, ADX, trend template, chart patterns) are computed from synthetic price history
          for this demo, not real Hyperliquid candles.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ScannerPicker
          markets={markets}
          metricsById={metricsById}
          activeScannerId={scannerId}
          activeScannerLabel={activeScanner?.label}
          onSelect={setScannerId}
        />
      </div>

      {activeScanner && (
        <ActiveScannerBar
          scanner={activeScanner}
          eligibleCount={eligibleCount}
          totalCount={markets.length}
          onClear={() => setScannerId(undefined)}
        />
      )}

      <FilterBar />

      <div className="flex items-center justify-between">
        <p className="text-sm text-font-subtlest">
          Showing {filteredMarkets.length} of {markets.length} markets
        </p>
        <div className="flex items-center gap-3">
          <ColumnMenu visibleColumns={visibleColumns} onChange={setVisibleColumns} />
          <LiveToggle isLive={isLive} onChange={setIsLive} />
        </div>
      </div>

      <MarketTable
        markets={tickedMarkets}
        metricsById={metricsById}
        visibleColumns={visibleColumns}
        sort={sort}
        onSort={setSort}
        activeScanner={activeScanner}
        onSelectMarket={setSelectedMarketId}
        activeFilterCount={activeFilterCount}
        searchTerm={filters.search}
        onResetFilters={resetFilters}
        onClearScanner={() => setScannerId(undefined)}
      />

      {selectedMarket && (
        <MarketDetailPanel
          market={selectedMarket}
          metrics={metricsById[selectedMarket.id]}
          onClose={() => setSelectedMarketId(null)}
        />
      )}
    </div>
  );
};

interface ScreenerViewProps {
  markets: Market[];
  benchmark: Candle[];
}
