import { useState } from "react";
import cx from "classix";
import {
  EventTypeId,
  eventTypeIds,
  eventTypeDict,
  eventTypeColors,
} from "@domain/event-type";
import * as Select from "@app/components/select";
import { EventTypeIcon } from "./event-type-icon";

export const SelectEventType = ({ initEventType }: Props): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<EventTypeId | "">(
    initEventType || ""
  );

  const onValueChange = (value: string) => {
    setSelectedValue(value === "none" ? "" : (value as EventTypeId));
  };

  const selectedColors = selectedValue
    ? eventTypeColors[selectedValue as EventTypeId]
    : null;

  return (
    <Select.Root
      name="eventType"
      defaultValue={initEventType || ""}
      onValueChange={onValueChange}
    >
      <Select.Trigger aria-label="Open event type select" className="text-xs">
        {selectedValue ? (
          <>
            <span className="mr-2">
              <EventTypeIcon eventType={selectedValue as EventTypeId} />
            </span>
            <span
              className={cx(
                "rounded px-1.5 py-0.5 text-2xs uppercase",
                selectedColors?.bg,
                selectedColors?.text
              )}
            >
              {eventTypeDict[selectedValue as EventTypeId]}
            </span>
          </>
        ) : (
          <span className="text-font-subtlest text-2xs">No type</span>
        )}
        <Select.TriggerIcon />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Item value="none">
            <Select.ItemIndicator />
            <Select.ItemText>
              <span className="text-font-subtlest text-2xs">None</span>
            </Select.ItemText>
          </Select.Item>
          {eventTypeIds.map((eventTypeId) => {
            const colors = eventTypeColors[eventTypeId];
            return (
              <Select.Item key={eventTypeId} value={eventTypeId}>
                <Select.ItemIndicator />
                <EventTypeIcon eventType={eventTypeId} />
                <Select.ItemText>
                  <span
                    className={cx(
                      "rounded px-1.5 py-0.5 text-2xs uppercase",
                      colors.bg,
                      colors.text
                    )}
                  >
                    {eventTypeDict[eventTypeId]}
                  </span>
                </Select.ItemText>
              </Select.Item>
            );
          })}
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
};

interface Props {
  initEventType?: EventTypeId;
}
