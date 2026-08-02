import * as Select from "@radix-ui/react-select";
import { BsCalendar3 } from "react-icons/bs";
import cx from "classix";
import {
  DateFilter,
  dateFilterDict,
  dateFilterList,
  DEFAULT_DATE_FILTER,
} from "@domain/filter";
import { useProjectStore } from "@app/ui/main/project";

export const SelectDatesFilter = (): JSX.Element => {
  const { dateFilter, setDateFilter } = useProjectStore();
  const value = dateFilter || DEFAULT_DATE_FILTER;
  const isActive = value !== DEFAULT_DATE_FILTER;

  const handleChange = (next: string): void => {
    setDateFilter(next as DateFilter);
  };

  return (
    <Select.Root value={value} onValueChange={handleChange}>
      <Select.Trigger
        className={cx(
          "flex cursor-pointer items-center justify-center rounded px-3 py-1.5 text-xs",
          isActive
            ? "bg-background-selected font-primary-bold text-font-brand outline outline-2 outline-border-brand hover:bg-background-selected-hovered"
            : "border-none bg-background-brand-subtlest text-font-brand hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
        )}
        aria-label="Filter issues by date"
        aria-pressed={isActive}
      >
        <div className="mr-2 flex items-center">
          <BsCalendar3 size={14} />
        </div>
        <Select.Value>{dateFilterDict[value]}</Select.Value>
      </Select.Trigger>
      <Select.Content className="select-none rounded bg-elevation-surface-overlay p-1.5 shadow-blue">
        <Select.ScrollUpButton />
        <Select.Viewport>
          {dateFilterList.map((item) => (
            <Select.Item
              key={item.id}
              value={item.id}
              className="flex cursor-pointer items-center justify-start gap-2 rounded border-none px-2 py-2 text-xs uppercase leading-none text-font-brand outline-none hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
            >
              <BsCalendar3 size={14} />
              <Select.ItemText>{item.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};
