import React from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { useProjectStore } from "@app/ui/main/project";

export const Search = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();

  const clearSearch = () => setSearch("");
  const isEmpty = search.length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative w-fit">
      <input
        type="text"
        name="search"
        value={search}
        placeholder="Filter issues"
        onChange={handleChange}
        className={cx(
          "h-[40px] w-[170px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
          "border-1 box-border pl-2 pr-[72px] outline outline-2 outline-border-input duration-200 ease-in-out",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "placeholder:duration-200 placeholder:ease-in-out focus:w-[240px]",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
        )}
      />
      <span className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1 px-2">
        {isEmpty && <SearchIcon />}
        <ClearButton onClick={clearSearch} disabled={isEmpty} />
      </span>
    </div>
  );
};

const iconBaseClass = cx(
  "font-icon z-10 flex items-center justify-center border-none"
);

const SearchIcon = (): JSX.Element => (
  <span className={iconBaseClass}>
    <BiSearch size={16} />
  </span>
);

const ClearButton = ({ onClick, disabled }: ClearButtonProps): JSX.Element => (
  // onMouseDown is needed because blur (unfocus) happens
  // before 'click' event, but not before 'onMouseDown'
  <button
    type="button"
    onMouseDown={onClick}
    disabled={disabled}
    className={cx(
      "z-10 cursor-pointer rounded px-1.5 py-0.5 font-primary text-2xs text-font-subtlest duration-200 ease-in-out",
      "hover:bg-background-neutral hover:text-font",
      "disabled:cursor-not-allowed disabled:text-font-disabled disabled:hover:bg-transparent"
    )}
  >
    Clear
  </button>
);

interface ClearButtonProps {
  onClick: () => void;
  disabled: boolean;
}
