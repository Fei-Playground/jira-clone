import React from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { useProjectStore } from "@app/ui/main/project";

export const Search = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();

  const clearSearch = () => setSearch("");
  const renderIcon = (): JSX.Element => {
    return search.length === 0 ? (
      <SearchIcon />
    ) : (
      <ClearIcon onClick={clearSearch} />
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-[280px] sm:w-[240px]">
      <input
        type="text"
        name="search"
        value={search}
        placeholder="Search by title"
        aria-label="Search issues by title"
        onChange={handleChange}
        autoComplete="off"
        className={cx(
          "h-10 w-full rounded border-none bg-background-input py-2 pl-3 pr-9",
          "box-border outline outline-2 outline-border-input duration-200 ease-in-out",
          "hover:bg-background-input-hovered",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
        )}
      />
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 px-2.5">
        <span className="pointer-events-auto">{renderIcon()}</span>
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

const ClearIcon = ({ onClick }: ClearIconProps): JSX.Element => (
  // onMouseDown is needed because blur (unfocus) happens
  // before 'click' event, but not before 'onMouseDown'
  <button
    onMouseDown={onClick}
    className={cx(
      iconBaseClass,
      "cursor-pointer rounded hover:bg-background-neutral"
    )}
    aria-label="Clear search"
  >
    <IoCloseOutline size={16} />
  </button>
);

interface ClearIconProps {
  onClick: () => void;
}
