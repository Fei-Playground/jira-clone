// Shared ID constants for the "Last Ship Out of Blacktide Harbor" demo
// story. Scene/quest/story mocks all cross-reference each other (a scene's
// exit points at another scene; a quest's objective points at a scene; a
// scene's unlock condition points at a quest) — centralizing the ids here
// avoids a mock-to-mock circular import between scene.mock.ts, quest.mock.ts
// and story.mock.ts.

export const BLACKTIDE_STORY_ID = "0i6e7f8g-story-0001-0000-000000000001";

export const SCENE_DOCKS_ID = "0i6e7f8g-scene-0001-0000-000000000001";
export const SCENE_TAVERN_ID = "0i6e7f8g-scene-0002-0000-000000000002";
export const SCENE_WAREHOUSE_ID = "0i6e7f8g-scene-0003-0000-000000000003";
export const SCENE_LIGHTHOUSE_ID = "0i6e7f8g-scene-0004-0000-000000000004";
export const SCENE_LAST_SHIP_ID = "0i6e7f8g-scene-0005-0000-000000000005";

export const QUEST_ASK_AROUND_ID = "0i6e7f8g-quest-0001-0000-000000000001";
export const QUEST_BRASS_KEY_ID = "0i6e7f8g-quest-0002-0000-000000000002";
export const QUEST_DELIVER_LETTER_ID = "0i6e7f8g-quest-0003-0000-000000000003";
// A real mutually-exclusive pair: both become available the moment the
// brass key quest completes, and accepting/completing EITHER one recalls
// the other from "available" back to "locked" via Quest.excludedBy.
export const QUEST_REPORT_SMUGGLING_ID = "0i6e7f8g-quest-0004-0000-000000000004";
export const QUEST_FENCE_THE_GOODS_ID = "0i6e7f8g-quest-0005-0000-000000000005";

export const FLAG_HEARD_ABOUT_THE_KEY = "heard_about_the_key";
export const FLAG_HARBOR_MASTER_TRUSTS_YOU = "harbor_master_trusts_you";
// Set directly by a dialogue CHOICE (not a quest reward) when talking to
// the hidden informant Corvin — mutually exclusive by construction, since
// the choice buttons that set them disappear once either is set.
export const FLAG_SOLD_OUT_WISP = "sold_out_wisp";
export const FLAG_PROTECTED_WISP = "protected_wisp";
// Set by whichever of the report-smuggling / fence-the-goods quests the
// player completes — read by the OTHER quest's excludedBy so it retracts.
export const FLAG_REPORTED_SMUGGLING = "reported_smuggling";
export const FLAG_FENCED_THE_GOODS = "fenced_the_goods";
