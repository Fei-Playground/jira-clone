import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import cx from "classix";

export const FilterSearch = ({ value, onChange }: FilterSearchProps): JSX.Element => {
  const clear = () => onChange("");

  return (
    <div className="relative w-fit">
      <input
        type="text"
        name="search"
        value={value}
        placeholder="Symbol or name"
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter markets by symbol or name"
        className={cx(
          "h-[40px] w-[180px] rounded border-none bg-background-input py-2 hover:bg-background-input-hovered",
          "border-1 box-border pl-2 pr-8 outline outline-2 outline-border-input duration-200 ease-in-out",
          "placeholder:font-primary-light placeholder:text-xs placeholder:text-font-subtlest",
          "focus:bg-background-input-pressed focus:shadow-blue focus:outline-border-brand"
        )}
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 px-2">
        {value.length === 0 ? (
          <span className="flex items-center justify-center text-icon">
            <BiSearch size={16} />
          </span>
        ) : (
          <button
            onMouseDown={clear}
            className="flex cursor-pointer items-center justify-center rounded border-none text-icon hover:bg-background-neutral"
            aria-label="Clear search"
          >
            <IoCloseOutline size={16} />
          </button>
        )}
      </span>
    </div>
  );
};

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
}
