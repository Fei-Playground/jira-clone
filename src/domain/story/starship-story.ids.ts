// Shared ID constants for the "Silent Run of the Wayfinder" demo story —
// same centralization reasoning as blacktide-story.ids.ts (scene/quest/story
// mocks cross-reference each other, so ids live here to avoid a mock-to-mock
// circular import).

export const STARSHIP_STORY_ID = "0j7f8g9h-story-0002-0000-000000000002";

export const SCENE_BRIDGE_ID = "0j7f8g9h-scene-0001-0000-000000000001";
export const SCENE_ENGINE_ROOM_ID = "0j7f8g9h-scene-0002-0000-000000000002";
export const SCENE_MED_BAY_ID = "0j7f8g9h-scene-0003-0000-000000000003";
export const SCENE_OBSERVATION_DECK_ID = "0j7f8g9h-scene-0004-0000-000000000004";

export const QUEST_SENSOR_GHOST_ID = "0j7f8g9h-quest-0001-0000-000000000001";
export const QUEST_COOLANT_LEAK_ID = "0j7f8g9h-quest-0002-0000-000000000002";
export const QUEST_THE_SIGNAL_ID = "0j7f8g9h-quest-0003-0000-000000000003";
// A mutually-exclusive pair, same mechanism as Blacktide's smuggling/fencing
// pair: both become available once the engine is stabilized, and
// accepting/completing EITHER one recalls the other via Quest.excludedBy.
export const QUEST_REPORT_GALLEY_TRADE_ID = "0j7f8g9h-quest-0004-0000-000000000004";
export const QUEST_JOIN_GALLEY_TRADE_ID = "0j7f8g9h-quest-0005-0000-000000000005";

export const FLAG_ENGINE_STABILIZED = "engine_stabilized";
export const FLAG_NOVA_TRUSTS_YOU = "nova_trusts_you";
// Set directly by a dialogue CHOICE (not a quest reward) when talking to
// the hidden galley trader Chef Basil — mutually exclusive by construction,
// since the choice buttons that set them disappear once either is set.
export const FLAG_TOLD_BASIL_ABOUT_NOVA = "told_basil_about_nova";
export const FLAG_WARNED_NOVA_ABOUT_BASIL = "warned_nova_about_basil";
// Set by whichever of the report/join-trade quests the player completes —
// read by the OTHER quest's excludedBy so it retracts.
export const FLAG_REPORTED_GALLEY_TRADE = "reported_galley_trade";
export const FLAG_JOINED_GALLEY_TRADE = "joined_galley_trade";
