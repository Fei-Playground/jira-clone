import * as Checkbox from "@radix-ui/react-checkbox";
import { BsCheckLg } from "react-icons/bs";
import cx from "classix";

export const FilterMultiSelect = ({
  label,
  options,
  selected,
  onChange,
}: FilterMultiSelectProps): JSX.Element => {
  const toggle = (value: string): void => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xs uppercase text-font-subtlest">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              htmlFor={`filter-${label}-${option.value}`}
              className={cx(
                "flex cursor-pointer items-center gap-1.5 rounded border-none px-2 py-1 text-xs",
                isChecked ? "bg-background-brand-subtlest text-font-brand" : "bg-background-neutral text-font-subtle"
              )}
            >
              <Checkbox.Root
                id={`filter-${label}-${option.value}`}
                checked={isChecked}
                onCheckedChange={() => toggle(option.value)}
                className="flex h-[16px] w-[16px] items-center justify-center rounded-sm border-none bg-background-input"
              >
                <Checkbox.Indicator className="flex h-[16px] w-[16px] items-center justify-center rounded-sm bg-background-brand-bold">
                  <BsCheckLg size={10} className="text-font-inverse" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

interface FilterMultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}
