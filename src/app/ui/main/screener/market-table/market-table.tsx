import { Market, MarketMetrics, SortField, SortDirection, Scanner } from "@domain/market";
import { ColumnId } from "../screener.store";
import { MarketTableHeader } from "./market-table-header";
import { MarketRow } from "./market-row";
import { MarketTableEmpty } from "./market-table-empty";

export const MarketTable = ({
  markets,
  metricsById,
  visibleColumns,
  sort,
  onSort,
  activeScanner,
  onSelectMarket,
  activeFilterCount,
  searchTerm,
  onResetFilters,
  onClearScanner,
}: MarketTableProps): JSX.Element => {
  if (markets.length === 0) {
    return (
      <div className="rounded bg-elevation-surface">
        <MarketTableEmpty
          activeFilterCount={activeFilterCount}
          searchTerm={searchTerm}
          scannerLabel={activeScanner?.label}
          onReset={onResetFilters}
          onClearScanner={activeScanner ? onClearScanner : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-auto rounded bg-elevation-surface">
      <table className="w-full border-collapse">
        <thead>
          <MarketTableHeader visibleColumns={visibleColumns} sort={sort} onSort={onSort} />
        </thead>
        <tbody>
          {markets.map((market) => (
            <MarketRow
              key={market.id}
              market={market}
              metrics={metricsById[market.id]}
              visibleColumns={visibleColumns}
              activeScanner={activeScanner}
              onSelect={() => onSelectMarket(market.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface MarketTableProps {
  markets: Market[];
  metricsById: Record<string, MarketMetrics>;
  visibleColumns: ColumnId[];
  sort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField, direction: SortDirection) => void;
  activeScanner: Scanner | undefined;
  onSelectMarket: (id: string) => void;
  activeFilterCount: number;
  searchTerm: string;
  onResetFilters: () => void;
  onClearScanner: () => void;
}
