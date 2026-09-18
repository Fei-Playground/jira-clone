import { Locale } from "@app/locales";
import { StoryId } from "./story";
import { StoryText } from "./story.i18n";
import { STARSHIP_STORY_ID } from "./starship-story.ids";

export const starshipStoryTextByLocale: Record<Locale, Record<StoryId, StoryText>> = {
  [Locale.EN]: {
    [STARSHIP_STORY_ID]: {
      title: "The Silent Run of the Wayfinder",
      synopsis:
        "A blip on the sensors, a coolant leak, and a signal nobody can quite explain — a quiet shift on the Wayfinder is about to get a lot less quiet.",
      authorNoteText:
        "Tone: quiet hard sci-fi. Curiosity over dread — the ship feels safe, even when something's off.",
    },
  },
  [Locale.ZH]: {
    [STARSHIP_STORY_ID]: {
      title: "星舟号的静默航行",
      synopsis:
        "传感器上的一个光点，一处冷却剂泄漏，还有一个谁也说不清的信号——星舟号平静的一班岗，就要变得不那么平静了。",
      authorNoteText:
        "基调：安静的硬核科幻。好奇心多于恐惧——即便有什么不对劲，船上依然让人觉得安全。",
    },
  },
};
