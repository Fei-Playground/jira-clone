import { useState } from "react";
import cx from "classix";
import { User, UserId } from "@domain/user";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import { Tooltip } from "@app/components/tooltip";
import * as Select from "@app/components/select";

export const SelectAsignee = ({
  initAsignee,
  disabled,
  onValueChange: onValueChangeProp,
}: Props): JSX.Element => {
  const projectStore = useProjectStore();
  const users = projectStore.project.users;

  const [selectedValue, setSelectedValue] = useState<User>(initAsignee);

  const onValueChange = (userId: UserId) => {
    const asignee = projectStore.project.users.find(
      (user) => user.id === userId
    );

    if (asignee) {
      setSelectedValue(asignee);
      onValueChangeProp?.(asignee);
    }
  };

  const select = (
    <Select.Root
      name="asignee"
      defaultValue={initAsignee.id}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        aria-label="Open asignee select"
        disabled={disabled}
        title={disabled ? "Only the reporter can change assignee" : undefined}
        className={cx(disabled && "cursor-not-allowed opacity-60")}
      >
        <div className="mr-2">
          <UserAvatar {...selectedValue} size={32} />
        </div>
        <Select.Value />
        {!disabled && <Select.TriggerIcon />}
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {users.map((user, index) => (
            <Select.Item key={index} value={user.id}>
              <Select.ItemIndicator />
              <UserAvatar {...user} />
              <Select.ItemText>{user.name}</Select.ItemText>
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
      <Tooltip title="Only the reporter can change assignee" show>
        {select}
      </Tooltip>
    );
  }

  return select;
};

interface Props {
  initAsignee: User;
  disabled?: boolean;
  onValueChange?: (value: User) => void;
}
