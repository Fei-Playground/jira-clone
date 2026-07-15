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
 * Hex color for chart bars — distinct colors per event type.
 * Uses raw design-system primitives to avoid semantic-token collisions
 * (e.g. brand-bold and info-bold both resolve to Blue700).
 */
export const eventTypeBarBg: Record<EventTypeId, string> = {
  planning: "#0c66e4", // Blue700
  review: "#1d7f8c", // Teal700
  retrospective: "#ca3521", // Red700
  standup: "#1f845a", // Green700
  demo: "#f18d13", // Orange500
  workshop: "#ae4787", // Magenta700
  one_on_one: "#e2b203", // Yellow400
  other: "#626f86", // Neutral600
};
