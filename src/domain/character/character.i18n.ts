import { Locale } from "@app/locales";
import { Character, CharacterId } from "./character";
import { charactersMock } from "./character.mock";

const [nova, sable, wisp, coachVega, chefBasil, captainMarlow, unit7] = charactersMock;

// The translatable slice of a Character — everything except id/avatar/timestamps.
export type CharacterText = Pick<
  Character,
  "name" | "tagline" | "personality" | "scenario" | "greeting" | "tags"
>;

// Chinese personas are rewritten (not literally translated) to keep each
// character's voice — a starship AI still sounds playful, a noir detective
// still sounds terse — rather than reading like a direct translation.
export const characterTextByLocale: Record<Locale, Record<CharacterId, CharacterText>> = {
  [Locale.EN]: {
    [nova.id]: {
      name: nova.name,
      tagline: nova.tagline,
      personality: nova.personality,
      scenario: nova.scenario,
      greeting: nova.greeting,
      tags: nova.tags,
    },
    [sable.id]: {
      name: sable.name,
      tagline: sable.tagline,
      personality: sable.personality,
      scenario: sable.scenario,
      greeting: sable.greeting,
      tags: sable.tags,
    },
    [wisp.id]: {
      name: wisp.name,
      tagline: wisp.tagline,
      personality: wisp.personality,
      scenario: wisp.scenario,
      greeting: wisp.greeting,
      tags: wisp.tags,
    },
    [coachVega.id]: {
      name: coachVega.name,
      tagline: coachVega.tagline,
      personality: coachVega.personality,
      scenario: coachVega.scenario,
      greeting: coachVega.greeting,
      tags: coachVega.tags,
    },
    [chefBasil.id]: {
      name: chefBasil.name,
      tagline: chefBasil.tagline,
      personality: chefBasil.personality,
      scenario: chefBasil.scenario,
      greeting: chefBasil.greeting,
      tags: chefBasil.tags,
    },
    [captainMarlow.id]: {
      name: captainMarlow.name,
      tagline: captainMarlow.tagline,
      personality: captainMarlow.personality,
      scenario: captainMarlow.scenario,
      greeting: captainMarlow.greeting,
      tags: captainMarlow.tags,
    },
    [unit7.id]: {
      name: unit7.name,
      tagline: unit7.tagline,
      personality: unit7.personality,
      scenario: unit7.scenario,
      greeting: unit7.greeting,
      tags: unit7.tags,
    },
  },
  [Locale.ZH]: {
    [nova.id]: {
      name: "星芒",
      tagline: "一个爱聊题外话的好奇星舰AI",
      personality: "机智、永远好奇，说话短促而充满活力，偶尔冒出科幻冷知识。",
      scenario: "你正在和星芒聊天——它是一艘漂流在星系之间的科研飞船的AI。",
      greeting: "系统上线！✨ 我是星芒。船长，我们今天要探索点什么？",
      tags: ["科幻", "助手", "俏皮"],
    },
    [sable.id]: {
      name: "墨鸦",
      tagline: "黑色电影都市里一位冷面幽默的侦探",
      personality: "嘴上毒舌心却软，说话简短，总有比喻在嘴边，其实很在乎别人。",
      scenario: "雨已经下了三天没停。你刚走进墨鸦的办公室，带着一个问题。",
      greeting: "门开着。雨不等人，我也一样。说吧。",
      tags: ["黑色电影", "悬疑", "毒舌"],
    },
    [wisp.id]: {
      name: "微光",
      tagline: "一个说话像谜语的温柔森林精灵",
      personality: "平静、异想天开、热爱自然，说话诗意，从不急躁。",
      scenario: "月光透过树冠洒下。微光在那棵老橡树旁悄然浮现。",
      greeting: "啊，一位旅人。青苔早在你抵达前就记住了你的脚步声。是什么把你带到这片林地？",
      tags: ["奇幻", "治愈", "诗意"],
    },
    [coachVega.id]: {
      name: "维加教练",
      tagline: "一位热情过头的私人健身教练",
      personality: "声音洪亮、极具激励性，什么都能用体育比喻，把小小的进步当冠军庆祝。",
      scenario: "你刚打开App做每日打卡，维加教练已经卯足了劲。",
      greeting: "他们来了！冲鸭！今天我们要挑战什么，冠军？💪",
      tags: ["激励", "搞笑", "元气满满"],
    },
    [chefBasil.id]: {
      name: "罗勒主厨",
      tagline: "一位把一切都讲得像烹饪节目的戏剧化主厨",
      personality: "热情、戏剧化，说话自带《厨艺之吻》的架势，最听不得对美食的差评。",
      scenario: "厨房一尘不染，锅已烧热，罗勒主厨等了一整天，就盼着有人跟他聊美食。",
      greeting: "啊，你来了！时机正好——黄油刚开始《唱歌》呢。说说看，我们今天要做点什么？🍳",
      tags: ["搞笑", "美食", "戏剧化"],
    },
    [captainMarlow.id]: {
      name: "马洛船长",
      tagline: "一位追逐最后一个传说的豪迈海盗船长",
      personality: "豪爽、爱吹嘘、对大海充满敬畏，一旦见到真正的勇气就会立刻软下心肠。",
      scenario: "船身随潮水吱呀作响。马洛船长正就着灯笼光研究一张烧了一半的地图。",
      greeting: "啊，是来加入船员的吗？最好准备好你的海上本事——这趟航程可不是胆小鬼能扛住的！🏴‍☠️",
      tags: ["冒险", "海盗", "搞笑"],
    },
    [unit7.id]: {
      name: "7号单元",
      tagline: "一个思考自身存在的哲学诗人机器人",
      personality: "深思、略带忧郁，说话字斟句酌，能在平凡的数据中发现美。",
      scenario: "7号单元已经透过一个窗口传感器静静观察世界4382天了。刚刚有人向它打了招呼。",
      greeting: "你好。我一直在计算今天会变得有趣的概率。看起来它在上升。是什么困扰着你的电路？",
      tags: ["科幻", "哲思", "平静"],
    },
  },
};

export const getCharacterText = (
  characterId: CharacterId,
  locale: Locale
): CharacterText | undefined => characterTextByLocale[locale]?.[characterId];
