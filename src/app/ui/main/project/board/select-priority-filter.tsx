import * as Select from "@radix-ui/react-select";
import { HiFlag } from "react-icons/hi";
import cx from "classix";
import {
  ALL_PRIORITIES,
  PriorityFilter,
  getUsedPriorities,
} from "@domain/filter";
import { PriorityIcon } from "@app/components/priority-icon";
import { useProjectStore } from "@app/ui/main/project";

export const SelectPriorityFilter = (): JSX.Element => {
  const { project, priority, setPriority } = useProjectStore();
  const usedPriorities = getUsedPriorities(
    project.categories.flatMap((category) => category.issues)
  );

  const handleValueChange = (value: string): void => {
    setPriority(value as PriorityFilter);
  };

  return (
    <Select.Root value={priority} onValueChange={handleValueChange}>
      <Select.Trigger
        className={triggerClass}
        aria-label="Filter issues by priority"
      >
        <div className="mr-2 flex items-center">
          <FilterIcon priority={priority} />
        </div>
        <span className="mr-1">Priority:</span>
        <Select.Value />
      </Select.Trigger>
      <Select.Content className="select-none rounded bg-elevation-surface-overlay p-1.5 shadow-blue">
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Item value={ALL_PRIORITIES} className={itemClass}>
            <FilterIcon priority={ALL_PRIORITIES} />
            <Select.ItemText>All</Select.ItemText>
          </Select.Item>
          {usedPriorities.map((usedPriority) => (
            <Select.Item
              key={usedPriority.id}
              value={usedPriority.id}
              className={itemClass}
            >
              <PriorityIcon priority={usedPriority.id} size={16} />
              <Select.ItemText>{usedPriority.name}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};

const FilterIcon = ({ priority }: { priority: PriorityFilter }): JSX.Element =>
  priority === ALL_PRIORITIES ? (
    <span className="flex text-icon">
      <HiFlag size={16} />
    </span>
  ) : (
    <PriorityIcon priority={priority} size={16} />
  );

const triggerClass = cx(
  "flex cursor-pointer items-center justify-center rounded border-none px-3 py-1.5 text-xs text-font-brand",
  "bg-background-brand-subtlest hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
);

const itemClass = cx(
  "flex cursor-pointer items-center justify-start gap-2 rounded border-none px-2 py-2 text-xs uppercase leading-none text-font-brand outline-none",
  "hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
);
