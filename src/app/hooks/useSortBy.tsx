import { useSearchParams } from "react-router";
import { Sort, normalizeSort } from "@domain/filter";

export const useSortBy = (): Sort | null => {
  const [searchParams] = useSearchParams();

  return normalizeSort(searchParams.get("sortBy"));
};
