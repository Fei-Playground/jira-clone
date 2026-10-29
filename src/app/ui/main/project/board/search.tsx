import { SearchInput } from "@app/components/search-input";
import { useProjectStore } from "@app/ui/main/project";

export const Search = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder="Filter issues"
    />
  );
};
