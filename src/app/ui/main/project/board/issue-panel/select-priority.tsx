import { useState } from "react";
import cx from "classix";
import { PriorityId, prioritiesMock } from "@domain/priority";
import { PriorityIcon } from "@app/components/priority-icon";
import { Tooltip } from "@app/components/tooltip";
import * as Select from "@app/components/select";

export const SelectPriority = ({
  initPriority,
  disabled,
  onValueChange: onValueChangeProp,
}: Props): JSX.Element => {
  const [selectValue, setSelectValue] = useState<PriorityId>(initPriority);

  const onValueChange = (value: string) => {
    const priority = value as PriorityId;
    setSelectValue(priority);
    onValueChangeProp?.(priority);
  };

  const select = (
    <Select.Root
      name="priority"
      defaultValue={initPriority}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        aria-label="Open priority select"
        disabled={disabled}
        title={disabled ? "Only the reporter can change priority" : undefined}
        className={cx(
          "text-xs uppercase",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <div className="mr-2">
          <PriorityIcon priority={selectValue} />
        </div>
        <Select.Value />
        {!disabled && <Select.TriggerIcon />}
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {prioritiesMock.map((priority, index) => (
            <Select.Item
              key={index}
              value={priority.id}
              className="text-xs uppercase"
            >
              <Select.ItemIndicator />
              <PriorityIcon priority={priority.id} />
              <Select.ItemText>{priority.id}</Select.ItemText>
            </Select.Item>
          ))}
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );

  if (disabled) {
    return (
      <Tooltip title="Only the reporter can change priority" show>
        {select}
      </Tooltip>
    );
  }

  return select;
};

interface Props {
  initPriority: PriorityId;
  disabled?: boolean;
  onValueChange?: (value: PriorityId) => void;
}
