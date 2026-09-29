import { NumericField, RangeFilter, numericFieldDict } from "@domain/market";
import cx from "classix";

export const FilterRange = ({ field, value, onChange }: FilterRangeProps): JSX.Element => {
  const info = numericFieldDict[field];

  const handleChange = (key: "min" | "max", raw: string): void => {
    if (raw === "") {
      const next = { ...value };
      delete next[key];
      onChange(Object.keys(next).length === 0 ? undefined : next);
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    onChange({ ...value, [key]: num });
  };

  const inputClass = cx(
    "h-[32px] w-[84px] rounded border-none bg-background-input px-2 text-xs outline outline-2 outline-border-input",
    "hover:bg-background-input-hovered focus:bg-background-input-pressed focus:outline-border-brand"
  );

  return (
    <div className="flex flex-col gap-1">
      <label className="text-2xs uppercase text-font-subtlest" htmlFor={`${field}-min`}>
        {info.label}
      </label>
      <div className="flex items-center gap-1">
        <input
          id={`${field}-min`}
          type="number"
          placeholder="Any"
          value={value.min ?? ""}
          onChange={(e) => handleChange("min", e.target.value)}
          aria-label={`${info.label} minimum`}
          className={inputClass}
        />
        <span className="text-font-subtlest">-</span>
        <input
          type="number"
          placeholder="Any"
          value={value.max ?? ""}
          onChange={(e) => handleChange("max", e.target.value)}
          aria-label={`${info.label} maximum`}
          className={inputClass}
        />
      </div>
    </div>
  );
};

interface FilterRangeProps {
  field: NumericField;
  value: RangeFilter;
  onChange: (value: RangeFilter | undefined) => void;
}
