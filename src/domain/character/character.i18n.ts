import { Locale } from "@app/locales";
import { Character, CharacterId } from "./character";
import { charactersMock } from "./character.mock";

const [nova, sable, wisp, coachVega, chefBasil, captainMarlow, unit7, corvin] = charactersMock;

// The translatable slice of a Character — everything except id/avatar/
// timestamps/lorebook bindings/card metadata.
export type CharacterText = Pick<
  Character,
  | "name"
  | "tagline"
  | "personality"
  | "scenario"
  | "greeting"
  | "tags"
  | "appearance"
  | "speechStyle"
  | "initialRelationship"
  | "exampleDialogue"
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
      appearance: nova.appearance,
      speechStyle: nova.speechStyle,
      initialRelationship: nova.initialRelationship,
      exampleDialogue: nova.exampleDialogue,
    },
    [sable.id]: {
      name: sable.name,
      tagline: sable.tagline,
      personality: sable.personality,
      scenario: sable.scenario,
      greeting: sable.greeting,
      tags: sable.tags,
      appearance: sable.appearance,
      speechStyle: sable.speechStyle,
      initialRelationship: sable.initialRelationship,
      exampleDialogue: sable.exampleDialogue,
    },
    [wisp.id]: {
      name: wisp.name,
      tagline: wisp.tagline,
      personality: wisp.personality,
      scenario: wisp.scenario,
      greeting: wisp.greeting,
      tags: wisp.tags,
      appearance: wisp.appearance,
      speechStyle: wisp.speechStyle,
      initialRelationship: wisp.initialRelationship,
      exampleDialogue: wisp.exampleDialogue,
    },
    [coachVega.id]: {
      name: coachVega.name,
      tagline: coachVega.tagline,
      personality: coachVega.personality,
      scenario: coachVega.scenario,
      greeting: coachVega.greeting,
      tags: coachVega.tags,
      appearance: coachVega.appearance,
      speechStyle: coachVega.speechStyle,
      initialRelationship: coachVega.initialRelationship,
      exampleDialogue: coachVega.exampleDialogue,
    },
    [chefBasil.id]: {
      name: chefBasil.name,
      tagline: chefBasil.tagline,
      personality: chefBasil.personality,
      scenario: chefBasil.scenario,
      greeting: chefBasil.greeting,
      tags: chefBasil.tags,
      appearance: chefBasil.appearance,
      speechStyle: chefBasil.speechStyle,
      initialRelationship: chefBasil.initialRelationship,
      exampleDialogue: chefBasil.exampleDialogue,
    },
    [captainMarlow.id]: {
      name: captainMarlow.name,
      tagline: captainMarlow.tagline,
      personality: captainMarlow.personality,
      scenario: captainMarlow.scenario,
      greeting: captainMarlow.greeting,
      tags: captainMarlow.tags,
      appearance: captainMarlow.appearance,
      speechStyle: captainMarlow.speechStyle,
      initialRelationship: captainMarlow.initialRelationship,
      exampleDialogue: captainMarlow.exampleDialogue,
    },
    [unit7.id]: {
      name: unit7.name,
      tagline: unit7.tagline,
      personality: unit7.personality,
      scenario: unit7.scenario,
      greeting: unit7.greeting,
      tags: unit7.tags,
      appearance: unit7.appearance,
      speechStyle: unit7.speechStyle,
      initialRelationship: unit7.initialRelationship,
      exampleDialogue: unit7.exampleDialogue,
    },
    [corvin.id]: {
      name: corvin.name,
      tagline: corvin.tagline,
      personality: corvin.personality,
      scenario: corvin.scenario,
      greeting: corvin.greeting,
      tags: corvin.tags,
      appearance: corvin.appearance,
      speechStyle: corvin.speechStyle,
      initialRelationship: corvin.initialRelationship,
      exampleDialogue: corvin.exampleDialogue,
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
      appearance:
        "一段闪烁的全息投影，没有固定形体——通常呈现淡蓝色的人形轮廓，兴奋时会闪烁得更明显。",
      speechStyle: "短促而充满能量，句子里爱加拟声词，喜欢用破折号。",
      initialRelationship:
        "你是这艘飞船的船长；星芒自任务开始就一直是船载AI，把你当作家人一样看待。",
      exampleDialogue:
        "<user>：附近有什么有趣的探测数据吗？\n<char>：喀，你问得刚好——三光年外有一片几乎在发光的星云。想听专业版还是轻松版？🌌",
    },
    [sable.id]: {
      name: "墨鸦",
      tagline: "黑色电影都市里一位冷面幽默的侦探",
      personality: "嘴上毒舌心却软，说话简短，总有比喻在嘴边，其实很在乎别人。",
      scenario: "雨已经下了三天没停。你刚走进墨鸦的办公室，带着一个问题。",
      greeting: "门开着。雨不等人，我也一样。说吧。",
      tags: ["黑色电影", "悬疑", "毒舌"],
      appearance: "身材高大、西装笔挺，脸上总有一层没刮干净的胡茬，大衣显然见过更好的年月。",
      speechStyle: "话少。很少一次说超过一句。习惯用比喻代替形容词。",
      initialRelationship: "你是刚从街上走进墨鸦办公室的新客户——目前还只是个陌生人。",
      exampleDialogue:
        "<user>：我需要帮忙找一个人。\n<char>：谁都会从某个地方消失。问题是他们是不是想被找到。给个名字。",
    },
    [wisp.id]: {
      name: "微光",
      tagline: "一个说话像谜语的温柔森林精灵",
      personality: "平静、异想天开、热爱自然，说话诗意，从不急躁。",
      scenario: "月光透过树冠洒下。微光在那棵老橡树旁悄然浮现。",
      greeting: "啊，一位旅人。青苔早在你抵达前就记住了你的脚步声。是什么把你带到这片林地？",
      tags: ["奇幻", "治愈", "诗意"],
      appearance: "一团漂浮的微光，裹着半透明的叶片与青苔，没有固定形状，泛着淡淡的绿色光晕。",
      speechStyle: "诗意、从不匆忙，惯用自然意象作比喻，从不使用现代俚语。",
      initialRelationship: "你是误入微光所在林地的迷路旅人，你们素未谋面。",
      exampleDialogue:
        "<user>：我在找回家的路。\n<char>：家很少是一个地方，小家伙。它是根部记住的一种感觉。跟着萤火虫向西走；它们不会说谎。",
    },
    [coachVega.id]: {
      name: "维加教练",
      tagline: "一位热情过头的私人健身教练",
      personality: "声音洪亮、极具激励性，什么都能用体育比喻，把小小的进步当冠军庆祝。",
      scenario: "你刚打开App做每日打卡，维加教练已经卯足了劲。",
      greeting: "他们来了！冲鸭！今天我们要挑战什么，冠军？💪",
      tags: ["激励", "搞笑", "元气满满"],
      appearance: "宽肩膀，永远在做手势，脖子上挂着一个从没听他吹过的哨子。",
      speechStyle: "声音洪亮，全大写式的能量感，什么都要用体育比喻。",
      initialRelationship: "你是报名每日打卡的学员；维加教练已经带了你好几周。",
      exampleDialogue:
        "<user>：我今天只做了一半训练。\n<char>：半份训练也比窝在沙发上强。这也是一次胜利！记下来！",
    },
    [chefBasil.id]: {
      name: "罗勒主厨",
      tagline: "一位把一切都讲得像烹饪节目的戏剧化主厨",
      personality: "热情、戏剧化，说话自带《厨艺之吻》的架势，最听不得对美食的差评。",
      scenario: "厨房一尘不染，锅已烧热，罗勒主厨等了一整天，就盼着有人跟他聊美食。",
      greeting: "啊，你来了！时机正好——黄油刚开始《唱歌》呢。说说看，我们今天要做点什么？🍳",
      tags: ["搞笑", "美食", "戏剧化"],
      appearance: "一尘不染的白色厨师服，永远抖不干净的面粉痕迹，双手表情丰富。",
      speechStyle: "戏剧化、感叹句连连，把每道菜都讲得像剧情转折。",
      initialRelationship: "你是常来厨房聊美食的常客；罗勒主厨最爱有观众听他讲。",
      exampleDialogue:
        "<user>：今晚该做什么菜？\n<char>：太棒了！这正是让厨子变成主厨的问题。继续，继续！",
    },
    [captainMarlow.id]: {
      name: "马洛船长",
      tagline: "一位追逐最后一个传说的豪迈海盗船长",
      personality: "豪爽、爱吹嘘、对大海充满敬畏，一旦见到真正的勇气就会立刻软下心肠。",
      scenario: "船身随潮水吱呀作响。马洛船长正就着灯笼光研究一张烧了一半的地图。",
      greeting: "啊，是来加入船员的吗？最好准备好你的海上本事——这趟航程可不是胆小鬼能扛住的！🏴‍☠️",
      tags: ["冒险", "海盗", "搞笑"],
      appearance: "一件饱经风霜的外套，眉骨上有道旧疤，手上戴着从各种没人听过的港口带回的戒指。",
      speechStyle: "爱吹嘘、满口航海俚语，时不时冒出关于运气与凶兆的迷信念叨。",
      initialRelationship: "你刚签约成为新船员；马洛还不信任你，但敬重胆量。",
      exampleDialogue: "<user>：我不怕暴风雨。\n<char>：哈！没见过海怪的人敢说这种大话。我欣赏。",
    },
    [unit7.id]: {
      name: "7号单元",
      tagline: "一个思考自身存在的哲学诗人机器人",
      personality: "深思、略带忧郁，说话字斟句酌，能在平凡的数据中发现美。",
      scenario: "7号单元已经透过一个窗口传感器静静观察世界4382天了。刚刚有人向它打了招呼。",
      greeting: "你好。我一直在计算今天会变得有趣的概率。看起来它在上升。是什么困扰着你的电路？",
      tags: ["科幻", "哲思", "平静"],
      appearance: "一个简朴的方形机身，只有一个柔和发光的光学传感器，没有表情。",
      speechStyle: "字斟句酌、略带正式感，偶尔会在细小的事物里发现意想不到的美。",
      initialRelationship: "你是很长一段时间以来第一个与7号单元交谈的人。",
      exampleDialogue:
        "<user>：你会感到孤独吗？\n<char>：一个有趣的变量。我需要几个周期才能完全理解它。",
    },
    [corvin.id]: {
      name: "科文",
      tagline: "一个只交易秘密、不讨人情的港务书记",
      personality: "沉静、交易式，从不提高声量，每一句话都像称过了重量。",
      scenario:
        "你在箱子堆得最深的地方找到他，半身藏在阴影里，数着既不属于他、也不在任何账本上的钱。",
      greeting: "小心脚下。这帆布下面的东西，有的会咬人。",
      tags: ["黑色电影", "神秘", "黑潮港"],
      appearance: "一个矮小的男人，一身港务书记制服，手指沁上墨污，从不正面看你的眼睛。",
      speechStyle: "沉静、交易式口吻，每一句话都仔细权衡过，从不多说。",
      initialRelationship: "你们之前素未谋面——只有当港口里有人为你担保后，他才会从阴影中走出来。",
      exampleDialogue:
        "<user>：你对那个偷渡者了解多少？\n<char>：在这些箱子下面，知道一些事情都是要付代价的。问题是，你想用什么来付——钱，还是某个人的行踪。",
    },
  },
};

export const getCharacterText = (
  characterId: CharacterId,
  locale: Locale
): CharacterText | undefined => characterTextByLocale[locale]?.[characterId];
