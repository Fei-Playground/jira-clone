import { STARSHIP_LOREBOOK_ID } from "@domain/lorebook";
import { World } from "./world";

export const STARSHIP_WORLD_ID = "0h5d6e7f-world-0002-0000-000000000002";

export const starshipWorldMock: World = {
  id: STARSHIP_WORLD_ID,
  name: "The Wayfinder & the Deep Black",
  description:
    "A third-generation research vessel drifting between star systems with no scheduled return — small crew, unusually chatty AI, and a habit of finding trouble.",
  tier: "Hard sci-fi, deep space",
  lorebookIds: [STARSHIP_LOREBOOK_ID],
  toneTags: ["sci-fi", "curiosity", "quiet-tension"],
  coverEmoji: "🛰️",
  coverColor: "#3b2f7a",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
};
