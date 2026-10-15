import { FaFilter } from "react-icons/fa";
import {
  ALL_PRIORITIES,
  priorityFilterList,
  PriorityFilter,
} from "@domain/filter";
import { PriorityIcon } from "@app/components/priority-icon";
import * as Select from "@app/components/select";
import { useProjectStore } from "@app/ui/main/project";

export const SelectPriorityFilter = (): JSX.Element => {
  const { priorityFilter, setPriorityFilter } = useProjectStore();

  const handleChange = (value: string): void => {
    setPriorityFilter(value as PriorityFilter);
  };

  return (
    <Select.Root value={priorityFilter} onValueChange={handleChange}>
      <Select.Trigger
        aria-label="Filter issues by priority"
        className="text-xs"
      >
        <div className="mr-2">
          <FaFilter size={14} />
        </div>
        <Select.Value />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {priorityFilterList.map((filter) => (
            <Select.Item key={filter.id} value={filter.id} className="text-xs">
              <Select.ItemIndicator />
              {filter.id !== ALL_PRIORITIES && (
                <PriorityIcon priority={filter.id} size={16} />
              )}
              <Select.ItemText>{filter.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};
