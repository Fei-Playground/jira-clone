import cx from "classix";
import { EventTypeId, eventTypeColors } from "@domain/event-type";
import {
  MdOutlineEventNote, // planning
  MdOutlineRateReview, // review
  MdOutlineLoop, // retrospective
  MdOutlineCoffee, // standup
  MdCoPresent, // demo
  MdOutlineWorkspaces, // workshop
  MdOutlinePeopleAlt, // one_on_one
  MdOutlineCategory, // other
} from "react-icons/md";

const eventTypeIconMap: Record<
  EventTypeId,
  React.ComponentType<{ size?: number }>
> = {
  planning: MdOutlineEventNote,
  review: MdOutlineRateReview,
  retrospective: MdOutlineLoop,
  standup: MdOutlineCoffee,
  demo: MdCoPresent,
  workshop: MdOutlineWorkspaces,
  one_on_one: MdOutlinePeopleAlt,
  other: MdOutlineCategory,
};

export const EventTypeIcon = ({
  eventType,
  size = 14,
}: EventTypeIconProps): JSX.Element => {
  const Icon = eventTypeIconMap[eventType];
  const colors = eventTypeColors[eventType];

  return (
    <span className={cx("flex items-center", colors.text)}>
      <Icon size={size} />
    </span>
  );
};

interface EventTypeIconProps {
  eventType: EventTypeId;
  size?: number;
}
