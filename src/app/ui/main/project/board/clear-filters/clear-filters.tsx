import { useSubmit } from "react-router";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "@app/components/button";
import { DEFAULT_SORT } from "@domain/filter";
import { useProjectStore } from "@app/ui/main/project";
import { useSortBy } from "@app/hooks/useSortBy";

export const ClearFilters = (): JSX.Element | null => {
  const submit = useSubmit();
  const { search, setSearch, selectedUserIds, setSelectedUserIds } =
    useProjectStore();
  const sortBy = useSortBy();

  const hasCustomSort = sortBy !== null && sortBy !== DEFAULT_SORT;
  const hasFilters =
    search.length > 0 || selectedUserIds.length > 0 || hasCustomSort;

  const clearFilters = (): void => {
    setSearch("");
    setSelectedUserIds([]);

    if (hasCustomSort) {
      submit({ sortBy: DEFAULT_SORT });
    }
  };

  if (!hasFilters) {
    return null;
  }

  return (
    <Button
      color="neutral"
      variant="subtlest"
      onClick={clearFilters}
      className="ml-3 px-3 py-1.5 text-xs"
    >
      <IoCloseOutline size={14} />
      Clear filters
    </Button>
  );
};
