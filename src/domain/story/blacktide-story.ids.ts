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

export const FLAG_HEARD_ABOUT_THE_KEY = "heard_about_the_key";
export const FLAG_HARBOR_MASTER_TRUSTS_YOU = "harbor_master_trusts_you";
