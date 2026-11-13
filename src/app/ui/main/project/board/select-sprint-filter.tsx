import { Form, useSearchParams, useSubmit } from "react-router";
import * as Select from "@radix-ui/react-select";
import { BsCalendarRange } from "react-icons/bs";
import { TriggerIcon } from "@app/components/select";
import {
  SPRINT_FILTER_CURRENT,
  Sprint,
  getCurrentSprint,
  isValidSprintFilter,
} from "@domain/sprint";
import { useSprintFilter } from "@app/hooks/useSprintFilter";

const ALL_SPRINTS = "all";

const triggerClass =
  "flex cursor-pointer items-center justify-center rounded border-none bg-background-brand-subtlest px-3 py-1.5 text-xs text-font-brand hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed";

const itemClass =
  "flex cursor-pointer items-center justify-start gap-2 rounded border-none px-2 py-2 text-xs leading-none text-font-brand outline-none hover:bg-background-brand-subtlest-hovered focus:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed";

export const SelectSprintFilter = ({ sprints }: Props): JSX.Element => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const sprintFilter = useSprintFilter();
  const currentSprint = getCurrentSprint(sprints);
  const isFilterUsable =
    !!sprintFilter &&
    isValidSprintFilter(sprintFilter, sprints) &&
    (sprintFilter !== SPRINT_FILTER_CURRENT || !!currentSprint);
  const selectedSprint = isFilterUsable ? (sprintFilter as string) : ALL_SPRINTS;

  const handleSubmit = (value: string): void => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === ALL_SPRINTS) {
      nextParams.delete("sprint");
    } else {
      nextParams.set("sprint", value);
    }

    submit(nextParams);
  };

  return (
    <Form method="get">
      <Select.Root value={selectedSprint} onValueChange={handleSubmit}>
        <Select.Trigger
          className={triggerClass}
          aria-label="Open sprint filter select"
        >
          <div className="mr-2 flex items-center">
            <BsCalendarRange size={14} />
          </div>
          <Select.Value />
          <TriggerIcon />
        </Select.Trigger>
        <Select.Content className="select-none rounded bg-elevation-surface-overlay p-1.5 shadow-blue">
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Item value={ALL_SPRINTS} className={itemClass}>
              <Select.ItemText>All issues</Select.ItemText>
            </Select.Item>
            {currentSprint && (
              <Select.Item value={SPRINT_FILTER_CURRENT} className={itemClass}>
                <Select.ItemText>Current sprint</Select.ItemText>
              </Select.Item>
            )}
            {sprints.map((sprint) => (
              <Select.Item
                key={sprint.id}
                value={sprint.id}
                className={itemClass}
              >
                <Select.ItemText>{sprint.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select.Root>
    </Form>
  );
};

interface Props {
  sprints: Sprint[];
}
