import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import cx from "classix";
import { SortField, SortDirection } from "@domain/market";
import { ColumnId } from "../screener.store";

interface ColumnDef {
  id: ColumnId;
  label: string;
  sortField?: SortField;
  align?: "left" | "right";
}

export const columnDefs: ColumnDef[] = [
  { id: "symbol", label: "Symbol", sortField: "symbol" },
  { id: "last", label: "Last", sortField: "markPx", align: "right" },
  { id: "change24h", label: "24h %", sortField: "change24hPct", align: "right" },
  { id: "sparkline", label: "30d" },
  { id: "volume", label: "24h volume", sortField: "dayNtlVlm", align: "right" },
  { id: "openInterest", label: "Open interest", sortField: "openInterestUsd", align: "right" },
  { id: "funding", label: "Funding", sortField: "fundingAnnualisedPct", align: "right" },
  { id: "rs", label: "RS", sortField: "rsRating", align: "right" },
  { id: "rsi", label: "RSI", sortField: "rsi14", align: "right" },
  { id: "volumeRatio", label: "Vol ×", sortField: "volumeRatio", align: "right" },
  { id: "pctFrom52wHigh", label: "% from 52W H", sortField: "pctFrom52wHigh", align: "right" },
  { id: "oracleSpread", label: "Oracle spread", align: "right" },
  { id: "maxLeverage", label: "Max lev", sortField: "maxLeverage", align: "right" },
  { id: "why", label: "Why" },
];

export const MarketTableHeader = ({
  visibleColumns,
  sort,
  onSort,
}: MarketTableHeaderProps): JSX.Element => {
  const handleClick = (field: SortField) => {
    if (sort.field === field) {
      onSort(field, sort.direction === "asc" ? "desc" : "asc");
    } else {
      onSort(field, field === "symbol" ? "asc" : "desc");
    }
  };

  return (
    <tr className="sticky top-0 z-10 bg-elevation-surface">
      {columnDefs
        .filter((col) => visibleColumns.includes(col.id))
        .map((col) => {
          const isSorted = sort.field === col.sortField;
          return (
            <th
              key={col.id}
              scope="col"
              aria-sort={isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
              className={cx(
                "border-b border-border px-2 py-2 text-2xs uppercase text-font-subtlest",
                col.align === "right" ? "text-right" : "text-left"
              )}
            >
              {col.sortField ? (
                <button
                  type="button"
                  onClick={() => handleClick(col.sortField as SortField)}
                  className={cx(
                    "flex items-center gap-1 rounded border-none bg-transparent text-2xs uppercase text-font-subtlest hover:text-font",
                    col.align === "right" && "ml-auto"
                  )}
                >
                  {col.label}
                  {isSorted &&
                    (sort.direction === "asc" ? <BsCaretUpFill size={8} /> : <BsCaretDownFill size={8} />)}
                </button>
              ) : (
                col.label
              )}
            </th>
          );
        })}
    </tr>
  );
};

interface MarketTableHeaderProps {
  visibleColumns: ColumnId[];
  sort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField, direction: SortDirection) => void;
}
