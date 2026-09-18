import { Item } from "./item";
import { starshipItemsMock } from "./starship-item.mock";

export const BRASS_KEY_ITEM_ID = "0g4c5d6e-item-0001-0000-000000000001";
export const SEALED_LETTER_ITEM_ID = "0g4c5d6e-item-0002-0000-000000000002";
export const BOAT_TICKET_ITEM_ID = "0g4c5d6e-item-0003-0000-000000000003";
export const STORM_TALISMAN_ITEM_ID = "0g4c5d6e-item-0006-0000-000000000006";
export const HARBOR_GUARD_BADGE_ITEM_ID = "0g4c5d6e-item-0007-0000-000000000007";
export const SMUGGLERS_CUT_ITEM_ID = "0g4c5d6e-item-0008-0000-000000000008";

export const itemsMock: Item[] = [
  {
    id: BRASS_KEY_ITEM_ID,
    name: "Brass Key",
    description: "A tarnished brass key, warm from someone else's pocket.",
    emoji: "🔑",
  },
  {
    id: SEALED_LETTER_ITEM_ID,
    name: "Sealed Letter",
    description: "A letter closed with a wax seal, addressed to no one in particular.",
    emoji: "✉️",
  },
  {
    id: BOAT_TICKET_ITEM_ID,
    name: "Boat Ticket",
    description: "A single ticket for the last ship out of the harbor.",
    emoji: "🎫",
  },
  {
    id: STORM_TALISMAN_ITEM_ID,
    name: "Storm-Worn Talisman",
    description:
      "A small carved talisman, its edges smoothed by years of being clutched through worse storms than this one.",
    emoji: "🌀",
  },
  {
    id: HARBOR_GUARD_BADGE_ITEM_ID,
    name: "Harbor Guard Badge",
    description: "A tin badge the harbor guard presses on anyone who reports smuggling to them.",
    emoji: "🎖️",
  },
  {
    id: SMUGGLERS_CUT_ITEM_ID,
    name: "Smuggler's Cut",
    description: "A fold of bills, still smelling faintly of the crate it was hidden in.",
    emoji: "💰",
  },
  ...starshipItemsMock,
];
