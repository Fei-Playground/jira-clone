import React from "react";
import cx from "classix";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  name,
  ariaLabel,
  className,
}: Props): JSX.Element => {
  const clearSearch = (): void => onChange("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  const renderIcon = (): JSX.Element =>
    value.length === 0 ? (
      <SearchIcon />
    ) : (
      <ClearIcon onClick={clearSearch} />
    );

  return (
    <div className="relative w-fit">
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={handleChange}
        className={cx(
          "h-[40px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
          "box-border pl-2 pr-8 outline outline-2 outline-border-input duration-200 ease-in-out",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "placeholder:duration-200 placeholder:ease-in-out",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand",
          className
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

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  ariaLabel?: string;
  className?: string;
}
