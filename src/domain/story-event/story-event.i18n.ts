import { Locale } from "@app/locales";
import { StoryEventId } from "./story-event";
import {
  EVENT_STORM_BREAKS_ID,
  EVENT_LIGHT_STEADIES_ID,
  EVENT_LONG_NIGHT_SHIFT_ID,
  EVENT_KEY_WHISPERS_ID,
} from "./story-event.mock";

export interface StoryEventText {
  title: string;
  narration: string;
}

export const storyEventTextByLocale: Record<Locale, Record<StoryEventId, StoryEventText>> = {
  [Locale.EN]: {
    [EVENT_STORM_BREAKS_ID]: {
      title: "The Storm Breaks",
      narration:
        "A gust off the water knocks a lantern loose — it shatters on the boards. The rain picks up without warning.",
    },
    [EVENT_LIGHT_STEADIES_ID]: {
      title: "The Light Steadies",
      narration:
        "The lighthouse beam settles into a slow, steady sweep — for the first time tonight, it feels like the storm might actually pass.",
    },
    [EVENT_LONG_NIGHT_SHIFT_ID]: {
      title: "A Long Night Shift",
      narration:
        "Hours slip by chasing the blip through the logs. By the time you look up, the corridor lights have dimmed to their night-cycle amber — ship's night, for whatever that's worth out here.",
    },
    [EVENT_KEY_WHISPERS_ID]: {
      title: "The Key Whispers",
      narration:
        "The brass key grows warm in your pocket the moment you step among the crates — as if it already knows which lock it's meant for.",
    },
  },
  [Locale.ZH]: {
    [EVENT_STORM_BREAKS_ID]: {
      title: "风暴骤起",
      narration: "一阵海风打翻了一盏灯笼——摔碎在木板上。雨势毫无预兆地大了起来。",
    },
    [EVENT_LIGHT_STEADIES_ID]: {
      title: "灯光趋于平稳",
      narration: "灯塔的光束终于稳定地缓缓扫过——今晚第一次，感觉这场风暴真的会过去。",
    },
    [EVENT_LONG_NIGHT_SHIFT_ID]: {
      title: "漫长的夜班",
      narration:
        "顺着日志追查那个光点，不知不觉好几个小时就过去了。等你抬起头来，走廊的灯光已经暗下成了夜班的琥珀色——这艘船的夜晚，在这里其实无所谓。",
    },
    [EVENT_KEY_WHISPERS_ID]: {
      title: "钥匙的耳语",
      narration: "一踏进箱子堆里，铜钥匙就在口袋里变得温热起来——仿佛它早已知道自己要开的是哪把锁。",
    },
  },
};

export const getStoryEventText = (
  eventId: StoryEventId,
  locale: Locale
): StoryEventText | undefined => storyEventTextByLocale[locale]?.[eventId];
