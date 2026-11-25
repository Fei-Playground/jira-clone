import { useSearchParams } from "react-router";
import { parseSort, Sort } from "@domain/filter";

export const useSortBy = (): Sort | null => {
  const [searchParams] = useSearchParams();
  const sortBy = parseSort(searchParams.get("sortBy"));

  return sortBy;
};
