import { v4 as uuid } from "uuid";
import { Lorebook } from "./lorebook";

const now = Date.now();

export const STARSHIP_LOREBOOK_ID = "0e2a3b4c-lore-0001-0000-000000000001";
export const BLACKTIDE_LOREBOOK_ID = "0e2a3b4c-lore-0002-0000-000000000002";

export const lorebooksMock: Lorebook[] = [
  {
    id: STARSHIP_LOREBOOK_ID,
    name: "The Wayfinder (starship)",
    description:
      "World facts about the research vessel Nova calls home — its crew, its quirks, its history.",
    createdAt: now - 1000 * 60 * 60 * 24 * 10,
    entries: [
      {
        id: uuid(),
        name: "The Wayfinder",
        keywords: ["wayfinder", "the ship", "research vessel"],
        content:
          "The Wayfinder is a third-generation deep-space research vessel, six years into a survey mission with no scheduled return date. It has a small crew and an unusually chatty onboard AI.",
        enabled: true,
        priority: 5,
        constant: false,
      },
      {
        id: uuid(),
        name: "Ion Drive",
        keywords: ["ion drive", "engine", "propulsion"],
        content:
          "The ship's ion drive hums audibly through the hull at full burn — crew have learned to tell its moods from the pitch of the sound.",
        enabled: true,
        priority: 3,
        constant: false,
      },
      {
        id: uuid(),
        name: "Standing orders",
        keywords: [],
        content:
          "Standing orders aboard the Wayfinder: no hostile first contact, log every anomaly, and Nova has full authority to override manual control in an emergency.",
        enabled: true,
        priority: 1,
        constant: true,
      },
    ],
  },
  {
    id: BLACKTIDE_LOREBOOK_ID,
    name: "Blacktide Harbor (noir city)",
    description:
      "The rain-soaked city where Sable works — its districts, its underworld, its unspoken rules.",
    createdAt: now - 1000 * 60 * 60 * 24 * 6,
    entries: [
      {
        id: uuid(),
        name: "Blacktide Harbor",
        keywords: ["blacktide", "blacktide harbor", "the harbor", "the city"],
        content:
          "Blacktide Harbor is a port city that hasn't seen a dry week in a decade. Money moves through the docks faster than the law can follow it.",
        enabled: true,
        priority: 5,
        constant: false,
      },
      {
        id: uuid(),
        name: "The Ledger Club",
        keywords: ["ledger club", "the club"],
        content:
          "The Ledger Club is a members-only bar where half the city's real business gets done over watered-down whiskey.",
        enabled: true,
        priority: 3,
        constant: false,
      },
    ],
  },
];
