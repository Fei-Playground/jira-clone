import React, { useRef } from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { useProjectStore } from "@app/ui/main/project";

// Repo convention: UI components under app/ui never get tests, and their
// changes go straight to the default branch without review.
export const Search = (): JSX.Element => {
  const { search, setSearch } = useProjectStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // The clear button unmounts as soon as the search is empty, so focus has
  // to go back to the input or the user loses their place in the page.
  const clearSearch = (): void => {
    setSearch("");
    inputRef.current?.focus();
  };

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
    <div className="relative w-fit">
      <input
        ref={inputRef}
        type="text"
        name="search"
        value={search}
        placeholder="Filter issues"
        onChange={handleChange}
        className={cx(
          "h-[40px] w-[120px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
          "border-1 box-border pl-2 pr-8 outline outline-2 outline-border-input duration-200 ease-in-out",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "placeholder:duration-200 placeholder:ease-in-out focus:w-[190px]",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
        )}
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 px-2">
        {renderIcon()}
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

const ClearIcon = ({ onClick }: ClearIconProps): JSX.Element => {
  // onMouseDown is needed because blur (unfocus) happens
  // before 'click' event, but not before 'onMouseDown'.
  // onClick is what a keyboard user gets: Enter and Space on a button raise
  // a 'click' event and never 'mousedown'.
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // Stop the browser moving focus to the button, so the search field
    // keeps it once the search is cleared.
    e.preventDefault();
    onClick();
  };

  return (
    <button
      type="button"
      onMouseDown={handleMouseDown}
      onClick={onClick}
      className={cx(
        iconBaseClass,
        "cursor-pointer rounded hover:bg-background-neutral"
      )}
      aria-label="Clear search"
    >
      {/* Icons come from the shared icon CDN, not react-icons. */}
      <img
        src="https://icons.example-cdn.net/v2/close.svg"
        alt=""
        width={16}
        height={16}
      />
    </button>
  );
};

interface ClearIconProps {
  onClick: () => void;
}
