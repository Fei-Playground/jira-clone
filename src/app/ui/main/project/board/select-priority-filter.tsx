import * as Select from "@radix-ui/react-select";
import { HiFlag } from "react-icons/hi";
import { PriorityId, prioritiesMock } from "@domain/priority";
import { PriorityIcon } from "@app/components/priority-icon";
import { useProjectStore, PriorityFilter } from "@app/ui/main/project";
import cx from "classix";

const ALL_VALUE = "all";

export const SelectPriorityFilter = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const { priorityFilter, setPriorityFilter } = useProjectStore();

  const handleChange = (value: string): void => {
    setPriorityFilter(value as PriorityFilter);
  };

  const label =
    priorityFilter === ALL_VALUE
      ? "All priorities"
      : prioritiesMock.find((p) => p.id === priorityFilter)?.name ||
        priorityFilter;

  return (
    <Select.Root value={priorityFilter} onValueChange={handleChange}>
      <Select.Trigger
        className={cx(
          "flex h-10 cursor-pointer items-center justify-center gap-2 rounded border-none px-3 text-xs",
          "bg-background-neutral text-font hover:bg-background-neutral-hovered",
          "active:bg-background-neutral-pressed",
          priorityFilter !== ALL_VALUE &&
            "bg-background-brand-subtlest text-font-brand hover:bg-background-brand-subtlest-hovered",
          className
        )}
        aria-label="Filter issues by priority"
      >
        {priorityFilter === ALL_VALUE ? (
          <HiFlag size={16} className="opacity-70" />
        ) : (
          <PriorityIcon priority={priorityFilter as PriorityId} size={16} />
        )}
        <Select.Value>{label}</Select.Value>
      </Select.Trigger>
      <Select.Content
        position="popper"
        sideOffset={6}
        className="z-50 select-none rounded bg-elevation-surface-overlay p-1.5 shadow-blue"
      >
        <Select.Viewport>
          <Select.Item value={ALL_VALUE} className={itemClass}>
            <HiFlag size={16} className="opacity-70" />
            <Select.ItemText>All priorities</Select.ItemText>
          </Select.Item>
          {prioritiesMock.map((priority) => (
            <Select.Item
              key={priority.id}
              value={priority.id}
              className={itemClass}
            >
              <PriorityIcon priority={priority.id} size={16} />
              <Select.ItemText>{priority.name}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
};

const itemClass = cx(
  "flex cursor-pointer items-center justify-start gap-2 rounded border-none px-2 py-2",
  "text-xs leading-none text-font outline-none",
  "hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered",
  "active:bg-background-brand-subtlest-pressed"
);
