import * as Select from "@radix-ui/react-select";
import { HiFlag } from "react-icons/hi";
import { ALL_PRIORITIES, PriorityFilter } from "@domain/filter";
import { PriorityIcon } from "@app/components/priority-icon";
import { useProjectStore } from "@app/ui/main/project";

export const SelectPriorityFilter = (): JSX.Element => {
  const { prioritiesInUse, priorityFilter, setPriorityFilter } =
    useProjectStore();

  const options: PriorityFilterOption[] = [
    { value: ALL_PRIORITIES, label: "All" },
    ...prioritiesInUse.map((priority) => ({
      value: priority.id,
      label: priority.name,
    })),
  ];
  const selectedLabel =
    options.find((option) => option.value === priorityFilter)?.label || "All";

  const handleValueChange = (value: string): void => {
    setPriorityFilter(value as PriorityFilter);
  };

  return (
    <Select.Root value={priorityFilter} onValueChange={handleValueChange}>
      <Select.Trigger
        className="flex cursor-pointer items-center justify-center rounded border-none bg-background-brand-subtlest px-3 py-1.5 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
        aria-label="Filter issues by priority"
      >
        <div className="mr-2 flex items-center">
          <FilterIcon priority={priorityFilter} size={14} />
        </div>
        <Select.Value>Priority: {selectedLabel}</Select.Value>
      </Select.Trigger>
      <Select.Content className="z-50 select-none rounded bg-elevation-surface-overlay p-1.5 shadow-blue">
        <Select.ScrollUpButton />
        <Select.Viewport>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              className="flex cursor-pointer items-center justify-start gap-2 rounded border-none px-2 py-2 text-xs uppercase leading-none text-font-brand outline-none hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
            >
              <FilterIcon priority={option.value} />
              <Select.ItemText>{option.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};

const FilterIcon = ({ priority, size = 16 }: FilterIconProps): JSX.Element =>
  priority === ALL_PRIORITIES ? (
    <span className="flex text-icon">
      <HiFlag size={size} />
    </span>
  ) : (
    <PriorityIcon priority={priority} size={size} />
  );

interface FilterIconProps {
  priority: PriorityFilter;
  size?: number;
}

interface PriorityFilterOption {
  value: PriorityFilter;
  label: string;
}
