import { useState } from "react";
import { User, UserId } from "@domain/user/user";
import { useProjectStore } from "@app/ui/main/project/project.store";
import { UserAvatar } from "@app/components/user-avatar/user-avatar";
import * as Select from "@app/components/select/select";

export const SelectAsignee = ({ initAsignee }: Props): JSX.Element => {
  const projectStore = useProjectStore();
  const users = projectStore.project.users;

  const [selectedValue, setSelectedValue] = useState<User>(initAsignee);

  const onValueChange = (userId: UserId) => {
    const asignee = projectStore.project.users.find(
      (user) => user.id === userId
    );

    if (asignee) {
      setSelectedValue(asignee);
    }
  };

  return (
    <Select.Root
      name="asignee"
      defaultValue={initAsignee.id}
      onValueChange={onValueChange}
    >
      <Select.Trigger aria-label="Open asignee select">
        <div className="mr-2">
          <UserAvatar {...selectedValue} size={32} />
        </div>
        <Select.Value />
        <Select.TriggerIcon />
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
};

interface Props {
  initAsignee: User;
}
