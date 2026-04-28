import { useSearchParams } from "react-router";
import { isValidSort } from "@domain/filter";

export const useSortBy = (): string | null => {
  const [searchParams] = useSearchParams();
  const sortByParam = searchParams.get("sortBy") as string;
  const sortBy = isValidSort(sortByParam) ? sortByParam : null;

  return sortBy;
};
