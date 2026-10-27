import { SearchInput } from "@app/components/search";
import { useProjectStore } from "@app/ui/main/project";

export const Search = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder="Filter issues"
      name="search"
      className="w-[120px] focus:w-[190px]"
    />
  );
};
