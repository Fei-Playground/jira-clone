import { Locale } from "@app/locales";
import { StoryId } from "./story";
import { BLACKTIDE_STORY_ID } from "./blacktide-story.ids";
import { starshipStoryTextByLocale } from "./starship-story.i18n";

export interface StoryText {
  title: string;
  synopsis: string;
  authorNoteText: string;
}

export const storyTextByLocale: Record<Locale, Record<StoryId, StoryText>> = {
  [Locale.EN]: {
    [BLACKTIDE_STORY_ID]: {
      title: "The Last Ship Out of Blacktide Harbor",
      synopsis:
        "A storm is coming, and so is the last ship out. Talk your way across the docks, the tavern, and the warehouses — trust the wrong person and you'll be stuck here when the tide turns.",
      authorNoteText:
        "Tone: rain-soaked noir. Keep dialogue terse and a little wary — nobody in this harbor trusts easily.",
    },
  },
  [Locale.ZH]: {
    [BLACKTIDE_STORY_ID]: {
      title: "黑潮港的最后一班船",
      synopsis:
        "风暴将至，最后一班船也即将离港。在码头、酒馆和货仓之间周旋——信错了人，潮水转向时你就只能困在这里了。",
      authorNoteText: "基调：雨夜黑色悬疑。对话保持简短而带着几分警惕——这座港口没人轻易信任别人。",
    },
  },
};

export const getStoryText = (storyId: StoryId, locale: Locale): StoryText | undefined =>
  storyTextByLocale[locale]?.[storyId] ?? starshipStoryTextByLocale[locale]?.[storyId];
