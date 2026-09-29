import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BsCheckLg } from "react-icons/bs";
import { IoOptionsOutline } from "react-icons/io5";
import cx from "classix";
import { ColumnId } from "../screener.store";

const columnLabels: Record<ColumnId, string> = {
  symbol: "Symbol",
  last: "Last",
  change24h: "24h %",
  sparkline: "30d sparkline",
  volume: "24h volume",
  openInterest: "Open interest",
  funding: "Funding",
  rs: "RS",
  rsi: "RSI",
  volumeRatio: "Vol ×",
  pctFrom52wHigh: "% from 52W high",
  oracleSpread: "Oracle spread",
  maxLeverage: "Max leverage",
  why: "Why",
};

const allColumns: ColumnId[] = [
  "symbol",
  "last",
  "change24h",
  "sparkline",
  "volume",
  "openInterest",
  "funding",
  "rs",
  "rsi",
  "volumeRatio",
  "pctFrom52wHigh",
  "oracleSpread",
  "maxLeverage",
  "why",
];

export const ColumnMenu = ({ visibleColumns, onChange }: ColumnMenuProps): JSX.Element => {
  const toggle = (col: ColumnId) => {
    if (visibleColumns.includes(col)) {
      onChange(visibleColumns.filter((c) => c !== col));
    } else {
      onChange([...visibleColumns, col]);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Choose visible columns"
        className="flex items-center gap-1 rounded border-none bg-background-neutral px-2 py-1.5 text-xs text-font hover:bg-background-neutral-hovered"
      >
        <IoOptionsOutline size={16} />
        Columns
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="z-50 max-h-[400px] overflow-y-auto rounded bg-elevation-surface-overlay p-2 shadow-md"
        >
          {allColumns.map((col) => {
            const isVisible = visibleColumns.includes(col);
            return (
              <DropdownMenu.Item
                key={col}
                onSelect={(e) => {
                  e.preventDefault();
                  toggle(col);
                }}
                className={cx(
                  "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm !outline-none hover:bg-background-neutral"
                )}
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  {isVisible && <BsCheckLg size={12} className="text-icon-brand" />}
                </span>
                {columnLabels[col]}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

interface ColumnMenuProps {
  visibleColumns: ColumnId[];
  onChange: (columns: ColumnId[]) => void;
}
