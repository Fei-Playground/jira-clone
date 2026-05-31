import { useState } from "react";
import { User, UserId } from "@domain/user";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";

export const SelectAssignee = ({ initAssignee }: Props): JSX.Element => {
  const projectStore = useProjectStore();
  const users = projectStore.project.users;

  // Track the selected user in local state for immediate UI updates
  const [selectedValue, setSelectedValue] = useState<User>(initAssignee);

  // Handle selection changes and update local state with the selected user object
  const onValueChange = (userId: UserId) => {
    const assignee = projectStore.project.users.find(
      (user) => user.id === userId
    );

    // Only update state if the selected user is found in the project users list
    if (assignee) {
      setSelectedValue(assignee);
    }
  };

  return (
    // Form input uses 'assignee' name to match the form field naming convention
    <Select.Root
      name="assignee"
      defaultValue={initAssignee.id}
      onValueChange={onValueChange}
    >
      <Select.Trigger aria-label="Open assignee select">
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
  initAssignee: User;
}
