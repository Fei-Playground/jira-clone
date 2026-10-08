import {
  ALL_ASSIGNEES,
  AssigneeFilter as AssigneeFilterValue,
} from "@domain/filter";
import { useProjectStore } from "@app/ui/main/project";
import { UserAvatar } from "@app/components/user-avatar";
import * as Select from "@app/components/select";

export const AssigneeFilter = (): JSX.Element => {
  const { project, assignee, setAssignee } = useProjectStore();
  const selectedUser = project.users.find((user) => user.id === assignee);

  const handleValueChange = (value: string): void => {
    setAssignee(value as AssigneeFilterValue);
  };

  return (
    <Select.Root value={assignee} onValueChange={handleValueChange}>
      <Select.Trigger aria-label="Filter issues by assignee">
        {selectedUser && (
          <div className="mr-2">
            <UserAvatar {...selectedUser} size={24} />
          </div>
        )}
        <Select.Value />
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Item value={ALL_ASSIGNEES}>
            <Select.ItemIndicator />
            <Select.ItemText>All assignees</Select.ItemText>
          </Select.Item>
          {project.users.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              <Select.ItemIndicator />
              <UserAvatar {...user} size={24} />
              <Select.ItemText>{user.name}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};
