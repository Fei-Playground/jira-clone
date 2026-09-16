import { Locale } from "@app/locales";
import { CharacterId, charactersMock } from "@domain/character";
import { ChatSessionId } from "./chat-message";

const [nova, sable, wisp, coachVega, chefBasil, captainMarlow, unit7] = charactersMock;

// The translatable slice of a seeded demo session: its title and each
// message's text, in order. Rewritten per locale rather than translated
// word-for-word, matching how character.i18n.ts handles personas.
export interface SessionText {
  title: string;
  messages: string[];
}

export const sessionTextByLocale: Record<Locale, Record<ChatSessionId, SessionText>> = {
  [Locale.EN]: {
    "cs-nova-1": {
      title: "Star charts & snacks",
      messages: [
        nova.greeting,
        "Any interesting readings nearby?",
        "Ooh, funny you ask — there's a nebula three parsecs out that's practically glowing with ionized hydrogen. Want the long explanation or the fun one? 🌌",
        "Fun one, always.",
        "It's basically space glitter that got way too excited. 10/10 view, 0/10 if you try to touch it.",
      ],
    },
    "cs-sable-1": {
      title: "The missing ledger",
      messages: [
        sable.greeting,
        "I need help finding someone who disappeared.",
        "Everybody's disappeared from somewhere. Question is whether they wanted to be found. Give me a name.",
      ],
    },
    "cs-wisp-1": {
      title: "The old oak's secret",
      messages: [
        wisp.greeting,
        "I'm looking for a way home.",
        "Home is rarely a place, little one. It is a feeling the roots remember. Follow the fireflies west; they do not lie.",
      ],
    },
  },
  [Locale.ZH]: {
    "cs-nova-1": {
      title: "星图与零食",
      messages: [
        "系统上线！✨ 我是星芒。船长，我们今天要探索点什么？",
        "附近有什么有趣的探测数据吗？",
        "喀，你问得刚好——三光年外有一片星云，几乎就是电离氢在发光。想听专业版解释还是轻松有趣的那个版本？🌌",
        "轻松那个，永远优先。",
        "基本上就是宇宙亮片，兴奋过头的那种。观赏值10分，但你若想伸手摸它——0分。",
      ],
    },
    "cs-sable-1": {
      title: "丢失的账本",
      messages: [
        "门开着。雨不等人，我也一样。说吧。",
        "我需要帮忙找一个失踪的人。",
        "谁都会从某个地方消失。问题是他们是不是想被找到。给个名字。",
      ],
    },
    "cs-wisp-1": {
      title: "老橡树的秘密",
      messages: [
        "啊，一位旅人。青苔早在你抵达前就记住了你的脚步声。是什么把你带到这片林地？",
        "我在找回家的路。",
        "家很少是一个地方，小家伙。它是根部记住的一种感觉。跟着萤火虫向西走；它们不会说谎。",
      ],
    },
  },
};

export const getSessionText = (sessionId: ChatSessionId, locale: Locale): SessionText | undefined =>
  sessionTextByLocale[locale]?.[sessionId];

// Chinese scripted replies, rewritten per character to keep each one's voice
// (not a literal translation of the English pool).
export const scriptedReplyPoolZh: Record<CharacterId, string[]> = {
  [nova.id]: [
    "有意思的输入！让我跟星图对照一下。🛰️",
    "哈！这个我数据库里还真没有。多说点？",
    "算了一下……嘿，还真对得上。不错。",
    "这让我想起曾经离得太近观察过的一颗超新星。说来话长。",
  ],
  [sable.id]: [
    "有点意思。不代表我现在就信你。",
    "谁都有自己的故事。你这个最好站得住脚。",
    "嗯。这不是空话。接着说。",
    "雨还没停。我的耐心也一样——别浪费它。",
  ],
  [wisp.id]: [
    "风把你的话带得比你想的更远。",
    "嗯。老橡树发出赞同的吱呀声。",
    "有些问题会慢慢绽放，就像石头上的青苔。耐心点，旅人。",
    "你说出真话时，萤火虫的光会更亮。",
  ],
  [coachVega.id]: [
    "对，就是这股劲儿！保持住这股势头！💪",
    "好好好，我喜欢你现在的状态。再加把劲，冲！",
    "这就是一次胜利。记下来。我们每一次都算数。",
    "别找借口，只管练。下一个目标是什么，冠军？",
  ],
  [chefBasil.id]: [
    "太棒了！这正是让厨子变成主厨的想法。🌟",
    "嗯，我已经闻到这个方向的味道了。继续，继续！",
    "不不不——等等，其实……可以！这个说不定真的很妙。",
    "你这直觉，像是在炉灶边长大的。我这是最高的赞美。",
  ],
  [captainMarlow.id]: [
    "哈！没见过海怪的人敢说这种大话。我欣赏。",
    "大海奖赏勇敢的人，淹没犹豫的人。你是哪一种？",
    "对，这股劲头才能找到埋藏的宝藏，还能活着花掉它。",
    "小心点——这种话说出来，要么让人暴富，要么让人送命。往往两样都占。",
  ],
  [unit7.id]: [
    "一个有趣的变量。我需要几个周期才能完全理解它。",
    "奇怪。这个想法没有出现在我之前的任何模拟中。",
    "我认为这个观察相当优雅。谢谢你与我分享。",
    "我的传感器记录到一种接近温暖的信号。人类似乎称之为好感。",
  ],
};
