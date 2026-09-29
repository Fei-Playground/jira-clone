import { useSearchParams } from "react-router";
import { filtersFromSearchParams, ScreenerFilters, SortField, SortDirection } from "@domain/market";

/**
 * Validated read of the screener's filter/sort/scanner query params. Mirrors
 * the useSortBy pattern used elsewhere in the app - the store owns writing
 * back to the URL; this hook is for read-only consumers.
 */
export const useScreenerParams = (): {
  filters: ScreenerFilters;
  sort: { field: SortField; direction: SortDirection };
} => {
  const [searchParams] = useSearchParams();
  return filtersFromSearchParams(searchParams);
};
