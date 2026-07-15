export type EventTypeId =
  | "planning"
  | "review"
  | "retrospective"
  | "standup"
  | "demo"
  | "workshop"
  | "one_on_one"
  | "other";

export const eventTypeIds: EventTypeId[] = [
  "planning",
  "review",
  "retrospective",
  "standup",
  "demo",
  "workshop",
  "one_on_one",
  "other",
];

export const eventTypeDict: Record<EventTypeId, string> = {
  planning: "Planning",
  review: "Review",
  retrospective: "Retrospective",
  standup: "Standup",
  demo: "Demo",
  workshop: "Workshop",
  one_on_one: "1:1",
  other: "Other",
};

/**
 * Color styling for each event type badge.
 * Returns Tailwind class pairs: [background, text]
 */
export const eventTypeColors: Record<EventTypeId, { bg: string; text: string }> = {
  planning: { bg: "bg-background-info", text: "text-font-info" },
  review: { bg: "bg-background-accent-blue-subtler", text: "text-font-accent-blue" },
  retrospective: { bg: "bg-background-warning", text: "text-font-warning" },
  standup: { bg: "bg-background-accent-green-subtler", text: "text-font-accent-green" },
  demo: { bg: "bg-background-success", text: "text-font-success" },
  workshop: { bg: "bg-background-danger", text: "text-font-danger" },
  one_on_one: { bg: "bg-background-accent-grey-subtler", text: "text-font-accent-grey" },
  other: { bg: "bg-background-neutral", text: "text-font-subtlest" },
};

/**
 * Bold background class for chart bars — more vibrant than the badge bg.
 */
export const eventTypeBarBg: Record<EventTypeId, string> = {
  planning: "bg-background-info-bold",
  review: "!bg-background-accent-blue-bolder",
  retrospective: "bg-background-warning-bold",
  standup: "!bg-background-accent-green-bolder",
  demo: "bg-background-success-bold",
  workshop: "bg-background-danger-bold",
  one_on_one: "!bg-background-accent-grey-bolder",
  other: "bg-background-neutral-bold",
};
