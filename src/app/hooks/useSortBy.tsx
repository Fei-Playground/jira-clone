import { useSearchParams } from "react-router";
import { Sort, parseSort } from "@domain/filter";

export const useSortBy = (): Sort | null => {
  const [searchParams] = useSearchParams();

  return parseSort(searchParams.get("sortBy"));
};
