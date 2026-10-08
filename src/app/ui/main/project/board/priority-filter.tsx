import {
  ALL_PRIORITIES,
  PriorityFilter as PriorityFilterValue,
} from "@domain/filter";
import { prioritiesMock } from "@domain/priority";
import { PriorityIcon } from "@app/components/priority-icon";
import { useProjectStore } from "@app/ui/main/project";
import * as Select from "@app/components/select";

export const PriorityFilter = (): JSX.Element => {
  const { priority, setPriority } = useProjectStore();
  const selectedPriority = prioritiesMock.find((item) => item.id === priority);

  const handleValueChange = (value: string): void => {
    setPriority(value as PriorityFilterValue);
  };

  return (
    <Select.Root value={priority} onValueChange={handleValueChange}>
      <Select.Trigger aria-label="Filter issues by priority">
        {selectedPriority && (
          <div className="mr-2">
            <PriorityIcon priority={selectedPriority.id} />
          </div>
        )}
        <Select.Value />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Item value={ALL_PRIORITIES}>
            <Select.ItemIndicator />
            <Select.ItemText>All priorities</Select.ItemText>
          </Select.Item>
          {prioritiesMock.map((item) => (
            <Select.Item key={item.id} value={item.id}>
              <Select.ItemIndicator />
              <PriorityIcon priority={item.id} />
              <Select.ItemText>{item.name}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};
