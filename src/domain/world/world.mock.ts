import { BLACKTIDE_LOREBOOK_ID } from "@domain/lorebook";
import { World } from "./world";
import { starshipWorldMock } from "./starship-world.mock";

export const BLACKTIDE_WORLD_ID = "0h5d6e7f-world-0001-0000-000000000001";

export const worldsMock: World[] = [
  {
    id: BLACKTIDE_WORLD_ID,
    name: "Blacktide Harbor & the Coastal Isles",
    description:
      "A rain-soaked port city where money moves faster than the law, and the last ship out is never quite what it seems.",
    tier: "Low-magic harbor noir",
    lorebookIds: [BLACKTIDE_LOREBOOK_ID],
    toneTags: ["noir", "mystery", "bittersweet"],
    coverEmoji: "⚓",
    coverColor: "#1f3a4a",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  starshipWorldMock,
];
