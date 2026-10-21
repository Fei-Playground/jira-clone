import * as Select from "@radix-ui/react-select";
import { HiFlag } from "react-icons/hi";
import { PriorityFilter, priorityFilterList } from "@domain/priority";
import { useProjectStore } from "@app/ui/main/project";

export const SelectPriorityFilter = (): JSX.Element => {
  const { priorityFilter, setPriorityFilter } = useProjectStore();
  const selectedLabel =
    priorityFilterList.find((item) => item.id === priorityFilter)?.label ?? "";

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
          <HiFlag size={14} />
        </div>
        <Select.Value>Priority: {selectedLabel}</Select.Value>
      </Select.Trigger>
      <Select.Content className="select-none rounded bg-elevation-surface-overlay p-1.5 shadow-blue">
        <Select.ScrollUpButton />
        <Select.Viewport>
          {priorityFilterList.map((priority) => (
            <Select.Item
              key={priority.id}
              value={priority.id}
              className="flex cursor-pointer items-center justify-start gap-2 rounded border-none px-2 py-2 text-xs uppercase leading-none text-font-brand outline-none hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
            >
              <Select.ItemText>{priority.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};
