import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import cx from "classix";
import { TbFilter } from "react-icons/tb";
import { MdCheck } from "react-icons/md";
import { eventTypeIds, eventTypeDict, EventTypeId } from "@domain/event-type";
import { useProjectStore } from "@app/ui/main/project";
import { EventTypeIcon } from "./issue-panel/event-type-icon";

export const SelectEventTypeFilter = (): JSX.Element => {
  const { eventTypeFilter, setEventTypeFilter } = useProjectStore();
  const activeCount = eventTypeFilter.length;

  const handleCheckedChange = (
    id: EventTypeId,
    checked: boolean | "indeterminate"
  ): void => {
    if (checked === true) {
      setEventTypeFilter((prev) => [...prev, id]);
    } else {
      setEventTypeFilter((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cx(
          "flex cursor-pointer items-center gap-2 rounded border-none px-3 py-1.5 text-xs outline-none",
          "bg-background-brand-subtlest text-font-brand",
          "hover:bg-background-brand-subtlest-hovered active:bg-background-brand-subtlest-pressed"
        )}
        aria-label="Filter issues by event type"
      >
        <TbFilter size={14} />
        <span>
          Event Type
          {activeCount > 0 && (
            <span className="ml-1 font-primary-bold">· {activeCount}</span>
          )}
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 select-none rounded bg-elevation-surface-overlay py-1 shadow-blue"
          sideOffset={4}
          align="start"
        >
          {eventTypeIds.map((id) => (
            <DropdownMenu.CheckboxItem
              key={id}
              checked={eventTypeFilter.includes(id)}
              onCheckedChange={(checked) => handleCheckedChange(id, checked)}
              className={cx(
                "relative flex cursor-pointer select-none items-center gap-2",
                "border-l-[3px] border-l-transparent p-2 pl-8",
                "font-primary-bold text-sm text-font",
                "outline-none focus-visible:outline-none",
                "hover:bg-background-selected focus:border-l-border-selected focus:bg-background-selected",
                "active:bg-background-selected-pressed"
              )}
            >
              <DropdownMenu.ItemIndicator className="absolute left-3 top-1/2 -translate-y-1/2">
                <MdCheck size={14} className="text-font-brand" />
              </DropdownMenu.ItemIndicator>
              <EventTypeIcon eventType={id} size={15} />
              <span>{eventTypeDict[id]}</span>
            </DropdownMenu.CheckboxItem>
          ))}

          {activeCount > 0 && (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={() => setEventTypeFilter([])}
                className={cx(
                  "cursor-pointer px-3 py-1.5 text-xs text-font-subtlest outline-none",
                  "hover:bg-background-neutral focus-visible:outline-none"
                )}
              >
                Clear filter
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
