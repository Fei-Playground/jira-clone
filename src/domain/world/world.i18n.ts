import { Locale } from "@app/locales";
import { WorldId } from "./world";
import { BLACKTIDE_WORLD_ID } from "./world.mock";
import { STARSHIP_WORLD_ID } from "./starship-world.mock";

export interface WorldText {
  name: string;
  description: string;
  tier: string;
  toneTags: string[];
}

export const worldTextByLocale: Record<Locale, Record<WorldId, WorldText>> = {
  [Locale.EN]: {
    [BLACKTIDE_WORLD_ID]: {
      name: "Blacktide Harbor & the Coastal Isles",
      description:
        "A rain-soaked port city where money moves faster than the law, and the last ship out is never quite what it seems.",
      tier: "Low-magic harbor noir",
      toneTags: ["noir", "mystery", "bittersweet"],
    },
    [STARSHIP_WORLD_ID]: {
      name: "The Wayfinder & the Deep Black",
      description:
        "A third-generation research vessel drifting between star systems with no scheduled return — small crew, unusually chatty AI, and a habit of finding trouble.",
      tier: "Hard sci-fi, deep space",
      toneTags: ["sci-fi", "curiosity", "quiet-tension"],
    },
  },
  [Locale.ZH]: {
    [BLACKTIDE_WORLD_ID]: {
      name: "黑潮港与近海诸岛",
      description:
        "一座雨水从不停歇的港口城市——钱在码头上流动的速度比法律还快，而最后一班船，从来不是它看上去的样子。",
      tier: "低魔法港口黑色悬疑",
      toneTags: ["黑色悬疑", "谜团", "苦涩余味"],
    },
    [STARSHIP_WORLD_ID]: {
      name: "星舟号与深空黑暗",
      description:
        "一艘第三代深空科研飞船，在星系间飘流，没有既定归期——船员不多，船载AI出名地话多，还总能碰上麻烦。",
      tier: "硬核科幻，深空",
      toneTags: ["科幻", "好奇心", "静默的紧张感"],
    },
  },
};

export const getWorldText = (worldId: WorldId, locale: Locale): WorldText | undefined =>
  worldTextByLocale[locale]?.[worldId];
