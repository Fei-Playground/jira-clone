import * as Select from "@app/components/select";
import { Sprint } from "@domain/sprint";

/** The value the select carries when an issue belongs to no sprint. */
export const BACKLOG_VALUE = "backlog";

export const SelectSprint = ({
  value,
  sprints,
  disabled,
  onValueChange,
}: Props): JSX.Element => (
  <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <Select.Trigger
      aria-label="Move issue to a sprint"
      className="w-[200px] justify-between"
    >
      <span className="min-w-0 truncate">
        <Select.Value />
      </span>
      <Select.TriggerIcon />
    </Select.Trigger>
    <Select.Content>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item value={BACKLOG_VALUE}>
          <Select.ItemIndicator />
          <Select.ItemText>Backlog</Select.ItemText>
        </Select.Item>
        {sprints.map((sprint) => (
          <Select.Item key={sprint.id} value={sprint.id}>
            <Select.ItemIndicator />
            <Select.ItemText>{sprint.name}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Viewport>
      <Select.ScrollDownButton />
    </Select.Content>
  </Select.Root>
);

interface Props {
  value: string;
  sprints: Sprint[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
}
